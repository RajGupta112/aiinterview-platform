import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export async function extractPdfText(data: Buffer): Promise<string> {
  const { PDFParse } = require("pdf-parse") as typeof import("pdf-parse");
  const parser = new PDFParse({ data });
  try {
    const parsed = await parser.getText();
    return parsed.text;
  } finally {
    await parser.destroy();
  }
}
