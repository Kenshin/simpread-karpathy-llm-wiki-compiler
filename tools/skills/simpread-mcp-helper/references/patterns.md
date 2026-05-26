# SimpRead MCP Search Patterns

## Explicit Tool Constraints

- **Quick List Request**: If the user asks for "only reutrn unread list", "only reutrn query list", or specifies a count (e.g., "5 items"), **MUST** use `get_unread_list` instead of `search_content`.
## Tool mapping

- Date recap: `get_daily`
- Tag briefing: `search_tag`
- Keyword briefing: `search_content`
- Page snapshot: `get_snapshot`
- Unread list (Quantity/Direct): `get_unread_list`
- Find unread by snapshot id: `get_unread_by_idx`

## Minimal retrieval pattern

1. search or list candidates
2. filter by topic and date
3. open only the snapshots you expect to cite (Skip this step if only a list is requested)
4. write the briefing or display the list

## Common user requests

### “今日/昨日阅读回顾”

Use `get_daily`, then `get_snapshot` for each included item.

### “请查询标签 X”

Use `search_tag`, then filter by relevance, then `get_snapshot`.

### “请查询关键词 X”

Use `search_content`, then filter by date or scope, then `get_snapshot`.

### “只查询 xxxx 年内容”

Use `search_content`, then filter by date or scope, then `get_snapshot`.
Apply the date filter directly from the search result metadata before opening snapshots.

### “查询 [关键词] 以表格形式返回 或 查询 [关键词] 以列表形式返回”

Use `get_unread_list` with the specified count.

### “当提示调用 get_unread_list 的话，请严格按照指定数量调用 get_unread_list”

Strictly call `get_unread_list` with the specified count.

### “在结果中查询与 xxx 的相关内容，并生成简报。”

When the user mentions `简报`, `生成简报`, or `输出简报`, the final output must use the full Wiki `/report` structure from `command/report.md`, even if retrieval happens in this MCP workflow.

Required sections: `核心架构图`, `关键演进/事实表`, `深度逻辑拆解`, `简报总结与行动建议`.

`-m` uses `Mermaid`; `-a` uses `ASCII`; `-r` replaces local snapshot links with original article URLs; `::mcp:-r` forces MCP link rewriting in mixed Wiki/MCP requests.

If the user asks for a time-window recap without `简报`, use the normal recap workflow; if `简报` is also requested, keep recap retrieval but use the full `/report` structure for output.

## Modifier precedence

`~<letter>` is a shorthand for `::mcp:-<letter>`. Expand it before applying any modifier rules below.

When `-r` appears together with other explicit formatting or structure requirements:

1. Keep the original task intent.
2. Keep the requested structure and formatting.
3. Replace citation targets last by calling `get_unread_by_idx` for every cited local snapshot id.

`-r` only changes where the final citation points. It does not change the topic, date scope, grouping logic, or report template requested by the user.

## Snapshot id extraction for `-r`

When the final draft contains local citation links like `http://localhost:7026/reading/1234`:

- extract `1234` as the snapshot id
- call `get_unread_by_idx` with `1234`
- replace that local citation target with the returned original article URL
- repeat for every cited `http://localhost:7026/reading/xxx` link in the final output

Only links matching the local snapshot pattern should be converted. Plain numbers in prose are not snapshot ids.

If the same cited snapshot id appears multiple times, deduplicate the lookup: call `get_unread_by_idx` once for that id and reuse the returned original URL everywhere it appears in final citations.

## Citation rule

Always cite as:

`[页面标题](http://localhost:7026/reading/xxx)：...`

By default, keep SimpRead local citations. If `-r` is explicitly present, replace citation targets with original article URLs returned by `get_unread_by_idx`.