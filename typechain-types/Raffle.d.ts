/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface RaffleInterface extends ethers.utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "claim(address,uint256,bytes32[])": FunctionFragment;
    "draw()": FunctionFragment;
    "drawn()": FunctionFragment;
    "finalize(bytes32,uint256)": FunctionFragment;
    "id()": FunctionFragment;
    "initWithNFT(address,address,uint256,string)": FunctionFragment;
    "linkFee()": FunctionFragment;
    "list()": FunctionFragment;
    "listSize()": FunctionFragment;
    "merkleLeafForListItem(address,uint256)": FunctionFragment;
    "name()": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "rawFulfillRandomness(bytes32,uint256)": FunctionFragment;
    "token()": FunctionFragment;
    "winner()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [string, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "draw", values?: undefined): string;
  encodeFunctionData(functionFragment: "drawn", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "finalize",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "id", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initWithNFT",
    values: [string, string, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "linkFee", values?: undefined): string;
  encodeFunctionData(functionFragment: "list", values?: undefined): string;
  encodeFunctionData(functionFragment: "listSize", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "merkleLeafForListItem",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rawFulfillRandomness",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(functionFragment: "winner", values?: undefined): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "draw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "drawn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "finalize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "id", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initWithNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "linkFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "list", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "listSize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "merkleLeafForListItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rawFulfillRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "winner", data: BytesLike): Result;

  events: {};
}

export class Raffle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: RaffleInterface;

  functions: {
    admin(overrides?: CallOverrides): Promise<[string]>;

    claim(
      _winner: string,
      _winnerIdx: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    draw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    drawn(overrides?: CallOverrides): Promise<[boolean]>;

    finalize(
      _list: BytesLike,
      _listSize: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    id(overrides?: CallOverrides): Promise<[BigNumber]>;

    initWithNFT(
      _admin: string,
      _token: string,
      _id: BigNumberish,
      _name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    linkFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    list(overrides?: CallOverrides): Promise<[string]>;

    listSize(overrides?: CallOverrides): Promise<[BigNumber]>;

    merkleLeafForListItem(
      _participant: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    winner(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  claim(
    _winner: string,
    _winnerIdx: BigNumberish,
    _proof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  draw(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  drawn(overrides?: CallOverrides): Promise<boolean>;

  finalize(
    _list: BytesLike,
    _listSize: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  id(overrides?: CallOverrides): Promise<BigNumber>;

  initWithNFT(
    _admin: string,
    _token: string,
    _id: BigNumberish,
    _name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  linkFee(overrides?: CallOverrides): Promise<BigNumber>;

  list(overrides?: CallOverrides): Promise<string>;

  listSize(overrides?: CallOverrides): Promise<BigNumber>;

  merkleLeafForListItem(
    _participant: string,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  name(overrides?: CallOverrides): Promise<string>;

  onERC721Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rawFulfillRandomness(
    requestId: BytesLike,
    randomness: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  winner(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    claim(
      _winner: string,
      _winnerIdx: BigNumberish,
      _proof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    draw(overrides?: CallOverrides): Promise<string>;

    drawn(overrides?: CallOverrides): Promise<boolean>;

    finalize(
      _list: BytesLike,
      _listSize: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    id(overrides?: CallOverrides): Promise<BigNumber>;

    initWithNFT(
      _admin: string,
      _token: string,
      _id: BigNumberish,
      _name: string,
      overrides?: CallOverrides
    ): Promise<void>;

    linkFee(overrides?: CallOverrides): Promise<BigNumber>;

    list(overrides?: CallOverrides): Promise<string>;

    listSize(overrides?: CallOverrides): Promise<BigNumber>;

    merkleLeafForListItem(
      _participant: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    name(overrides?: CallOverrides): Promise<string>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    winner(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    admin(overrides?: CallOverrides): Promise<BigNumber>;

    claim(
      _winner: string,
      _winnerIdx: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    draw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    drawn(overrides?: CallOverrides): Promise<BigNumber>;

    finalize(
      _list: BytesLike,
      _listSize: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    id(overrides?: CallOverrides): Promise<BigNumber>;

    initWithNFT(
      _admin: string,
      _token: string,
      _id: BigNumberish,
      _name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    linkFee(overrides?: CallOverrides): Promise<BigNumber>;

    list(overrides?: CallOverrides): Promise<BigNumber>;

    listSize(overrides?: CallOverrides): Promise<BigNumber>;

    merkleLeafForListItem(
      _participant: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    winner(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claim(
      _winner: string,
      _winnerIdx: BigNumberish,
      _proof: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    draw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    drawn(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    finalize(
      _list: BytesLike,
      _listSize: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    id(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initWithNFT(
      _admin: string,
      _token: string,
      _id: BigNumberish,
      _name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    linkFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    list(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    listSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    merkleLeafForListItem(
      _participant: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onERC721Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    winner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
