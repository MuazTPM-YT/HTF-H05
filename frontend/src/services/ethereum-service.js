import { ethers } from 'ethers';
import AuthLogContract from '../contracts/AuthLogContract.json';

/**
 * Production-ready service for interacting with Ethereum blockchain
 */
class EthereumService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isInitialized = false;
        this.networkName = null;
        this.lastError = null;
    }

    /**
     * Initialize the Ethereum service
     * @returns {Promise<boolean>} Whether initialization was successful
     */
    async initialize() {
        // If already initialized successfully, return immediately
        if (this.isInitialized && this.provider && this.signer && this.contract) {
            return true;
        }

        this.lastError = null;

        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                this.lastError = 'MetaMask not detected. Please install MetaMask extension.';
                return false;
            }

            try {
                // Request accounts with timeout
                const accountsPromise = window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                // Set timeout for the request to prevent hanging
                const accounts = await this._withTimeout(accountsPromise, 10000, 'Account request timeout');

                if (!accounts || accounts.length === 0) {
                    this.lastError = 'No accounts available. Please unlock MetaMask.';
                    return false;
                }

                // Create provider
                this.provider = new ethers.BrowserProvider(window.ethereum);

                // Get signer with timeout
                const signerPromise = this.provider.getSigner();
                this.signer = await this._withTimeout(signerPromise, 5000, 'Signer request timeout');

                // Get network information with timeout
                const networkPromise = this.provider.getNetwork();
                const network = await this._withTimeout(networkPromise, 5000, 'Network request timeout');
                this.networkName = network.name;

                // Validate contract configuration
                if (!AuthLogContract.contractAddress || !AuthLogContract.abi) {
                    this.lastError = 'Invalid contract configuration';
                    return false;
                }

                // Initialize the contract
                this.contract = new ethers.Contract(
                    AuthLogContract.contractAddress,
                    AuthLogContract.abi,
                    this.signer
                );

                this.isInitialized = true;
                return true;
            } catch (error) {
                this.lastError = error.message || 'Failed to initialize Ethereum connection';
                return false;
            }
        } catch (error) {
            this.lastError = error.message || 'Unexpected error during initialization';
            return false;
        }
    }

    /**
     * Utility method to add timeout to a promise
     * @param {Promise} promise - The promise to add timeout to
     * @param {number} timeoutMs - Timeout in milliseconds
     * @param {string} timeoutMessage - Message to use if timeout occurs
     * @returns {Promise} A promise that will reject if the timeout is exceeded
     */
    async _withTimeout(promise, timeoutMs, timeoutMessage) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
        });

        return Promise.race([promise, timeoutPromise]);
    }

    /**
     * Force reconnection to MetaMask
     * @returns {Promise<boolean>} Whether reconnection was successful
     */
    async reconnect() {
        this.isInitialized = false;
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.lastError = null;

        return await this.initialize();
    }

    /**
     * Get the current account address
     * @returns {Promise<string>} The current account address
     */
    async getAccount() {
        if (!this.isInitialized) {
            const success = await this.initialize();
            if (!success) {
                return null;
            }
        }

        try {
            return await this._withTimeout(
                this.signer.getAddress(),
                3000,
                'Get address timeout'
            );
        } catch (error) {
            this.lastError = error.message || 'Failed to get account';
            return null;
        }
    }

    /**
     * Log an authentication event to the blockchain
     * @param {Object} eventData The event data to log
     * @returns {Promise<Object>} The transaction data
     */
    async logAuthEvent(eventData) {
        if (!this.isInitialized) {
            const success = await this.initialize();
            if (!success) {
                throw new Error(this.lastError || 'Failed to initialize Ethereum service');
            }
        }

        try {
            // Validate contract is available
            if (!this.contract || !this.contract.logAuthEvent) {
                throw new Error('Contract not properly initialized');
            }

            // Send transaction with timeout
            const txPromise = this.contract.logAuthEvent(
                eventData.action,
                eventData.username,
                eventData.role,
                eventData.status,
                eventData.ipAddress
            );

            const tx = await this._withTimeout(
                txPromise,
                10000,
                'Transaction submission timeout'
            );

            // Create an early response in case waiting for confirmation takes too long
            const earlyResponse = {
                txHash: tx.hash,
                blockNumber: 'pending',
                timestamp: new Date().toLocaleString()
            };

            try {
                // Wait for confirmation with timeout
                const receipt = await this._withTimeout(
                    tx.wait(),
                    15000,
                    'Transaction confirmation timeout'
                );

                return {
                    txHash: tx.hash,
                    blockNumber: receipt.blockNumber,
                    timestamp: new Date().toLocaleString()
                };
            } catch (confirmError) {
                // Return early response if confirmation times out
                return earlyResponse;
            }
        } catch (error) {
            this.lastError = error.message || 'Failed to log auth event';
            throw error;
        }
    }

    /**
     * Get authentication logs from the blockchain
     * @returns {Promise<Array>} The authentication logs
     */
    async getAuthLogs() {
        if (!this.isInitialized) {
            const success = await this.initialize();
            if (!success) {
                throw new Error(this.lastError || 'Failed to initialize Ethereum service');
            }
        }

        try {
            // Validate contract
            if (!this.contract || !this.contract.getLatestEvents) {
                throw new Error('Contract not properly initialized');
            }

            // Get logs with timeout
            const logs = await this._withTimeout(
                this.contract.getLatestEvents(),
                10000,
                'Getting logs timeout'
            );

            // Format the logs
            return logs.map((log, index) => ({
                id: index + 1,
                txHash: 'Fetched from chain',
                blockNumber: 'N/A',
                userAddress: log.userAddress,
                action: log.action,
                user: log.username,
                role: log.role,
                status: log.status,
                ipAddress: log.ipAddress,
                timestamp: new Date(log.timestamp * 1000).toLocaleString(),
            }));
        } catch (error) {
            this.lastError = error.message || 'Failed to get auth logs';
            throw error;
        }
    }

    /**
     * Get the current network name
     * @returns {string} The network name
     */
    getNetworkName() {
        return this.networkName || 'Not connected';
    }

    /**
     * Get the last error message
     * @returns {string} The last error message
     */
    getLastError() {
        return this.lastError;
    }

    /**
     * Get account balance in ETH
     * @param {string} address - The account address to check
     * @returns {Promise<number>} The account balance in ETH
     */
    async getBalance(address) {
        try {
            if (!address) {
                address = await this.getAccount();
            }

            if (!address) {
                return 0;
            }

            if (!this.provider) {
                // If we don't have a provider yet but have an address, try to create one
                if (window.ethereum) {
                    this.provider = new ethers.BrowserProvider(window.ethereum);
                } else {
                    return 0;
                }
            }

            // Get balance with timeout
            const balancePromise = this.provider.getBalance(address);
            const balanceWei = await this._withTimeout(
                balancePromise,
                5000,
                'Balance check timeout'
            );

            // Convert from Wei to ETH
            const balanceEth = parseFloat(ethers.formatEther(balanceWei));
            return balanceEth;
        } catch (error) {
            this.lastError = error.message || 'Failed to get balance';
            console.error('Error checking balance:', error);
            return 0;
        }
    }
}

// Create a singleton instance
const ethereumService = new EthereumService();

export default ethereumService; 