//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

contract Election {
    string public candidateName;

    constructor () {
        candidateName = "Candidate 1";
    }

    function setCandidate (string memory _name) public {
        candidateName = _name;
    }
}
