# lite-diagrams.md — `--lite` 图表组件规范

本文件定义 `--lite` 模式下可用的 8 种 SVG 图表组件。所有图表使用 `lite.html` 的 CSS token，独立于 kami。

## 使用规则

1. **选用依据**：根据 Wiki 正文中的数据特征选择最匹配的图表类型
2. **嵌入方式**：将 SVG 代码块放入 `<figure>` 容器，附 `<figcaption>` 说明
3. **数据填充**：仅修改 `<!-- DATA START -->` 与 `<!-- DATA END -->` 之间的内容
4. **坐标约束**：所有坐标、宽度、间距必须为 4 的倍数
5. **颜色**：主色 `#1B365D`，辅色 `#504e49` → `#6b6a64` → `#b8b7b0` → `#d4d3cd` → `#EEF2F7`
6. **字体**：SVG 内文本使用 `font-family="LXGW WenKai, Source Han Serif SC, Noto Serif SC, Songti SC, Georgia, serif"`
7. **与正文并存**：当数据条目过多时（如 50+ 个时间线事件），选取 8-10 个关键条目生成图表，完整数据保留为 HTML 表格

## 选用速查

| 数据特征 | 图表 | 典型场景 |
|----------|------|----------|
| 时间轴 + 里程碑事件 | Timeline | 品牌发展历程、历史节点 |
| 分类对比（2-8 项） | Bar Chart | 营收对比、市场份额 |
| 占比分布（≤6 项） | Donut Chart | 营收结构、需求占比 |
| 趋势数据（多时间点） | Line Chart | 金价走势、增长曲线 |
| 两轴定位（2×2） | Quadrant | 品牌战略定位 |
| 层级关系（≥2 层） | Tree | 品牌体系、组织架构 |
| 正负贡献求和 | Waterfall | 利润分解、收入桥 |
| 集合交集（2-3 组） | Venn | 用户重合度 |

---

## 1. Timeline（时间线）

**适用**：品牌发展历程、关键事件时间轴、产品迭代历史。

**选取规则**：数据条目 ≤12 时全量展示；>12 时选取关键里程碑 8-10 个。

```html
<figure>
  <svg viewBox="0 0 720 {{HEIGHT}}" xmlns="http://www.w3.org/2000/svg">
    <!-- 主轴线 -->
    <line x1="80" y1="32" x2="80" y2="{{BOTTOM}}" stroke="#1B365D" stroke-width="2"/>
    <!-- DATA START -->
    <!-- 每个节点：修改 y 坐标（间距 72px）、日期文本、描述文本 -->
    <circle cx="80" cy="32" r="6" fill="#1B365D"/>
    <text x="100" y="28" font-size="13" font-weight="600" fill="#1B365D" font-family="LXGW WenKai, Source Han Serif SC, serif">{{日期}}</text>
    <text x="100" y="48" font-size="11" fill="#5A5A5A" font-family="LXGW WenKai, Source Han Serif SC, serif">{{描述}}</text>
    <!-- 重复上述 3 行，cy 每次 +72 -->
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**修改点**：
- `viewBox` 的 `{{HEIGHT}}`：32 + 节点数 × 72
- `{{BOTTOM}}`：最后一个节点的 cy + 16
- 每组 `<circle>` + `<text>` 的 `cy` / `y` 值
- 高亮节点：`fill="#C49A6C"`（accent 色）

---

## 2. Bar Chart（柱状图）

**适用**：品牌营收对比、市场份额对比、财务指标横向比较。

**容量**：最多 8 组 × 3 系列。

```html
<figure>
  <svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg">
    <!-- Y 轴 -->
    <line x1="120" y1="20" x2="120" y2="310" stroke="#D6CFC3" stroke-width="1"/>
    <!-- X 轴 -->
    <line x1="120" y1="310" x2="680" y2="310" stroke="#D6CFC3" stroke-width="1"/>
    <!-- DATA START -->
    <!-- 每组柱子：修改 x、y、height、文本 -->
    <!-- 柱宽 48px，组间距 20px，起始 x=140 -->
    <rect x="140" y="{{BAR_Y}}" width="48" height="{{BAR_H}}" fill="#1B365D" rx="2"/>
    <text x="164" y="330" text-anchor="middle" font-size="10" fill="#5A5A5A" font-family="LXGW WenKai, Source Han Serif SC, serif">{{标签}}</text>
    <text x="164" y="{{BAR_Y-6}}" text-anchor="middle" font-size="9" fill="#1B365D" font-family="LXGW WenKai, Source Han Serif SC, serif">{{数值}}</text>
    <!-- DATA END -->
    <!-- Y 轴刻度（可选） -->
    <text x="110" y="314" text-anchor="end" font-size="9" fill="#6b6a64">0</text>
    <text x="110" y="{{TOP}}" text-anchor="end" font-size="9" fill="#6b6a64">{{最大值}}</text>
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**修改点**：
- `{{BAR_Y}}`：310 - (数值 / 最大值 × 280)
- `{{BAR_H}}`：数值 / 最大值 × 280
- 每组 x 偏移：140 + 组索引 × 68

---

## 3. Donut Chart（环形图）

**适用**：营收结构、市场需求占比、用户分布（≤6 段）。

```html
<figure>
  <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg">
    <!-- DATA START -->
    <!-- 每段弧线：修改 stroke-dasharray 和 stroke-dashoffset -->
    <!-- 圆心 (180,150)，半径 100，周长 628.32 -->
    <circle cx="180" cy="150" r="100" fill="none" stroke="#1B365D" stroke-width="40"
            stroke-dasharray="{{LEN}} {{REMAIN}}" stroke-dashoffset="0"/>
    <!-- 重复，每段 offset 累加 -->
    <!-- DATA END -->
    <!-- 中心文字 -->
    <text x="180" y="145" text-anchor="middle" font-size="20" font-weight="600" fill="#1B365D" font-family="LXGW WenKai, serif">{{中心数值}}</text>
    <text x="180" y="168" text-anchor="middle" font-size="10" fill="#5A5A5A" font-family="LXGW WenKai, serif">{{中心标签}}</text>
    <!-- 图例 -->
    <!-- DATA START -->
    <rect x="310" y="{{LEGEND_Y}}" width="10" height="10" fill="#1B365D" rx="2"/>
    <text x="326" y="{{LEGEND_Y+9}}" font-size="10" fill="#2C2C2C" font-family="LXGW WenKai, serif">{{标签}} {{百分比}}%</text>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**计算公式**：
- 每段长度 = 百分比 / 100 × 628.32
- `stroke-dasharray` = `"{长度} {周长-长度}"`
- `stroke-dashoffset` = 前面所有段长度之和的负值

---

## 4. Line Chart（折线图）

**适用**：时间趋势（金价走势、营收增长、用户增长）。

**容量**：最多 12 个数据点 × 3 条线。

```html
<figure>
  <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
    <!-- 网格线 -->
    <line x1="80" y1="280" x2="680" y2="280" stroke="#EAE4D9" stroke-width="0.5"/>
    <line x1="80" y1="200" x2="680" y2="200" stroke="#EAE4D9" stroke-width="0.5"/>
    <line x1="80" y1="120" x2="680" y2="120" stroke="#EAE4D9" stroke-width="0.5"/>
    <line x1="80" y1="40" x2="680" y2="40" stroke="#EAE4D9" stroke-width="0.5"/>
    <!-- DATA START -->
    <!-- 折线路径 -->
    <polyline points="{{X1,Y1}} {{X2,Y2}} {{X3,Y3}}" fill="none" stroke="#1B365D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- 数据点 -->
    <circle cx="{{X1}}" cy="{{Y1}}" r="4" fill="#1B365D"/>
    <!-- X 轴标签 -->
    <text x="{{X1}}" y="298" text-anchor="middle" font-size="9" fill="#6b6a64" font-family="LXGW WenKai, serif">{{标签}}</text>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**坐标映射**：
- X：80 + 索引 × (600 / (数据点数-1))
- Y：280 - (值 - 最小值) / (最大值 - 最小值) × 240

---

## 5. Quadrant（象限图）

**适用**：品牌定位对比（如高端/平价 × 直营/加盟）。

```html
<figure>
  <svg viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
    <!-- 坐标轴 -->
    <line x1="260" y1="30" x2="260" y2="390" stroke="#D6CFC3" stroke-width="1"/>
    <line x1="30" y1="210" x2="490" y2="210" stroke="#D6CFC3" stroke-width="1"/>
    <!-- 轴标签 -->
    <text x="260" y="18" text-anchor="middle" font-size="10" fill="#6b6a64" font-family="LXGW WenKai, serif">{{上标签}}</text>
    <text x="260" y="408" text-anchor="middle" font-size="10" fill="#6b6a64" font-family="LXGW WenKai, serif">{{下标签}}</text>
    <text x="18" y="214" text-anchor="start" font-size="10" fill="#6b6a64" font-family="LXGW WenKai, serif">{{左标签}}</text>
    <text x="502" y="214" text-anchor="end" font-size="10" fill="#6b6a64" font-family="LXGW WenKai, serif">{{右标签}}</text>
    <!-- DATA START -->
    <!-- 每个实体：修改 cx, cy, 文本 -->
    <circle cx="{{CX}}" cy="{{CY}}" r="28" fill="#1B365D" opacity="0.15" stroke="#1B365D" stroke-width="1.5"/>
    <text x="{{CX}}" y="{{CY+4}}" text-anchor="middle" font-size="10" font-weight="600" fill="#1B365D" font-family="LXGW WenKai, serif">{{名称}}</text>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**坐标映射**：
- 左上 (60,50) → 右下 (460,370)
- CX = 60 + (X 值 / X 最大值) × 400
- CY = 50 + (Y 值 / Y 最大值) × 320（注意 Y 轴向下）

---

## 6. Tree（树状图）

**适用**：品牌体系、组织架构、层级关系。

```html
<figure>
  <svg viewBox="0 0 720 {{HEIGHT}}" xmlns="http://www.w3.org/2000/svg">
    <!-- DATA START -->
    <!-- 根节点 -->
    <rect x="{{RX}}" y="20" width="120" height="36" rx="6" fill="#1B365D"/>
    <text x="{{RX+60}}" y="43" text-anchor="middle" font-size="12" font-weight="600" fill="#fff" font-family="LXGW WenKai, serif">{{根节点}}</text>
    <!-- 连线 -->
    <line x1="{{RX+60}}" y1="56" x2="{{CX}}" y2="90" stroke="#D6CFC3" stroke-width="1.5"/>
    <!-- 子节点 -->
    <rect x="{{CX-60}}" y="90" width="120" height="36" rx="6" fill="#FAF6EF" stroke="#1B365D" stroke-width="1"/>
    <text x="{{CX}}" y="113" text-anchor="middle" font-size="11" fill="#2C2C2C" font-family="LXGW WenKai, serif">{{子节点}}</text>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**布局规则**：
- 根节点居中
- 子节点水平均匀分布，垂直间距 72px
- 节点宽度 120px，间距 ≥ 16px

---

## 7. Waterfall（瀑布图）

**适用**：利润分解、收入桥、成本构成（含正负贡献）。

```html
<figure>
  <svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg">
    <!-- 基线 -->
    <line x1="80" y1="280" x2="680" y2="280" stroke="#EAE4D9" stroke-width="0.5"/>
    <!-- DATA START -->
    <!-- 每个柱子：正值绿色 #5C8A6B，负值红色 #B85C5C，累计 #1B365D -->
    <rect x="{{X}}" y="{{Y}}" width="56" height="{{H}}" fill="{{COLOR}}" rx="2"/>
    <text x="{{X+28}}" y="{{LABEL_Y}}" text-anchor="middle" font-size="9" fill="#2C2C2C" font-family="LXGW WenKai, serif">{{标签}}</text>
    <text x="{{X+28}}" y="{{VALUE_Y}}" text-anchor="middle" font-size="9" fill="{{COLOR}}" font-family="LXGW WenKai, serif">{{数值}}</text>
    <!-- 连接线 -->
    <line x1="{{X+56}}" y1="{{CONNECT_Y}}" x2="{{NEXT_X}}" y2="{{CONNECT_Y}}" stroke="#D6CFC3" stroke-width="1" stroke-dasharray="4,3"/>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

---

## 8. Venn（维恩图）

**适用**：用户重合度、功能交集、集合关系（2-3 组）。

```html
<figure>
  <svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg">
    <!-- DATA START -->
    <!-- 两圆：修改 cx, cy, r 和文本 -->
    <circle cx="200" cy="160" r="120" fill="#1B365D" opacity="0.12" stroke="#1B365D" stroke-width="1.5"/>
    <circle cx="320" cy="160" r="120" fill="#C49A6C" opacity="0.12" stroke="#C49A6C" stroke-width="1.5"/>
    <!-- 标签 -->
    <text x="140" y="160" text-anchor="middle" font-size="13" font-weight="600" fill="#1B365D" font-family="LXGW WenKai, serif">{{左标签}}</text>
    <text x="380" y="160" text-anchor="middle" font-size="13" font-weight="600" fill="#C49A6C" font-family="LXGW WenKai, serif">{{右标签}}</text>
    <!-- 交集 -->
    <text x="260" y="155" text-anchor="middle" font-size="14" font-weight="600" fill="#2C2C2C" font-family="LXGW WenKai, serif">{{交集数值}}</text>
    <text x="260" y="175" text-anchor="middle" font-size="9" fill="#5A5A5A" font-family="LXGW WenKai, serif">{{交集标签}}</text>
    <!-- DATA END -->
  </svg>
  <figcaption>{{图表说明}}</figcaption>
</figure>
```

**三组时**：增加第三个圆，调整透明度和位置形成三重重叠。

---

## 暗色模式适配

所有图表颜色使用 CSS 变量引用时需注意：SVG 内联样式不支持 `var()`。暗色模式下的处理方式：

1. 图表颜色保持不变（深色在暗色背景下仍可读）
2. 背景色由父容器（`.kg-container`、`<figure>`）的 CSS 变量自动适配
3. 文本颜色如需调整，在 `<style>` 中用 `[data-theme="dark"] svg text` 覆盖
