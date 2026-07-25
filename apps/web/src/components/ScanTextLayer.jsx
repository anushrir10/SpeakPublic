import { useEffect, useRef, useState } from "react";

/**
 * ScanTextLayer
 *
 * Renders a scanned page image with a transparent, selectable OCR text layer on
 * top of it — the same technique PDF.js and Google Books use. Each OCR token is
 * an absolutely-positioned <span> whose text is `color: transparent`, so the
 * scan shows through but the real text underneath is selectable. Selecting words
 * highlights them on the scan and yields the real text via window.getSelection().
 *
 * Coordinates are normalized (0..1) relative to the page, so the layer scales
 * with the rendered image at any size.
 *
 * Props:
 *   src    – image URL of the scanned page
 *   alt    – alt text
 *   tokens – Array<{ text, x, y, w, h }> normalized 0..1 (from GET /api/ocr)
 */
export default function ScanTextLayer({ src, alt, tokens = [] }) {
  const imgRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    if (el.complete) measure();
    el.addEventListener("load", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("load", measure);
      ro.disconnect();
    };
  }, [src]);

  return (
    <div className="relative inline-block max-w-full">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="block max-w-full max-h-[80vh] object-contain rounded-md shadow-lg border border-[#E6E2D6] select-none pointer-events-none"
      />
      {box.h > 0 && tokens.length > 0 && (
        <div className="absolute inset-0 select-text" style={{ userSelect: "text" }}>
          {tokens.map((t, i) => (
            <span
              key={i}
              className="absolute whitespace-pre leading-none"
              style={{
                left: `${t.x * 100}%`,
                top: `${t.y * 100}%`,
                width: `${t.w * 100}%`,
                height: `${t.h * 100}%`,
                fontSize: `${Math.max(6, t.h * box.h)}px`,
                color: "transparent",
                cursor: "text",
                overflow: "hidden",
              }}
            >
              {t.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
