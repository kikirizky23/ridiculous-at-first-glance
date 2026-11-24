// Ridiculous at First Glance, Real by the Second — a make.fun entry (program/v1).
//
// The entry is a single sentence: a startup pitch for hiring retired stage
// magicians as forensic accountants. It reads like a joke until the second
// clause lands — the people best at making money vanish are also the best
// at noticing where it went. This program guards the sentence against the
// contest's shape rules (one sentence, 1 to 200 characters, no stray
// whitespace), writes it to entry.txt in the grader's output directory,
// then reads it back to prove the judge will see exactly this text.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch. One sentence, one full stop, at the very end.
const PITCH =
  "We hire retired magicians as forensic accountants, because nobody finds " +
  "hidden money faster than people trained to make it disappear.";

const LIMIT = 200;

function fail(message: string): never {
  throw new Error(`pitch rejected: ${message}`);
}

// Count characters the way the scorer does: one code point at a time, so an
// accented letter counts once rather than once per UTF-16 unit.
function charCount(text: string): number {
  return Array.from(text).length;
}

function validate(text: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > LIMIT) {
    fail(`pitch is ${chars} characters, the contest allows 1 to ${LIMIT}`);
  }
  if (text.trim() !== text) {
    fail("pitch must not start or end with blank space");
  }
  if (/[\r\n]/.test(text)) {
    fail("pitch must be a single line");
  }
  if (/ {2,}/.test(text) || /\t/.test(text)) {
    fail("pitch must not hold doubled spaces or tabs");
  }
  const stops = text.match(/[.!?]/g) ?? [];
  if (stops.length !== 1 || !text.endsWith(".")) {
    fail(`pitch needs exactly one sentence ending, found ${stops.length}`);
  }
}

validate(PITCH);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}
const target = join(outDir, "entry.txt");
writeFileSync(target, PITCH, "utf8");

const back = readFileSync(target, "utf8");
if (back !== PITCH) {
  fail("entry.txt differs from the pitch after writing");
}
console.log(`entry.txt written: ${charCount(PITCH)} characters, one sentence`);
