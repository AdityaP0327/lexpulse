const { fromBuffer } = require('pdf2pic');
const Tesseract = require('tesseract.js');

/**
 * Attempts to extract text from an image-based (OCR) PDF.
 * Converts the first 5 pages of the PDF to images and runs Tesseract OCR.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<string>}
 */
async function performOCR(pdfBuffer) {
    console.log('[OCR System] Initializing Optical Character Recognition on unreadable PDF...');
    
    // Configure pdf2pic to convert PDF buffer to base64 images
    const options = {
        density: 300,             // high DPI for better OCR
        saveFilename: 'temp',
        savePath: './uploads',    // temp path (though we will use base64 output)
        format: 'png',
        width: 2550,
        height: 3300
    };
    
    // Force output to be Base64 array so we don't have to manage raw temp files
    const storeAsImage = fromBuffer(pdfBuffer, options);
    
    // We'll scan up to the first 5 pages to prevent massive OCR processing times
    let extractedText = "";
    
    try {
        // Bulk convert pages 1 through 5 to base64 images
        console.log('[OCR System] Converting PDF to image frames...');
        const pageConversions = await storeAsImage.bulk(1, true); // true = return base64
        
        console.log(`[OCR System] Preparing to scan ${pageConversions.length} pages via Tesseract...`);
        
        // Setup Tesseract worker
        const worker = await Tesseract.createWorker('eng');
        
        for (let i = 0; i < pageConversions.length; i++) {
            const pageData = pageConversions[i];
            if (!pageData || !pageData.base64) continue;
            
            console.log(`[OCR System] Scanning Page ${pageData.page}...`);
            // The image needs to be prefixed for Tesseract
            const dataUri = `data:image/png;base64,${pageData.base64}`;
            
            const { data: { text } } = await worker.recognize(dataUri);
            extractedText += text + "\n\n";
        }
        
        await worker.terminate();
        console.log('[OCR System] OCR Complete. Extracted text successfully.');
        return extractedText.trim();
        
    } catch (err) {
        console.error('[OCR System] Critical Failure during Tesseract execution:', err);
        throw new Error('Failed to perform OCR on the scanned document.');
    }
}

module.exports = { performOCR };
