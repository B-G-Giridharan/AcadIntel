
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const Sidebar: React.FC = () => {
    const { user, subjects, logout, deleteSubject } = useContext(AppContext);
    const location = useLocation();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/library', icon: 'local_library', label: 'Library' },
        { path: '/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <aside className="flex w-64 flex-col border-r border-white/5 bg-charcoal-dark pt-5 pb-4 px-3 shrink-0">
            <div className="flex items-center gap-3 px-3 mb-6">
                 <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <h1 className="text-white text-base font-semibold tracking-tight">AcadIntel</h1>
            </div>
            <a href="#/subject/new" className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-medium tracking-wide shadow-md shadow-primary/10 group">
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">add</span>
                <span>New Subject Notes</span>
            </a>
            <nav className="flex flex-col gap-1 mb-6">
                {navLinks.map(link => (
                     <a key={link.path} href={`#${link.path}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-black/5 dark:bg-white/5 text-[#111318] dark:text-white' : 'text-[#6b7280] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === link.path ? 'text-primary' : ''}`}>{link.icon}</span>
                        <p className="text-sm font-medium">{link.label}</p>
                    </a>
                ))}
            </nav>
            <div className="px-3 mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Subjects</h3>
            </div>
            <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pr-1 -mr-2">
                 {subjects.map(subject => (
                    <div key={subject.id} className="group/item relative flex items-center gap-2 pr-2">
                        <a href={`#/subject/${subject.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#6b7280] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-1">
                            <span className="material-symbols-outlined text-[20px] text-[#9ca3af] dark:text-gray-600 group-hover/item:text-[#6b7280] dark:group-hover/item:text-gray-400">folder</span>
                            <p className="text-sm font-medium truncate">{subject.name}</p>
                        </a>
                        <button 
                            onClick={() => setDeleteConfirmId(subject.id)}
                            className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-md text-[#6b7280] dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Delete subject"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 relative" ref={menuRef}>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-surface-dark rounded-lg shadow-xl border border-white/10 p-1.5 z-10">
                        <a href="#/settings" className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-colors">
                            <span className="material-symbols-outlined text-base">person</span>
                            Profile
                        </a>
                        <button onClick={logout} className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors">
                            <span className="material-symbols-outlined text-base">logout</span>
                            Logout
                        </button>
                    </div>
                )}
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 px-2 w-full hover:bg-white/5 p-2 rounded-lg transition-colors text-left">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-500 flex items-center justify-center text-xs font-bold text-white shadow-inner overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Profile" className="size-8 object-cover" />
                        ) : (
                            user?.avatarInitial
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    </div>
                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}>expand_less</span>
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">warning</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#111318] dark:text-white mb-1">Delete Subject</h3>
                                <p className="text-sm text-[#6b7280] dark:text-gray-400">
                                    Are you sure you want to delete this subject? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 text-sm font-medium text-[#6b7280] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteSubject) {
                                        deleteSubject(deleteConfirmId);
                                        setDeleteConfirmId(null);
                                        // Navigate to home if currently viewing the deleted subject
                                        const deletedSubject = subjects.find(s => s.id === deleteConfirmId);
                                        if (deletedSubject && location.pathname === `/subject/${deleteConfirmId}`) {
                                            window.location.hash = '/';
                                        }
                                    }
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
