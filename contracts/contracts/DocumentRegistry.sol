// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DocumentRegistry
/// @author Contium
/// @notice Smart contract para registrar y validar documentos en blockchain
/// @dev Compatible con EVM estándar

contract DocumentRegistry {

    /// @notice Información de cada documento
    struct DocumentInfo {
        address owner;
        uint256 timestamp;
        bool isValidated;
        string metadata;
    }

    /// @notice hash del documento => información
    mapping(bytes32 => DocumentInfo) private documents;

    /// @notice dirección => score
    mapping(address => uint256) private scores;

    /// @notice lista de usuarios con score
    address[] private usersWithScore;

    /// @notice Evento al registrar documento
    event DocumentRegistered(bytes32 indexed hash, address indexed owner, uint256 timestamp);

    /// @notice Evento al validar documento
    event DocumentValidated(bytes32 indexed hash, address indexed owner, uint256 newScore);

    /// @notice Registrar un documento nuevo
    /// @param _hash Hash del documento
    /// @param _metadata Metadata del documento
    function registerDocument(bytes32 _hash, string calldata _metadata) external {
        require(documents[_hash].owner == address(0), "Documento ya registrado");

        documents[_hash] = DocumentInfo({
            owner: msg.sender,
            timestamp: block.timestamp,
            isValidated: false,
            metadata: _metadata
        });

        emit DocumentRegistered(_hash, msg.sender, block.timestamp);
    }

    /// @notice Validar un documento existente
    /// @param _hash Hash del documento
    function validateDocument(bytes32 _hash) external {
        require(documents[_hash].owner != address(0), "Documento no existe");
        require(!documents[_hash].isValidated, "Documento ya validado");
        require(msg.sender == documents[_hash].owner, "Solo el owner puede validar");

        documents[_hash].isValidated = true;

        if (scores[msg.sender] == 0) {
            usersWithScore.push(msg.sender);
        }

        scores[msg.sender] += 10;

        emit DocumentValidated(_hash, msg.sender, scores[msg.sender]);
    }

    /// @notice Obtener info completa de un documento
    function getDocument(bytes32 _hash) external view returns (DocumentInfo memory) {
        require(documents[_hash].owner != address(0), "Documento no existe");
        return documents[_hash];
    }

    /// @notice Saber si un documento esta registrado
    function isRegistered(bytes32 _hash) external view returns (bool) {
        return documents[_hash].owner != address(0);
    }

    /// @notice Saber si un documento esta validado
    function isValidated(bytes32 _hash) external view returns (bool) {
        return documents[_hash].isValidated;
    }

    /// @notice Obtener score de un usuario
    function getScore(address _user) external view returns (uint256) {
        return scores[_user];
    }

    /// @notice Retorna los usuarios con score (sin ordenar)
    function getTotalUsers() external view returns (uint256) {
        return usersWithScore.length;
    }

    /// @notice Obtener top usuarios por score (ordenados)
    function getTopUsers(uint256 _limit) external view returns (address[] memory) {
        uint256 length = usersWithScore.length;
        if (_limit > length) {
            _limit = length;
        }

        address[] memory result = new address[](_limit);
        address[] memory temp = usersWithScore;

        for (uint256 i = 0; i < _limit; i++) {
            uint256 maxIndex = i;
            for (uint256 j = i + 1; j < length; j++) {
                if (scores[temp[j]] > scores[temp[maxIndex]]) {
                    maxIndex = j;
                }
            }
            (temp[i], temp[maxIndex]) = (temp[maxIndex], temp[i]);
            result[i] = temp[i];
        }

        return result;
    }
}
