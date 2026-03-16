const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { performOCR } = require('./documentOCR');

/**
 * Extracts text from PDF, DOCX, or TXT file buffer.
 * @param {Buffer} buffer - Raw file bytes
 * @param {string} filename - Original filename (used to determine type)
 * @returns {Promise<string>}
 */
async function extractText(buffer, filename) {
    const ext = filename.split('.').pop().toLowerCase();

    try {
        if (ext === 'pdf') {
            // pdf-parse uses pdf.js which can sometimes have concurrency/memory quirks.
            // Removing the arbitrary 'max: 100' limit prevents it from short-circuiting on large docs.
            const data = await pdfParse(buffer, { version: 'default' });
            
            if (!data.text || data.text.trim().length === 0) {
                // Throwing a specialized error for image-only PDFs
                throw new Error("PDF_SCANNED_IMAGE: This PDF appears to be a scanned image without an OCR text layer.");
            }
            return data.text;
        } else if (ext === 'docx') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value || '';
        } else if (ext === 'txt') {
            return buffer.toString('utf-8');
        }
        
    } catch (error) {
        // Log the exact internal error for backend debugging
        console.error(`[extractText] Error extracting text from ${filename}:`, error.stack || error.message);
        
        // If it's our custom OCR error or an explicit format error, fall back to Tesseract OCR
        if (error.message.includes('PDF_SCANNED_IMAGE') || ext === 'pdf') {
            try {
                console.log(`[extractText] Standard parsing failed for ${filename}. Attempting Tesseract OCR Fallback...`);
                const ocrText = await performOCR(buffer);
                if (ocrText && ocrText.trim().length > 0) return ocrText;
            } catch (ocrError) {
                console.error(`[OCR Fallback Error]`, ocrError.message);
                throw new Error("The uploaded document is a scanned image, but the OCR engine failed to extract text from it. Please upload a clear, text-searchable PDF.");
            }
        }
        
        // Throw a clean, safe error for generic corruptions
        throw new Error(`Failed to parse ${ext.toUpperCase()} document. The file may be completely corrupted or encrypted.`);
    }

    return '';
}

/**
 * Cleans up extra whitespace and newlines.
 * @param {string} text
 * @returns {string}
 */
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

/**
 * Splits text into fixed-size word chunks for model processing.
 * @param {string} text
 * @param {number} chunkSize - Words per chunk
 * @returns {string[]}
 */
function chunkDocument(text, chunkSize = 300) {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
}

module.exports = { extractText, cleanText, chunkDocument };
