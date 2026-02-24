import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface LessonData {
  chapterId: number;
  title: string;
  subtitle: string;
  lessons: { title: string; content: string }[];
  exercises: { title: string; description: string }[];
  keyTakeaway: string;
}

export function generateGuideBuffer(chapters: LessonData[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 60,
      info: {
        Title: 'Find Your Soulmate - The Complete Guide',
        Author: 'Find Your Soulmate',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Cover page
    doc.fontSize(36).font('Helvetica-Bold');
    doc.moveDown(6);
    doc.text('Find Your Soulmate', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica');
    doc.fillColor('#E8435A').text('The Complete Guide', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).fillColor('#737373');
    doc.text('20 Chapters to Transform Your Dating Life', { align: 'center' });
    doc.moveDown(1);
    doc.text('From Self-Discovery to Lasting Connection', { align: 'center' });

    // Chapters
    for (const chapter of chapters) {
      doc.addPage();

      // Chapter header
      doc.fontSize(11).fillColor('#E8435A').font('Helvetica-Bold');
      doc.text(`CHAPTER ${chapter.chapterId}`, { align: 'left' });
      doc.moveDown(0.3);
      doc.fontSize(24).fillColor('#171717');
      doc.text(chapter.title);
      doc.moveDown(0.2);
      doc.fontSize(13).fillColor('#737373').font('Helvetica');
      doc.text(chapter.subtitle);
      doc.moveDown(1);

      // Horizontal rule
      doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#E5E5E5').stroke();
      doc.moveDown(1);

      // Lessons
      for (const lesson of chapter.lessons) {
        doc.fontSize(14).fillColor('#171717').font('Helvetica-Bold');
        doc.text(lesson.title);
        doc.moveDown(0.4);
        doc.fontSize(11).fillColor('#404040').font('Helvetica');
        doc.text(lesson.content, { lineGap: 3 });
        doc.moveDown(0.8);
      }

      // Exercises
      if (chapter.exercises.length > 0) {
        doc.moveDown(0.5);
        doc.fontSize(13).fillColor('#E8435A').font('Helvetica-Bold');
        doc.text('EXERCISES');
        doc.moveDown(0.5);

        for (const exercise of chapter.exercises) {
          doc.fontSize(12).fillColor('#171717').font('Helvetica-Bold');
          doc.text(`→ ${exercise.title}`);
          doc.moveDown(0.2);
          doc.fontSize(11).fillColor('#525252').font('Helvetica');
          doc.text(exercise.description, { lineGap: 2 });
          doc.moveDown(0.6);
        }
      }

      // Key takeaway
      doc.moveDown(0.5);
      doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#E5E5E5').stroke();
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#E8435A').font('Helvetica-Bold');
      doc.text('KEY TAKEAWAY');
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor('#171717').font('Helvetica-BoldOblique');
      doc.text(`"${chapter.keyTakeaway}"`);
    }

    doc.end();
  });
}
