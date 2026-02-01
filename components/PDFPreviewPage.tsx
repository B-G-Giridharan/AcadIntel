
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { downloadPDF, triggerDownload } from '../services/backendService';

type PreviewState = {
    filename?: string;
    subjectName?: string;
    generationType?: 'answer-key' | 'notes';
};

const PDFPreviewPage: React.FC = () => {
    const location = useLocation();
    const state = (location.state || {}) as PreviewState;
    const [zoom, setZoom] = useState(100);
    const [includeCitations, setIncludeCitations] = useState(true);
    const [smartHighlights, setSmartHighlights] = useState(true);
    const [darkExport, setDarkExport] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleZoom = (amount: number) => {
        setZoom(prev => Math.max(50, Math.min(200, prev + amount)));
    };

    const handleDownloadPDF = async () => {
        if (!state.filename) {
            console.warn('No filename found for download.');
            return;
        }

        setIsDownloading(true);
        try {
            const blob = await downloadPDF(state.filename);
            triggerDownload(blob, state.filename);
            console.log('PDF downloaded successfully:', state.filename);
        } catch (error) {
            console.error('PDF download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden h-screen flex flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e5e7eb] dark:border-[#292e38] px-6 py-3 bg-white dark:bg-[#111318] z-20 shrink-0">
                <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                    <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">AcadIntel</h2>
                </div>
            </header>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-[#111621] border-b border-[#e5e7eb] dark:border-[#292e38] shrink-0 z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[#111318] dark:text-white tracking-tight text-xl font-bold leading-tight">
                            {state.subjectName || 'Introduction to Quantum Mechanics'}
                        </h1>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">Generated</span>
                    </div>
                    <p className="text-[#6b7280] dark:text-[#9da6b8] text-sm">Created just now via AI Assistant</p>
                </div>
                <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-[#eef1f6] dark:bg-[#292e38] hover:bg-[#e5e7eb] dark:hover:bg-[#3c4453] text-[#111318] dark:text-white text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span className="hidden sm:inline">Back to Workspace</span>
                </button>
            </div>
            <main className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 bg-[#f3f4f6] dark:bg-[#0d1017] relative flex flex-col items-center overflow-y-auto pt-8 pb-20 px-4 md:px-8">
                    <div className="a4-page bg-white text-gray-900 shadow-lg shadow-black/20 rounded-sm p-[25mm] relative mb-8 origin-top transition-transform duration-200" style={{ transform: `scale(${zoom / 100})` }}>
                        <div className="border-b-2 border-gray-900 pb-4 mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold font-sans text-gray-900 mb-2">{state.subjectName || 'Course Study Notes'}</h1>
                                <p className="text-sm text-gray-600 font-sans italic">AI Generated Study Material - AcadIntel</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">PHY-301</p>
                                <p className="text-xs text-gray-500">Page 1 of 3</p>
                            </div>
                        </div>
                        <div className="space-y-6 font-sans leading-relaxed text-[11pt]">
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Introduction</h2>
                                <p className="text-justify mb-4">This document provides a comprehensive overview of the key concepts and theories covered in this course. The material is organized to facilitate effective study and understanding of the subject matter.</p>
                                <p className="text-justify">Students are encouraged to review this material regularly and refer to additional resources as needed for deeper understanding of complex topics.</p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Key Topics</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Fundamental principles and theoretical foundations</li>
                                    <li>Mathematical frameworks and analytical methods</li>
                                    <li>Practical applications and real-world examples</li>
                                    <li>Problem-solving techniques and strategies</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Study Notes</h2>
                                <p className="text-justify mb-3">The content presented here has been carefully curated to align with the course objectives and learning outcomes. Each section builds upon previous concepts to provide a coherent understanding of the material.</p>
                                <div className="bg-gray-50 border-l-4 border-primary p-4 mt-4">
                                    <p className="text-sm font-semibold text-primary mb-1">Important Note</p>
                                    <p className="text-sm text-gray-700">This is a generated preview document. The actual content will be customized based on your specific subject and course requirements.</p>
                                </div>
                            </section>
                        </div>
                        <div className="absolute bottom-[15mm] left-[25mm] right-[25mm] border-t border-gray-200 pt-3 flex justify-between text-[9pt] text-gray-400 font-sans">
                            <span>Generated by AcadIntel</span>
                            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-[-160px] bg-white/90 dark:bg-[#292e38]/90 backdrop-blur-md border border-[#e5e7eb] dark:border-[#3c4453] rounded-full p-1.5 flex gap-1 shadow-2xl z-40">
                    <button onClick={() => handleZoom(-10)} className="size-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#111318] dark:text-white transition-colors" title="Zoom Out">
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <div className="flex items-center justify-center px-2 min-w-[60px]"><span className="text-xs font-medium text-[#111318] dark:text-white">{zoom}%</span></div>
                    <button onClick={() => handleZoom(10)} className="size-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#111318] dark:text-white transition-colors" title="Zoom In">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                <aside className="w-80 bg-white dark:bg-[#111621] border-l border-[#e5e7eb] dark:border-[#292e38] flex-col shadow-xl z-20 shrink-0 hidden md:flex">
                    <div className="p-6 border-b border-[#e5e7eb] dark:border-[#292e38]">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#6b7280] dark:text-[#9da6b8]">Export & Share</h3>
                        <button 
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="w-full h-12 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isDownloading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">download</span>
                                    Download PDF
                                </>
                            )}
                        </button>
                        <p className="text-xs text-[#6b7280] mt-2 text-center">
                            High-quality PDF with {includeCitations && 'citations, '}
                            {smartHighlights && 'highlights, '}
                            {darkExport ? 'dark theme' : 'light theme'}
                        </p>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <h3 className="text-[#111318] dark:text-white text-sm font-bold uppercase tracking-wider mb-5 text-[#6b7280] dark:text-[#9da6b8]">Preview Settings</h3>
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <span className="text-sm font-medium text-[#111318] dark:text-white block">Include Citations</span>
                                <span className="text-xs text-[#6b7280] block mt-0.5">Add footnotes at bottom</span>
                            </div>
                            <button 
                                onClick={() => setIncludeCitations(!includeCitations)} 
                                className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-colors ${includeCitations ? 'bg-primary' : 'bg-[#e5e7eb] dark:bg-[#292e38]'}`}
                                aria-label="Toggle citations"
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${includeCitations ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <span className="text-sm font-medium text-[#111318] dark:text-white block">Smart Highlights</span>
                                <span className="text-xs text-[#6b7280] block mt-0.5">Bold key terms automatically</span>
                            </div>
                            <button 
                                onClick={() => setSmartHighlights(!smartHighlights)} 
                                className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-colors ${smartHighlights ? 'bg-primary' : 'bg-[#e5e7eb] dark:bg-[#292e38]'}`}
                                aria-label="Toggle smart highlights"
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${smartHighlights ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <span className="text-sm font-medium text-[#111318] dark:text-white block">Dark Export</span>
                                <span className="text-xs text-[#6b7280] block mt-0.5">Invert colors for screens</span>
                            </div>
                            <button 
                                onClick={() => setDarkExport(!darkExport)} 
                                className={`flex-shrink-0 w-11 h-6 rounded-full relative transition-colors ${darkExport ? 'bg-primary' : 'bg-[#e5e7eb] dark:bg-[#292e38]'}`}
                                aria-label="Toggle dark export"
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkExport ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default PDFPreviewPage;
