
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { QuestionPaper, Textbook, LibraryBook } from '../types';
import Sidebar from './Sidebar';
import AIAssistantModal from './AIAssistantModal';
import AITutorModal from './AITutorModal';

// Mock Data
const MOCK_QUESTION_PAPERS: QuestionPaper[] = [
    { id: 'qp-1', title: 'Fall 2023 Final Exam', source: 'Prof. Schrodinger', duration: '3 hours', status: 'Solved', difficulty: 'High', type: 'Exam' },
    { id: 'qp-2', title: 'Spring 2022 Midterm', source: 'Prof. Heisenberg', duration: '1.5 hours', status: 'Unsolved', difficulty: 'Medium', type: 'Midterm' },
    { id: 'qp-3', title: 'Practice Problem Set 4', source: 'TA Session', duration: '20 Questions', status: 'Solved', difficulty: 'Low', type: 'Practice' },
];

const MOCK_TEXTBOOKS: Textbook[] = [
    { id: 'tb-1', title: 'Intro to Quantum Mechanics', author: 'David J. Griffiths', coverUrl: 'https://m.media-amazon.com/images/I/71pU-3f90sL._AC_UF1000,1000_QL80_.jpg', readPercentage: 65 },
    { id: 'tb-2', title: 'Principles of QM', author: 'R. Shankar', coverUrl: 'https://m.media-amazon.com/images/I/71cSKTcmr3L._AC_UF1000,1000_QL80_.jpg', readPercentage: 12 },
];

const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
    { id: 'lb-1', title: 'Griffiths - QM (3rd Ed.)', status: 'Available', availableCopies: 2, location: 'Stack 4, Row B' },
    { id: 'lb-2', title: 'Feynman Lectures Vol 3', status: 'Checked Out', dueDate: 'Nov 14' },
];


const SubjectWorkspacePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { subjects, user } = useContext(AppContext);
    const subject = subjects.find(s => s.id === id);
    const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
    const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);

    if (!subject) {
        return <div className="text-white">Subject not found</div>;
    }

    return (
        <div className="flex h-screen w-full bg-background-dark font-display text-white">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                 <header className="sticky top-0 z-40 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#292e38] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-10 py-3">
                    <div/>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                        <div className="hidden md:flex items-center gap-9">
                            <a href="#/" className="text-[#111318] dark:text-white text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
                            <span className="text-primary text-sm font-medium">Semester 4</span>
                            <a href="#" className="text-[#111318] dark:text-white text-sm font-medium hover:text-primary transition-colors">Profile</a>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg size-10 bg-[#eef1f6] dark:bg-[#292e38] text-[#111318] dark:text-white hover:bg-[#e5e7eb] dark:hover:bg-[#363c4a] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                            </button>
                            <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-tr from-gray-600 to-gray-500 text-sm font-bold shadow-inner overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="size-10 object-cover" />
                                ) : (
                                    user?.avatarInitial
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-6 flex flex-col gap-6">
                    <div className="flex flex-wrap gap-2 items-center text-sm text-text-secondary">
                        <a href="#/" className="hover:text-primary transition-colors">Dashboard</a>
                        <span>/</span>
                        <span>Semester 4</span>
                        <span>/</span>
                        <span className="text-white font-medium">{subject.name}</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end pb-4 border-b border-[#e5e7eb] dark:border-[#292e38]">
                        <div className="flex flex-col gap-3 max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#111318] dark:text-white">{subject.name}</h1>
                            <p className="text-[#6b7280] dark:text-text-secondary text-lg font-light leading-normal">Manage your study materials, exams, and library resources efficiently.</p>
                        </div>
                         <div className="flex gap-3 shrink-0">
                            <button className="flex items-center gap-2 px-5 h-12 rounded-xl bg-[#eef1f6] dark:bg-[#292e38] hover:bg-[#e5e7eb] dark:hover:bg-[#363c4a] text-[#111318] dark:text-white font-bold transition-all" onClick={() => setIsAssistantModalOpen(true)}>
                                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                                <span className="hidden sm:inline">Generate Notes</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 h-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20 transition-all" onClick={() => setIsTutorModalOpen(true)}>
                                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                                <span>Ask AI Tutor</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-text-secondary">search</span>
                        <input className="w-full h-14 pl-12 pr-4 rounded-xl bg-white dark:bg-surface-dark text-[#111318] dark:text-white placeholder:text-[#9ca3af] dark:placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#e5e7eb] dark:border-transparent focus:border-primary/50" placeholder="Search resources, topics, or ask AI a question..." />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                        {/* Question Papers Column */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                             <div className="flex items-center justify-between pb-2">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    Question Papers
                                </h2>
                                <button className="text-sm font-medium text-primary hover:text-blue-400">View All</button>
                            </div>
                            {MOCK_QUESTION_PAPERS.map(qp => (
                                <div key={qp.id} className="group flex flex-col p-4 rounded-xl bg-surface-dark border border-transparent hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-10 rounded-lg flex items-center justify-center ${qp.type === 'Practice' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                                                <span className="material-symbols-outlined">{qp.type === 'Practice' ? 'quiz' : 'picture_as_pdf'}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base leading-tight text-[#111318] dark:text-white group-hover:text-primary transition-colors">{qp.title}</h3>
                                                <p className="text-xs text-text-secondary mt-1">{qp.source} • {qp.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${qp.status === 'Solved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{qp.status}</span>
                                        <span className="px-2 py-1 rounded bg-[#eef1f6] dark:bg-slate-700 text-[#6b7280] dark:text-slate-300 text-xs font-medium">{qp.difficulty} Difficulty</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Textbooks Column */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between pb-2">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">menu_book</span>
                                    Textbooks
                                </h2>
                                <button className="text-sm font-medium text-primary hover:text-blue-400">Manage</button>
                            </div>
                            {MOCK_TEXTBOOKS.map(tb => (
                                <div key={tb.id} className="flex gap-4 p-4 rounded-xl bg-surface-dark border border-transparent hover:border-slate-700 hover:shadow-lg transition-all">
                                    <div className="shrink-0 w-20 h-28 rounded-lg bg-cover bg-center shadow-md" style={{backgroundImage: `url(${tb.coverUrl})`}}></div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h3 className="font-bold text-base truncate text-[#111318] dark:text-white">{tb.title}</h3>
                                        <p className="text-sm text-text-secondary mb-2">{tb.author}</p>
                                        <div className="w-full bg-[#e5e7eb] dark:bg-slate-700 h-1.5 rounded-full mb-1">
                                            <div className="bg-primary h-1.5 rounded-full" style={{width: `${tb.readPercentage}%`}}></div>
                                        </div>
                                        <p className="text-xs text-text-secondary mb-3 text-right">{tb.readPercentage}% Read</p>
                                        <div className="flex gap-2 mt-auto">
                                            <button className="flex-1 h-8 rounded-lg bg-[#e5e7eb] dark:bg-slate-700 text-[#111318] dark:text-white text-xs font-bold hover:bg-[#dfe3ea] dark:hover:bg-slate-600 transition-colors">Read</button>
                                            <button className="flex-1 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>Summary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Library Status Column */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between pb-2">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">domain</span>
                                    Library Status
                                </h2>
                            </div>
                             <div className="p-5 rounded-xl bg-surface-dark border border-transparent shadow-sm">
                                <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Physical Copies</h3>
                                {MOCK_LIBRARY_BOOKS.map(book => (
                                    <div key={book.id} className="flex flex-col gap-2 pb-4 mb-4 border-b border-dashed border-[#e5e7eb] dark:border-slate-700 last:border-b-0 last:pb-0 last:mb-0">
                                        <span className="font-bold text-[#111318] dark:text-white">{book.title}</span>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${book.status === 'Available' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-medium ${book.status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>{book.status}{book.availableCopies ? ` (${book.availableCopies} copies)` : ''}</span>
                                            </div>
                                            <span className="text-xs text-[#6b7280] dark:text-text-secondary bg-[#eef1f6] dark:bg-slate-800 px-2 py-1 rounded">{book.location || `Due: ${book.dueDate}`}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="p-5 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">timer</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#111318] dark:text-white">Study Session</h3>
                                        <p className="text-sm text-text-secondary leading-snug mb-3">You have an upcoming exam in 5 days. Start a focused timer?</p>
                                        <button className="px-4 py-2 rounded-lg bg-primary text-white dark:bg-white dark:text-slate-900 text-sm font-bold shadow hover:scale-105 transition-transform">Start 25m Focus</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {isAssistantModalOpen && <AIAssistantModal subjectId={subject.id} onClose={() => setIsAssistantModalOpen(false)} />}
            {isTutorModalOpen && <AITutorModal subjectName={subject.name} onClose={() => setIsTutorModalOpen(false)} />}
        </div>
    );
};

export default SubjectWorkspacePage;
