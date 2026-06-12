#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path
from typing import Optional

RAW_DIR = Path(__file__).resolve().parent.parent.parent / 'raw'

LOCAL_SNAPSHOT_RE = re.compile(r'\[本地快照\]\(http://localhost:7026/reading/(\d+)\)')
SOURCE_URL_RE     = re.compile(r'\[原文地址\]\((https?://[^\)]+)\)')


def extract_snapshot_ids(content: str) -> list[str]:
    ids = sorted(set(LOCAL_SNAPSHOT_RE.findall(content)), key=int)
    return ids


def extract_source_urls(content: str) -> list[str]:
    urls = list(dict.fromkeys(SOURCE_URL_RE.findall(content)))
    return urls


def sort_key_md(filename: str):
    """Sort: numeric names ascending, then others lexicographic."""
    stem = Path(filename).stem
    try:
        n = int(stem)
        if f'{n}.md' == filename:
            return (0, n)
    except ValueError:
        pass
    return (1, filename)


def sorted_md_files(dir_path: Path) -> list[str]:
    files = [f for f in os.listdir(dir_path) if f.endswith('.md')]
    files.sort(key=sort_key_md)
    return files


def generate_for_dir(dir_path: Path) -> Optional[str]:
    files = sorted_md_files(dir_path)
    if not files:
        return None

    lines = []
    for file in files:
        content = (dir_path / file).read_text('utf-8')
        stem = Path(file).stem

        snapshot_ids = extract_snapshot_ids(content)
        if snapshot_ids:
            lines.append(f'@{stem}: {", ".join(snapshot_ids)}')
        else:
            urls = extract_source_urls(content)
            if urls:
                lines.append(f'@{stem}: {", ".join(urls)}')

    if not lines:
        return None

    return '\n'.join(lines) + '\n'


def main():
    args = sys.argv[1:]
    mode = None
    targets = []

    i = 0
    while i < len(args):
        if args[i] == '-a':
            mode = 'all'
            i += 1
        elif args[i] == '-m':
            mode = 'manual'
            i += 1
            while i < len(args) and not args[i].startswith('-'):
                targets.append(args[i])
                i += 1
        else:
            i += 1

    if not mode:
        print('Usage: generate.py -a | -m <dir> [dir ...]', file=sys.stderr)
        sys.exit(1)

    if mode == 'all':
        dirs = [d for d in RAW_DIR.iterdir() if d.is_dir()]
    else:
        dirs = [RAW_DIR / t for t in targets]

    for d in sorted(dirs, key=lambda p: p.name):
        dir_path = d if d.is_absolute() else RAW_DIR / d
        dir_name = d.name if d.is_absolute() else d

        if not dir_path.is_dir():
            print(f'[skip] {dir_name}: not a directory', file=sys.stderr)
            continue

        result = generate_for_dir(dir_path)
        if result is None:
            print(f'[skip] {dir_name}: no .md files with sources', file=sys.stderr)
            continue

        out_path = dir_path / 'index_map.txt'
        out_path.write_text(result, 'utf-8')
        print(f'[ok]   {dir_name} → index_map.txt')


if __name__ == '__main__':
    main()
