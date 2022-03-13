//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract OnChainRaffle is
  Ownable,
  ERC721Holder,
  VRFConsumerBase,
  ChainlinkClient
{
  using Chainlink for Chainlink.Request;
  using Strings for uint256;
  uint256 public volume;
  address private _oracle;
  bytes32 private _jobId;

  struct Raffle {
    // Current data strcuture assumes one raffle maps to one erc721 NFT [MVP]
    address raffleHost;
    address erc721TokenAddress;
    uint256 erc721TokenId;
    uint256 raffleEndTimeStamp;
    uint256 randomWinningNumber;
    string addressListBaseUri;
    address winner;
    bool hasEnded;
  }

  // min time needed for a raffle
  uint256 public minRaffleTime;

  // current data structure assumes one host only does 1 raffle at a time [MVP]
  mapping(address => Raffle) private _hostAddressToRaffle;

  // mapping for storing random number requestId to Raffle
  mapping(bytes32 => Raffle) private _randomNumberRequestIdToRaffle;

  // mapping for storing raffle size requestId to Raffle
  mapping(bytes32 => Raffle) private _raffleSizeRequestIdToRaffle;

  // mapping for storing raffle size requestId to Raffle
  mapping(bytes32 => Raffle) private _raffleWinnerRequestIdToRaffle;

  // royalties
  address private _teamAddress;

  /*
  Chainlink
  */
  bytes32 internal _keyHash;
  uint256 internal _fee;

  // Current data strcuture assumes one raffle maps to one erc721 NFT [MVP]
  constructor(
    address teamAddress,
    address vrfCoordinator,
    address linkTokenAddress,
    bytes32 keyHash,
    uint256 fee
  ) VRFConsumerBase(vrfCoordinator, linkTokenAddress) {
    _teamAddress = teamAddress;
    _keyHash = keyHash;
    _oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8; // depends on job type, will need to change
    _jobId = "d5270d1c311941d0b08bead21fea7747"; // depends on job type, will need to change
    _fee = fee * 10**18; // Varies by network
    setPublicChainlinkToken();
  }

  // initiate raffle with token address / token id / timestamp /
  function startRaffle(
    address tokenAddress,
    uint256 tokenId,
    uint256 raffleEndTimeStamp,
    string calldata addressListBaseUri
  ) public {
    // require address to be ERC721 (0x80ac58cd) compliant
    // require host to own the NFT tokenId
    // require host to approve this contract to move their NFTs
    // require time end time stamp to be in the future with min raffle time
    require(
      IERC165(tokenAddress).supportsInterface(0x80ac58cd),
      "require ERC721 supported contract"
    );
    IERC721 erc721Contract = IERC721(tokenAddress);
    require(
      erc721Contract.ownerOf(tokenId) == msg.sender,
      "must own the tokenId"
    );
    require(
      erc721Contract.isApprovedForAll(msg.sender, address(this)),
      "must allow this contract to transfer token"
    );
    require(
      raffleEndTimeStamp >= block.timestamp + minRaffleTime,
      "raffle end time must be in the future with certain time frame"
    );
    // Create Raffle data entry
    Raffle memory newRaffle = Raffle(
      msg.sender,
      tokenAddress,
      tokenId,
      raffleEndTimeStamp,
      0, // no random winning number yet
      addressListBaseUri,
      address(0xdEaD),
      false
    );
    _hostAddressToRaffle[msg.sender] = newRaffle;
    // Take custody of NFT
    erc721Contract.safeTransferFrom(msg.sender, address(this), tokenId);

    // should emit NFT transferred event here
  }

  function endRaffle() external {
    // todo: ask caller to pay LINK here to this contract to use
    // require raffle not ended
    // require raffle to exist
    // require caller to be raffle host
    Raffle storage raffle = _hostAddressToRaffle[msg.sender];
    require(raffle.raffleEndTimeStamp > 0, "raffle does not exist");
    require(raffle.raffleEndTimeStamp > block.timestamp, "raffle not ended");
    require(raffle.raffleHost == msg.sender, "must be host");

    // fetch random number for this raffle
    bytes32 randomNumberRequestId = getRandomNumber();
    _randomNumberRequestIdToRaffle[randomNumberRequestId] = raffle;
  }

  /*
  Only Owner 
  */

  function setMinRaffleTime(uint256 time) external onlyOwner {
    minRaffleTime = time;
  }

  // set uri for raffle entry addresses
  function setUriForRaffleEntriesLookUp(string memory uri) external onlyOwner {}

  // in case link gets stuck in this contract
  function withdrawLink() external onlyOwner {
    uint256 linkBalance = LINK.balanceOf(address(this));
    require(linkBalance > 0, "LINK balance 0");
    LINK.transferFrom(address(this), msg.sender, linkBalance);
  }

  /*
  Chainlink Randomness
  */

  // get random number from VRF
  function getRandomNumber() public returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= _fee, "Not enough LINK");
    return requestRandomness(_keyHash, _fee);
  }

  // Callback function used by VRF Coordinator
  function fulfillRandomness(bytes32 requestId, uint256 randomness)
    internal
    override
  {
    Raffle memory raffle = _randomNumberRequestIdToRaffle[requestId];
    raffle.randomWinningNumber = randomness;
    // after getting random number, request for raffle size
    bytes32 raffleEntriesSizeRaffleId = requestRaffleEntriesSize(raffle);
    // store requestId in mapping to raffle
    _raffleSizeRequestIdToRaffle[raffleEntriesSizeRaffleId] = raffle;
  }

  /*
  Chainlink Requests Raffle Entries Size
  */

  function requestRaffleEntriesSize(Raffle memory raffle)
    public
    returns (bytes32 requestId)
  {
    Chainlink.Request memory request = buildChainlinkRequest(
      _jobId,
      address(this),
      this.fulfill.selector
    );
    // Set the URL to perform the GET request on ifps://hash/size
    request.add(
      "get",
      string(abi.encodePacked(raffle.addressListBaseUri, "/size"))
    );
    request.add("path", "size");
    /*
    response should be in the stucture of 
    {
      "size": uint256
    }
    */
    return sendChainlinkRequestTo(_oracle, request, _fee);
  }

  /**
   * Receive the response in the form of uint256
   */
  function fulfill(bytes32 _requestId, uint256 _volume)
    public
    recordChainlinkFulfillment(_requestId)
  {
    // get raffle response for size
    // use size modulus to find index of winning address
    Raffle memory raffle = _raffleSizeRequestIdToRaffle[_requestId];
    uint256 size = _volume;
    uint256 winningIndex = raffle.randomWinningNumber % size;

    // Once we have winner index, use it to request for winner address the same way
    bytes32 requestWinnerAddressId = requestWinnerAddress(raffle, winningIndex);
    _raffleWinnerRequestIdToRaffle[requestWinnerAddressId] = raffle;
  }

  /*
  Chainlink Requests Winner
  */

  function requestWinnerAddress(Raffle memory raffle, uint256 winningIndex)
    public
    returns (bytes32 requestId)
  {
    Chainlink.Request memory request = buildChainlinkRequest(
      _jobId,
      address(this),
      this.fulfill.selector
    );
    // Set the URL to perform the GET request on ifps://hash/size
    request.add(
      "get",
      string(
        abi.encodePacked(raffle.addressListBaseUri, winningIndex.toString())
      )
    );
    /*
    response should be in the stucture of 
    {
      "address"
    }
    */
    return sendChainlinkRequestTo(_oracle, request, _fee);
  }

  function fulfill(bytes32 _requestId, bytes32 _volume)
    public
    recordChainlinkFulfillment(_requestId)
  {
    // get raffle response for size
    // use size modulus to find index of winning address
    Raffle storage raffle = _raffleWinnerRequestIdToRaffle[_requestId];

    // convert bytes32 to string
    // https://ethereum.stackexchange.com/questions/11758/converting-oraclize-result-from-string-to-address

    address winner = bytesToAddress(_volume);
    // send NFT to winner
    IERC721 erc721Contract = IERC721(raffle.erc721TokenAddress);
    erc721Contract.safeTransferFrom(
      address(this),
      winner,
      raffle.erc721TokenId
    );

    // mark raffle as over
    raffle.hasEnded = true;
  }

  function bytes32ToString(bytes32 _bytes32)
    internal
    pure
    returns (string memory)
  {
    uint8 i = 0;
    while (i < 32 && _bytes32[i] != 0) {
      i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }

  function bytesToAddress(bytes calldata _address)
    internal
    pure
    returns (address)
  {
    uint160 m = 0;
    uint160 b = 0;
    for (uint8 i = 0; i < 20; i++) {
      m *= 256;
      b = uint160(_address[i]);
      m += (b);
    }
    return address(m);
  }
}
