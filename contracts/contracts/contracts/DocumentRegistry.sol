// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DocumentRegistry
/// @author Contium
/// @notice Smart contract para registrar y validar documentos en blockchain
/// @dev Compatible con EVM estándar
contract DocumentRegistry {
    /// @notice Información principal del documento
    struct DocumentInfo {
        address owner;
        uint256 timestamp;
        bool isValidated;
        string metadata;
    }

    /// @notice hash (bytes32) => DocumentInfo
    mapping(bytes32 => DocumentInfo) private documents;

    /// @notice address => score
    mapping(address => uint256) private scores;

    /// @notice Lista de usuarios que han acumulado score (para ranking)
    address[] private usersWithScore;
    mapping(address => bool) private isInUsersWithScore;

    /// @notice Se emite cuando se registra un documento
    event DocumentRegistered(bytes32 indexed hash, address indexed owner, uint256 timestamp);

    /// @notice Se emite cuando se valida un documento (y se actualiza score)
    event DocumentValidated(bytes32 indexed hash, address indexed owner, uint256 newScore);

    /// @notice Registra un documento (si no existe ese hash)
    /// @param _hash Hash del documento (bytes32)
    /// @param _metadata Metadata asociada (string)
    function registerDocument(bytes32 _hash, string calldata _metadata) external {
        require(_hash != bytes32(0), "hash invalido");
        require(!isRegistered(_hash), "hash ya registrado");

        documents[_hash] = DocumentInfo({
            owner: msg.sender,
            timestamp: block.timestamp,
            isValidated: false,
            metadata: _metadata
        });

        emit DocumentRegistered(_hash, msg.sender, block.timestamp);
    }

    /// @notice Valida un documento: debe existir, no estar validado y el validador debe ser el owner
    /// @param _hash Hash del documento (bytes32)
    function validateDocument(bytes32 _hash) external {
        require(isRegistered(_hash), "no existe");
        DocumentInfo storage doc = documents[_hash];

        require(!doc.isValidated, "ya validado");
        require(msg.sender == doc.owner, "solo owner");

        doc.isValidated = true;

        // Suma 10 puntos al owner
        uint256 prev = scores[msg.sender];
        scores[msg.sender] = prev + 10;

        // Agregar al ranking si es la primera vez que suma score
        if (!isInUsersWithScore[msg.sender]) {
            isInUsersWithScore[msg.sender] = true;
            usersWithScore.push(msg.sender);
        }

        emit DocumentValidated(_hash, msg.sender, scores[msg.sender]);
    }

    /// @notice Retorna la info de un documento
    function getDocument(bytes32 _hash) external view returns (DocumentInfo memory) {
        require(isRegistered(_hash), "no existe");
        return documents[_hash];
    }

    /// @notice Verifica si un hash está registrado
    function isRegistered(bytes32 _hash) public view returns (bool) {
        return documents[_hash].owner != address(0);
    }

    /// @notice Verifica si un documento está validado
    function isValidated(bytes32 _hash) external view returns (bool) {
        require(isRegistered(_hash), "no existe");
        return documents[_hash].isValidated;
    }

    /// @notice Retorna el score de un usuario
    function getScore(address _user) external view returns (uint256) {
        return scores[_user];
    }

    /// @notice Total de usuarios que tienen score (para ranking)
    function getTotalUsers() external view returns (uint256) {
        return usersWithScore.length;
    }

    /// @notice Retorna los top usuarios ordenados por score desc
    /// @dev Ordena en memoria (solo view). Para pocos usuarios funciona perfecto.
    /// @param _limit Cantidad máxima a retornar
    /// @return topUsers Direcciones top
    /// @return topScores Scores top
    function getTopUsers(uint256 _limit)
        external
        view
        returns (address[] memory topUsers, uint256[] memory topScores)
    {
        uint256 n = usersWithScore.length;
        if (_limit > n) _limit = n;

        // Copia en memoria
        address[] memory addrs = new address[](n);
        uint256[] memory scs = new uint256[](n);

        for (uint256 i = 0; i < n; i++) {
            address u = usersWithScore[i];
            addrs[i] = u;
            scs[i] = scores[u];
        }

        // Selection sort desc por score (simple y determinista)
        for (uint256 i = 0; i < n; i++) {
            uint256 maxIdx = i;
            for (uint256 j = i + 1; j < n; j++) {
                if (scs[j] > scs[maxIdx]) {
                    maxIdx = j;
                }
            }
            if (maxIdx != i) {
                (scs[i], scs[maxIdx]) = (scs[maxIdx], scs[i]);
                (addrs[i], addrs[maxIdx]) = (addrs[maxIdx], addrs[i]);
            }
        }

        // Recortar a limit
        topUsers = new address[](_limit);
        topScores = new uint256[](_limit);

        for (uint256 k = 0; k < _limit; k++) {
            topUsers[k] = addrs[k];
            topScores[k] = scs[k];
        }
    }
}
