
import React, { useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext, AppProvider } from './contexts/AppContext';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import NewSubjectPage from './components/NewSubjectPage';
import SubjectWorkspacePage from './components/SubjectWorkspacePage';
import PDFPreviewPage from './components/PDFPreviewPage';
import LibraryPage from './components/LibraryPage';
import SettingsPage from './components/SettingsPage';

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppWithTheme />
        </AppProvider>
    );
};

const AppWithTheme: React.FC = () => {
    const { theme } = useContext(AppContext);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
    }, [theme]);
    
    return <AppRouter />;
}


const AppRouter: React.FC = () => {
    const { isAuthenticated } = React.useContext(AppContext);

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
                <Route path="/subject/new" element={isAuthenticated ? <NewSubjectPage /> : <Navigate to="/login" />} />
                <Route path="/subject/:id" element={isAuthenticated ? <SubjectWorkspacePage /> : <Navigate to="/login" />} />
                <Route path="/subject/:id/preview" element={isAuthenticated ? <PDFPreviewPage /> : <Navigate to="/login" />} />
                <Route path="/library" element={isAuthenticated ? <LibraryPage /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};

export default App;
