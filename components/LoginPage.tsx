
import React, { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Html5Qrcode } from 'html5-qrcode';

const LoginPage: React.FC = () => {
    const [regId, setRegId] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [authMethod, setAuthMethod] = useState('reg');
    const [qrError, setQrError] = useState<string | null>(null);
    const [qrMessage, setQrMessage] = useState<string | null>(null);
    const [isQrScanning, setIsQrScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const hasScannedRef = useRef(false);
    const { login } = useContext(AppContext);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const finalUsername = username.trim() || 'User';
        if (login(regId, finalUsername)) {
            window.location.hash = '/';
        } else {
            setError('Invalid Registration Number.');
        }
    };

    useEffect(() => {
        const stopScanner = () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {
                    // Error stopping scanner, ignore
                }).finally(() => {
                    scannerRef.current?.clear?.();
                });
                scannerRef.current = null;
            }
        };

        if (authMethod !== 'qr') {
            stopScanner();
            setIsQrScanning(false);
            setQrError(null);
            setQrMessage(null);
            hasScannedRef.current = false;
            return;
        }

        const initScanner = async () => {
            try {
                setIsQrScanning(true);
                setQrError(null);
                setQrMessage('Starting camera...');
                const scanner = new Html5Qrcode('login-qr-scanner');

                const onScanSuccess = (decodedText: string) => {
                    if (hasScannedRef.current) return;

                    let registrationId = decodedText.trim();

                    try {
                        const parsed = JSON.parse(decodedText);
                        registrationId = parsed.registrationId || parsed.regId || parsed.id || registrationId;
                    } catch {
                        // Non-JSON QR codes are supported as raw registration ID
                    }

                    if (!registrationId) {
                        const match = decodedText.match(/registration\s*id\s*[:#-]?\s*([A-Za-z0-9-]+)/i);
                        if (match) {
                            registrationId = match[1];
                        }
                    }

                    if (!registrationId) {
                        const numericMatch = decodedText.match(/\b\d{10,20}\b/);
                        if (numericMatch) {
                            registrationId = numericMatch[0];
                        }
                    }

                    registrationId = registrationId.trim();

                    if (!registrationId) {
                        setQrError('Invalid QR code. Please scan a Registration ID QR.');
                        return;
                    }

                    setRegId(registrationId);
                    setQrError(null);
                    setQrMessage('Logging you in...');
                    hasScannedRef.current = true;
                    stopScanner();
                    setIsQrScanning(false);

                    if (login(registrationId)) {
                        window.location.hash = '/';
                    } else {
                        setError('Invalid Registration Number.');
                        setQrMessage(null);
                    }
                };

                const onScanError = (_errorMessage: string) => {
                    // Ignore expected scanning errors during normal operation
                };

                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 220, height: 220 }
                    },
                    onScanSuccess,
                    onScanError
                );

                scannerRef.current = scanner;
                hasScannedRef.current = false;
                setQrMessage('Point your camera at a Registration ID QR code.');
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to initialize scanner';
                if (errorMsg.includes('NotAllowedError') || errorMsg.includes('permission') || errorMsg.includes('Permission')) {
                    setQrError('Camera access denied. Please allow camera permissions.');
                } else if (errorMsg.includes('NotFoundError')) {
                    setQrError('No camera found. Please check your device.');
                } else if (errorMsg.includes('Only secure origins') || errorMsg.includes('secure context')) {
                    setQrError('Camera requires a secure context. Use https or localhost to enable scanning.');
                } else {
                    setQrError(errorMsg);
                }
                setIsQrScanning(false);
                setQrMessage(null);
            }
        };

        initScanner();

        return () => {
            stopScanner();
            setIsQrScanning(false);
            setQrMessage(null);
        };
    }, [authMethod, login]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-sans flex flex-col min-h-screen relative overflow-hidden text-[#111318] dark:text-white transition-colors duration-300">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full px-4 py-8">
                <div className="w-full max-w-[440px] flex flex-col gap-8 bg-white dark:bg-[#1a202c] rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] p-8 border border-white/50 dark:border-gray-800 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-1">
                            <span className="material-symbols-outlined text-[32px]">school</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white">AcadIntel</h1>
                            <p className="text-[#636f88] dark:text-gray-400 text-sm font-normal leading-relaxed">Welcome to your focused study space.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex p-1.5 bg-[#f0f2f4] dark:bg-[#111621] rounded-xl">
                            <button onClick={() => setAuthMethod('reg')} className={`flex-1 relative group py-2.5 px-3 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center ${authMethod === 'reg' ? 'bg-white dark:bg-[#2d3748] text-[#111318] dark:text-white shadow-sm' : 'text-[#636f88] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white'}`}>
                                <span className="material-symbols-outlined mr-2 text-[18px]">badge</span>
                                <span>Registration ID</span>
                            </button>
                            <button onClick={() => setAuthMethod('qr')} className={`flex-1 relative group py-2.5 px-3 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center ${authMethod === 'qr' ? 'bg-white dark:bg-[#2d3748] text-[#111318] dark:text-white shadow-sm' : 'text-[#636f88] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white'}`}>
                                <span className="material-symbols-outlined mr-2 text-[18px]">qr_code_scanner</span>
                                <span>QR Scan</span>
                            </button>
                        </div>
                        
                        {authMethod === 'reg' ? (
                            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#111318] dark:text-gray-200 ml-1">Your Name</span>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#636f88] dark:text-gray-500 text-[20px]">person</span>
                                        </div>
                                        <input 
                                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#dcdfe5] dark:border-gray-700 text-[#111318] dark:text-white placeholder-[#a1a8b3] dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal text-base"
                                            placeholder="Enter your full name" 
                                            type="text" 
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#111318] dark:text-gray-200 ml-1">Registration Number</span>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#636f88] dark:text-gray-500 text-[20px]">id_card</span>
                                        </div>
                                        <input 
                                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#dcdfe5] dark:border-gray-700 text-[#111318] dark:text-white placeholder-[#a1a8b3] dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal text-base"
                                            placeholder="e.g. 2117240020105" 
                                            type="text" 
                                            value={regId}
                                            onChange={(e) => setRegId(e.target.value)}
                                            />
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
                                </label>
                                <button type="submit" className="group flex items-center justify-center w-full h-12 bg-primary hover:bg-[#1550c6] text-white text-[15px] font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(25,93,230,0.39)] hover:shadow-[0_6px_20px_rgba(25,93,230,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                                    <span>Enter Study Space</span>
                                    <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-100 dark:bg-charcoal-dark rounded-xl">
                                <div
                                    id="login-qr-scanner"
                                    className="w-full rounded-xl overflow-hidden bg-black"
                                    style={{ minHeight: '260px' }}
                                />
                                {isQrScanning && (
                                    <p className="text-sm text-gray-500 text-center">Initializing camera...</p>
                                )}
                                {qrError && (
                                    <p className="text-sm text-red-500 text-center">{qrError}</p>
                                )}
                                {qrMessage && !qrError && (
                                    <p className="text-sm text-gray-500 text-center">{qrMessage}</p>
                                )}
                                {!isQrScanning && !qrError && !qrMessage && (
                                    <p className="text-sm text-gray-500 text-center">Point your camera at a Registration ID QR code.</p>
                                )}
                                <p className="text-xs text-gray-400 text-center">
                                    Tip: QR codes can contain plain Registration ID text or JSON like {`{"registrationId":"2024-STUD-8821"}`}.
                                </p>
                            </div>
                        )}
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-[#e5e7eb] dark:border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-[#9ca3af] dark:text-gray-500 font-medium uppercase tracking-wider">Help & Access</span>
                            <div className="flex-grow border-t border-[#e5e7eb] dark:border-gray-700"></div>
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <a href="#" className="text-sm text-[#636f88] dark:text-gray-400 hover:text-primary dark:hover:text-primary font-medium transition-colors flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">help</span>Need Help?
                            </a>
                            <a href="#" className="text-sm text-[#636f88] dark:text-gray-400 hover:text-primary dark:hover:text-primary font-medium transition-colors flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">school</span>Institutional Access
                            </a>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-center">
                        <p className="text-[11px] font-medium text-[#9ca3af] dark:text-gray-600 flex items-center gap-1.5 bg-[#f9fafb] dark:bg-[#111621] px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                            <span className="material-symbols-outlined text-[14px] text-green-600 dark:text-green-500">lock</span>Protected by AcadIntel Security
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
