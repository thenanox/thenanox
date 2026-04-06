import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
} from "docx";
import fs from "fs";
import path from "path";

interface ResumeRole {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface Spacing {
  sectionGap: number;
  roleGap: number;
  bulletGap: number;
  lineHeight: number;
  bodyFontSize: number;
  headlineFontSize: number;
}

interface ResumeData {
  name: string;
  headline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  roles: ResumeRole[];
  skills: { category: string; items: string }[];
  education: {
    degree: string;
    school: string;
    location: string;
    dates: string;
  }[];
  spacing: Spacing;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 36;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const TARGET_Y = PAGE_H - MARGIN;

const BASE_SPACING: Spacing = {
  sectionGap: 8,
  roleGap: 5,
  bulletGap: 1.5,
  lineHeight: 13,
  bodyFontSize: 10,
  headlineFontSize: 10,
};

const ptToHalfPt = (pt: number) => Math.round(pt * 2);
const ptToTwip = (pt: number) => Math.round(pt * 20);

function getResumeData(): Omit<ResumeData, "spacing"> {
  return {
    name: "Fernando Rodriguez Garcia",
    headline:
      "Head of Engineering  |  Backend Expert (Go / Java / JS)  |  Blockchain & AI",
    contact: {
      email: "thenanox@gmail.com",
      phone: "",
      location: "Madrid, Spain",
      linkedin: "linkedin.com/in/fernando-rodriguez-garcia",
      website: "thenanox.me",
    },
    summary:
      "Engineering leader with 14+ years building scalable distributed systems, blockchain platforms, and AI-driven products in fintech and regulated markets. " +
      "Head of Engineering at Adhara, leading Ethereum-based digital token infrastructure for central banks while driving company-wide AI initiatives from research to production.",
    roles: [
      {
        title: "Head of Engineering",
        company: "Adhara",
        location: "Madrid, Spain",
        startDate: "Jan 2026",
        endDate: "Present",
        bullets: [
          "Lead engineering organization across strategy, hiring, and delivery of AI-driven systems and scalable blockchain platforms for central banks and financial institutions.",
          "Define engineering processes, architectural standards, and technical strategy; bridge engineering, product, and business stakeholders to ensure sustainable, high-quality delivery.",
          "Drive company-wide AI initiatives from research and experimentation through to production-grade systems.",
        ],
      },
      {
        title: "Principal Engineer (prev. Technical Lead)",
        company: "Adhara",
        location: "Madrid, Spain",
        startDate: "May 2019",
        endDate: "Feb 2026",
        bullets: [
          "Architected next-generation Ethereum and deposit token platforms enabling real-time, multi-currency settlement and cross-border payments for regulated financial markets.",
          "Led cross-functional engineering teams across Spain and South Africa, ensuring scalability, resilience, and security of production-grade DLT software.",
        ],
      },
      {
        title: "Co-founder & CTO",
        company: "YONDR",
        location: "Madrid, Spain",
        startDate: "May 2019",
        endDate: "Present",
        bullets: [
          "Architected scalable backend infrastructure and Android/iOS API layer for a mobile-first events platform, enabling seamless native integrations.",
          "Designed an asynchronous job distribution system in Java and RabbitMQ, dynamically scaling workers based on real-time load.",
        ],
      },
      {
        title: "Head of Backend Development",
        company: "Copado Solutions",
        location: "Madrid, Spain",
        startDate: "Mar 2018",
        endDate: "May 2019",
        bullets: [
          "Led backend engineering integrating cloud infrastructure with Salesforce to automate CI/CD pipelines and release management for enterprise clients.",
          "Mentored a multidisciplinary backend team; drove adoption of automated testing, significantly reducing deployment times and increasing release frequency.",
        ],
      },
      {
        title: "Full Stack Engineer",
        company: "Grupo GFT",
        location: "Madrid, Spain",
        startDate: "Jan 2016",
        endDate: "Mar 2018",
        bullets: [
          "Developed PSD2-compliant open banking API platform for BBVA and Bankinter, enabling secure third-party integrations and regulatory compliance.",
        ],
      },
    ],
    skills: [
      { category: "Languages", items: "Go, Java, JavaScript, TypeScript, PHP" },
      {
        category: "Blockchain & Web3",
        items: "Ethereum, Smart Contracts, DLT, Digital Tokens, Deposit Tokens",
      },
      {
        category: "AI / ML",
        items: "LangChain, AI-driven platforms, Prompt Engineering",
      },
      {
        category: "Backend & Infra",
        items:
          "REST APIs, Distributed Systems, RabbitMQ, Spring, Microservices, Docker",
      },
    ],
    education: [
      {
        degree: "Ingeniero Informático Superior (M.Eng. equivalent), Computer Engineering",
        school: "Universidad de Murcia",
        location: "Murcia, Spain",
        dates: "2005 – 2011",
      },
    ],
  };
}

function renderPDF(
  doc: jsPDF,
  data: Omit<ResumeData, "spacing">,
  spacing: Spacing
): number {
  let y = MARGIN;
  const {
    bodyFontSize,
    headlineFontSize,
    lineHeight,
    sectionGap,
    roleGap,
    bulletGap,
  } = spacing;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.name, PAGE_W / 2, y, { align: "center" });
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(headlineFontSize);
  doc.text(data.headline, PAGE_W / 2, y, { align: "center" });
  y += lineHeight;

  const contactParts = [
    data.contact.location,
    data.contact.email,
    data.contact.linkedin,
    data.contact.website,
  ].filter(Boolean);
  doc.setFontSize(9);
  doc.text(contactParts.join("   |   "), PAGE_W / 2, y, { align: "center" });
  y += lineHeight + 2;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(bodyFontSize);
  const summaryLines = doc.splitTextToSize(
    data.summary,
    CONTENT_W
  ) as string[];
  for (const line of summaryLines) {
    doc.text(line, MARGIN, y);
    y += lineHeight;
  }

  function renderSectionHeader(title: string) {
    y += sectionGap;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), MARGIN, y);
    y += 3;
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += lineHeight;
  }

  renderSectionHeader("Experience");

  for (const role of data.roles) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(bodyFontSize);
    const dateText = `${role.startDate} – ${role.endDate}`;
    doc.text(role.title, MARGIN, y);
    doc.text(dateText, PAGE_W - MARGIN, y, { align: "right" });
    y += lineHeight * 0.9;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(bodyFontSize - 0.5);
    doc.text(`${role.company}  ·  ${role.location}`, MARGIN, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(bodyFontSize);
    for (const bullet of role.bullets) {
      const bulletLines = doc.splitTextToSize(
        `• ${bullet}`,
        CONTENT_W - 4
      ) as string[];
      for (const line of bulletLines) {
        doc.text(line, MARGIN + 2, y);
        y += lineHeight;
      }
      y += bulletGap;
    }
    y += roleGap;
  }

  renderSectionHeader("Skills");
  for (const skill of data.skills) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(bodyFontSize);
    const labelWidth = doc.getTextWidth(`${skill.category}: `);
    doc.text(`${skill.category}: `, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const itemsLines = doc.splitTextToSize(
      skill.items,
      CONTENT_W - labelWidth
    ) as string[];
    doc.text(itemsLines[0] ?? "", MARGIN + labelWidth, y);
    y += lineHeight;
    for (let i = 1; i < itemsLines.length; i++) {
      doc.text(itemsLines[i], MARGIN + labelWidth, y);
      y += lineHeight;
    }
    y += bulletGap;
  }

  renderSectionHeader("Education");
  for (const edu of data.education) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(bodyFontSize);
    doc.text(edu.degree, MARGIN, y);
    doc.text(edu.dates, PAGE_W - MARGIN, y, { align: "right" });
    y += lineHeight * 0.9;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(bodyFontSize - 0.5);
    doc.text(`${edu.school}  ·  ${edu.location}`, MARGIN, y);
    y += lineHeight;
  }

  return y;
}

function buildDocx(
  data: Omit<ResumeData, "spacing">,
  spacing: Spacing
): Document {
  const { bodyFontSize, lineHeight, sectionGap, roleGap, bulletGap } = spacing;
  const children: Paragraph[] = [];

  const namePara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: ptToTwip(4) },
    children: [
      new TextRun({
        text: data.name,
        bold: true,
        size: ptToHalfPt(20),
        font: "Calibri",
      }),
    ],
  });
  children.push(namePara);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ptToTwip(2) },
      children: [
        new TextRun({
          text: data.headline,
          size: ptToHalfPt(bodyFontSize + 0.5),
          font: "Calibri",
        }),
      ],
    })
  );

  const contactParts = [
    data.contact.location,
    data.contact.email,
    data.contact.linkedin,
    data.contact.website,
  ]
    .filter(Boolean)
    .join("   |   ");

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: ptToTwip(4) },
      border: {
        bottom: {
          color: "000000",
          size: 6,
          style: BorderStyle.SINGLE,
          space: 4,
        },
      },
      children: [
        new TextRun({
          text: contactParts,
          size: ptToHalfPt(9),
          font: "Calibri",
        }),
      ],
    })
  );

  const summaryLines = data.summary.split(". ").filter(Boolean);
  children.push(
    new Paragraph({
      spacing: { after: ptToTwip(sectionGap) },
      children: [
        new TextRun({
          text: data.summary,
          size: ptToHalfPt(bodyFontSize),
          font: "Calibri",
        }),
      ],
    })
  );

  function sectionHeader(title: string) {
    children.push(
      new Paragraph({
        spacing: { before: ptToTwip(sectionGap), after: ptToTwip(3) },
        border: {
          bottom: {
            color: "000000",
            size: 6,
            style: BorderStyle.SINGLE,
            space: 2,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: ptToHalfPt(10),
            font: "Calibri",
          }),
        ],
      })
    );
  }

  sectionHeader("Experience");

  for (const role of data.roles) {
    children.push(
      new Paragraph({
        spacing: { before: ptToTwip(roleGap), after: 0 },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        children: [
          new TextRun({
            text: role.title,
            bold: true,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
          new TextRun({
            text: `\t${role.startDate} – ${role.endDate}`,
            bold: true,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { before: 0, after: ptToTwip(1) },
        children: [
          new TextRun({
            text: `${role.company}  ·  ${role.location}`,
            italics: true,
            size: ptToHalfPt(bodyFontSize - 0.5),
            font: "Calibri",
          }),
        ],
      })
    );

    for (const bullet of role.bullets) {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: ptToTwip(bulletGap) },
          children: [
            new TextRun({
              text: `• ${bullet}`,
              size: ptToHalfPt(bodyFontSize),
              font: "Calibri",
            }),
          ],
          indent: { left: ptToTwip(8) },
        })
      );
    }
  }

  sectionHeader("Skills");

  for (const skill of data.skills) {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: ptToTwip(bulletGap) },
        children: [
          new TextRun({
            text: `${skill.category}: `,
            bold: true,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
          new TextRun({
            text: skill.items,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
        ],
      })
    );
  }

  sectionHeader("Education");

  for (const edu of data.education) {
    children.push(
      new Paragraph({
        spacing: { before: ptToTwip(roleGap), after: 0 },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        children: [
          new TextRun({
            text: edu.degree,
            bold: true,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
          new TextRun({
            text: `\t${edu.dates}`,
            bold: true,
            size: ptToHalfPt(bodyFontSize),
            font: "Calibri",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text: `${edu.school}  ·  ${edu.location}`,
            italics: true,
            size: ptToHalfPt(bodyFontSize - 0.5),
            font: "Calibri",
          }),
        ],
      })
    );
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: ptToTwip(PAGE_W), height: ptToTwip(PAGE_H) },
            margin: {
              top: ptToTwip(MARGIN),
              bottom: ptToTwip(MARGIN),
              left: ptToTwip(MARGIN),
              right: ptToTwip(MARGIN),
            },
          },
        },
        children,
      },
    ],
  });
}

async function main() {
  const data = getResumeData();
  const outputDir = path.resolve(import.meta.dirname, "..", "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let spacing = { ...BASE_SPACING };
  let doc = new jsPDF({ unit: "pt", format: "letter" });
  let finalY = renderPDF(doc, data, spacing);

  if (finalY > TARGET_Y) {
    let tries = 0;
    while (finalY > TARGET_Y && tries < 20) {
      spacing = {
        ...spacing,
        bodyFontSize: spacing.bodyFontSize - 0.25,
        headlineFontSize: spacing.headlineFontSize - 0.25,
        lineHeight: spacing.lineHeight - 0.25,
        sectionGap: Math.max(spacing.sectionGap - 0.5, 2),
        roleGap: Math.max(spacing.roleGap - 0.5, 1),
        bulletGap: Math.max(spacing.bulletGap - 0.25, 0),
      };
      doc = new jsPDF({ unit: "pt", format: "letter" });
      finalY = renderPDF(doc, data, spacing);
      tries++;
    }
  } else if (finalY < TARGET_Y) {
    const slack = TARGET_Y - finalY;
    const weights = { sectionGap: 3, roleGap: 2, bulletGap: 1, lineHeight: 0.5 };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const occurrences = {
      sectionGap: 3,
      roleGap: data.roles.length + data.education.length,
      bulletGap:
        data.roles.reduce((a, r) => a + r.bullets.length, 0) +
        data.skills.length,
      lineHeight: Math.round(finalY / spacing.lineHeight),
    };
    const totalWeightedOccurrences = Object.entries(weights).reduce(
      (sum, [k, w]) =>
        sum + w * occurrences[k as keyof typeof occurrences],
      0
    );
    const slackPerUnit = slack / totalWeightedOccurrences;
    spacing = {
      ...spacing,
      sectionGap: spacing.sectionGap + weights.sectionGap * slackPerUnit,
      roleGap: spacing.roleGap + weights.roleGap * slackPerUnit,
      bulletGap: spacing.bulletGap + weights.bulletGap * slackPerUnit,
      lineHeight: spacing.lineHeight + weights.lineHeight * slackPerUnit,
    };
  }

  doc = new jsPDF({ unit: "pt", format: "letter" });
  finalY = renderPDF(doc, data, spacing);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(
    path.join(outputDir, "fernando-rodriguez-resume.pdf"),
    pdfBuffer
  );

  const docxDoc = buildDocx(data, spacing);
  const docxBuffer = await Packer.toBuffer(docxDoc);
  fs.writeFileSync(
    path.join(outputDir, "fernando-rodriguez-resume.docx"),
    docxBuffer
  );

  const jsonData: ResumeData = { ...data, spacing };
  fs.writeFileSync(
    path.join(outputDir, "resume-data.json"),
    JSON.stringify(jsonData, null, 2)
  );

  console.log(
    `All files generated. Final Y = ${finalY.toFixed(1)} / ${TARGET_Y} (target)`
  );
}

main().catch(console.error);
