import PDFDocument from "pdfkit";

export async function generateResume(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text(data.name || "Name", { align: "center" });
      doc.moveDown();

      // Education
      doc.fontSize(16).text("Education:");
      (data.education || []).forEach((edu) => doc.text(`- ${edu}`));
      doc.moveDown();

      // Experience
      doc.fontSize(16).text("Experience:");
      (data.experience || []).forEach((exp) => doc.text(`- ${exp}`));

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
