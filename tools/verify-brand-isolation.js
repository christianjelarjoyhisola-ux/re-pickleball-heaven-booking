const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORED_DIRS = new Set(['.git', 'node_modules']);
const IGNORED_FILES = new Set(['package-lock.json', 'verify-brand-isolation.js']);
const BLOCKED_PATTERNS = [
  /korte/i,
  /kortedoscdo/i,
  /zcuufcpkgidmaanxjufo/i,
];

/**
 * Recursively collects text files that should be checked for inherited brand
 * and infrastructure references.
 *
 * @param {string} dir Directory to scan.
 * @returns {string[]} Absolute file paths.
 */
function collectFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return IGNORED_DIRS.has(entry.name) ? [] : collectFiles(fullPath);
    }
    return IGNORED_FILES.has(entry.name) ? [] : [fullPath];
  });
}

/**
 * Detects whether a file is likely binary by looking for null bytes.
 *
 * @param {Buffer} buffer File contents.
 * @returns {boolean} True when the file appears binary.
 */
function isBinary(buffer) {
  return buffer.includes(0);
}

/**
 * Finds blocked strings in a single source file.
 *
 * @param {string} filePath Absolute file path.
 * @returns {string[]} Human-readable findings.
 */
function findBlockedReferences(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (isBinary(buffer)) return [];

  const text = buffer.toString('utf8');
  return BLOCKED_PATTERNS
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `${path.relative(ROOT, filePath)} matches ${pattern}`);
}

const findings = collectFiles(ROOT).flatMap(findBlockedReferences);

if (findings.length) {
  console.error('Brand isolation check failed:');
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log('Brand isolation check passed.');
