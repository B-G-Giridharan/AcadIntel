
export interface User {
    id: string;
    name: string;
    registrationId: string;
    department: string;
    year: number;
    semester: number;
    regulation: string;
    avatarInitial: string;
    avatarUrl?: string;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    regulation: string;
}

export interface QuestionPaper {
    id: string;
    title: string;
    source: string;
    duration: string;
    status: 'Solved' | 'Unsolved';
    difficulty: 'High' | 'Medium' | 'Low';
    type: 'Exam' | 'Midterm' | 'Practice';
}

export interface Textbook {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    readPercentage: number;
}

export interface LibraryBook {
    id: string;
    title: string;
    status: 'Available' | 'Checked Out';
    location?: string;
    dueDate?: string;
    availableCopies?: number;
}
