
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import QRScannerModal from './QRScannerModal';

const NewSubjectPage: React.FC = () => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [regulation, setRegulation] = useState('');
    const [showQRScanner, setShowQRScanner] = useState(false);
    const { addSubject } = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subjectName && subjectCode && regulation) {
            addSubject({ name: subjectName, code: subjectCode, regulation: regulation });
            window.location.hash = '/';
        }
    };

    const handleQRScan = (data: { name: string; code: string; regulation: string }) => {
        setSubjectName(data.name);
        setSubjectCode(data.code);
        setRegulation(data.regulation);
        setShowQRScanner(false);
    };
    
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display antialiased text-[#111318] dark:text-white transition-colors duration-200">
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-gray-800 bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">AcadIntel</h2>
                </div>
                <button onClick={() => window.history.back()} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#111318] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
                    <span className="truncate">Back to Dashboard</span>
                </button>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[560px] flex flex-col gap-8">
                    <div className="flex flex-col gap-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318] dark:text-white">Add a New Subject</h1>
                            <span className="material-symbols-outlined text-primary animate-pulse" title="AI Powered">auto_awesome</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-normal max-w-[440px] mx-auto">
                            Tell us what you're learning, and our AI will prepare your study materials immediately.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none border border-[#e5e7eb] dark:border-gray-800 p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#111318] dark:text-white">Enter Subject Details</h3>
                            <button
                                type="button"
                                onClick={() => setShowQRScanner(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">qr_code</span>
                                Scan QR Code
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal" htmlFor="subject-name">Subject Name</label>
                            <input autoFocus value={subjectName} onChange={e => setSubjectName(e.target.value)} required className="form-input w-full resize-none overflow-hidden rounded-xl text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark h-14 placeholder:text-[#9ca3af] px-4 py-3 text-base font-normal leading-tight transition-all" id="subject-name" placeholder="e.g., Advanced Calculus" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal" htmlFor="subject-code">Subject Code</label>
                                <input value={subjectCode} onChange={e => setSubjectCode(e.target.value)} required className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark h-14 placeholder:text-[#9ca3af] px-4 text-base font-normal leading-normal transition-all" id="subject-code" placeholder="e.g., MAT-402" />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold leading-normal" htmlFor="regulation">Regulation / Year</label>
                                <div className="relative">
                                    <input value={regulation} onChange={e => setRegulation(e.target.value)} required className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-background-dark h-14 placeholder:text-[#9ca3af] px-4 text-base font-normal leading-normal transition-all" id="regulation" placeholder="e.g., R-2021" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-xl">calendar_month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-2"></div>
                        <button type="submit" className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                            <span className="mr-2">Start Studying</span>
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
                            AcadIntel will generate a syllabus structure based on these details.
                        </p>
                    </form>
                </div>
            </main>
            {showQRScanner && (
                <QRScannerModal
                    onScan={handleQRScan}
                    onClose={() => setShowQRScanner(false)}
                />
            )}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 dark:opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl opacity-50 dark:opacity-10"></div>
            </div>
        </div>
    );
};

export default NewSubjectPage;
