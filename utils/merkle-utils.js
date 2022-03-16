const {ethers} = require('ethers');
const { keccak256 } = require('ethers/lib/utils');
const {MerkleTree} = require('merkletreejs')


// input: an address and a number representing 
// the index of that address in an array
export function merkleLeaf(entrant, index) {
    return ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [entrant, index]
    );
}

// input: address[]. eg [0xa, 0xb, 0xc...] 
export function merkleRoot(addrArray) {
    const entries = addryArray.map((elem, idx) => [elem, idx]);
    
    const leaves = entries.map(elem => merkleLeaf(elem[0], elem[1]));

    const merkleTree = new MerkleTree(
        leaves,      // raw data
        keccak256,   // fn of leaves to compute "up the tree"
        {sort: true} // sort so the tree is deterministic
    );
    return merkleTree.getHexRoot();
}

export function merkleProofForIdx(addrArray, idx) {
    const merkleLeaf = merkleLeaf(addrArray[idx], idx);
    const entries = addrArray.map((elem, idx) => [elem, idx]);
    
    const leaves = entries.map(elem => merkleLeaf(elem[0], elem[1]));

    const merkleTree = new MerkleTree(
        leaves,      // raw data
        keccak256,   // fn of leaves to compute "up the tree"
        {sort: true} // sort so the tree is deterministic
    );
    return merkleTree.getProof(merkleLeaf);
}