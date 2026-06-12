#!/usr/bin/env bash
set -eo pipefail

RAW_DIR="$(cd "$(dirname "$0")/../../raw" && pwd)"

usage() {
  echo "Usage: generate.sh -a | -m <dir> [dir ...]" >&2
  exit 1
}

# ── Arg parsing ──────────────────────────────────────────────────────────────

mode=""
targets=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -a) mode="all"; shift ;;
    -m) mode="manual"; shift
        while [[ $# -gt 0 && ! "$1" =~ ^- ]]; do
          targets+=("$1"); shift
        done
        ;;
    *) usage ;;
  esac
done

[[ -z "$mode" ]] && usage

# ── Helpers ──────────────────────────────────────────────────────────────────

# Sort .md files: numeric names ascending, then others lexicographic
sorted_md_files() {
  local dir="$1"
  local num_lines="" other_lines=""

  for f in "$dir"/*.md; do
    [[ -f "$f" ]] || continue
    local base="${f##*/}"
    local stem="${base%.md}"
    if [[ "$stem" =~ ^[0-9]+$ && "${stem}.md" == "$base" ]]; then
      num_lines+="${stem}"$'\n'
    else
      other_lines+="${base}"$'\n'
    fi
  done

  [[ -n "$num_lines" ]] && printf '%s' "$num_lines" | sort -n
  [[ -n "$other_lines" ]] && printf '%s' "$other_lines" | sort
}

# Join lines with ", " separator
join_lines() {
  awk 'NR>1{printf ", "}{printf "%s",$0}END{printf "\n"}'
}

# Extract unique snapshot IDs (numeric), sorted ascending
extract_snapshot_ids() {
  local content="$1"
  printf '%s' "$content" \
    | sed -n 's/.*\[本地快照\](http:\/\/localhost:7026\/reading\/\([0-9]*\)).*/\1/p' \
    | sort -u -n | join_lines
}

# Extract unique source URLs, preserving order of first appearance
extract_source_urls() {
  local content="$1"
  printf '%s' "$content" \
    | sed -n 's/.*\[原文地址\](\(https\{0,1\}:\/\/[^)]*\)).*/\1/p' \
    | awk '!seen[$0]++' | join_lines
}

# ── Per-directory processing ────────────────────────────────────────────────

generate_for_dir() {
  local dir_path="$1"
  local dir_name="$2"
  local out=""

  local stems
  stems=$(sorted_md_files "$dir_path")
  [[ -z "$stems" ]] && return 1

  while IFS= read -r stem; do
    local file="$dir_path/${stem}.md"
    [[ -f "$file" ]] || continue

    local content
    content=$(<"$file")

    local ids
    ids=$(extract_snapshot_ids "$content")

    if [[ -n "$ids" ]]; then
      out+="@${stem}: ${ids}"$'\n'
    else
      local urls
      urls=$(extract_source_urls "$content")
      if [[ -n "$urls" ]]; then
        out+="@${stem}: ${urls}"$'\n'
      fi
    fi
  done <<< "$stems"

  [[ -z "$out" ]] && return 1

  printf '%s' "$out" > "$dir_path/index_map.txt"
  echo "[ok]   ${dir_name} → index_map.txt"
}

# ── Main ─────────────────────────────────────────────────────────────────────

if [[ "$mode" == "all" ]]; then
  dirs=()
  for d in "$RAW_DIR"/*/; do
    [[ -d "$d" ]] && dirs+=("${d%/}")
  done
else
  dirs=()
  for t in "${targets[@]}"; do
    dirs+=("$RAW_DIR/$t")
  done
fi

for dir_path in "${dirs[@]}"; do
  dir_name="${dir_path##*/}"
  if [[ ! -d "$dir_path" ]]; then
    echo "[skip] ${dir_name}: not a directory" >&2
    continue
  fi
  if ! generate_for_dir "$dir_path" "$dir_name"; then
    echo "[skip] ${dir_name}: no .md files with sources" >&2
  fi
done
