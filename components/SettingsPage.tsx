
import React, { useState, useContext, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { AppContext } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Profile');
    const { user, logout, theme, setTheme, updateProfile } = useContext(AppContext);
    const [fullName, setFullName] = useState(user?.name ?? '');
    const [semester, setSemester] = useState(user?.semester ?? 4);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
    const [profileError, setProfileError] = useState('');
    const [profileSaved, setProfileSaved] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [deadlineReminders, setDeadlineReminders] = useState(true);
    const [quietHours, setQuietHours] = useState(false);
    const [digestFrequency, setDigestFrequency] = useState<'Daily' | 'Weekly' | 'Off'>('Weekly');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFullName(user?.name ?? '');
        setSemester(user?.semester ?? 4);
        setAvatarUrl(user?.avatarUrl);
    }, [user]);

    const sections = [
        { name: 'Profile', icon: 'person' },
        { name: 'Appearance', icon: 'palette' },
        { name: 'Notifications', icon: 'notifications' },
        { name: 'Account', icon: 'manage_accounts' }
    ];

    const handleLogout = () => {
        logout();
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setProfileError('');
        setProfileSaved(false);

        if (!file.type.startsWith('image/')) {
            setProfileError('Please select a valid image file.');
            return;
        }
        if (file.size > 1024 * 1024) {
            setProfileError('Image must be 1MB or smaller.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === 'string' ? reader.result : undefined;
            setAvatarUrl(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = () => {
        const trimmedName = fullName.trim();
        if (!trimmedName) {
            setProfileError('Full name cannot be empty.');
            setProfileSaved(false);
            return;
        }
        updateProfile({ name: trimmedName, semester, avatarUrl });
        setProfileError('');
        setProfileSaved(true);
    };

    return (
        <div className="flex h-screen w-full bg-background-dark text-white font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark">
                 <div className="px-10 py-6 border-b border-[#292e38]">
                    <h1 className="text-white tracking-tight text-3xl font-bold">Settings</h1>
                    <p className="text-text-secondary mt-1">Manage your account and application preferences.</p>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-56 p-6 border-r border-[#292e38]">
                        <nav className="flex flex-col gap-2">
                            {sections.map(section => (
                                <button key={section.name} onClick={() => setActiveSection(section.name)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeSection === section.name ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111318] dark:hover:text-white'}`}>
                                    <span className="material-symbols-outlined text-xl">{section.icon}</span>
                                    <span>{section.name}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <div className="flex-1 p-10 overflow-y-auto">
                        {activeSection === 'Profile' && (
                             <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                                <p className="text-text-secondary mb-8">Update your personal details here.</p>
                                <div className="space-y-6 max-w-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="size-20 rounded-full bg-gradient-to-tr from-gray-600 to-gray-500 flex items-center justify-center text-2xl font-bold text-white shadow-inner overflow-hidden">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Profile" className="size-20 object-cover" />
                                            ) : (
                                                user?.avatarInitial
                                            )}
                                        </div>
                                        <div>
                                            <button onClick={handlePhotoClick} className="px-4 py-2 text-sm font-bold bg-surface-dark hover:bg-[#292e38] rounded-lg">Change Photo</button>
                                            <p className="text-xs text-text-secondary mt-2">JPG, GIF or PNG. 1MB max.</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(event) => {
                                                setFullName(event.target.value);
                                                setProfileSaved(false);
                                            }}
                                            className="w-full h-12 px-4 rounded-xl bg-surface-dark text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Registration ID</label>
                                        <input type="text" readOnly defaultValue={user?.registrationId} className="w-full h-12 px-4 rounded-xl bg-charcoal-dark text-text-secondary cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Current Semester</label>
                                        <select
                                            value={semester}
                                            onChange={(e) => {
                                                setSemester(parseInt(e.target.value, 10));
                                                setProfileSaved(false);
                                            }}
                                            className="w-full h-12 px-4 rounded-xl bg-surface-dark text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {profileError && (
                                        <p className="text-sm text-red-400">{profileError}</p>
                                    )}
                                    {profileSaved && (
                                        <p className="text-sm text-green-400">Profile updated successfully.</p>
                                    )}
                                    <button onClick={handleSaveProfile} className="h-11 px-6 bg-primary hover:bg-blue-600 font-bold rounded-lg transition-colors">Save Changes</button>
                                </div>
                            </div>
                        )}
                         {activeSection === 'Appearance' && (
                             <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
                                <p className="text-text-secondary mb-8">Customize the look and feel of AcadIntel.</p>
                                <div className="space-y-4 max-w-lg">
                                    <label className="text-sm font-medium text-text-secondary mb-2 block">Theme</label>
                                    <div className="flex gap-2 p-1 rounded-xl bg-surface-dark">
                                        <button onClick={() => setTheme('light')} className={`flex-1 text-center py-2.5 rounded-lg font-semibold ${theme === 'light' ? 'bg-[#363c4a] text-white' : 'text-text-secondary'}`}>Light</button>
                                        <button onClick={() => setTheme('dark')} className={`flex-1 text-center py-2.5 rounded-lg font-semibold ${theme === 'dark' ? 'bg-[#363c4a] text-white' : 'text-text-secondary'}`}>Dark</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === 'Notifications' && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                                <p className="text-text-secondary mb-8">Control how and when you get updates.</p>
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center justify-between gap-6 rounded-xl bg-surface-dark px-5 py-4 border border-white/5">
                                        <div>
                                            <h3 className="text-white font-semibold">Email notifications</h3>
                                            <p className="text-sm text-text-secondary">Receive important account and activity updates.</p>
                                        </div>
                                        <button
                                            onClick={() => setEmailNotifications(prev => !prev)}
                                            className={`h-8 w-14 rounded-full transition-colors ${emailNotifications ? 'bg-primary' : 'bg-[#363c4a]'}`}
                                            aria-pressed={emailNotifications}
                                        >
                                            <span className={`block size-6 bg-white rounded-full transition-transform ${emailNotifications ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 rounded-xl bg-surface-dark px-5 py-4 border border-white/5">
                                        <div>
                                            <h3 className="text-white font-semibold">Push notifications</h3>
                                            <p className="text-sm text-text-secondary">Stay on top of reminders and study alerts.</p>
                                        </div>
                                        <button
                                            onClick={() => setPushNotifications(prev => !prev)}
                                            className={`h-8 w-14 rounded-full transition-colors ${pushNotifications ? 'bg-primary' : 'bg-[#363c4a]'}`}
                                            aria-pressed={pushNotifications}
                                        >
                                            <span className={`block size-6 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 rounded-xl bg-surface-dark px-5 py-4 border border-white/5">
                                        <div>
                                            <h3 className="text-white font-semibold">Deadline reminders</h3>
                                            <p className="text-sm text-text-secondary">Get notified before exams and assignments.</p>
                                        </div>
                                        <button
                                            onClick={() => setDeadlineReminders(prev => !prev)}
                                            className={`h-8 w-14 rounded-full transition-colors ${deadlineReminders ? 'bg-primary' : 'bg-[#363c4a]'}`}
                                            aria-pressed={deadlineReminders}
                                        >
                                            <span className={`block size-6 bg-white rounded-full transition-transform ${deadlineReminders ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 rounded-xl bg-surface-dark px-5 py-4 border border-white/5">
                                        <div>
                                            <h3 className="text-white font-semibold">Quiet hours</h3>
                                            <p className="text-sm text-text-secondary">Pause notifications during study sessions.</p>
                                        </div>
                                        <button
                                            onClick={() => setQuietHours(prev => !prev)}
                                            className={`h-8 w-14 rounded-full transition-colors ${quietHours ? 'bg-primary' : 'bg-[#363c4a]'}`}
                                            aria-pressed={quietHours}
                                        >
                                            <span className={`block size-6 bg-white rounded-full transition-transform ${quietHours ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="rounded-xl bg-surface-dark px-5 py-4 border border-white/5">
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Digest frequency</label>
                                        <div className="flex gap-2">
                                            {(['Daily', 'Weekly', 'Off'] as const).map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setDigestFrequency(option)}
                                                    className={`px-4 h-10 rounded-lg text-sm font-semibold transition-colors ${digestFrequency === option ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === 'Account' && (
                             <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Account</h2>
                                <p className="text-text-secondary mb-8">Manage your account settings.</p>
                                <div className="p-6 rounded-xl border border-red-300 bg-red-100 max-w-lg">
                                    <h3 className="font-bold text-red-700 mb-2">Logout</h3>
                                    <p className="text-sm text-red-600 mb-4">Logging out will end your current session. You will need to enter your Registration ID to log back in.</p>
                                    <button onClick={handleLogout} className="h-10 px-5 bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg transition-colors">Logout from this device</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
