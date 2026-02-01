import React, { useState } from 'react';
import { generateQRCodeURL, SubjectQRData } from '../utils/qrCodeUtils';

interface QRCodeGeneratorProps {
    onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onClose }) => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [regulation, setRegulation] = useState('');
    const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);

    const generateQRCode = () => {
        if (subjectName && subjectCode && regulation) {
            const data: SubjectQRData = {
                name: subjectName,
                code: subjectCode,
                regulation: regulation,
            };
            const url = generateQRCodeURL(data, 400);
            setQrCodeURL(url);
        }
    };

    const downloadQRCode = () => {
        if (qrCodeURL) {
            const link = document.createElement('a');
            link.href = qrCodeURL;
            link.download = `${subjectCode}-qr-code.png`;
            link.click();
        }
    };

    const copyQRCodeData = () => {
        const data = {
            name: subjectName,
            code: subjectCode,
            regulation: regulation,
        };
        navigator.clipboard.writeText(JSON.stringify(data));
        alert('QR code data copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-background-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-blue-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-white text-2xl">qr_code_2</span>
                        <h2 className="text-white text-xl font-bold">Generate Subject QR Code</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-lg font-semibold text-[#111318] dark:text-white">Subject Details</h3>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Subject Name</label>
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    placeholder="e.g., Advanced Calculus"
                                    className="w-full rounded-xl px-4 py-3 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:outline-0 focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Subject Code</label>
                                <input
                                    type="text"
                                    value={subjectCode}
                                    onChange={(e) => setSubjectCode(e.target.value)}
                                    placeholder="e.g., MAT-402"
                                    className="w-full rounded-xl px-4 py-3 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:outline-0 focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">Regulation / Year</label>
                                <input
                                    type="text"
                                    value={regulation}
                                    onChange={(e) => setRegulation(e.target.value)}
                                    placeholder="e.g., R-2021"
                                    className="w-full rounded-xl px-4 py-3 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:outline-0 focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <button
                                onClick={generateQRCode}
                                disabled={!subjectName || !subjectCode || !regulation}
                                className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-semibold transition-colors mt-4"
                            >
                                Generate QR Code
                            </button>
                        </div>

                        {/* QR Code Display Section */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-lg font-semibold text-[#111318] dark:text-white">Preview</h3>
                            
                            {qrCodeURL ? (
                                <>
                                    <div className="flex items-center justify-center p-6 bg-white rounded-xl border border-[#e5e7eb] dark:border-gray-700">
                                        <img src={qrCodeURL} alt="Generated QR Code" className="max-w-xs" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={downloadQRCode}
                                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 font-semibold transition-colors"
                                        >
                                            <span className="material-symbols-outlined">download</span>
                                            Download QR Code
                                        </button>
                                        <button
                                            onClick={copyQRCodeData}
                                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold transition-colors"
                                        >
                                            <span className="material-symbols-outlined">content_copy</span>
                                            Copy Data
                                        </button>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-lg">
                                        <p className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
                                            {JSON.stringify({ name: subjectName, code: subjectCode, regulation: regulation })}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center p-12 bg-slate-50 dark:bg-black/20 rounded-xl border-2 border-dashed border-[#dcdfe5] dark:border-gray-700">
                                    <p className="text-center text-slate-500 dark:text-slate-400">
                                        Fill in the details and click "Generate QR Code" to preview
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">info</span>
                            <div>
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">How to use:</p>
                                <p className="text-xs text-blue-800 dark:text-blue-400">
                                    Generate a QR code with subject information. Students can scan this code to quickly add the subject to their workspace.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 px-6 py-4 bg-slate-50 dark:bg-black/20 border-t border-[#e5e7eb] dark:border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 rounded-lg border border-[#dcdfe5] dark:border-gray-700 text-[#111318] dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
