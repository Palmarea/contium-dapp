// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IDocumentRegistry {
    function isValidated(bytes32 hash) external view returns (bool);
    function getDocumentOwner(bytes32 hash) external view returns (address);
}

contract ContiumBadge is ERC721 {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;

    IDocumentRegistry public documentRegistry;
    mapping(uint256 => bytes32) public badgeDocumentHash;

    constructor(address _documentRegistry)
        ERC721("Contium Compliance Badge", "CCB")
    {
        documentRegistry = IDocumentRegistry(_documentRegistry);
    }

    function mintBadge(address recipient, bytes32 documentHash) public {
        require(documentRegistry.isValidated(documentHash), "Document not validated");
        require(documentRegistry.getDocumentOwner(documentHash) == msg.sender, "No eres el owner del documento");
        require(msg.sender == recipient, "Solo puedes mintear para ti mismo");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        badgeDocumentHash[newItemId] = documentHash;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token no existe");

        bytes32 docHash = badgeDocumentHash[tokenId];

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"Contium Compliance Badge #', tokenId.toString(), '",',
            '"description":"Certificado de validacion de documento en zkSYS blockchain.",',
            '"attributes":[{"trait_type":"Document Hash","value":"0x', _bytes32ToHex(docHash), '"},',
            '{"trait_type":"Network","value":"zkSYS PoB DevNet"},',
            '{"trait_type":"Token ID","value":"', tokenId.toString(), '"}]}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _bytes32ToHex(bytes32 data) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i * 2]     = hexChars[uint8(data[i] >> 4)];
            str[i * 2 + 1] = hexChars[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}