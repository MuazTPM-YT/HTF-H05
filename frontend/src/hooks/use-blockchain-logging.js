import { useState, useEffect, useCallback } from 'react';
import ethereumService from '../services/ethereum-service';

/**
 * Custom hook for blockchain access logging with production-ready implementation
 */
export function useBlockchainLogging() {
    const [isLogging, setIsLogging] = useState(false);
    const [logs, setLogs] = useState([]);
    const [ethereumAccount, setEthereumAccount] = useState(null);
    const [network, setNetwork] = useState('Not connected');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [attemptsCount, setAttemptsCount] = useState(0);
    const [hasBalance, setHasBalance] = useState(false);

    // Listen for MetaMask account changes
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setEthereumAccount(accounts[0]);
                setIsConnected(true);
                setConnectionError(null);
                // Check balance when account changes
                checkBalance(accounts[0]);
            } else {
                setEthereumAccount(null);
                setIsConnected(false);
                setHasBalance(false);
                setConnectionError('No Ethereum accounts available');
            }
        };

        // Check balance for an account
        const checkBalance = async (account) => {
            if (!account) return;
            try {
                const balance = await ethereumService.getBalance(account);
                setHasBalance(balance > 0);
            } catch (error) {
                console.error('Error checking balance:', error);
                setHasBalance(false);
            }
        };

        // Add MetaMask event listeners if available
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());

            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts && accounts.length > 0) {
                        setEthereumAccount(accounts[0]);
                        setIsConnected(true);
                        setConnectionError(null);
                        checkBalance(accounts[0]);
                    }
                })
                .catch(err => {
                    setConnectionError(`Ethereum error: ${err.message}`);
                });
        } else {
            setConnectionError('MetaMask not available');
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', () => { });
            }
        };
    }, []);

    // Initialize Ethereum connection
    useEffect(() => {
        const initEthereum = async () => {
            if (attemptsCount > 2) {
                // Limit attempts to avoid excessive prompts
                setConnectionError('Maximum connection attempts reached');
                return;
            }

            try {
                setIsLogging(true);
                const success = await ethereumService.initialize();
                if (success) {
                    const account = await ethereumService.getAccount();
                    setEthereumAccount(account);
                    setNetwork(ethereumService.getNetworkName());
                    setIsConnected(true);
                    setConnectionError(null);

                    // Check balance
                    const balance = await ethereumService.getBalance(account);
                    setHasBalance(balance > 0);

                    // Fetch initial logs only if we have balance
                    if (balance > 0) {
                        await fetchLogs();
                    }
                } else {
                    const error = ethereumService.getLastError();
                    setConnectionError(error || 'Failed to initialize Ethereum service');
                    setIsConnected(false);
                }
            } catch (error) {
                setConnectionError(`Connection error: ${error.message}`);
                setIsConnected(false);
            } finally {
                setIsLogging(false);
            }
        };

        if (!isConnected && !connectionError && attemptsCount < 3) {
            // Only try to connect a limited number of times
            initEthereum();
            setAttemptsCount(prevCount => prevCount + 1);
        }
    }, [isConnected, connectionError, attemptsCount]);

    // Fetch logs from the blockchain
    const fetchLogs = useCallback(async () => {
        if (!isConnected || !hasBalance) {
            return [];
        }

        try {
            setIsLogging(true);
            const authLogs = await ethereumService.getAuthLogs();
            setLogs(authLogs);
            return authLogs;
        } catch (error) {
            console.error('Error fetching blockchain logs:', error);
            return [];
        } finally {
            setIsLogging(false);
        }
    }, [isConnected, hasBalance]);

    // Log an event to the blockchain
    const logEvent = useCallback(async (eventData) => {
        // Fast path: If we know we don't have balance, return immediately
        if (!hasBalance) {
            console.log('Skipping blockchain logging: insufficient balance');
            return null;
        }

        if (!isConnected) {
            try {
                setIsLogging(true);
                await ethereumService.initialize();
                setIsConnected(true);
                setConnectionError(null);

                // Check balance after connecting
                const account = await ethereumService.getAccount();
                if (account) {
                    const balance = await ethereumService.getBalance(account);
                    setHasBalance(balance > 0);
                    if (balance <= 0) {
                        console.log('Skipping blockchain logging: insufficient balance');
                        return null;
                    }
                }
            } catch (error) {
                console.error('Failed to connect to Ethereum:', error);
                setConnectionError(`Connection error: ${error.message}`);
                return null;
            } finally {
                setIsLogging(false);
            }
        }

        try {
            setIsLogging(true);
            // Final balance check before transaction
            const account = await ethereumService.getAccount();
            if (account) {
                const balance = await ethereumService.getBalance(account);
                if (balance <= 0) {
                    console.log('Insufficient balance for transaction');
                    setHasBalance(false);
                    return null;
                }
            }

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
            return newLog;
        } catch (error) {
            console.error('Error logging to blockchain:', error);
            return null;
        } finally {
            setIsLogging(false);
        }
    }, [isConnected, logs, hasBalance]);

    // Log authentication events
    const logAuthentication = useCallback(async (authData) => {
        // Skip immediately if we know there's no balance
        if (!hasBalance) {
            console.log('Skipping authentication logging: insufficient balance');
            return null;
        }

        try {
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
        } catch (error) {
            console.error('Error during authentication logging:', error);
            return null;
        }
    }, [logEvent, hasBalance]);

    // Force reconnection
    const reconnect = useCallback(async () => {
        setIsConnected(false);
        setConnectionError(null);
        setAttemptsCount(0);
        setHasBalance(false);

        try {
            return await ethereumService.reconnect();
        } catch (error) {
            console.error('Reconnection error:', error);
            return false;
        }
    }, []);

    return {
        logs,
        isLogging,
        isConnected,
        ethereumAccount,
        network,
        connectionError,
        hasBalance,
        logEvent,
        logAuthentication,
        fetchLogs,
        reconnect
    };
} 