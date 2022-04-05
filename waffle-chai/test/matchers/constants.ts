export const TX_GAS = 21000; // Gas used by a single, non-contract transaction.

/**
 * Hardfork London - baseFeePerGas is replacing gasPrice.
 * A default minimum in Ganache is this number.
 * It cannot be set to 0 at this time.
 */
export const BASE_FEE_PER_GAS = 875000000;
