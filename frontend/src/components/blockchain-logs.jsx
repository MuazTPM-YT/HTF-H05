import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/Button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useBlockchainLogging } from '../hooks/use-blockchain-logging';
import ethereumService from '../services/ethereum-service';

function BlockchainLogs() {
    const [selectedLog, setSelectedLog] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [manualCheckStatus, setManualCheckStatus] = useState(false);
    const {
        logs,
        isLogging,
        isEnabled,
        isConnected,
        ethereumAccount,
        network,
        logEvent,
        setLoggingEnabled,
        fetchLogs,
        refreshConnection
    } = useBlockchainLogging();

    useEffect(() => {
        const loadInitialLogs = async () => {
            const currentLogs = await fetchLogs();
            console.log("Fetched logs:", currentLogs);
        };

        if (isEnabled && isConnected) {
            loadInitialLogs();
        }
    }, [fetchLogs, isEnabled, isConnected]);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    setManualCheckStatus(accounts && accounts.length > 0);
                    console.log("Manual connection check:", accounts && accounts.length > 0 ? "Connected" : "Disconnected");
                } catch (err) {
                    console.error("Error checking connection:", err);
                    setManualCheckStatus(false);
                }
            } else {
                setManualCheckStatus(false);
            }
        };

        checkConnection();

        const interval = setInterval(checkConnection, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleLogAccess = async () => {
        await logEvent({
            action: 'View Medical Records',
            user: localStorage.getItem('username') || 'Current User',
            ipAddress: '192.168.1.100',
            status: 'Authorized'
        });
    };

    const handleToggleLogging = () => {
        setLoggingEnabled(!isEnabled);
    };

    const handleConnectWallet = async () => {
        setConnecting(true);
        try {
            const success = await ethereumService.reconnect();
            console.log("Manual connection attempt result:", success);
            refreshConnection();

            if (success) {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        } finally {
            setConnecting(false);
        }
    };

    const truncateAddress = (address) => {
        if (!address) return 'Not connected';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const renderLogDetails = (log) => {
        if (!log) return null;

        return (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Log Details</CardTitle>
                    <CardDescription>Transaction #{log.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Transaction Hash</div>
                        <div className="font-mono text-sm overflow-hidden text-ellipsis">
                            <a
                                href={`https://${network === 'homestead' ? '' : network + '.'}etherscan.io/tx/${log.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {log.txHash}
                            </a>
                        </div>

                        <div className="font-medium">Block Number</div>
                        <div>{log.blockNumber}</div>

                        <div className="font-medium">Timestamp</div>
                        <div>{log.timestamp}</div>

                        <div className="font-medium">User</div>
                        <div>{log.user}</div>

                        <div className="font-medium">IP Address</div>
                        <div>{log.ipAddress}</div>

                        <div className="font-medium">Status</div>
                        <div>
                            <Badge variant={log.status === 'Authorized' ? 'success' : 'destructive'}>
                                {log.status}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const effectivelyConnected = isConnected || manualCheckStatus;

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Blockchain Access Logs</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Blockchain Logging:</span>
                        <button
                            onClick={handleToggleLogging}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? "translate-x-5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                </div>

                <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium">Ethereum Connection</p>
                                <p className="text-sm text-gray-500">
                                    {effectivelyConnected ? (
                                        <span className="text-green-600 font-medium">Connected</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Disconnected</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Network</p>
                                <p className="text-sm text-gray-500">{network}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Account</p>
                                <p className="text-sm text-gray-500 font-mono">{truncateAddress(ethereumAccount)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Status</p>
                                <Badge variant={isEnabled ? "success" : "secondary"}>
                                    {isEnabled ? "Logging enabled" : "Logging disabled"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex space-x-3">
                <Button
                    onClick={handleLogAccess}
                    disabled={isLogging || !isEnabled || !effectivelyConnected}
                >
                    {isLogging ? 'Logging Access...' : 'Simulate Access Log'}
                </Button>

                {!effectivelyConnected && (
                    <Button
                        onClick={handleConnectWallet}
                        disabled={connecting}
                        variant="outline"
                    >
                        {connecting ? 'Connecting...' : 'Connect MetaMask'}
                    </Button>
                )}

                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                >
                    Refresh Page
                </Button>
            </div>

            {!effectivelyConnected && isEnabled && (
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                            <div>
                                <p className="font-medium">MetaMask Required</p>
                                <p className="text-sm">Please install MetaMask and connect to use blockchain logging.</p>
                                <p className="text-sm mt-1">Click the "Connect MetaMask" button above to connect your wallet.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Recent Access Logs</CardTitle>
                    <CardDescription>
                        All access events recorded on the Ethereum blockchain
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No access logs recorded yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>TX Hash</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <TableCell>{log.timestamp}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.user}</TableCell>
                                        <TableCell>
                                            <Badge variant={log.status === 'Authorized' ? 'success' : 'destructive'}>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {`${log.txHash.substring(0, 6)}...${log.txHash.substring(log.txHash.length - 4)}`}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {renderLogDetails(selectedLog)}
        </div>
    );
}

export default BlockchainLogs; 