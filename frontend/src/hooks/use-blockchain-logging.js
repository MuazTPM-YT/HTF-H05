import { useState, useEffect, useCallback } from 'react';
import ethereumService from '../services/ethereum-service';

/**
 * Custom hook for blockchain access logging
 * @param {Object} config Configuration options
 * @param {boolean} config.enabled Whether blockchain logging is enabled by default
 * @returns {Object} Blockchain logging methods and state
 */
export function useBlockchainLogging(config = {}) {
    const { enabled = true } = config;

    // Group all useState hooks together
    const [isLogging, setIsLogging] = useState(false);
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [logs, setLogs] = useState([]);
    const [ethereumAccount, setEthereumAccount] = useState(null);
    const [network, setNetwork] = useState('Not connected');
    const [isConnected, setIsConnected] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Listen for MetaMask account changes
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            console.log('MetaMask accounts changed:', accounts);
            if (accounts.length > 0) {
                setEthereumAccount(accounts[0]);
                setIsConnected(true);
                // Force a refresh of connected state
                setRefreshTrigger(prev => prev + 1);
            } else {
                setEthereumAccount(null);
                setIsConnected(false);
            }
        };

        // Add MetaMask event listeners if available
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts && accounts.length > 0) {
                        console.log('Already connected to accounts:', accounts);
                        setEthereumAccount(accounts[0]);
                        setIsConnected(true);
                    }
                })
                .catch(err => console.error('Error checking accounts:', err));
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    // Initialize Ethereum connection
    useEffect(() => {
        const initEthereum = async () => {
            try {
                console.log('Initializing Ethereum connection...');
                const success = await ethereumService.initialize();
                if (success) {
                    const account = await ethereumService.getAccount();
                    setEthereumAccount(account);
                    setNetwork(ethereumService.getNetworkName());
                    setIsConnected(true);
                    console.log('Successfully connected to Ethereum:', account);

                    // Fetch initial logs
                    await fetchLogs();
                } else {
                    console.log('Failed to initialize Ethereum service');
                    setIsConnected(false);
                }
            } catch (error) {
                console.error('Error initializing Ethereum:', error);
                setIsConnected(false);
            }
        };

        if (isEnabled) {
            initEthereum();
        }
    }, [isEnabled, refreshTrigger]);

    // Force a connection refresh
    const refreshConnection = useCallback(async () => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // Fetch logs from the blockchain
    const fetchLogs = useCallback(async () => {
        if (!isEnabled || !isConnected) {
            return logs;
        }

        try {
            setIsLogging(true);
            const authLogs = await ethereumService.getAuthLogs();
            setLogs(authLogs);
            return authLogs;
        } catch (error) {
            console.error('Error fetching blockchain logs:', error);
            return logs;
        } finally {
            setIsLogging(false);
        }
    }, [isEnabled, isConnected, logs]);

    // Log an event to the blockchain
    const logEvent = useCallback(async (eventData) => {
        if (!isEnabled) {
            console.log('Blockchain logging is disabled');
            return null;
        }

        if (!isConnected) {
            try {
                await ethereumService.initialize();
                setIsConnected(true);
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('Failed to connect to Ethereum:', error);
                return null;
            }
        }

        setIsLogging(true);

        try {
            // Log the event to blockchain using the ethereum service
            const result = await ethereumService.logAuthEvent({
                action: eventData.action,
                username: eventData.user || 'Unknown User',
                role: eventData.details?.role || 'user',
                status: eventData.status || 'Authorized',
                ipAddress: eventData.ipAddress || '0.0.0.0'
            });

            // Create a new log entry with blockchain data
            const newLog = {
                id: logs.length + 1,
                txHash: result.txHash,
                blockNumber: result.blockNumber,
                timestamp: result.timestamp,
                action: eventData.action,
                user: eventData.user || 'Unknown User',
                ipAddress: eventData.ipAddress || '0.0.0.0',
                status: eventData.status || 'Authorized',
                details: eventData.details || {}
            };

            setLogs(prevLogs => [newLog, ...prevLogs]);

            console.log('Blockchain Transaction Complete',
                `Event logged with transaction hash: ${result.txHash.substring(0, 10)}...`);

            return newLog;
        } catch (error) {
            console.error('Error logging to blockchain:', error);

            console.log('Logging Failed', 'Failed to record event on blockchain.');

            return null;
        } finally {
            setIsLogging(false);
        }
    }, [isEnabled, isConnected, logs]);

    // Log authentication events
    const logAuthentication = useCallback(async (authData) => {
        const { action, username, role, status, ipAddress } = authData;

        return await logEvent({
            action: action,
            user: username || 'Unknown User',
            ipAddress: ipAddress || '0.0.0.0',
            status: status || 'Authorized',
            details: {
                role: role || 'user',
                timestamp: new Date().toISOString(),
                authMethod: 'password'
            }
        });
    }, [logEvent]);

    // Toggle logging enabled state
    const setLoggingEnabled = useCallback((enabled) => {
        setIsEnabled(enabled);

        if (enabled && !isConnected) {
            ethereumService.initialize()
                .then(success => {
                    if (success) {
                        setIsConnected(true);
                        ethereumService.getAccount()
                            .then(account => setEthereumAccount(account));
                        setNetwork(ethereumService.getNetworkName());
                        setRefreshTrigger(prev => prev + 1);
                    }
                })
                .catch(err => console.error('Failed to initialize Ethereum service:', err));
        }

        console.log(`Blockchain logging ${enabled ? 'enabled' : 'disabled'}`);
    }, [isConnected]);

    return {
        logs,
        isLogging,
        isEnabled,
        isConnected,
        ethereumAccount,
        network,
        logEvent,
        logAuthentication,
        setLoggingEnabled,
        fetchLogs,
        refreshConnection
    };
} 