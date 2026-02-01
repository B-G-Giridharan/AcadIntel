
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import QRCodeGenerator from './QRCodeGenerator';

const DashboardPage: React.FC = () => {
    const [showQRGenerator, setShowQRGenerator] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            alert(`Processing your query: "${searchQuery}"\n\nThis feature will integrate with AI tutoring, note generation, and smart search capabilities.`);
            setIsProcessing(false);
            setSearchQuery('');
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
    };

    return (
        <div className="flex h-screen w-full bg-background-dark text-white font-sans">
            <Sidebar />
            <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-background-dark">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-[800px] mx-auto px-6 pb-20">
                    <div className="flex flex-col items-center text-center gap-3 mb-10">
                        <div className="mb-4 p-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl shadow-black/20 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-4xl text-primary bg-clip-text">auto_awesome</span>
                        </div>
                        <h1 className="text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight px-4 text-center">
                            Unlock your academic potential.
                        </h1>
                        <p className="text-gray-400 text-lg font-normal leading-relaxed max-w-xl text-center">
                            Paste a lecture transcript, upload a PDF, or ask a question to get started. AcadIntel helps you master any subject faster.
                        </p>
                    </div>
                    <div className="w-full max-w-2xl px-4 py-3 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <label className="relative flex flex-col w-full h-14 z-10">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-[#1a1f2b] border border-white/10 shadow-2xl overflow-hidden transition-all focus-within:outline-none focus-within:ring-0">
                                <div className="text-gray-400 flex items-center justify-center pl-4 pr-2">
                                    <span className="material-symbols-outlined text-[24px]">search</span>
                                </div>
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isProcessing}
                                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white border-none h-full placeholder:text-gray-500 px-2 text-lg font-normal leading-normal outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50"
                                    placeholder="Ask AcadIntel anything..."
                                />
                                <div className="flex items-center gap-2 pr-3">
                                    {searchQuery && (
                                        <>
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="p-1 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
                                                title="Clear"
                                            >
                                                <span className="material-symbols-outlined text-[20px] text-gray-500">close</span>
                                            </button>
                                            <button
                                                onClick={handleSearch}
                                                disabled={isProcessing}
                                                className="p-2 rounded-full bg-primary hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center"
                                                title="Search"
                                            >
                                                {isProcessing ? (
                                                    <span className="material-symbols-outlined text-[18px] text-white animate-spin">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="flex gap-3 mt-6 flex-wrap justify-center">
                        <button 
                            onClick={() => handleSuggestionClick('Summarize my uploaded PDF on Machine Learning')}
                            className="group flex h-9 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 pl-3 pr-4 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-primary/80">summarize</span>
                            <p className="text-gray-300 group-hover:text-white text-sm font-medium">Summarize a PDF</p>
                        </button>
                        <button 
                            onClick={() => handleSuggestionClick('Quiz me on History of Ancient Rome')}
                            className="group flex h-9 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 pl-3 pr-4 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-[18px] text-purple-400 group-hover:text-purple-300">quiz</span>
                            <p className="text-gray-300 group-hover:text-white text-sm font-medium">Quiz me on History</p>
                        </button>
                        <button 
                            onClick={() => handleSuggestionClick('Create flashcards for my study notes')}
                            className="group flex h-9 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 pl-3 pr-4 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-[18px] text-emerald-400 group-hover:text-emerald-300">style</span>
                            <p className="text-gray-300 group-hover:text-white text-sm font-medium">Create Flashcards</p>
                        </button>
                        <button
                            onClick={() => setShowQRGenerator(true)}
                            className="group flex h-9 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 pl-3 pr-4 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-[18px] text-orange-400 group-hover:text-orange-300">qr_code_2</span>
                            <p className="text-gray-300 group-hover:text-white text-sm font-medium">Generate QR Code</p>
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-6 w-full text-center">
                    <p className="text-xs text-gray-600">Powered by AcadIntel AI • <a href="#" className="hover:text-gray-400 transition-colors">Help & Support</a></p>
                </div>
            </main>
            {showQRGenerator && <QRCodeGenerator onClose={() => setShowQRGenerator(false)} />}
        </div>
    );
};

export default DashboardPage;
