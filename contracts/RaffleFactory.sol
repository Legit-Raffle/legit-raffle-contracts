//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Raffle} from "./Raffle.sol";

contract RaffleFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _raffleCounter;

    event NewRaffle(string Name, address raffleAddress, address raffleOwner);

    struct Raffles{
        Counters.Counter Id;
        string Name;
        address raffleAddress;
        address raffleOwner;
    }

    Raffles[] public raffles;
    address public raffleLogic;

    constructor(
        address _vrfCoordinator,
        bytes32 _vrfKeyHash,
        address _linkToken,
        uint256 _linkFee
    ){
        raffleLogic = address(new Raffle(
                _vrfCoordinator,
                _vrfKeyHash,
                _linkToken,
                _linkFee
        ));
    }

    // @note this address must be approved to move `nft`
    function createRaffle(address _token, uint256 _id, string memory _name) external
    {
        address raffle = Clones.clone(raffleLogic);

        // move the NFT to the raffle
        // throws if RaffleFactory is not `approved`
        // or if `msg.sender` doesn't own `token id`
        IERC721(_token).safeTransferFrom(msg.sender, raffle, _id);

        Raffle(raffle).initWithNFT(msg.sender, _token, _id, _name);

        _raffleCounter.increment();

        raffles.push(Raffles(_raffleCounter, _name, raffle, msg.sender));

        emit NewRaffle(_name, raffle, msg.sender);
    }
}