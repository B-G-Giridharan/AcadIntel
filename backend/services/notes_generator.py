"""
Notes/Mini-Book Generator Service
Converts questions into structured study material with chapter-wise organization
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from datetime import datetime
import os
import time
from collections import defaultdict

def organize_by_chapters(questions, textbook):
    """Organize questions into chapters based on topics"""
    chapters = defaultdict(list)
    
    for question in questions:
        question_topics = set(topic.lower() for topic in question.get('topics', []))
        matched = False
        
        for chapter in textbook.get('chapters', []):
            for section in chapter.get('sections', []):
                section_title_lower = section['title'].lower()
                if any(topic in section_title_lower for topic in question_topics):
                    chapters[chapter['number']].append({
                        'question': question,
                        'chapter': chapter,
                        'section': section
                    })
                    matched = True
                    break
            if matched:
                break
    
    return chapters

def generate_notes_book(subject_name, questions, textbook, topics, settings):
    """Generate exam-ready notes as a mini-book"""
    start_time = time.time()
    
    # Create output directory
    os.makedirs("output", exist_ok=True)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"AcadIntel_StudyNotes_{subject_name.replace(' ', '_')}_{timestamp}.pdf"
    filepath = os.path.join("output", filename)
    
    # Organize content by chapters
    organized_content = organize_by_chapters(questions, textbook)
    
    # Create PDF
    doc = SimpleDocTemplate(filepath, pagesize=A4,
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles for book-like appearance
    book_title_style = ParagraphStyle(
        'BookTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#195de6'),
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    book_subtitle_style = ParagraphStyle(
        'BookSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.grey,
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    chapter_title_style = ParagraphStyle(
        'ChapterTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#195de6'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold',
        borderPadding=10,
        borderColor=colors.HexColor('#195de6'),
        borderWidth=2,
        backColor=colors.HexColor('#f0f2f4')
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#111318'),
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold',
        leftIndent=10
    )
    
    content_style = ParagraphStyle(
        'Content',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.black,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=16,
        leftIndent=10,
        rightIndent=10
    )
    
    key_point_style = ParagraphStyle(
        'KeyPoint',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#195de6'),
        spaceAfter=6,
        leftIndent=20,
        bulletIndent=10,
        fontName='Helvetica-Bold'
    )
    
    source_style = ParagraphStyle(
        'Source',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#636f88'),
        spaceAfter=8,
        fontName='Helvetica-Oblique',
        leftIndent=10
    )
    
    # Build document content
    content = []
    
    # Cover page
    content.append(Spacer(1, 1.5*inch))
    content.append(Paragraph(f"{subject_name}", book_title_style))
    content.append(Paragraph("Exam-Ready Study Notes", book_subtitle_style))
    content.append(Spacer(1, 0.3*inch))
    
    # Book info box
    info_data = [
        ['Source Material', textbook['title']],
        ['Author', textbook['author']],
        ['Edition', textbook.get('edition', 'N/A')],
        ['Generated', datetime.now().strftime('%B %d, %Y')],
        ['Topics Covered', str(len(organized_content))]
    ]
    
    info_table = Table(info_data, colWidths=[2*inch, 3.5*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f2f4')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#195de6'))
    ]))
    
    content.append(info_table)
    content.append(Spacer(1, 0.5*inch))
    content.append(Paragraph(
        "<i>Structured for exam preparation - Source-verified content - AI-enhanced organization</i>",
        book_subtitle_style
    ))
    content.append(PageBreak())
    
    # Table of Contents
    content.append(Paragraph("Table of Contents", chapter_title_style))
    content.append(Spacer(1, 0.2*inch))
    
    toc_data = []
    for chapter_num in sorted(organized_content.keys()):
        items = organized_content[chapter_num]
        if items:
            chapter_info = items[0]['chapter']
            toc_data.append([
                f"Chapter {chapter_num}",
                chapter_info['title'],
                f"{len(items)} topics"
            ])
    
    toc_table = Table(toc_data, colWidths=[1.2*inch, 3.5*inch, 1*inch])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#195de6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
    ]))
    
    content.append(toc_table)
    content.append(PageBreak())
    
    # Generate chapters
    sources_used = set()
    total_topics = 0
    
    for chapter_num in sorted(organized_content.keys()):
        items = organized_content[chapter_num]
        if not items:
            continue
        
        chapter_info = items[0]['chapter']
        
        # Chapter title page
        content.append(Spacer(1, 0.3*inch))
        content.append(Paragraph(
            f"Chapter {chapter_num}: {chapter_info['title']}",
            chapter_title_style
        ))
        content.append(Spacer(1, 0.3*inch))
        
        # Process each topic in the chapter
        for item in items:
            total_topics += 1
            question = item['question']
            section = item['section']
            
            # Topic title (derived from question)
            content.append(Paragraph(
                f"Topic {total_topics}: {section['title']}",
                section_title_style
            ))
            
            # Core concept explanation
            answer_text = section['content']
            
            # Highlight key terms if enabled
            if settings.get('smart_highlights', True) and section.get('key_terms'):
                for term in section['key_terms']:
                    answer_text = answer_text.replace(
                        term,
                        f"<b><font color='#195de6'>{term}</font></b>"
                    )
            
            content.append(Paragraph(answer_text.replace('\n', '<br/>'), content_style))
            
            # Key points box
            if section.get('key_terms'):
                content.append(Spacer(1, 0.1*inch))
                content.append(Paragraph("<b>Key Terms:</b>", content_style))
                for term in section['key_terms']:
                    content.append(Paragraph(f"- {term}", key_point_style))
            
            # Exam relevance
            exam_note = (f"<i>Exam Note: This topic appeared {question.get('frequency', 0)} times "
                        f"in past papers with {question.get('weightage', 0)} marks weightage.</i>")
            content.append(Spacer(1, 0.1*inch))
            content.append(Paragraph(exam_note, source_style))
            
            # Source citation
            if settings.get('include_citations', True):
                citation = (f"<b>Source:</b> {textbook['title']}, "
                          f"Chapter {chapter_num}, Page {section.get('page', 'N/A')}")
                content.append(Paragraph(citation, source_style))
                sources_used.add(textbook['title'])
            
            content.append(Spacer(1, 0.2*inch))
        
        # Chapter summary
        content.append(Spacer(1, 0.2*inch))
        summary_text = f"<b>Chapter {chapter_num} Summary:</b> This chapter covered {len(items)} important exam topics. " \
                      f"Focus on understanding the key concepts and practice related problems."
        content.append(Paragraph(summary_text, content_style))
        
        content.append(PageBreak())
    
    # Final page
    content.append(Spacer(1, 1*inch))
    content.append(Paragraph("End of Study Notes", book_title_style))
    content.append(Spacer(1, 0.3*inch))
    content.append(Paragraph(
        "- Review all key terms highlighted in blue<br/>"
        "- Practice questions from each chapter<br/>"
        "- Focus on high-frequency topics<br/>"
        "- Refer to source material for deeper understanding",
        content_style
    ))
    content.append(Spacer(1, 0.5*inch))
    footer_text = f"Generated by AcadIntel AI - Exam-Focused Study Material - {datetime.now().strftime('%B %d, %Y')}"
    content.append(Paragraph(footer_text, source_style))
    
    # Build PDF
    doc.build(content)
    
    generation_time = round(time.time() - start_time, 2)
    
    return {
        "file_path": filepath,
        "filename": filename,
        "total_chapters": len(organized_content),
        "total_topics": total_topics,
        "total_pages": "N/A",  # ReportLab doesn't provide page count easily
        "sources_used": list(sources_used),
        "generation_time": generation_time
    }
