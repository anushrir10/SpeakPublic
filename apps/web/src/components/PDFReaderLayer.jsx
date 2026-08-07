import { useState, useCallback, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use the bundled worker from pdfjs-dist via CDN.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PDFReaderLayer({ url, pageNumber, onDocumentLoadSuccess, onPageTextExtracted }) {
  const [error, setError] = useState(null);
  const pdfDocRef = useRef(null);

  const handleLoadSuccess = useCallback((pdf) => {
    setError(null);
    pdfDocRef.current = pdf;
    if (onDocumentLoadSuccess) onDocumentLoadSuccess(pdf);
  }, [onDocumentLoadSuccess]);

  const handleLoadError = useCallback((err) => {
    console.error('[PDFReaderLayer] Load error:', err);
    setError(err?.message || 'Unknown PDF load error');
  }, []);

  // Extract text content whenever page changes
  useEffect(() => {
    if (!pdfDocRef.current || !onPageTextExtracted) return;
    let cancelled = false;

    pdfDocRef.current.getPage(pageNumber).then((page) => {
      return page.getTextContent();
    }).then((textContent) => {
      if (cancelled) return;
      const text = textContent.items.map((item) => item.str).join(' ');
      onPageTextExtracted(pageNumber, text);
    }).catch(() => {
      // silently fail — the right pane will show a placeholder
    });

    return () => { cancelled = true; };
  }, [pageNumber, onPageTextExtracted]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 overflow-auto bg-[#FBFAF7] select-text" style={{ userSelect: 'text' }}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 max-w-md text-center">
          <p className="text-red-600 text-sm font-semibold mb-1">Failed to load PDF</p>
          <p className="text-red-500 text-xs">{error}</p>
          <p className="text-stone-400 text-[10px] mt-2">URL: {url}</p>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        loading={
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-10 h-10 border-3 border-stone-300 border-t-[#D97757] rounded-full animate-spin" />
            <p className="text-stone-400 text-sm">Loading PDF…</p>
          </div>
        }
      >
        {!error && (
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={Math.min(window.innerWidth > 768 ? 620 : window.innerWidth - 60, 700)}
            loading={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-[#D97757] rounded-full animate-spin" />
              </div>
            }
          />
        )}
      </Document>
    </div>
  );
}
