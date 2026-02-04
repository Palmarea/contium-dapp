// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IDocumentRegistry {
    function isValidated(bytes32 hash) external view returns (bool);
}

contract ContiumBadge is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IDocumentRegistry public documentRegistry;

    mapping(uint256 => bytes32) public badgeDocumentHash;

    constructor(address _documentRegistry)
        ERC721("Contium Compliance Badge", "CCB")
    {
        documentRegistry = IDocumentRegistry(_documentRegistry);
    }

    function mintBadge(address recipient, bytes32 documentHash) public onlyOwner {
        require(
            documentRegistry.isValidated(documentHash),
            "Document not validated"
        );

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(recipient, newItemId);
        badgeDocumentHash[newItemId] = documentHash;
    }
}
