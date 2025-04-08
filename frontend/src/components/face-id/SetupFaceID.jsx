import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const SetupFaceID = ({ onComplete, onCancel }) => {
    const totalImages = 500;
    const [isCapturing, setIsCapturing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imagesCaptured, setImagesCaptured] = useState(0);
    const [eyesOpen, setEyesOpen] = useState(true);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [isCheckingBackend, setIsCheckingBackend] = useState(true);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const capturedImages = useRef([]);
    const { toast } = useToast();

    useEffect(() => {
        const checkBackend = async () => {
            try {
                setIsCheckingBackend(true);
                const response = await api.get('/health');
                if (response.data.status === 'healthy') {
                    setBackendAvailable(true);
                    console.log('Backend server is available');
                }
            } catch (error) {
                console.error('Backend server not available:', error);
                setBackendAvailable(false);
                toast({
                    title: "Backend Server Error",
                    description: "Cannot connect to the facial recognition server. Your data will be stored locally only.",
                    variant: "destructive"
                });
            } finally {
                setIsCheckingBackend(false);
            }
        };

        const initialize = async () => {
            await startCamera();
            await checkBackend();
        };

        initialize();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            toast({
                title: "Camera Error",
                description: "Could not access your camera. Please check permissions.",
                variant: "destructive"
            });
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    };

    const sendImagesToBackend = async () => {
        if (!backendAvailable) {
            localStorage.setItem('faceIDSetupComplete', 'true');
            localStorage.setItem('faceIDSetupTime', new Date().toISOString());
            localStorage.setItem('faceIDImagesCaptures', capturedImages.current.length.toString());
            toast({
                title: "Success",
                description: "Face ID setup completed locally (offline mode)",
            });
            onComplete();
            return;
        }

        try {
            const BATCH_SIZE = 10;
            let successfulBatches = 0;
            let lastError = null;

            for (let i = 0; i < capturedImages.current.length; i += BATCH_SIZE) {
                const batch = capturedImages.current.slice(i, i + BATCH_SIZE);
                try {
                    console.log(`Sending batch ${i / BATCH_SIZE + 1} with ${batch.length} images`);
                    const response = await api.post('/api/enroll_face/', {
                        images: batch,
                        user_id: localStorage.getItem('username') || 'test_user'
                    });
                    console.log('Batch response:', response.data);
                    if (response.data.message && !response.data.error) {
                        successfulBatches++;
                    } else if (response.data.error) {
                        lastError = response.data.error;
                        console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, response.data.error);
                    }
                } catch (batchError) {
                    lastError = batchError.response?.data?.error || batchError.message;
                    console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, batchError);
                }
            }

            if (successfulBatches > 0) {
                toast({
                    title: "Success",
                    description: `Face ID setup completed with ${successfulBatches} successful batches.`,
                });
                onComplete();
            } else {
                toast({
                    title: "Warning",
                    description: "No successful face detections in the batches. Your data will be stored locally.",
                    variant: "destructive"
                });
                localStorage.setItem('faceIDSetupComplete', 'true');
                localStorage.setItem('faceIDSetupTime', new Date().toISOString());
                localStorage.setItem('faceIDImagesCaptures', capturedImages.current.length.toString());
                onComplete();
            }
        } catch (error) {
            console.error('Error sending images to backend:', error);
            if (
                error.message.includes('Network Error') ||
                error.code === 'ECONNABORTED' ||
                error.message.includes('Connection refused') ||
                (error.response && error.response.status >= 500)
            ) {
                toast({
                    title: "Connection Error",
                    description: "Could not connect to the facial recognition server. Your data will be stored locally.",
                    variant: "destructive"
                });
                localStorage.setItem('faceIDSetupComplete', 'true');
                localStorage.setItem('faceIDSetupTime', new Date().toISOString());
                localStorage.setItem('faceIDImagesCaptures', capturedImages.current.length.toString());
                onComplete();
            } else {
                toast({
                    title: "Error",
                    description: error.message || "Failed to setup Face ID. Please try again.",
                    variant: "destructive"
                });
                onCancel();
            }
        }
    };

    const startCapture = async () => {
        setIsCapturing(true);
        setProgress(0);
        setImagesCaptured(0);
        capturedImages.current = [];

        for (let i = 0; i < totalImages; i++) {
            if (!isCapturing) break;

            const imageData = captureImage();
            if (imageData) {
                capturedImages.current.push(imageData);
            }

            const newProgress = Math.round(((i + 1) / totalImages) * 100);
            setProgress(newProgress);
            setImagesCaptured(i + 1);

            console.log(`Captured image ${i + 1}/${totalImages}, progress: ${newProgress}%`);

            await new Promise(resolve => setTimeout(resolve, 200));

            if (i === Math.floor(totalImages / 2)) {
                setEyesOpen(false);
            }
        }

        setIsCapturing(false);
        await sendImagesToBackend();
    };

    const stopCapture = () => {
        setIsCapturing(false);
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Setup Face ID</h2>
                        <button onClick={stopCapture} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>

                    {!backendAvailable && !isCheckingBackend && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm">
                            Backend server is not available. Your facial data will be stored locally.
                        </div>
                    )}

                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Progress: {progress}%</span>
                            <span>{imagesCaptured}/{totalImages} images</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        {eyesOpen
                            ? <p>Please keep your eyes open and rotate your head slowly</p>
                            : <p>Please close your eyes and rotate your head slowly</p>}
                    </div>

                    <div className="flex justify-center space-x-4">
                        {!isCapturing ? (
                            <Button onClick={startCapture} className="flex items-center space-x-2">
                                <Camera size={20} />
                                <span>Start Capture</span>
                            </Button>
                        ) : (
                            <Button onClick={stopCapture} variant="destructive" className="flex items-center space-x-2">
                                <X size={20} />
                                <span>Stop Capture</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupFaceID;
