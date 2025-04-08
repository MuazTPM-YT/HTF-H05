import { ethers } from 'ethers';
import AuthLogContract from '../contracts/AuthLogContract.json';

/**
 * Service for interacting with Ethereum blockchain
 */
class EthereumService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isInitialized = false;
        this.networkName = null;
    }

    /**
     * Initialize the Ethereum service
     * @returns {Promise<boolean>} Whether initialization was successful
     */
    async initialize() {
        try {
            console.log("Attempting to initialize Ethereum service...");

            // Check if MetaMask is installed
            if (window.ethereum) {
                console.log("MetaMask detected, requesting accounts...");

                try {
                    // Explicitly request accounts - this will trigger the MetaMask popup
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                        params: []
                    });

                    console.log("MetaMask accounts:", accounts);

                    if (accounts && accounts.length > 0) {
                        // Get the provider from MetaMask - ethers v6 syntax
                        this.provider = new ethers.BrowserProvider(window.ethereum);

                        // Get the signer (current account)
                        this.signer = await this.provider.getSigner();

                        // Get the network
                        const network = await this.provider.getNetwork();
                        this.networkName = network.name;
                        console.log("Connected to network:", this.networkName);

                        // Initialize the contract
                        this.contract = new ethers.Contract(
                            AuthLogContract.contractAddress,
                            AuthLogContract.abi,
                            this.signer
                        );

                        this.isInitialized = true;
                        console.log('Ethereum service initialized successfully');
                        return true;
                    } else {
                        console.error("No accounts returned from MetaMask");
                        return false;
                    }
                } catch (requestError) {
                    console.error("Error requesting accounts:", requestError);
                    return false;
                }
            } else {
                console.error('MetaMask not detected! Please install MetaMask extension.');
                return false;
            }
        } catch (error) {
            console.error('Failed to initialize Ethereum service:', error);
            return false;
        }
    }

    /**
     * Force reconnection to MetaMask
     * @returns {Promise<boolean>} Whether reconnection was successful
     */
    async reconnect() {
        this.isInitialized = false;
        return await this.initialize();
    }

    /**
     * Get the current account address
     * @returns {Promise<string>} The current account address
     */
    async getAccount() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            return await this.signer.getAddress();
        } catch (error) {
            console.error('Failed to get account:', error);
            return null;
        }
    }

    /**
     * Log an authentication event to the blockchain
     * @param {Object} eventData The event data to log
     * @returns {Promise<Object>} The transaction receipt
     */
    async logAuthEvent(eventData) {
        if (!this.isInitialized) {
            const success = await this.initialize();
            if (!success) {
                throw new Error('Failed to initialize Ethereum service');
            }
        }

        try {
            const tx = await this.contract.logAuthEvent(
                eventData.action,
                eventData.username,
                eventData.role,
                eventData.status,
                eventData.ipAddress
            );

            console.log('Transaction sent:', tx.hash);

            // Wait for the transaction to be mined
            const receipt = await tx.wait();
            console.log('Transaction confirmed in block:', receipt.blockNumber);

            return {
                txHash: tx.hash,
                blockNumber: receipt.blockNumber,
                timestamp: new Date().toLocaleString()
            };
        } catch (error) {
            console.error('Failed to log auth event:', error);
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
                throw new Error('Failed to initialize Ethereum service');
            }
        }

        try {
            const logs = await this.contract.getLatestEvents();

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
            console.error('Failed to get auth logs:', error);
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
}

// Create a singleton instance
const ethereumService = new EthereumService();

export default ethereumService; 