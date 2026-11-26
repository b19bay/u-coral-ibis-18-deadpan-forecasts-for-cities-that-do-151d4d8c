import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "In Fernwick, expect lightning to strike the town hall twice this evening, at 6 and 6:15, as scheduled. The town hall is insured.";

function fail(message: string): never {
  console.error(`deadpan-forecast: ${message}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set; nothing was written.");
}

if (LINE.length < 1 || LINE.length > 160) {
  fail(`line is ${LINE.length} characters; the gate allows 1 to 160.`);
}
if (LINE.trim().length === 0) {
  fail("line is only whitespace.");
}
if (LINE.includes("\n")) {
  fail("line must be a single line.");
}
const lineBytes = Buffer.byteLength(LINE, "utf8");
if (lineBytes !== LINE.length) {
  fail(
    `line is ${LINE.length} characters but ${lineBytes} bytes; the entry must stay pure ASCII so the bytes tie-break matches the character count.`,
  );
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

const written = readFileSync(target, "utf8");
if (written !== LINE) {
  fail("read-back check failed: entry.txt differs from the intended line.");
}
if (Buffer.byteLength(written, "utf8") !== lineBytes) {
  fail("read-back check failed: entry.txt byte count differs from the line.");
}
console.log(`wrote entry.txt (${LINE.length} characters)`);
