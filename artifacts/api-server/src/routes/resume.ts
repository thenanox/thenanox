import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

const outputDir = path.resolve(process.cwd(), "..", "..", "scripts", "output");

router.get("/resume-data", (_req, res) => {
  const filePath = path.join(outputDir, "resume-data.json");
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Resume data not found." });
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
});

router.get("/download/pdf", (_req, res) => {
  const filePath = path.join(outputDir, "fernando-rodriguez-resume.pdf");
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "PDF not found. Run the generation script first." });
    return;
  }
  res.setHeader("Content-Disposition", "attachment; filename=fernando-rodriguez-resume.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
});

router.get("/download/docx", (_req, res) => {
  const filePath = path.join(outputDir, "fernando-rodriguez-resume.docx");
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "DOCX not found. Run the generation script first." });
    return;
  }
  res.setHeader("Content-Disposition", "attachment; filename=fernando-rodriguez-resume.docx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.sendFile(filePath);
});

export default router;
