
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAnswerKey, generateNotes } from '../services/backendService';
import { AppContext } from '../contexts/AppContext';

interface AIAssistantModalProps {
    onClose: () => void;
    subjectId: string;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onClose, subjectId }) => {
    const { subjects } = useContext(AppContext);
    const subject = subjects.find(s => s.id === subjectId);
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationType, setGenerationType] = useState<'answer-key' | 'notes' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleGenerate = async (type: 'answer-key' | 'notes') => {
        if (!subject) return;
        
        setIsGenerating(true);
        setGenerationType(type);
        setError(null);
        setSuccessMessage(null);

        try {
            const request = {
                subject_id: subjectId,
                subject_name: subject.name,
                include_citations: true,
                smart_highlights: true,
                dark_export: false
            };

            let result;
            if (type === 'answer-key') {
                result = await generateAnswerKey(request);
            } else {
                result = await generateNotes(request);
            }

            if (!result?.success) {
                setError(result?.message || 'Failed to generate PDF. Please try again.');
                return;
            }

            setSuccessMessage('Generated successfully. Open preview to download.');

            // Show metadata
            console.log('Generation metadata:', result.metadata);

            // Navigate to preview page after short delay
            setTimeout(() => {
                onClose();
                navigate(`/subject/${subjectId}/preview`, {
                    state: {
                        filename: result.filename,
                        subjectName: subject?.name,
                        generationType: type,
                    },
                });
            }, 800);
        } catch (err) {
            console.error('Generation error:', err);
            setError('Failed to generate PDF. Make sure the backend server is running at http://localhost:8000');
        } finally {
            setIsGenerating(false);
            setGenerationType(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="w-full max-w-4xl rounded-2xl p-1 shadow-2xl overflow-hidden relative bg-white/90 dark:bg-[rgba(17,22,33,0.75)] backdrop-blur-[16px] border border-black/10 dark:border-[rgba(255,255,255,0.08)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-background-light/90 dark:bg-background-dark/40 rounded-xl p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-400">
                                    <span className="material-symbols-outlined text-white text-[20px]">auto_awesome</span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#111318] dark:text-white tracking-tight">AI Study Assistant</h2>
                            </div>
                            <p className="text-[#6b7280] dark:text-slate-400 text-sm ml-11">Transform your raw notes into structured study materials.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1c2333] border border-[#e5e7eb] dark:border-[#292e38] text-xs font-medium text-[#6b7280] dark:text-slate-300">
                                <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                                5/10 Generations left
                            </div>
                            <button onClick={onClose} className="text-[#6b7280] dark:text-slate-400 hover:text-[#111318] dark:hover:text-white transition-colors rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="relative z-10 mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="relative z-10 mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50">
                            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-8">
                        <button 
                            onClick={() => handleGenerate('answer-key')} 
                            disabled={isGenerating}
                            className="group text-left p-6 rounded-xl flex flex-col h-full relative overflow-hidden bg-white dark:bg-[rgba(28,35,51,0.6)] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:bg-[#f3f4f6] dark:hover:bg-[rgba(28,35,51,0.9)] hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            <div className="w-12 h-12 rounded-lg bg-[#eef1f6] dark:bg-[#292e38] group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-5 text-[#111318] dark:text-white shadow-lg">
                                {isGenerating && generationType === 'answer-key' ? (
                                    <span className="material-symbols-outlined text-[28px] animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[28px]">picture_as_pdf</span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {isGenerating && generationType === 'answer-key' ? 'Generating...' : 'Generate Answer Key'}
                            </h3>
                            <p className="text-sm text-[#6b7280] dark:text-slate-400 leading-relaxed">
                                {isGenerating && generationType === 'answer-key' 
                                    ? 'Creating comprehensive answer key with source references...'
                                    : 'Create a comprehensive, downloadable PDF with step-by-step solutions and detailed explanations with source references.'
                                }
                            </p>
                        </button>
                        <button 
                            onClick={() => handleGenerate('notes')} 
                            disabled={isGenerating}
                            className="group text-left p-6 rounded-xl flex flex-col h-full relative overflow-hidden bg-white dark:bg-[rgba(28,35,51,0.6)] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:bg-[#f3f4f6] dark:hover:bg-[rgba(28,35,51,0.9)] hover:border-purple-500/50 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            <div className="w-12 h-12 rounded-lg bg-[#eef1f6] dark:bg-[#292e38] group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-5 text-[#111318] dark:text-white shadow-lg">
                                {isGenerating && generationType === 'notes' ? (
                                    <span className="material-symbols-outlined text-[28px] animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[28px]">psychology</span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-2 group-hover:text-purple-400 transition-colors">
                                {isGenerating && generationType === 'notes' ? 'Generating...' : 'Generate Exam-Ready Notes'}
                            </h3>
                            <p className="text-sm text-[#6b7280] dark:text-slate-400 leading-relaxed">
                                {isGenerating && generationType === 'notes'
                                    ? 'Creating structured study notes organized by chapters...'
                                    : 'Condense lecture material into high-yield summaries with chapter-wise organization optimized for exam preparation.'
                                }
                            </p>
                        </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#e5e7eb] dark:border-white/5 pt-6 relative z-10">
                        <div className="flex gap-4">
                            <button className="text-xs text-[#6b7280] dark:text-slate-400 hover:text-[#111318] dark:hover:text-white flex items-center gap-1.5 transition-colors">
                                <span className="material-symbols-outlined text-[16px]">history</span>View History
                            </button>
                            <button className="text-xs text-[#6b7280] dark:text-slate-400 hover:text-[#111318] dark:hover:text-white flex items-center gap-1.5 transition-colors">
                                <span className="material-symbols-outlined text-[16px]">settings</span>Configure Output
                            </button>
                        </div>
                        <div className="text-[10px] text-[#9da6b8] dark:text-slate-600 font-mono">POWERED BY AcadIntel AI v1.0</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantModal;
