import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
} from 'docx';
import { CheatSheetItem } from '../data/examData';

export async function exportCheatSheetToWord(sheet: CheatSheetItem): Promise<void> {
  const lines = sheet.content.split('\n');
  const docChildren: Paragraph[] = [];

  // Header Banner
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, before: 60 },
      children: [
        new TextRun({
          text: `EXAMPREP AI • HIGH-YIELD REVISION CHEAT SHEET`,
          bold: true,
          size: 20, // 10pt
          color: '4F46E5',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: sheet.topic,
          bold: true,
          size: 36, // 18pt
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: `Target Exam: ${sheet.exam}   |   Revision Mode: ${sheet.mode.toUpperCase()}   |   Generated: ${new Date(sheet.timestamp).toLocaleDateString()}`,
          italics: true,
          size: 18, // 9pt
          color: '64748B',
          font: 'Arial',
        }),
      ],
    })
  );

  // Parse Markdown Lines into Docx Paragraphs
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      docChildren.push(new Paragraph({ spacing: { after: 100 } }));
      continue;
    }

    if (trimmed.startsWith('## ')) {
      // Major Section Heading (The 4 Pillars)
      const headingText = trimmed.replace(/^##\s+/, '');
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 140 },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 28, // 14pt
              color: '1E293B',
              font: 'Arial',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('### ')) {
      // Sub-heading
      const subHeadingText = trimmed.replace(/^###\s+/, '');
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: subHeadingText,
              bold: true,
              size: 24, // 12pt
              color: '4338CA',
              font: 'Arial',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // Bullet items
      const bulletText = trimmed.replace(/^[*|-]\s+/, '');
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: parseInlineFormatting(bulletText),
        })
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      // Numbered items
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: parseInlineFormatting(itemText),
        })
      );
    } else if (trimmed.startsWith('>')) {
      // Callout box / blockquote
      const quoteText = trimmed.replace(/^>\s*/, '');
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 100 },
          indent: { left: 400 },
          children: [
            new TextRun({
              text: `[NOTE/TRAP] ${quoteText}`,
              italics: true,
              bold: true,
              color: 'B45309',
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
    } else {
      // Standard text paragraph
      docChildren.push(
        new Paragraph({
          spacing: { after: 100 },
          children: parseInlineFormatting(trimmed),
        })
      );
    }
  }

  // Footer section in docx
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `────────────────────────────────────────────────────────────`,
          color: 'CBD5E1',
          size: 16,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: `Prepared with ExamPrep AI for ${sheet.exam} Aspirants • Negative Marking & Speed Strategy Included`,
          size: 16,
          italics: true,
          color: '94A3B8',
          font: 'Arial',
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const sanitizedTopic = sheet.topic.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sheet.exam.replace(/[^a-zA-Z0-9_-]/g, '_')}_${sanitizedTopic}_FormulaSheet.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to convert bold markdown **text** and equations into TextRuns
function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  // Tokenize by bold **...** and backticks `...`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;
  const parts = text.split(regex);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('**') && part.endsWith('**')) {
      runs.push(
        new TextRun({
          text: part.slice(2, -2),
          bold: true,
          color: '0F172A',
          size: 20,
          font: 'Arial',
        })
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          font: 'Courier New',
          color: 'B45309',
          size: 19,
        })
      );
    } else if (part.startsWith('$') && part.endsWith('$')) {
      // Math formula represented in word
      runs.push(
        new TextRun({
          text: part,
          font: 'Cambria Math',
          color: '1E3A8A',
          bold: true,
          size: 21,
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: part,
          color: '334155',
          size: 20,
          font: 'Arial',
        })
      );
    }
  }

  return runs.length > 0
    ? runs
    : [
        new TextRun({
          text,
          color: '334155',
          size: 20,
          font: 'Arial',
        }),
      ];
}
