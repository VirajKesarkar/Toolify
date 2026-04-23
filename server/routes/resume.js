import express from "express";
import PDFDocument from "pdfkit";
const router = express.Router();

// ===================== TEMPLATES ====================== //
function applyClassicTemplate(doc) {
  doc.lineWidth(2)
    .strokeColor("#000")
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .stroke();
  doc.fillColor("#000");
}

function applyCreativeTemplate(doc) {
  const headerHeight = 110; // larger header to avoid text cutting
  doc.rect(0, 0, doc.page.width, headerHeight).fill("#6A3CC6");
}

function applyTechTemplate(doc) {
  doc.lineWidth(4)
    .strokeColor("#1dbf73")
    .moveTo(40, 80)
    .lineTo(550, 80)
    .stroke();
}

// ================ SECTION HELPERS ===================== //
function sectionHeader(doc, title, template) {
  doc.moveDown(1);
  doc.fontSize(16)
    .fillColor(template === "tech" ? "#1dbf73" : "#6A3CC6")
    .text(title, { underline: true, bold: true });
  doc.moveDown(0.3);
}

function bullet(doc, text) {
  doc.fontSize(12)
    .fillColor("#000")
    .text(`• ${text}`, { indent: 20, lineGap: 2 });
}

// ========================= ROUTE ======================= //
router.post("/generate", async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      phone = "",
      linkedin = "",
      github = "",
      skills = [],
      experience = [],
      education = [],
      template = "classic"
    } = req.body;

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment;filename=${name || "resume"}.pdf`
        })
        .end(pdfData);
    });

    // ================= APPLY TEMPLATE ================= //
    if (template === "classic") applyClassicTemplate(doc);
    if (template === "creative") applyCreativeTemplate(doc);
    if (template === "tech") applyTechTemplate(doc);

    // ================= HEADER SPACING FIX ============= //
    doc.moveDown(template === "creative" ? 3 : 1.2);

    // ================= NAME ========================= //
    doc.fontSize(22)
      .fillColor(template === "creative" ? "#fff" : "#333")
      .text(name, { align: "center" });

// ====== CONTACT INFO PROPER TEXT ICONS (NO EMOJI) ======
doc.moveDown(template === "creative" ? 1 : 0.6);

doc.fontSize(11).fillColor("#555");

if (email) doc.text(`Email: ${email}`, { align: "center" });
if (phone) doc.text(`Phone: ${phone}`, { align: "center" });
if (linkedin) doc.text(`LinkedIn: ${linkedin}`, { align: "center", link: linkedin, underline: true });
if (github) doc.text(`GitHub: ${github}`, { align: "center", link: github, underline: true });

doc.moveDown(1);


    // ================= EXPERIENCE ================= //
    if (experience.length) {
      sectionHeader(doc, "Experience", template);
      experience.forEach(exp => bullet(doc, exp));
      doc.moveDown(0.5);
    }

    // ================= EDUCATION ================= //
    if (education.length) {
      sectionHeader(doc, "Education", template);
      education.forEach(edu => bullet(doc, edu));
      doc.moveDown(0.5);
    }

    // ================= SKILLS ===================== //
    if (skills.length) {
      sectionHeader(doc, "Skills", template);
      skills.forEach(skill => bullet(doc, skill));
      doc.moveDown(0.5);
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Error generating resume" });
  }
});

export default router;
