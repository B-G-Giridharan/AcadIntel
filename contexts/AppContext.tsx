
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Subject } from '../types';

type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
    isAuthenticated: boolean;
    user: User | null;
    subjects: Subject[];
    theme: Theme;
    login: (registrationId: string, username?: string) => boolean;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    addSubject: (subject: Omit<Subject, 'id'>) => void;
    deleteSubject: (subjectId: string) => void;
    setTheme: (theme: Theme) => void;
}

const MOCK_USER: User = {
    id: 'user-1',
    name: 'Alex Smith',
    registrationId: '2024-STUD-8821',
    department: 'Computer Science',
    year: 3,
    semester: 4,
    regulation: 'R-2021',
    avatarInitial: 'AS',
};

const MOCK_SUBJECTS: Subject[] = [
    { id: 'subj-1', name: 'Quantum Physics I', code: 'PHY-301', regulation: 'R-2021' },
    { id: 'subj-2', name: 'Advanced Calculus', code: 'MAT-402', regulation: 'R-2021' },
    { id: 'subj-3', name: 'European History', code: 'HIS-210', regulation: 'R-2020' },
    { id: 'subj-4', name: 'Machine Learning', code: 'CS-450', regulation: 'R-2021' },
];

const PROFILE_STORAGE_KEY = 'acadintel.profile';

const getInitialsFromName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
};

const getStoredProfile = (): Partial<User> | null => {
    try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        return stored ? (JSON.parse(stored) as Partial<User>) : null;
    } catch {
        return null;
    }
};

const buildUserFromStoredProfile = () => {
    const storedProfile = getStoredProfile();
    return storedProfile ? { ...MOCK_USER, ...storedProfile } : MOCK_USER;
};

export const AppContext = createContext<AppContextType>(null!);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Default to false to show login page
    const [user, setUser] = useState<User | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
    const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const login = (registrationId: string, username?: string) => {
        // New format: 211724XXXxxxx where XXX = department code (001-009), xxxx = student number (0001-0500)
        const regNumPattern = /^211724(00[1-9])(\d{4})$/;
        const match = registrationId.match(regNumPattern);
        
        if (match) {
            const deptCode = match[1];
            const studentNum = parseInt(match[2], 10);
            
            // Validate student number range (0001-0500)
            if (studentNum < 1 || studentNum > 500) {
                return false;
            }
            
            // Map department codes to departments
            const deptMap: Record<string, string> = {
                '001': 'CCE',
                '002': 'CSE',
                '003': 'CSE(AIML)',
                '004': 'ECE',
                '005': 'VLSI',
                '006': 'MECH',
                '007': 'AIDS',
                '008': 'CSBS',
                '009': 'BT',
            };
            
            const department = deptMap[deptCode];
            if (!department) {
                return false;
            }
            
            // Extract year from registration (2117 = 2021 batch, 2024 - 2021 = 3rd year)
            const batchYear = 2021; // From 2117
            const currentYear = 2024;
            const year = currentYear - batchYear + 1; // Currently 4th year
            
            const userName = username?.trim() || 'AcadIntel_User';
            
            const newUser: User = {
                id: `user-${Date.now()}`,
                name: userName,
                registrationId,
                department,
                year,
                semester: 4, // Default semester
                regulation: 'R-2021',
                avatarInitial: getInitialsFromName(userName),
                avatarUrl: buildUserFromStoredProfile().avatarUrl,
            };
            
            setIsAuthenticated(true);
            setUser(newUser);
            return true;
        }
        
        // Fallback for old demo credentials
        if (registrationId === MOCK_USER.registrationId) {
            setIsAuthenticated(true);
            setUser(buildUserFromStoredProfile());
            return true;
        }
        
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        window.location.hash = '/login';
    };

    const updateProfile = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser: User = {
            ...user,
            ...updates,
            avatarInitial: updates.name ? getInitialsFromName(updates.name) || user.avatarInitial : user.avatarInitial,
        };
        setUser(updatedUser);
        try {
            const { name, avatarInitial, avatarUrl, department, year, semester, regulation } = updatedUser;
            localStorage.setItem(
                PROFILE_STORAGE_KEY,
                JSON.stringify({ name, avatarInitial, avatarUrl, department, year, semester, regulation })
            );
        } catch {
            // ignore storage errors
        }
    };
    
    const addSubject = (subjectData: Omit<Subject, 'id'>) => {
        const newSubject: Subject = {
            id: `subj-${Date.now()}`,
            ...subjectData
        };
        setSubjects(prev => [newSubject, ...prev]);
    };

    const deleteSubject = (subjectId: string) => {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const value = {
        isAuthenticated,
        user,
        subjects,
        theme,
        login,
        logout,
        updateProfile,
        addSubject,
        deleteSubject,
        setTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
