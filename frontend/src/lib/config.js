/**
 * Configuración de red para la dApp
 * zkSYS PoB DevNet
 */
export const NETWORK = {
  /** Chain ID decimal */
  chainId: 57042,

  /** Chain ID hexadecimal (MetaMask) */
  chainIdHex: '0xDEB2',

  /** Nombre de la red */
  name: 'zkSYS PoB DevNet',

  /** RPC público */
  rpcUrl: 'https://rpc-pob.dev11.top',

  /** Explorador de bloques */
  explorer: 'https://explorer-pob.dev11.top',

  /** Moneda nativa */
  currency: {
    name: 'TSYS',
    symbol: 'TSYS',
    decimals: 18
  }
};

/**
 * Direcciones de contratos desplegados
 */
export const CONTRACTS = {
  /** Registro de documentos (hashes, metadata) */
  documentRegistry: '0x0000...',

  /** NFT / Badge de validación Contium */
  contiumBadge: '0x0000...'
};

/**
 * ABIs de contratos inteligentes
 * (importar aquí cuando estén definidos)
 */
export const ABIS = {
  /** ABI del contrato DocumentRegistry */
  documentRegistry: [],

  /** ABI del contrato ContiumBadge (NFT) */
  contiumBadge: []
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Devuelve la URL del explorador para una transacción
 * @param {string} txHash - Hash de la transacción
 * @returns {string}
 */
export function getTxExplorerUrl(txHash) {
  return `${NETWORK.explorer}/tx/${txHash}`;
}

/**
 * Devuelve la URL del explorador para una dirección
 * @param {string} address - Dirección wallet o contrato
 * @returns {string}
 */
export function getAddressExplorerUrl(address) {
  return `${NETWORK.explorer}/address/${address}`;
}

/**
 * Devuelve la URL del explorador para un NFT
 * @param {string} contract - Dirección del contrato NFT
 * @param {string|number} tokenId - ID del token
 * @returns {string}
 */
export function getNftExplorerUrl(contract, tokenId) {
  return `${NETWORK.explorer}/token/${contract}?a=${tokenId}`;
}

/**
 * Trunca una dirección para mostrarla en UI
 * Ej: 0x1234...ABCD
 *
 * @param {string} address - Dirección completa
 * @param {number} [start=6] - Caracteres iniciales
 * @param {number} [end=4] - Caracteres finales
 * @returns {string}
 */
export function truncateAddress(address, start = 6, end = 4) {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Parámetros para agregar la red en MetaMask
 * usando wallet_addEthereumChain
 *
 * @returns {import('ethers').providers.Networkish}
 */
export function getMetaMaskNetworkParams() {
  return {
    chainId: NETWORK.chainIdHex,
    chainName: NETWORK.name,
    nativeCurrency: NETWORK.currency,
    rpcUrls: [NETWORK.rpcUrl],
    blockExplorerUrls: [NETWORK.explorer]
  };
}