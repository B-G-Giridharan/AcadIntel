/**
 * QR Code utility for generating and formatting QR codes
 * Expected format: {"name":"Subject Name", "code":"SUB-101", "regulation":"R-2021"}
 */

export interface SubjectQRData {
    name: string;
    code: string;
    regulation: string;
}

/**
 * Generate QR code data string for a subject
 */
export const generateQRDataString = (subject: SubjectQRData): string => {
    return JSON.stringify(subject);
};

/**
 * Generate a QR code image URL using external service
 * Using qr-server.com for free QR code generation
 */
export const generateQRCodeURL = (subject: SubjectQRData, size: number = 300): string => {
    const dataString = generateQRDataString(subject);
    const encodedData = encodeURIComponent(dataString);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
};

/**
 * Format subject data for display in QR code
 */
export const formatQRDisplay = (subject: SubjectQRData): string => {
    return `Subject: ${subject.name} | Code: ${subject.code} | Regulation: ${subject.regulation}`;
};
