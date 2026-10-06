import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ReportPayload = {
  reason?: string;
  start?: string;
  end?: string;
};

const brown = rgb(0.20, 0.10, 0.07);
const muted = rgb(0.38, 0.34, 0.31);
const blush = rgb(0.91, 0.76, 0.70);

function clean(value: string) {
  return value.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-");
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ReportPayload;
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  let page = pdf.addPage([595.28, 841.89]);
  let y = 792;
  const margin = 52;
  const width = 491;

  const newPage = () => {
    page = pdf.addPage([595.28, 841.89]);
    y = 790;
  };

  const ensure = (height: number) => {
    if (y - height < 54) newPage();
  };

  const line = (text: string, size = 10, isBold = false, color = muted, indent = 0) => {
    ensure(size + 8);
    page.drawText(clean(text), {
      x: margin + indent,
      y,
      size,
      font: isBold ? bold : regular,
      color,
    });
    y -= size + 7;
  };

  const wrapped = (text: string, size = 10, color = muted) => {
    const words = clean(text).split(/\s+/);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (regular.widthOfTextAtSize(candidate, size) > width && current) {
        line(current, size, false, color);
        current = word;
      } else current = candidate;
    }
    if (current) line(current, size, false, color);
  };

  const section = (title: string) => {
    ensure(42);
    y -= 8;
    page.drawRectangle({ x: margin, y: y - 5, width, height: 25, color: rgb(0.98, 0.94, 0.91) });
    page.drawText(title.toUpperCase(), { x: margin + 10, y: y + 3, size: 9, font: bold, color: brown });
    y -= 34;
  };

  page.drawText("My Baby Well-Being Insights", { x: margin, y, size: 24, font: serif, color: brown });
  y -= 31;
  page.drawText("DOCTOR'S REPORT", { x: margin, y, size: 9, font: bold, color: blush });
  page.drawLine({ start: { x: margin, y: y - 10 }, end: { x: margin + width, y: y - 10 }, thickness: 1, color: blush });
  y -= 36;

  section("Child");
  line("Name: Oliver Hart", 10, true);
  line("Date of birth: 18 March 2024");
  line("Age: 19 months");
  line(`Report period: ${payload.start || "12 October 2025"} to ${payload.end || "18 October 2025"}`);

  section("Current information");
  line("Known conditions: None known");
  line("Allergies: None known");
  line("Current medicines: None routinely");

  section("Reason for report");
  wrapped(payload.reason || "To share a concise summary of recent congestion, sleep and appetite records before Oliver's appointment.");

  section("Summary");
  wrapped("During this period, congestion was recorded on 2 days, lower meal intake on 3 days and increased night waking on 2 days. Oliver was recorded as well on 5 days and happy/content on 5 of 7 days.");

  section("Timeline");
  line("14 Oct  |  Congested; 3 night wakes; ate very little", 10, true);
  line("15 Oct  |  Congested; 3 night wakes; ate some");
  line("15 Oct  |  Calpol, 5 ml at 7:30 pm - teething discomfort");
  line("16 Oct  |  Well; 1-2 wakes; ate most");
  line("18 Oct  |  Well; happy/content; ate well");

  section("Patterns observed");
  wrapped("Increased night waking was recorded on both days where congestion was also recorded. Lower meal intake occurred alongside these records. This is an observed combination and does not establish a cause.");

  section("Medicine");
  line("15 Oct  |  Calpol  |  5 ml  |  Teething discomfort");

  section("Food reactions");
  line("13 Oct  |  Strawberries  |  Redness around mouth");
  wrapped("A reaction after strawberries has been recorded on 3 occasions. This record does not label an allergy or intolerance.", 9);

  section("Parent notes / concerns");
  wrapped("Please discuss the recent congestion and whether there is anything in particular we should continue to observe.");

  y -= 12;
  page.drawLine({ start: { x: margin, y }, end: { x: margin + width, y }, thickness: 0.6, color: rgb(0.78, 0.75, 0.72) });
  y -= 20;
  wrapped("This report contains information recorded by the parent/carer through My Baby Well-Being Insights. It is intended as an organisational aid and is not a medical record, diagnosis or medical advice.", 8, rgb(0.42, 0.42, 0.42));

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="oliver-doctors-report.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
