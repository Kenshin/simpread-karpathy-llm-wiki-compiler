#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const RAW_DIR = path.resolve(__dirname, '../../raw');

// ── Arg parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let mode = null;       // 'all' | 'manual'
let targets = [];      // directory names when mode === 'manual'

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-a') {
    mode = 'all';
  } else if (args[i] === '-m') {
    mode = 'manual';
    // collect all remaining positional args as directory names
    while (i + 1 < args.length && !args[i + 1].startsWith('-')) {
      targets.push(args[++i]);
    }
  }
}

if (!mode) {
  console.error('Usage: generate.js -a | -m <dir> [dir ...]');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const LOCAL_SNAPSHOT_RE = /\[本地快照\]\(http:\/\/localhost:7026\/reading\/(\d+)\)/g;
const SOURCE_URL_RE     = /\[原文地址\]\((https?:\/\/[^\)]+)\)/g;

/** Collect all unique snapshot IDs from a file's content. */
function extractSnapshotIds(content) {
  const ids = new Set();
  let m;
  while ((m = LOCAL_SNAPSHOT_RE.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return [...ids].sort((a, b) => Number(a) - Number(b));
}

/** Collect all unique source URLs from a file's content. */
function extractSourceUrls(content) {
  const urls = new Set();
  let m;
  while ((m = SOURCE_URL_RE.exec(content)) !== null) {
    urls.add(m[1]);
  }
  return [...urls];
}

/** Return .md files sorted: numeric names ascending, then others lexicographic. */
function sortedMdFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      const aNum = !isNaN(na) && String(na) + '.md' === a;
      const bNum = !isNaN(nb) && String(nb) + '.md' === b;
      if (aNum && bNum) return na - nb;
      if (aNum) return -1;
      if (bNum) return 1;
      return a.localeCompare(b);
    });
}

/** Generate index_map.txt for one directory. */
function generateForDir(dirPath) {
  const files = sortedMdFiles(dirPath);
  if (files.length === 0) return null;

  const lines = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
    const basename = path.basename(file, '.md'); // "0", "1", "overview", etc.

    const snapshotIds = extractSnapshotIds(content);

    if (snapshotIds.length > 0) {
      lines.push(`@${basename}: ${snapshotIds.join(', ')}`);
    } else {
      const urls = extractSourceUrls(content);
      if (urls.length > 0) {
        lines.push(`@${basename}: ${urls.join(', ')}`);
      }
      // else: file has neither snapshot nor source URL — skip
    }
  }

  if (lines.length === 0) return null;

  // Ensure trailing newline
  return lines.join('\n') + '\n';
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  let dirs;

  if (mode === 'all') {
    dirs = fs.readdirSync(RAW_DIR)
      .filter(d => fs.statSync(path.join(RAW_DIR, d)).isDirectory());
  } else {
    dirs = targets;
  }

  for (const dir of dirs) {
    const dirPath = path.join(RAW_DIR, dir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.warn(`[skip] ${dir}: not a directory`);
      continue;
    }

    const result = generateForDir(dirPath);
    if (result === null) {
      console.warn(`[skip] ${dir}: no .md files with sources`);
      continue;
    }

    const outPath = path.join(dirPath, 'index_map.txt');
    fs.writeFileSync(outPath, result, 'utf-8');
    console.log(`[ok]   ${dir} → index_map.txt`);
  }
}

main();
