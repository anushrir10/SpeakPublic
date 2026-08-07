import pymupdf
import json

doc = pymupdf.open('public/bio11-split.pdf')
pages_data = []

for i, page in enumerate(doc):
    # Try OCR-like extraction using text blocks with positions
    blocks = page.get_text("dict")["blocks"]
    
    full_text = ""
    for block in blocks:
        if block["type"] == 0:  # text block
            for line in block["lines"]:
                line_text = ""
                for span in line["spans"]:
                    line_text += span["text"]
                full_text += line_text.strip() + "\n"
    
    full_text = full_text.strip()
    
    # Check if text is mostly garbage (non-ASCII ratio)
    if full_text:
        ascii_chars = sum(1 for c in full_text if ord(c) < 128 and c.isalpha())
        total_chars = sum(1 for c in full_text if c.isalpha())
        ascii_ratio = ascii_chars / max(total_chars, 1)
    else:
        ascii_ratio = 0
    
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    title = lines[0] if lines else f"Page {i+1}"
    if len(title) > 80:
        title = title[:77] + "..."
    
    pages_data.append({
        "pageNumber": i + 1,
        "title": title,
        "text": full_text,
        "ascii_ratio": round(ascii_ratio, 2),
        "char_count": len(full_text)
    })

with open('public/bio11_pages.json', 'w', encoding='utf-8') as f:
    json.dump(pages_data, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(pages_data)} pages")
# Show ascii ratios to understand quality
for p in pages_data[:20]:
    pn = p['pageNumber']
    ar = p['ascii_ratio']
    cc = p['char_count']
    print(f"P{pn:02d}: {cc:5d} chars, {ar:.0%} ASCII")

doc.close()
