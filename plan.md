- [x] 初始化 Vite + React + TypeScript 项目
- [x] 配置 Tailwind CSS 基础样式
- [x] 搭建 AdminLayout（Sidebar + Header）
- [x] 实现 Dashboard 页面
- [x] 实现 Free Trials 页面
- [x] 实现 Enrolments 页面
- [x] 实现 Class Scheduling 页面
- [x] 编写通用组件（StatusBadge、EntityDrawer、Toast）
- [x] 准备 mock 数据与基础交互
- [ ] 完成 Free Trial 预约流程
- [ ] 新增 Internship 管理模块
- [ ] 本地运行并做快速视觉检查

请为 Cirkidz（南澳一家教授马戏与杂技课程的非营利机构）设计一套极简的**员工端后台网页（Admin Portal）** 前端 demo。目标是用最少的代码展示核心业务场景，所有数据均来自前端 hard-coded mock，无需连接数据库或真实 API。

---

### 一、技术栈与运行方式

- **前端框架**：React + TypeScript（推荐使用 Vite 创建项目）
- **样式方案**：Tailwind CSS
- **图标**：可选 Heroicons，避免额外依赖亦可
- **状态管理**：React 本地状态 + 简单自定义 hooks（无需引入复杂库）

本地运行只需：

```bash
npm install
npm run dev
```

---

### 二、信息架构与导航

保持单层级左侧导航栏（Sidebar），包含以下六个核心页面，顶部再配一个极简 Header（显示当前用户和一个占位按钮）：

1. **Dashboard** – 摘要总览
2. **Free Trials** – 免费体验课报名管理
3. **Trial Scheduling** – 免费体验课预约与跟进
4. **Enrolments** – 正式付费学员管理
5. **Class Scheduling** – 简化课程排班视图
6. **Internships** – 实习安排与跟踪

如需后续扩展，可在导航底部预留一个 “Settings / Future” 占位链接即可，无需实现内容。

---

### 三、页面功能与布局（简化版本）

#### 1. Dashboard

目标：开屏即见关键数字。

布局建议：
- 顶部四张统计卡片（本周 Free Trials 数、待跟进 Leads、活跃学员数、今日课程数）。
- 一块“即将到来的课程”列表（3–4 条 mock 数据）。
- 一块“近期 Free Trial 跟进”列表（展示状态标签 + 负责人）。

全部数据可直接写在组件内或从 `mock/dashboard.ts` 导入。

#### 2. Free Trials

唯一需要的核心表格页面，字段尽量精简：
- `Student`, `Contact`, `Preferred Class`, `Status`, `Owner`, `Created`

功能：
- 顶部：搜索输入框 + 状态筛选下拉 + “Add Lead” 按钮（点击弹出简易表单 Modal，表单字段只含姓名、联系方式、课程、负责人、状态）。
- 表格行操作：`View`（右侧 Drawer 打开详情）与 `Convert`（直接在前端更改状态并触发 Toast）。
- Drawer 内展示基础信息 + 一段备注文本，无需时间线。
- 行内新增 `Schedule Trial` 按钮，点击后弹出预约表单，可在前端创建预约记录并同步到 Trial Scheduling 页面。

#### 3. Trial Scheduling

承接 Free Trials 的预约动作，确保销售跟进有明确排期：

- 顶部过滤器：`Date Range / Week`（简单周切换）、`Coach`、`Location`、`Lead Owner`。
- 主体：按日期或教练分组的预约卡片，每张卡展示 `Lead/Student`, `Preferred Class`, `Scheduled Slot`, `Owner`, `Status`。
- 操作：
  - `Confirm Attendance` / `Reschedule` / `Mark No-show`（更新本地状态 + Toast）。
  - 支持快捷备注输入，可在卡片底部提供折叠文本框。
- 预约状态变更需回写到 Free Trials 数据源，体验成功后可一键“Convert to Enrolment”。

#### 4. Enrolments

用一个精简表格展示正式学员：
- `Student`, `Program`, `Enrolment Date`, `Status`, `Next Payment`

功能：
- 顶部：状态筛选 + “Add Enrolment” 按钮（复用 Free Trials 的表单结构，字段略调）。
- 行操作：`View`（复用 Drawer 组件）与 `Pause/Resume`（前端直接切换状态，对应 Toast 提示）。

#### 5. Class Scheduling

避免复杂日历，改用列表 + 分组呈现：
- 顶部过滤器：`Week Selector`（简单按钮切换 mock 周份）+ `Coach` 下拉 + `Location` 下拉
- 主体：按课程分组的卡片列表，每张卡展示 `Class Name`, `Schedule`, `Coach`, `Location`, `Enrolled/Capacity`
- 每张卡只保留两个操作按钮：`Assign Students`（弹出带多选 checkbox 的简单 Modal）与 `Edit`（弹出简短表单，修改教练/地点）

#### 6. Internships

用于管理员工/志愿者实习安排，结构参考 Enrolments 与 Class Scheduling 的组合：

- 顶部过滤器：`Program`, `Mentor`, `Location`, `Status`。
- 列表字段：`Intern`, `Program`, `Placement Dates`, `Mentor`, `Hours Completed`, `Status`。
- 行操作：
  - `View`（复用 `EntityDrawer`，额外显示实习目标、导师反馈）。
  - `Log Hours`（弹出表单增减工时，更新 `Hours Completed`）。
  - `Assign Mentor` / `Update Placement`（简洁弹窗调整导师或场地）。
- 页面内可提供一个 `Upcoming Check-ins` 面板，提醒即将到期的导师回访。

---

### 四、通用组件（保持精简）

实施三个即可：
1. `StatusBadge` – 根据状态名称映射颜色，覆盖 Free Trials、Trial Scheduling 与 Enrolments。
2. `EntityDrawer` – 右侧抽屉展示学生/报名详情或实习记录，接受通用 props（标题、字段数组、备注文本）。
3. `AssignmentModal` – 用于安排体验课、指派教练/导师、记录实习工时，可通过 props 控制表单字段与确认回调。

此外提供一个轻量 `useToast` hook + `ToastProvider`，支持成功/失败两种样式即可。

---

### 五、目录结构建议

```
src/
  components/
    StatusBadge.tsx
    EntityDrawer.tsx
    AssignmentModal.tsx
    ToastProvider.tsx
  layouts/
    AdminLayout.tsx
  pages/
    Dashboard.tsx
    FreeTrials.tsx
    TrialScheduling.tsx
    Enrolments.tsx
    ClassScheduling.tsx
    Internships.tsx
  data/
    dashboard.ts
    freeTrials.ts
    trialScheduling.ts
    enrolments.ts
    classes.ts
    internships.ts
  hooks/
    useToast.ts
  App.tsx
  main.tsx
```

每个页面文件控制在 150 行以内，尽量通过拆分小组件、使用数据映射渲染来减少重复代码。

---

### 六、交互与样式约束

- 布局适配 1280px 桌面视口；响应式仅需保证在 1024px 仍可使用（可通过单列堆叠实现）。
- Tailwind 类命名保持一致，卡片使用统一的 `bg-white rounded-lg shadow-sm p-4` 风格。
- 所有按钮使用同一套 `Button` 样式（可直接写在页面或提取简单组件），状态区分采用 `variant="primary" | "secondary" | "ghost"`。
- Toast 自动 3 秒消失，可堆叠。

---

### 七、演示及扩展提示

- Demo 中的所有“保存/转换/指派”操作只需更新本地 state 并触发 Toast。
- 若未来需要接入后端，可将 `data/` 目录替换为 API 请求层，再逐步落地真实逻辑。
- 保留每个页面顶部的描述性文本（20–30 字），说明这是 mock 数据；有助于产品/客户理解。
- 可在 Trial Scheduling 与 Internships 页面预留导出按钮或报表入口，方便后续对接 CRM / HR 系统。

---

基于以上精简方案，即可快速实现一个轻量、易维护的 Admin Portal demo，既覆盖 Cirkidz 的核心流程，也方便后续迭代接入真实服务。
