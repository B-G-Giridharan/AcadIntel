/**
 * Backend API Service
 * Handles communication with FastAPI backend
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

interface GenerateRequest {
    subject_id: string;
    subject_name: string;
    include_citations?: boolean;
    smart_highlights?: boolean;
    dark_export?: boolean;
    topics?: string[];
}

interface GenerationResponse {
    success: boolean;
    file_path: string;
    filename: string;
    message: string;
    metadata: {
        total_questions?: number;
        repeated_questions?: number;
        high_weightage?: number;
        total_chapters?: number;
        total_topics?: number;
        total_pages?: number | string;
        sources_used: string[];
        generation_time: number;
    };
}

export const generateAnswerKey = async (request: GenerateRequest): Promise<GenerationResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate/answer-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GenerationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating answer key:', error);
        throw error;
    }
};

export const generateNotes = async (request: GenerateRequest): Promise<GenerationResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GenerationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating notes:', error);
        throw error;
    }
};

export const downloadPDF = async (filename: string): Promise<Blob> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/download/${filename}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};

export const triggerDownload = (blob: Blob, filename: string) => {
    const nav = window.navigator as Navigator & { msSaveOrOpenBlob?: (data: Blob, fileName?: string) => void };
    if (nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, filename);
        return;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener noreferrer';
    link.target = '_self';
    link.style.display = 'none';
    document.body.appendChild(link);
    requestAnimationFrame(() => {
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    });
};
