import { GoogleOAuthProvider } from '@react-oauth/google';

// You'll need to replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID_HERE";

export default function GoogleAuthProvider({ children }) {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
} 