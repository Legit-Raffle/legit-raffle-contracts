//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {VRFConsumerBase} from "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Raffle is 
    VRFConsumerBase,
    ERC721Holder, // bc it holds an NFT for raffle
    Initializable // bc it's created by a proxy
{

    event Claimed(
        address _winner,
        uint256 _winnerIdx,
        address token,
        uint256 id
    );
    event WinnerDrawn(
        uint256 winner
    ); 
    event Finalized(
        bytes32 _list, 
        uint256 _listSize    
    );

    // FLOW:
    // 1. Create with NFT
    // 2. [...people enter the raffle off-chain or outside of this contract...]
    // 3. admin finalizes the raffle by setting a merkle root (ie the list)
    // 4. admin gets a random number from [0, listSize)
    // 5. anyone can `claim` the NFT to the raffle winner

    address admin;
    address token; // nft contract
    uint256 id;    // nft contract's tokenId


    // these variables & constructor are chainlink VRF boilerplate
    bytes32 private immutable vrfKeyHash;
    uint256 public immutable linkFee;
    constructor (
        address _vrfCoordinator,
        bytes32 _vrfKeyHash,
        address _linkToken,
        uint256 _linkFee
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        vrfKeyHash = _vrfKeyHash;
        linkFee = _linkFee;
    }

    // called by RaffleFactory.sol (TODO)
    function initWithNFT(address _admin, address _token, uint256 _id) external initializer {
        admin = _admin;
        token = _token;
        id = _id;
        require(
            IERC721(_token).ownerOf(_id) == address(this)
        );
    }


    bytes32 public list; // merkle root of the list of raffle participants
    uint256 public listSize; // the length of the list
    // @note the list is represented as a merkle tree.
    // entries are represented as tuples of (address, listIndex).
    // example: [0xa, 0xb, 0xc] -> [(0xa, 0), (0xb, 1), (0xc, 2)]
    function finalize(bytes32 _list, uint256 _listSize) external {
        require(msg.sender == admin);
        list = _list;
        listSize = _listSize;
        emit Finalized(
            list,
            listSize
        );
    }

    uint256 winner; // the list index of the winner
    bool drawn;     // true if random number has been returned
    // use chainlink to draw a random number
    function draw() external returns (bytes32) {
        require(msg.sender == admin);
        require(list != 0x0);
        require(LINK.balanceOf(address(this)) >= linkFee);
        return requestRandomness(vrfKeyHash, linkFee);
    }

    // chainlink callback
    function fulfillRandomness(
        bytes32 /* requestId */,
        uint256 randomness
    ) internal override {
        winner = randomness % listSize;
        drawn = true;
        emit WinnerDrawn(winner);
    }


    // anyone can call this, but it will only send to the winner
    // Caller provides an "entry" into the list & proof of inclusion.
    // This method checks:
    // 1. a winner has been `drawn`
    // 2. parameters are truly in the list (ie merkle proof is valid)
    // 3. the parameters are the winning index of the list
    function claim(
        address _winner, 
        uint256 _winnerIdx, 
        bytes32[] calldata _proof
    ) external {
        require(drawn); // haven't selected the winner yet!

        // this is the format 
        bytes32 merkleLeaf = merkleLeafForListItem(_winner, _winnerIdx);

        bool isAddressAtIdx = MerkleProof.verify(_proof, list, merkleLeaf);
        require(isAddressAtIdx); // _winner is not at _winnerIdx in `list`

        require(_winnerIdx == winner); // this index is in the raffle, but not the winner

        // transfer the NFT to the winner
        IERC721(token).safeTransferFrom(address(this), _winner, id);
        emit Claimed(
            _winner,
            _winnerIdx,
            token,
            id
        );
    }

    // frontend will need an analogous method to format calls to `claim`
    function merkleLeafForListItem(
        address _participant, 
        uint256 _index) 
        public pure returns (bytes32) 
    {
        return keccak256(abi.encodePacked(_participant, _index));
    }
}