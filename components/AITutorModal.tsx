
import React, { useState, useEffect, useRef } from 'react';
import { generateContentFromPrompt } from '../services/geminiService';

interface AITutorModalProps {
    onClose: () => void;
    subjectName: string;
}

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

const AITutorModal: React.FC<AITutorModalProps> = ({ onClose, subjectName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const enhancedPrompt = `You are an expert academic tutor for ${subjectName}. Provide a clear, concise answer to the following question.

Guidelines:
- Keep response under 150 words
- Use bullet points for clarity
- Include 1 simple example if relevant
- Show key formulas using plain text (e.g., E = mc²)
- Be direct and precise

Question: ${input}

Answer:`;
        
        const aiResponseText = await generateContentFromPrompt(enhancedPrompt);
        
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden relative bg-surface-dark border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-400">
                             <span className="material-symbols-outlined text-white text-[20px]">support_agent</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">AI Tutor</h2>
                            <p className="text-xs text-slate-400">Focusing on {subjectName}</p>
                        </div>
                    </div>
                     <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-white/5">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto bg-white/95 dark:bg-transparent">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'ai' && <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-lg">auto_awesome</span></div>}
                                <div className={`p-3 rounded-xl max-w-md text-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-[#eef1f6] dark:bg-[#292e38] text-[#111318] dark:text-slate-200'}`}>
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {msg.text.split('\n').map((line, i) => {
                                            // Check if line contains formulas (has = and letters)
                                            if (line.includes('=') && /[A-Za-z]/.test(line)) {
                                                return (
                                                    <div key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? 'ml-2' : ''}>
                                                        <code className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-xs font-mono">{line}</code>
                                                    </div>
                                                );
                                            }
                                            
                                            // Parse inline bold text (**text**)
                                            const parts = line.split(/(\*\*.*?\*\*)/g);
                                            return (
                                                <div key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? 'ml-2' : ''}>
                                                    {parts.map((part, j) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return <span key={j}>{part}</span>;
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex gap-3">
                                <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span></div>
                                <div className="p-3 rounded-xl bg-[#eef1f6] dark:bg-[#292e38] text-[#111318] dark:text-slate-400 italic text-sm">AI is thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="p-4 border-t border-white/10 shrink-0">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your subject..."
                            className="w-full h-12 pl-4 pr-12 rounded-lg bg-white dark:bg-[#292e38] text-[#111318] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={isLoading}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 size-8 bg-primary rounded-lg text-white disabled:bg-slate-600 transition-colors" disabled={isLoading || !input.trim()}>
                             <span className="material-symbols-outlined text-lg">arrow_upward</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AITutorModal;
