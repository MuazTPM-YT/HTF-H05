import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { Button } from './ui/Button';
import { useToast } from '../hooks/use-toast';

export default function GoogleAuth({ onSuccess }) {
    const { toast } = useToast();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is already authenticated
        const userData = localStorage.getItem('google_user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleSuccess = (credentialResponse) => {
        try {
            // Decode the JWT token
            const decodedToken = jwtDecode(credentialResponse.credential);

            // Set user data
            setUser(decodedToken);

            // Store the user info in localStorage
            localStorage.setItem('google_user', JSON.stringify(decodedToken));
            localStorage.setItem('google_token', credentialResponse.credential);

            // Notify parent component
            if (onSuccess) {
                onSuccess(decodedToken);
            }

            toast({
                title: "Login successful",
                description: `Welcome, ${decodedToken.name}!`,
            });
        } catch (error) {
            console.error('Error decoding Google token:', error);
            toast({
                title: "Authentication failed",
                description: "There was an error processing your login. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleError = () => {
        toast({
            title: "Authentication failed",
            description: "Google sign-in was unsuccessful. Please try again.",
            variant: "destructive",
        });
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('google_user');
        localStorage.removeItem('google_token');

        toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
        });
    };

    return (
        <div className="flex flex-col space-y-4">
            {user ? (
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                        {user.picture && (
                            <img
                                src={user.picture}
                                alt={user.name}
                                className="h-10 w-10 rounded-full"
                            />
                        )}
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full sm:w-auto"
                    >
                        Disconnect Google Account
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col space-y-3">
                    <p className="text-sm text-gray-500">
                        Connect your Google account for secure sign-in
                    </p>
                    <div className="flex justify-center sm:justify-start">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            useOneTap
                            theme="outline"
                            shape="rectangular"
                            type="standard"
                            text="signin_with"
                            logo_alignment="left"
                            width="250"
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 