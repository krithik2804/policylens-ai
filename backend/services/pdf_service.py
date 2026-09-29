import pymupdf  # PyMuPDF
import re
from typing import List, Dict, Any, Optional, Tuple


class PDFPage:
    def __init__(self, page_number: int, text: str, blocks: List[Any]):
        self.page_number = page_number
        self.text = text
        self.blocks = blocks
        self.sentences = self._split_sentences(text)

    def _split_sentences(self, text: str) -> List[str]:
        t = text
        # Protect abbreviations with periods so they don't split
        t = re.sub(r'\bRs\.\s*', '_RS_SYM_', t)
        t = re.sub(r'\bLtd\.\s*', '_LTD_SYM_', t)
        t = re.sub(r'\bCo\.\s*', '_CO_SYM_', t)
        t = re.sub(r'\bNo\.\s*', '_NO_SYM_', t)
        t = re.sub(r'\bDr\.\s*', '_DR_SYM_', t)
        t = re.sub(r'\bvs\.\s*', '_VS_SYM_', t)

        # Split on sentence terminals
        raw_sentences = re.split(r'(?<=[.!?])\s+', t)

        cleaned = []
        for s in raw_sentences:
            s = s.replace('_RS_SYM_', 'Rs. ')
            s = s.replace('_LTD_SYM_', 'Ltd. ')
            s = s.replace('_CO_SYM_', 'Co. ')
            s = s.replace('_NO_SYM_', 'No. ')
            s = s.replace('_DR_SYM_', 'Dr. ')
            s = s.replace('_VS_SYM_', 'vs. ')
            s_clean = " ".join(s.split())
            if len(s_clean) > 8:
                cleaned.append(s_clean)
        return cleaned


class PDFDocument:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.pages: List[PDFPage] = []
        self.total_pages = 0
        self._load()

    def _load(self):
        doc = pymupdf.open(self.file_path)
        self.total_pages = len(doc)
        for i in range(self.total_pages):
            page = doc[i]
            text = page.get_text("text")
            blocks = page.get_text("blocks")
            self.pages.append(PDFPage(page_number=i + 1, text=text, blocks=blocks))
        doc.close()

    def get_full_text(self) -> str:
        return "\n\n--- Page Break ---\n\n".join([f"[PAGE {p.page_number}]\n" + p.text for p in self.pages])

    def find_quote_location(self, candidate_quote: str) -> Optional[Tuple[int, str, str]]:
        """
        Locates the exact page, exact sentence, and section heading for a candidate quote.
        Returns: (page_number, exact_sentence, section_heading) or None
        """
        if not candidate_quote or len(candidate_quote.strip()) < 4:
            return None

        clean_candidate = " ".join(candidate_quote.strip().lower().split())

        for p in self.pages:
            page_text_norm = " ".join(p.text.split()).lower()
            if clean_candidate in page_text_norm:
                section, matching_sentence = self._locate_in_blocks(p, clean_candidate)
                if not matching_sentence:
                    for s in p.sentences:
                        if clean_candidate in " ".join(s.split()).lower():
                            matching_sentence = s
                            break
                    if not matching_sentence:
                        matching_sentence = candidate_quote
                return (p.page_number, matching_sentence, section)

        # Fallback: substring matching
        if len(clean_candidate) > 20:
            prefix = clean_candidate[:min(35, len(clean_candidate))]
            for p in self.pages:
                page_text_norm = " ".join(p.text.split()).lower()
                if prefix in page_text_norm:
                    section, matching_sentence = self._locate_in_blocks(p, prefix)
                    if not matching_sentence:
                        matching_sentence = candidate_quote
                    return (p.page_number, matching_sentence, section)

        return None

    def _locate_in_blocks(self, page: PDFPage, query_str: str) -> Tuple[str, Optional[str]]:
        current_section = "GENERAL POLICY TERMS"
        found_sentence = None

        for block in page.blocks:
            if len(block) >= 5 and isinstance(block[4], str):
                b_text = block[4].strip()
                b_norm = " ".join(b_text.split()).lower()

                # Check if block is a heading
                lines = [l.strip() for l in b_text.split('\n') if l.strip()]
                for line in lines:
                    line_upper = line.upper()
                    if line_upper.startswith("SECTION") or (len(line) < 60 and ("COVERAGE" in line_upper or "WAITING PERIOD" in line_upper or "EXCLUSIONS" in line_upper or "DEDUCTIBLE" in line_upper or "CLAIM" in line_upper or "LIMITATIONS" in line_upper)):
                        current_section = line

                # If query matches this block
                if query_str in b_norm or (len(query_str) > 15 and any(word in b_norm for word in query_str.split()[:4])):
                    for sent in page.sentences:
                        s_norm = " ".join(sent.split()).lower()
                        if query_str in s_norm or s_norm in query_str:
                            found_sentence = sent
                            break
                    if not found_sentence:
                        found_sentence = lines[0] if lines else b_text
                    return current_section, found_sentence

        return current_section, found_sentence


def parse_pdf(file_path: str) -> PDFDocument:
    return PDFDocument(file_path)
