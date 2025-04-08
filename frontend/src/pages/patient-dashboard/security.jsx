import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, History, Clock, AlertTriangle, Shield, Database, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/use-toast';

// This would be replaced with actual Web3 integration in production
// import { ethers } from 'ethers';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [isLogging, setIsLogging] = useState(false);
  const [accessLogs, setAccessLogs] = useState([
    {
      id: '0x123abc',
      timestamp: '10/15/2023, 2:30:00 PM',
      action: 'Record Access',
      user: 'Dr. Sarah Johnson',
      ipAddress: '192.168.1.1',
      status: 'Authorized',
      txHash: '0x71c7656EC7ab88b098dFb751B8b65d8b6E8926F2a',
      blockNumber: 14876234
    },
    {
      id: '0x456def',
      timestamp: '10/14/2023, 9:15:00 AM',
      action: 'Login',
      user: 'You',
      ipAddress: '192.168.1.100',
      status: 'Authorized',
      txHash: '0x82d7656EC7ab88b098dFb751B8b65d8b6E8926F3b',
      blockNumber: 14876100
    },
    {
      id: '0x789ghi',
      timestamp: '10/10/2023, 4:45:00 PM',
      action: 'Record Update',
      user: 'Central Hospital',
      ipAddress: '192.168.2.50',
      status: 'Authorized',
      txHash: '0x93e7656EC7ab88b098dFb751B8b65d8b6E8926F4c',
      blockNumber: 14875500
    },
    {
      id: '0xabcdef',
      timestamp: '10/5/2023, 11:20:00 AM',
      action: 'Login Attempt',
      user: 'Unknown',
      ipAddress: '203.0.113.42',
      status: 'Blocked',
      txHash: '0xa4f7656EC7ab88b098dFb751B8b65d8b6E8926F5d',
      blockNumber: 14874900
    }
  ]);

  const [blockchainLoggingEnabled, setBlockchainLoggingEnabled] = useState(true);

  // Mock function to simulate logging an event to the blockchain
  const logToBlockchain = async (event) => {
    setIsLogging(true);
    try {
      // In a real implementation, this would use ethers.js or web3.js to:
      // 1. Connect to the blockchain (Ethereum)
      // 2. Call a smart contract function to log the event
      // 3. Wait for transaction confirmation

      // Simulating blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a new log entry with blockchain data
      const newLog = {
        id: `0x${Math.random().toString(16).slice(2, 8)}`,
        timestamp: new Date().toLocaleString(),
        action: event.action,
        user: event.user || 'You',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        status: 'Authorized',
        txHash: `0x${Math.random().toString(16).slice(2, 42)}`,
        blockNumber: 14876234 + Math.floor(Math.random() * 100)
      };

      // Add to our local state (in a real app, this would be fetched from the blockchain)
      setAccessLogs(prev => [newLog, ...prev]);

      toast({
        title: "Access logged to blockchain",
        description: `Transaction hash: ${newLog.txHash.slice(0, 10)}...`,
      });
    } catch (error) {
      console.error('Error logging to blockchain:', error);
      toast({
        title: "Blockchain logging failed",
        description: "Unable to record access on the blockchain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const toggleBlockchainLogging = () => {
    setBlockchainLoggingEnabled(!blockchainLoggingEnabled);
    toast({
      title: blockchainLoggingEnabled ? "Blockchain logging disabled" : "Blockchain logging enabled",
      description: blockchainLoggingEnabled ?
        "Access logs will no longer be recorded on the blockchain" :
        "All access events will now be recorded on the blockchain",
    });
  };

  const testBlockchainLogging = () => {
    logToBlockchain({
      action: 'Test Log Event',
      user: 'You'
    });
  };

  // In a real implementation, this would fetch logs from the blockchain
  useEffect(() => {
    // Simulating fetching logs from blockchain
    console.log('Fetching logs from blockchain...');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-500">Manage your encryption keys and security preferences</p>
      </div>

      {/* Blockchain Security */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-semibold">Blockchain Security</h2>
        <p className="text-gray-500">Manage your encryption keys and security settings</p>

        <div className="border rounded-lg p-5 mt-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="h-5 w-5" />
                Encryption Keys
              </h3>
              <p className="text-gray-500 text-sm">Your private key is used to encrypt and decrypt your health records</p>
            </div>
            <Button variant="outline">Generate New Keys</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Public Key (Ethereum Address)</label>
              <div className="flex">
                <input
                  type="text"
                  value="0x71c7656EC7ab88b098dFb751B8b65d8b6E8926F"
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50"
                />
                <Button variant="ghost" className="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Private Key</label>
              <div className="flex">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••••••••••••••••••••••••"
                  readOnly
                  className="py-2 px-3 border rounded-md w-full bg-gray-50"
                />
                <Button variant="ghost" className="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </Button>
              </div>
              <p className="text-sm mt-1 text-gray-500">Never share your private key with anyone. It gives full access to your health records.</p>
            </div>

            <Button variant="outline" className="mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Backup Keys
            </Button>
          </div>
        </div>

        {/* Blockchain Access Logging */}
        <div className="border rounded-lg p-5 mt-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Blockchain Access Logging
              </h3>
              <p className="text-gray-500 text-sm">All access to your records is permanently stored on the blockchain</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="toggle-blockchain-logging"
                  className="opacity-0 w-0 h-0"
                  checked={blockchainLoggingEnabled}
                  onChange={toggleBlockchainLogging}
                />
                <label
                  htmlFor="toggle-blockchain-logging"
                  className={`block absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${blockchainLoggingEnabled ? 'bg-blue-600' : 'bg-gray-300'} rounded-full before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all ${blockchainLoggingEnabled ? 'before:translate-x-6' : ''}`}
                ></label>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  When enabled, all access to your health records is cryptographically signed and permanently stored on the Ethereum blockchain,
                  creating an immutable audit trail. This ensures maximum transparency and security for your health data.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testBlockchainLogging}
                    disabled={isLogging || !blockchainLoggingEnabled}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    {isLogging ? (
                      <>
                        <span className="animate-spin mr-2">⚪</span>
                        Logging...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Test Blockchain Logging
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    View Smart Contract
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            <p className="text-gray-500">Require a verification code when logging in</p>
          </div>
          <div className="relative inline-block w-12 h-6">
            <input type="checkbox" id="toggle-2fa" className="opacity-0 w-0 h-0" />
            <label htmlFor="toggle-2fa" className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-6 checked:bg-blue-600"></label>
          </div>
        </div>

        <div className="ml-6 border-l-2 border-gray-200 pl-4 py-2">
          <div className="flex items-start gap-3">
            <div className="w-7 h-12 bg-gray-100 rounded flex items-center justify-center border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Mobile Authentication App</h3>
              <p className="text-sm text-gray-500">Use an authentication app like Google Authenticator or Authy</p>
              <Button variant="outline" size="sm" className="mt-2">Setup</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notifications */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Security Notifications</h2>
            <p className="text-gray-500">Get notified about important security events</p>
          </div>
          <div className="relative inline-block w-12 h-6">
            <input type="checkbox" id="toggle-notifications" className="opacity-0 w-0 h-0" defaultChecked />
            <label htmlFor="toggle-notifications" className="block absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-blue-600 rounded-full before:absolute before:h-4 before:w-4 before:left-[calc(100%-20px)] before:bottom-1 before:bg-white before:rounded-full before:transition-all"></label>
          </div>
        </div>
      </div>

      {/* Recent Access Logs */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Blockchain Access Logs
            </h2>
            <p className="text-gray-500">Immutable record of all access to your health records, secured by blockchain</p>
          </div>
          <Button variant="outline">View Full Access History</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-sm text-gray-700">
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date & Time</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">IP Address</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Blockchain Record</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {accessLogs.map(log => (
                <tr key={log.id} className="border-b">
                  <td className="py-3 px-4">{log.timestamp}</td>
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.user}</td>
                  <td className="py-3 px-4">{log.ipAddress}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 ${log.status === 'Authorized' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-xs font-medium`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://etherscan.io/tx/${log.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {log.txHash.slice(0, 10)}...
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="border rounded-lg p-5 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Security Best Practices</h2>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-yellow-800">
              <li>Never share your private key with anyone</li>
              <li>Enable two-factor authentication for additional security</li>
              <li>Regularly review access logs for unauthorized activity</li>
              <li>Backup your encryption keys in a secure location</li>
              <li>Keep blockchain logging enabled for maximum security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 