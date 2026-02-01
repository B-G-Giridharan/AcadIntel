import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
    onScan: (data: { name: string; code: string; regulation: string }) => void;
    onClose: () => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ onScan, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const isMountedRef = useRef(true);
    const onScanRef = useRef(onScan);
    const onCloseRef = useRef(onClose);

    // Update refs when props change
    useEffect(() => {
        onScanRef.current = onScan;
        onCloseRef.current = onClose;
    }, [onScan, onClose]);

    const handleClose = () => {
        if (!isMountedRef.current) return;
        isMountedRef.current = false;
        setIsScanning(false);
        if (scannerRef.current) {
            scannerRef.current.stop().catch(() => {
                // Error stopping scanner, ignore
            });
        }
        onCloseRef.current();
    };
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking on the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Lock body scroll when modal opens and add ESC key listener
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMountedRef.current) {
                handleClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const initScanner = async () => {
            if (!isMountedRef.current) return;

            try {
                const scanner = new Html5Qrcode('qr-scanner-container');
                
                const onScanSuccess = (decodedText: string) => {
                    if (!isMountedRef.current) return;

                    try {
                        // Try to parse as JSON first (expected format)
                        const data = JSON.parse(decodedText);
                        if (data.name && data.code && data.regulation) {
                            setIsScanning(false);
                            if (scannerRef.current) {
                                scannerRef.current.stop().catch(() => {
                                    // Error stopping scanner, ignore
                                });
                            }
                            onScanRef.current(data);
                            return;
                        }
                    } catch {
                        // If not JSON, try to extract info from text
                        // Format: "Subject: NAME | Code: CODE | Regulation: REG"
                        const nameMatch = decodedText.match(/Subject:\s*(.+?)(?:\||$)/i);
                        const codeMatch = decodedText.match(/Code:\s*(.+?)(?:\||$)/i);
                        const regMatch = decodedText.match(/Regulation:\s*(.+?)(?:\||$)/i);

                        if (nameMatch && codeMatch && regMatch) {
                            setIsScanning(false);
                            if (scannerRef.current) {
                                scannerRef.current.stop().catch(() => {
                                    // Error stopping scanner, ignore
                                });
                            }
                            onScanRef.current({
                                name: nameMatch[1].trim(),
                                code: codeMatch[1].trim(),
                                regulation: regMatch[1].trim(),
                            });
                            return;
                        }
                    }
                    if (isMountedRef.current) {
                        setError('Invalid QR code format. Expected: {"name":"...", "code":"...", "regulation":"..."}');
                    }
                };

                const onScanError = (errorMessage: string) => {
                    // Ignore expected scanning errors during normal operation
                };

                // Start the scanner with camera constraints
                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    onScanSuccess,
                    onScanError
                );

                if (isMountedRef.current) {
                    scannerRef.current = scanner;
                }
            } catch (err) {
                if (isMountedRef.current) {
                    const errorMsg = err instanceof Error ? err.message : 'Failed to initialize scanner';
                    if (errorMsg.includes('NotAllowedError') || errorMsg.includes('permission') || errorMsg.includes('Permission')) {
                        setError('Camera access denied. Please allow camera permissions.');
                    } else if (errorMsg.includes('NotFoundError')) {
                        setError('No camera found. Please check your device.');
                    } else {
                        setError(errorMsg);
                    }
                    setIsScanning(false);
                }
            }
        };

        // Initialize scanner on mount
        initScanner();

        return () => {
            isMountedRef.current = false;
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {
                    // Error stopping scanner on unmount, ignore
                });
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            <div className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-white text-2xl">qr_code</span>
                            <h2 className="text-white text-xl font-bold">Scan Subject QR Code</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Scanner Container */}
                <div className="p-6">
                    {isScanning ? (
                        <>
                            <div id="qr-scanner-container" className="mb-4 rounded-xl overflow-hidden bg-black w-full" style={{ minHeight: '300px', width: '100%' }} />
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Point your camera at a QR code to scan subject details
                            </p>
                        </>
                    ) : null}

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                                <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">error</span>
                                {error}
                            </p>
                        </div>
                    )}

                    {!isScanning && !error && (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-5xl text-primary mb-4 block">check_circle</span>
                            <p className="text-lg font-semibold text-[#111318] dark:text-white mb-2">QR Code Scanned!</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Your subject details have been loaded.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-t border-[#e5e7eb] dark:border-gray-800 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-[#dcdfe5] dark:border-gray-700 text-[#111318] dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                    {error && (
                        <button
                            onClick={() => {
                                setError(null);
                                setIsScanning(true);
                            }}
                            className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
