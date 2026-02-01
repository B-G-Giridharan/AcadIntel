
import React, { useState } from 'react';
import Sidebar from './Sidebar';

type Resource = {
    id: string;
    type: 'Textbook' | 'Q. Paper' | 'Article';
    title: string;
    author?: string;
    coverUrl?: string;
    status: 'Available' | 'In Use';
    subject: string;
};

const MOCK_RESOURCES: Resource[] = [
    { id: 'res-1', type: 'Textbook', title: 'Intro to Quantum Mechanics', author: 'D. Griffiths', subject: 'Quantum Physics I', status: 'Available', coverUrl: 'https://m.media-amazon.com/images/I/71pU-3f90sL._AC_UF1000,1000_QL80_.jpg' },
    { id: 'res-2', type: 'Q. Paper', title: 'Fall 2023 Final Exam', subject: 'Quantum Physics I', status: 'In Use' },
    { id: 'res-3', type: 'Textbook', title: 'Calculus: A Modern Approach', author: 'H. Anton', subject: 'Advanced Calculus', status: 'Available', coverUrl: 'https://pictures.abebooks.com/isbn/9780471153061-us.jpg'},
    { id: 'res-4', type: 'Article', title: 'The European Renaissance', subject: 'European History', status: 'Available' },
    { id: 'res-5', type: 'Textbook', title: 'Pattern Recognition & ML', author: 'C. Bishop', subject: 'Machine Learning', status: 'Available', coverUrl: 'https://m.media-amazon.com/images/I/71cSKTcmr3L._AC_UF1000,1000_QL80_.jpg' },
    { id: 'res-6', type: 'Q. Paper', title: 'Spring 2022 Midterm', subject: 'Advanced Calculus', status: 'Available' },
];

const LibraryPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadType, setUploadType] = useState<Resource['type']>('Textbook');
    const [uploadSubject, setUploadSubject] = useState('');
    const [uploadAuthor, setUploadAuthor] = useState('');
    const [uploadUrl, setUploadUrl] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState('');

    const filteredResources = resources.filter(res => {
        const matchesTab = activeTab === 'All' || res.type.startsWith(activeTab.slice(0, 4));
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = ['All', 'Textbooks', 'Q. Papers', 'Articles'];

    const resetUploadForm = () => {
        setUploadTitle('');
        setUploadType('Textbook');
        setUploadSubject('');
        setUploadAuthor('');
        setUploadUrl('');
        setUploadFile(null);
        setUploadError('');
    };

    const handleUploadSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedTitle = uploadTitle.trim();
        const trimmedSubject = uploadSubject.trim();
        const trimmedUrl = uploadUrl.trim();

        if (!trimmedTitle) {
            setUploadError('Name is required.');
            return;
        }
        if (!trimmedSubject) {
            setUploadError('Subject is required.');
            return;
        }
        if (!uploadFile && !trimmedUrl) {
            setUploadError('Please provide a file or a URL.');
            return;
        }

        const newResource: Resource = {
            id: `res-${Date.now()}`,
            type: uploadType,
            title: trimmedTitle,
            author: uploadAuthor.trim() || undefined,
            subject: trimmedSubject,
            status: 'Available',
        };

        setResources(prev => [newResource, ...prev]);
        resetUploadForm();
        setShowUploadModal(false);
    };
    
    return (
        <div className="flex h-screen w-full bg-background-dark text-white font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
                <div className="px-10 py-6 border-b border-[#292e38]">
                    <h1 className="text-white tracking-tight text-3xl font-bold">Library</h1>
                    <p className="text-text-secondary mt-1">Your central hub for all academic resources.</p>
                </div>

                <div className="px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#292e38]">
                    <div className="relative w-full sm:max-w-xs">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">search</span>
                        <input 
                            type="text" 
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-dark text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-dark">
                        {tabs.map(tab => (
                             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-[#363c4a] text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredResources.map(res => (
                            <div key={res.id} className="group flex flex-col bg-surface-dark rounded-xl border border-transparent hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/10">
                                {res.coverUrl ? (
                                    <div className="w-full h-48 bg-cover bg-center rounded-t-xl" style={{backgroundImage: `url(${res.coverUrl})`}}></div>
                                ) : (
                                    <div className="w-full h-48 flex items-center justify-center bg-charcoal-dark rounded-t-xl">
                                        <span className="material-symbols-outlined text-5xl text-text-secondary">{res.type === 'Q. Paper' ? 'description' : 'article'}</span>
                                    </div>
                                )}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${res.type === 'Textbook' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>{res.type}</span>
                                        <div className={`size-2 rounded-full mt-1 ${res.status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`} title={res.status}></div>
                                    </div>
                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors flex-1">{res.title}</h3>
                                    <p className="text-xs text-text-secondary mt-1">{res.author || res.subject}</p>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="group flex flex-col items-center justify-center bg-transparent rounded-xl border-2 border-dashed border-[#292e38] hover:border-primary transition-all cursor-pointer min-h-[280px]"
                        >
                            <div className="size-14 rounded-full bg-[#292e38] group-hover:bg-primary flex items-center justify-center text-text-secondary group-hover:text-white transition-colors mb-4">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                             <p className="font-bold text-white">Upload New</p>
                            <p className="text-xs text-text-secondary">PDF, DOCX, or URL</p>
                        </button>
                    </div>
                </div>
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
                        <div className="w-full max-w-xl rounded-2xl bg-surface-dark border border-white/10 shadow-2xl">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#292e38]">
                                <h2 className="text-lg font-bold text-white">Upload Resource</h2>
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        resetUploadForm();
                                    }}
                                    className="text-text-secondary hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Name *</label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={e => setUploadTitle(e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg bg-white dark:bg-[#151a24] text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="e.g., Quantum Mechanics Notes"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Type</label>
                                        <select
                                            value={uploadType}
                                            onChange={e => setUploadType(e.target.value as Resource['type'])}
                                            className="w-full h-11 px-4 rounded-lg bg-white dark:bg-[#151a24] text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="Textbook">Textbook</option>
                                            <option value="Q. Paper">Q. Paper</option>
                                            <option value="Article">Article</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Subject *</label>
                                        <input
                                            type="text"
                                            value={uploadSubject}
                                            onChange={e => setUploadSubject(e.target.value)}
                                            className="w-full h-11 px-4 rounded-lg bg-white dark:bg-[#151a24] text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="e.g., Quantum Physics I"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Author (optional)</label>
                                    <input
                                        type="text"
                                        value={uploadAuthor}
                                        onChange={e => setUploadAuthor(e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg bg-white dark:bg-[#151a24] text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="e.g., D. Griffiths"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Resource URL (optional)</label>
                                    <input
                                        type="url"
                                        value={uploadUrl}
                                        onChange={e => setUploadUrl(e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg bg-white dark:bg-[#151a24] text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Upload File (optional)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white dark:file:bg-[#151a24] file:text-[#111318] dark:file:text-white hover:file:bg-[#eef1f6] dark:hover:file:bg-[#1f2532]"
                                    />
                                    {uploadFile && (
                                        <p className="text-xs text-text-secondary mt-2">Selected: {uploadFile.name}</p>
                                    )}
                                </div>
                                {uploadError && (
                                    <p className="text-sm text-red-400">{uploadError}</p>
                                )}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            resetUploadForm();
                                        }}
                                        className="h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="h-10 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold"
                                    >
                                        Save Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LibraryPage;
