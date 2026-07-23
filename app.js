const STORAGE_KEY = "ai_relationship_butler_state_v1";

const defaultState = {
  route: "network",
  viewMode: "graph",
  themeMode: "light",
  offlineMode: true,
  networkActivityCollapsed: false,
  focusCategoryId: null,
  selectedCategoryId: "all",
  selectedPersonId: "p_zhang",
  dialogueMode: "incoming",
  dialogueOpponentText: "",
  dialogueEditingOpponent: false,
  dialogueOpeningText: "",
  dialogueSentReply: "",
  dialogueSelectedReply: "",
  dialogueDraftOptions: [],
  dialogueDraftAnimated: false,
  dialogueTyping: "",
  dialogueAnalysis: "",
  dialogueIntentInput: "",
  dialogueIntentAnalysis: "",
  dialogueEditingMessageId: "",
  pendingMemoryDraft: null,
  pendingChatImport: null,
  manageFilters: {
    keyword: "",
    importance: "all",
    sort: "recent"
  },
  manualSchedules: [],
  lastBackupAt: "",
  autoAiReply: true,
  aiConfig: {
    enabled: false,
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash",
    apiKey: "",
    preset: "deepseek"
  },
  editingPersonId: null,
  userProfile: {
    displayName: "我",
    role: "",
    goals: "",
    notes: ""
  },
  categories: [
    { id: "work", name: "同事", description: "当前公司的领导、同部门、跨部门协作者" },
    { id: "friends", name: "朋友", description: "朋友、同好、社群伙伴" },
    { id: "family", name: "亲人", description: "父母、亲戚、伴侣相关关系" },
    { id: "clients", name: "客户", description: "客户、合作方、外部资源" },
    { id: "former", name: "上一家公司", description: "前同事、前领导、老合作关系" },
    { id: "school", name: "同学", description: "小学、初中、高中、大学、培训班同学" }
  ],
  people: [
    {
      id: "p_zhang",
      name: "张总",
      categoryId: "work",
      relation: "直属领导",
      importance: "高",
      context: {
        roleWeight: "关键决策者",
        closeness: "正式工作关系",
        contactFrequency: "高频同步",
        background: "直属领导，负责目标、进度、风险判断和资源协调，对项目结果有直接影响。"
      },
      personality: "重结果、重风险控制，喜欢先听结论，再听需要协调的资源。",
      notes: "汇报要短，先给结论，不要直接承诺不确定的截止时间。",
      profile: {
        communication: "结果导向，偏正式，耐心有限。",
        work: "关注目标、进度、风险和资源调配。",
        goodwill: "提前暴露风险，带着方案寻求支持。",
        avoid: "长篇解释、模糊承诺、把问题拖到最后才说。"
      },
      memories: [
        {
          title: "默认画像",
          text: "适合用“结论-风险-需要支持”的三段式沟通。"
        }
      ]
    },
    {
      id: "p_li",
      name: "李经理",
      categoryId: "work",
      relation: "跨部门平级",
      importance: "中",
      context: {
        roleWeight: "重要协作者",
        closeness: "工作协作",
        contactFrequency: "按项目沟通",
        background: "跨部门协作对象，沟通中需要明确边界、流程和责任归属。"
      },
      personality: "谨慎，重流程和书面确认，对责任边界比较敏感。",
      notes: "沟通时先确认共识，再写清楚边界和下一步。",
      profile: {
        communication: "礼貌但谨慎，倾向留痕。",
        work: "看重流程、排期和责任归属。",
        goodwill: "提前同步上下文，并给出明确时间点。",
        avoid: "口头拍板、突然甩需求、模糊责任。"
      },
      memories: []
    },
    {
      id: "p_wang",
      name: "王姐",
      categoryId: "friends",
      relation: "老朋友",
      importance: "中",
      context: {
        roleWeight: "重要私人关系",
        closeness: "比较亲近",
        contactFrequency: "不定期联系",
        background: "老朋友，关系基础较好，更重视自然、真诚和持续的情绪回应。"
      },
      personality: "重情绪回应，喜欢被认真倾听，也很在意细节。",
      notes: "不要太快给建议，先接住情绪，再慢慢讨论事情。",
      profile: {
        communication: "温和、情绪细腻，喜欢自然一点的表达。",
        work: "生活话题多，决策会看感受和安全感。",
        goodwill: "记得她之前提过的小事，回复里有具体关心。",
        avoid: "敷衍、冷处理、上来就讲道理。"
      },
      memories: []
    },
    {
      id: "p_chen",
      name: "陈叔",
      categoryId: "family",
      relation: "父亲亲戚",
      importance: "低",
      context: {
        roleWeight: "家庭关系",
        closeness: "有辈分距离",
        contactFrequency: "低频往来",
        background: "父亲一侧亲戚，沟通需要保留礼貌和尊重，敏感话题尽量降低对抗性。"
      },
      personality: "讲话直接，喜欢传统礼貌和明确态度。",
      notes: "用词稳重，少开玩笑，遇到敏感话题尽量转到事实层面。",
      profile: {
        communication: "直接，重辈分和礼貌。",
        work: "更相信经验和熟人背书。",
        goodwill: "主动问候，表达尊重和感谢。",
        avoid: "过度争辩、态度轻飘、临时爽约。"
      },
      memories: []
    }
  ],
  lessons: [
    "对模棱两可的话，先判断对方是在要承诺、要态度，还是要信息。",
    "面对权力更高的人，优先回复确定性和下一步，不急着解释全部过程。"
  ]
};

let lastStateLoadError = "";
let state = normalizeAppState(resetLoadedDialogueSimulation(loadState()));
let sessionDialogueMessages = new Map();
let lastGraphNodes = new Map();
let personFocusTimer = null;
let pendingDeletePersonId = null;
let graphRenderToken = 0;
let lastStateSaveError = "";
const graphNodeExitTimers = new Map();
const graphEdgeTimers = new Map();
const presetPersonIds = new Set(defaultState.people.map((person) => person.id));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  workspace: $(".workspace"),
  themeToggle: $("#themeToggle"),
  pageTitle: $("#pageTitle"),
  currentScope: $("#currentScope"),
  networkView: $("#networkView"),
  manageView: $("#manageView"),
  personView: $("#personView"),
  dialogueView: $("#dialogueView"),
  scheduleView: $("#scheduleView"),
  settingsView: $("#settingsView"),
  nodeLayer: $("#nodeLayer"),
  edgeLayer: $("#edgeLayer"),
  networkHint: $("#networkHint"),
  networkActivityPanel: $("#networkActivityPanel"),
  networkCalendarPanel: $("#networkCalendarPanel"),
  categoryRail: $("#categoryRail"),
  personCategoryRail: $("#personCategoryRail"),
  directoryTitle: $("#directoryTitle"),
  manageCategoryEditor: $("#manageCategoryEditor"),
  manageSearchInput: $("#manageSearchInput"),
  manageImportanceFilter: $("#manageImportanceFilter"),
  manageSortSelect: $("#manageSortSelect"),
  personGrid: $("#personGrid"),
  personDetail: $("#personDetail"),
  dialoguePersonSelect: $("#dialoguePersonSelect"),
  dialogueHistoryList: $("#dialogueHistoryList"),
  dialogueSearchInput: $("#dialogueSearchInput"),
  dialogueChatTitle: $("#dialogueChatTitle"),
  dialogueChatMeta: $("#dialogueChatMeta"),
  autoReplyToggle: $("#autoReplyToggle"),
  composerHint: $("#composerHint"),
  chatThread: $("#chatThread"),
  dialogueInput: $("#dialogueInput"),
  replyOptions: $("#replyOptions"),
  customReply: $("#customReply"),
  analysisBox: $("#analysisBox"),
  analysisTitle: $("#analysisTitle"),
  memoryNote: $("#memoryNote"),
  todoList: $("#todoList"),
  lessonList: $("#lessonList"),
  weeklyPlan: $("#weeklyPlan"),
  scheduleDate: $("#scheduleDate"),
  scheduleForm: $("#scheduleForm"),
  monthCalendar: $("#monthCalendar"),
  categoryEditor: $("#categoryEditor"),
  aiEnabledToggle: $("#aiEnabledToggle"),
  aiProviderSelect: $("#aiProviderSelect"),
  aiModelInput: $("#aiModelInput"),
  aiBaseUrlInput: $("#aiBaseUrlInput"),
  aiApiKeyInput: $("#aiApiKeyInput"),
  aiConfigStatus: $("#aiConfigStatus"),
  importMemoryInput: $("#importMemoryInput"),
  memoryStatus: $("#memoryStatus"),
  storageLocation: $("#storageLocation"),
  diagnosticsPanel: $("#diagnosticsPanel"),
  offlineModeToggle: $("#offlineModeToggle"),
  personModal: $("#personModal"),
  personForm: $("#personForm"),
  personModalTitle: $("#personModalTitle"),
  profileModal: $("#profileModal"),
  profileForm: $("#profileForm"),
  deletePersonModal: $("#deletePersonModal"),
  deletePersonName: $("#deletePersonName"),
  cancelDeletePerson: $("#cancelDeletePerson"),
  cancelDeletePersonTop: $("#cancelDeletePersonTop"),
  confirmDeletePerson: $("#confirmDeletePerson")
};

function loadState() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    const saved = JSON.parse(rawState);
    if (!saved) return structuredClone(defaultState);
    return sanitizeLoadedDialogueHistory({
      ...structuredClone(defaultState),
      ...saved,
      userProfile: {
        ...structuredClone(defaultState.userProfile),
        ...(saved.userProfile || {})
      },
      aiConfig: {
        ...structuredClone(defaultState.aiConfig),
        ...(saved.aiConfig || {})
      },
      categories: saved.categories?.length ? saved.categories : defaultState.categories,
      people: Array.isArray(saved.people) ? saved.people : defaultState.people
    });
  } catch (error) {
    lastStateLoadError = error?.message || "本地缓存读取失败";
    backupCorruptedState();
    return structuredClone(defaultState);
  }
}

function backupCorruptedState() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) return;
    const backupKey = `${STORAGE_KEY}_corrupted_${new Date().toISOString().replace(/[:.]/g, "-")}`;
    localStorage.setItem(backupKey, rawState);
  } catch {
    // If localStorage itself is unavailable, the visible diagnostics will carry the load error.
  }
}

function sanitizeLoadedDialogueHistory(loaded) {
  const simulatedLabels = new Set(["AI预测", "对方回应", "我方开场", "对方所说"]);
  loaded.people = (loaded.people || []).map((person) => ({
    ...person,
    chatHistory: Array.isArray(person.chatHistory)
      ? person.chatHistory.filter((message) => message.savedAt || !simulatedLabels.has(message.label || ""))
      : []
  }));
  return loaded;
}

function resetLoadedDialogueSimulation(loaded) {
  return {
    ...loaded,
    dialogueOpponentText: "",
    dialogueEditingOpponent: false,
    dialogueOpeningText: "",
    dialogueSentReply: "",
    dialogueSelectedReply: "",
    dialogueDraftOptions: [],
    dialogueDraftAnimated: false,
    dialogueTyping: "",
    dialogueAnalysis: "",
    dialogueIntentAnalysis: "",
    dialogueEditingMessageId: "",
    dialogueAnimatedMessageId: ""
  };
}

function normalizeAppState(candidate = {}) {
  const normalized = {
    ...structuredClone(defaultState),
    ...(candidate || {}),
    userProfile: {
      ...structuredClone(defaultState.userProfile),
      ...(candidate?.userProfile || {})
    },
    aiConfig: {
      ...structuredClone(defaultState.aiConfig),
      ...(candidate?.aiConfig || {})
    }
  };

  const usedCategoryIds = new Set();
  normalized.categories = Array.isArray(candidate.categories) && candidate.categories.length
    ? candidate.categories
        .filter((category) => category && (category.id || category.name))
        .map((category, index) => ({
          id: uniqueStateId(category.id || `category_${index}`, usedCategoryIds, "category"),
          name: String(category.name || "未命名分类"),
          description: String(category.description || "")
        }))
    : structuredClone(defaultState.categories);
  if (!normalized.categories.length) normalized.categories = structuredClone(defaultState.categories);

  const categoryIds = new Set(normalized.categories.map((category) => category.id));
  const fallbackCategoryId = normalized.categories[0]?.id || "work";
  const usedPersonIds = new Set();
  normalized.people = Array.isArray(candidate.people)
    ? candidate.people
        .filter((person) => person && (person.id || person.name))
        .map((person, index) => ({
          ...person,
          id: uniqueStateId(person.id || `person_${index}`, usedPersonIds, "person"),
          name: String(person.name || "未命名人物"),
          categoryId: categoryIds.has(person.categoryId) ? person.categoryId : fallbackCategoryId,
          importance: person.importance || "中",
          profile: person.profile || {},
          context: normalizePersonContext(person),
          memories: Array.isArray(person.memories) ? person.memories : [],
          chatHistory: Array.isArray(person.chatHistory) ? person.chatHistory : []
        }))
    : structuredClone(defaultState.people);

  const personIds = new Set(normalized.people.map((person) => person.id));
  if (!personIds.has(normalized.selectedPersonId)) normalized.selectedPersonId = normalized.people[0]?.id || null;
  if (!categoryIds.has(normalized.selectedCategoryId) && normalized.selectedCategoryId !== "all") normalized.selectedCategoryId = "all";
  if (!categoryIds.has(normalized.focusCategoryId)) normalized.focusCategoryId = null;
  if (!personIds.has(normalized.focusPersonId)) normalized.focusPersonId = null;
  if (normalized.pendingMemoryDraft && !personIds.has(normalized.pendingMemoryDraft.personId)) normalized.pendingMemoryDraft = null;
  if (!["network", "manage", "person", "dialogue", "schedule", "settings"].includes(normalized.route)) normalized.route = "network";
  if (!["graph", "manage"].includes(normalized.viewMode)) normalized.viewMode = "graph";
  if (!["incoming", "report"].includes(normalized.dialogueMode)) normalized.dialogueMode = "incoming";
  if (!Array.isArray(normalized.lessons)) normalized.lessons = [];
  normalized.manageFilters = {
    keyword: "",
    importance: "all",
    sort: "recent",
    ...(candidate.manageFilters || {})
  };
  if (!["all", "高", "中", "低"].includes(normalized.manageFilters.importance)) normalized.manageFilters.importance = "all";
  if (!["recent", "importance", "name", "profile"].includes(normalized.manageFilters.sort)) normalized.manageFilters.sort = "recent";
  normalized.manualSchedules = Array.isArray(candidate.manualSchedules)
    ? candidate.manualSchedules
        .filter((item) => item && item.title)
        .map((item, index) => ({
          id: String(item.id || `schedule_${index}_${Date.now()}`),
          time: item.time || "09:30",
          duration: item.duration || "10 分钟",
          type: item.type || "手动",
          title: String(item.title || "未命名日程"),
          detail: String(item.detail || "手动添加的关系维护事项。"),
          personId: personIds.has(item.personId) ? item.personId : "",
          status: ["todo", "done", "delayed", "ignored"].includes(item.status) ? item.status : "todo",
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || ""
        }))
    : [];
  normalized.lastBackupAt = candidate.lastBackupAt || "";
  if (normalized.pendingChatImport && !personIds.has(normalized.pendingChatImport.personId)) normalized.pendingChatImport = null;
  normalized.offlineMode = normalized.offlineMode !== false;
  normalized.autoAiReply = normalized.autoAiReply !== false;
  return normalized;
}

function uniqueStateId(rawId, usedIds, fallbackPrefix) {
  const base = String(rawId || fallbackPrefix)
    .trim()
    .replace(/[^\w-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "") || fallbackPrefix;
  let id = base;
  let index = 2;
  while (usedIds.has(id)) {
    id = `${base}_${index}`;
    index += 1;
  }
  usedIds.add(id);
  return id;
}

function saveState() {
  state = normalizeAppState(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lastStateSaveError = "";
  } catch (error) {
    lastStateSaveError = error?.message || "本地存储不可用";
    if (elements.memoryStatus) {
      elements.memoryStatus.textContent = `保存失败：${lastStateSaveError}。请先导出记忆，避免刷新后丢失。`;
    }
  }
}

function categoryById(id) {
  return state.categories.find((category) => category.id === id);
}

function personById(id) {
  return state.people.find((person) => person.id === id) || null;
}

function firstPersonId() {
  return state.people[0]?.id || null;
}

function userDisplayName() {
  return state.userProfile?.displayName?.trim() || "我";
}

function shortUserName() {
  const name = userDisplayName();
  return name.length > 3 ? name.slice(0, 3) : name;
}

function updateAvatar() {
  const label = $("#homeButton span");
  if (label) label.textContent = shortUserName();
}

function isNetworkCenter() {
  return state.route === "network" && state.viewMode === "graph" && !state.focusCategoryId && !state.focusPersonId;
}

function peopleInCategory(categoryId) {
  if (!categoryId || categoryId === "all") return state.people;
  return state.people.filter((person) => person.categoryId === categoryId);
}

function setRoute(route) {
  if (route !== state.route && !confirmDiscardMemoryDraft()) return;
  state.route = route;
  if (route === "network") {
    state.viewMode = state.viewMode || "graph";
  }
  saveState();
  render();
}

function hasUnsavedMemoryDraft() {
  return !!state.pendingMemoryDraft?.dirty;
}

function confirmDiscardMemoryDraft() {
  if (!hasUnsavedMemoryDraft()) return true;
  const ok = window.confirm("新增记忆还没有保存。离开后这条草稿不会写入人物记忆，确定离开吗？");
  if (ok) {
    state.pendingMemoryDraft = null;
    saveState();
  }
  return ok;
}

function titleForRoute() {
  if (state.route === "person") {
    const person = personById(state.selectedPersonId);
    return {
      title: person?.name || "人物画像",
      scope: `${categoryById(person?.categoryId)?.name || "关系"} / ${person?.relation || "未设置关系"}`
    };
  }

  const map = {
    network: { title: state.viewMode === "graph" ? "关系总览" : "关系管理", scope: "AI 人际管家" },
    dialogue: { title: "模拟对话", scope: "回复决策台" },
    schedule: { title: "日程安排", scope: "关系维护" },
    settings: { title: "设置", scope: "模板与边界" }
  };
  return map[state.route] || map.network;
}

function render() {
  applyTheme();
  if (state.dialogueMode === "distill") state.dialogueMode = "incoming";
  const title = titleForRoute();
  elements.pageTitle.textContent = title.title;
  elements.currentScope.textContent = title.scope;
  elements.workspace.classList.toggle("topbar-hidden", routeGroup(state.route) !== "network");

  $$(".view").forEach((view) => view.classList.remove("active"));
  $$(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === routeGroup(state.route));
  });

  if (state.route === "network" && state.viewMode === "graph") {
    elements.networkView.classList.add("active");
    renderNetwork();
  } else if (state.route === "network") {
    elements.manageView.classList.add("active");
    renderManage();
  } else if (state.route === "person") {
    elements.personView.classList.add("active");
    renderPerson();
  } else if (state.route === "dialogue") {
    elements.dialogueView.classList.add("active");
    renderDialogue();
  } else if (state.route === "schedule") {
    elements.scheduleView.classList.add("active");
    renderSchedule();
  } else if (state.route === "settings") {
    elements.settingsView.classList.add("active");
    renderSettings();
  }

  if (window.lucide) lucide.createIcons();
  updateAvatar();
}

function applyTheme() {
  const theme = state.themeMode === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  if (!elements.themeToggle) return;
  elements.themeToggle.classList.toggle("dark", theme === "dark");
  elements.themeToggle.title = theme === "dark" ? "切换日间模式" : "切换黑夜模式";
  elements.themeToggle.setAttribute("aria-label", elements.themeToggle.title);
}

function routeGroup(route) {
  return route === "person" ? "network" : route;
}

function renderNetwork() {
  graphRenderToken += 1;
  const focusPerson = state.focusPersonId ? personById(state.focusPersonId) : null;
  const focusCategory = categoryById(state.focusCategoryId);
  const nodes = focusPerson ? personFocusNodes(focusPerson) : focusCategory ? focusedCategoryNodes(focusCategory) : overviewNodes();
  const edges = focusPerson ? [] : focusCategory ? focusedCategoryEdges(nodes) : overviewEdges(nodes);

  drawGraphNodes(nodes, graphRenderToken);
  drawGraphEdges(edges, graphRenderToken);
  renderNetworkPersonPanel(focusPerson);
  renderNetworkDocks(focusCategory, focusPerson);

  elements.networkHint.innerHTML = focusPerson
    ? `<strong>${escapeHtml(focusPerson.name)}</strong><span>${state.graphPersonStage === "detail" ? "已进入人物聚焦，右侧可查看画像或进入模拟。" : "正在聚焦人物，其它关系会先渐隐。"}</span>`
    : focusCategory
    ? `<strong>${escapeHtml(focusCategory.name)}</strong><span>${escapeHtml(focusCategory.description)}。地图会平移到这个关系，节点之间保持原来的相对位置。</span>`
    : `<strong>关系地图</strong><span>这是一张固定脉络图。点击分类后，整张地图会平移到该关系并展开细节。</span>`;
}

function renderNetworkDocks(focusCategory, focusPerson) {
  if (!elements.networkActivityPanel || !elements.networkCalendarPanel) return;
  elements.networkActivityPanel.classList.toggle("person-focus", !!focusPerson);
  elements.networkActivityPanel.classList.toggle("collapsed", !!state.networkActivityCollapsed);
  elements.networkCalendarPanel.classList.toggle("person-focus", !!focusPerson);
  elements.networkHint?.classList.toggle("person-focus", !!focusPerson);

  const scopedPeople = focusPerson
    ? [focusPerson]
    : focusCategory
    ? peopleInCategory(focusCategory.id)
    : [...state.people].sort((a, b) => importanceWeight(b.importance) - importanceWeight(a.importance)).slice(0, 4);
  const featuredPeople = (scopedPeople.length ? scopedPeople : state.people).slice(0, 4);
  const today = new Date();
  const activeCategoryName = focusPerson
    ? categoryById(focusPerson.categoryId)?.name || "关系"
    : focusCategory?.name || "全局";

  elements.networkActivityPanel.innerHTML = `
    <div class="dock-brand">
      <button class="brand-mark dock-toggle" id="activityDockToggle" type="button" title="${state.networkActivityCollapsed ? "展开关系事项" : "收起关系事项"}" aria-label="${state.networkActivityCollapsed ? "展开关系事项" : "收起关系事项"}">
        ${state.networkActivityCollapsed ? '<i data-lucide="panel-left-open"></i>' : escapeHtml(shortUserName())}
      </button>
      <div class="dock-title-block">
        <p class="eyebrow">${escapeHtml(today.toLocaleDateString("zh-CN", { weekday: "short", month: "numeric", day: "numeric" }))}</p>
        <h2>关系事项</h2>
      </div>
      <button class="icon-only dock-collapse-button" type="button" id="activityDockCollapse" title="收起关系事项" aria-label="收起关系事项">
        <i data-lucide="panel-left-close"></i>
      </button>
    </div>
    <div class="dock-stat-row">
      <section>
        <strong>${state.people.length}</strong>
        <span>联系人</span>
      </section>
      <section>
        <strong>${state.categories.length}</strong>
        <span>分类</span>
      </section>
    </div>
    <div class="dock-event-list">
      ${featuredPeople
        .map(
          (person, index) => `
            <button class="dock-event-card" data-dock-person="${escapeAttr(person.id)}">
              <span class="dock-time">${["09:30", "11:00", "17:30", "20:30"][index] || "今天"}</span>
              <strong>${escapeHtml(person.name)}</strong>
              <small>${escapeHtml(person.relation || categoryById(person.categoryId)?.name || "待补充关系")}</small>
              <span class="dock-chip">${escapeHtml(recommendStructure(person)).slice(0, 18)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;

  const week = buildWeeklyPlan();
  elements.networkCalendarPanel.innerHTML = `
    <div class="dock-side-head">
      <div>
        <p class="eyebrow">当前焦点</p>
        <h2>${escapeHtml(activeCategoryName)}</h2>
      </div>
      <span class="status-dot"></span>
    </div>
    <div class="mini-calendar">
      ${buildNetworkCalendarDays(today)
        .map(
          (day) => `
            <span class="${day.active ? "active" : ""}">${day.label}</span>
          `
        )
        .join("")}
    </div>
    <div class="dock-week-plan">
      ${week
        .slice(0, 5)
        .map(
          (item) => `
            <section class="${item.active ? "active" : ""}">
              <strong>${escapeHtml(item.day)}</strong>
              <span>${escapeHtml(item.focus)}</span>
            </section>
          `
        )
        .join("")}
    </div>
  `;

  elements.networkActivityPanel.querySelectorAll("[data-dock-person]").forEach((button) => {
    button.addEventListener("click", () => focusPersonInNetwork(button.dataset.dockPerson));
  });
  $("#activityDockToggle")?.addEventListener("click", toggleActivityDock);
  $("#activityDockCollapse")?.addEventListener("click", toggleActivityDock);
  if (window.lucide) lucide.createIcons();
}

function toggleActivityDock() {
  state.networkActivityCollapsed = !state.networkActivityCollapsed;
  saveState();
  renderNetwork();
}

function buildNetworkCalendarDays(today) {
  const currentDay = today.getDate();
  const total = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const start = Math.max(1, currentDay - 7);
  return Array.from({ length: 21 }, (_, index) => {
    const label = ((start + index - 1) % total) + 1;
    return { label, active: label === currentDay };
  });
}

function overviewNodes() {
  const center = { id: "self", type: "self", label: userDisplayName(), x: 50, y: 52 };
  const radiusX = 25;
  const radiusY = 28;
  const categoryNodes = state.categories.map((category, index) => {
    const angle = -Math.PI / 2 + (index / state.categories.length) * Math.PI * 2;
    return {
      id: category.id,
      type: "category",
      label: category.name,
      x: 50 + Math.cos(angle) * radiusX,
      y: 52 + Math.sin(angle) * radiusY
    };
  });

  return [center, ...categoryNodes];
}

function overviewEdges(nodes) {
  const center = nodes.find((node) => node.id === "self") || nodes[0];
  return nodes
    .filter((node) => node.id !== "self" && nodeKind(node) === "category")
    .map((node) => ({ id: `${center.id}->${node.id}`, from: center, to: node, active: false }));
}

function focusedCategoryNodes(category) {
  const baseNodes = overviewNodes();
  const anchor = baseNodes.find((node) => node.id === category.id) || { id: category.id, type: "category", label: category.name, x: 50, y: 52 };
  const viewport = viewportForAnchor(anchor);
  const center = translateMapNode(anchor, viewport, "category focus map-focus");
  const selfNode = baseNodes.find((node) => node.id === "self") || { x: 50, y: 52 };
  const translatedSelf = translateMapNode(selfNode, viewport, "self map-context");
  const mapNodes = baseNodes.map((node) => {
    const translated = translateMapNode(node, viewport, node.id === category.id ? "category focus map-focus" : `${node.type} map-context`);
    if (node.id === category.id) return { ...translated, reveal: 0 };
    if (node.id === "self") return { ...translated, reveal: 0, opacity: 0.9 };

    return {
      ...translated,
      x: clamp(translatedSelf.x + (translated.x - translatedSelf.x) * 0.42, 7, 93),
      y: clamp(translatedSelf.y + (translated.y - translatedSelf.y) * 0.42, 9, 91),
      reveal: 0,
      opacity: 0.22
    };
  });
  const people = peopleInCategory(category.id);
  const relationNames = uniqueRelations(people, category);
  const branch = branchVectors(anchor);
  const relationNodes = relationNames.map((name, index, list) => {
    const spread = centeredOffset(index, list.length, 12);
    return {
      id: `rel_${category.id}_${slugify(name)}`,
      type: "relation",
      label: name,
      relation: name,
      x: clamp(center.x + branch.dx * 16 + branch.px * spread, 9, 91),
      y: clamp(center.y + branch.dy * 16 + branch.py * spread, 12, 88),
      reveal: 2 + index
    };
  });

  const personNodes = people.map((person, index) => {
    const relationIndex = Math.max(
      relationNames.findIndex((name) => name === normalizedRelation(person, category)),
      0
    );
    const relationNode = relationNodes[relationIndex] || center;
    const offset = (index % 3) - 1;
    return {
      id: person.id,
      type: "person",
      label: person.name,
      relation: relationNode.relation,
      x: clamp(relationNode.x + branch.dx * 13 + branch.px * offset * 7, 8, 92),
      y: clamp(relationNode.y + branch.dy * 13 + branch.py * offset * 7, 10, 90),
      reveal: 3 + relationIndex + index * 0.2
    };
  });

  return [...mapNodes, ...relationNodes, ...personNodes];
}

function focusedCategoryEdges(nodes) {
  const center = nodes.find((node) => node.id === state.focusCategoryId);
  const relationNodes = nodes.filter((node) => node.type === "relation");
  const personNodes = nodes.filter((node) => node.type === "person");
  const edges = overviewEdges(nodes).map((edge) => ({
    ...edge,
    active: edge.to.id === center?.id,
    opacity: edge.to.id === center?.id ? 1 : 0.26
  }));

  relationNodes.forEach((relation) => {
    edges.push({ id: `${center.id}->${relation.id}`, from: center, to: relation, active: true, opacity: 1 });
  });

  personNodes.forEach((person) => {
    const relation = relationNodes.find((node) => node.relation === person.relation) || center;
    edges.push({ id: `${relation.id}->${person.id}`, from: relation, to: person, active: false, opacity: 0.76 });
  });

  return edges;
}

function personFocusNodes(person) {
  const category = categoryById(person.categoryId);
  const baseNodes = category ? focusedCategoryNodes(category) : overviewNodes();
  const stage = state.graphPersonStage || "center";

  if (stage === "detail") {
    return [
      {
        id: person.id,
        type: "person focus detail-focus",
        label: person.name,
        x: 25,
        y: 50,
        reveal: 0,
        opacity: 1
      }
    ];
  }

  return baseNodes.map((node) => {
    if (node.id === person.id) {
      return {
        ...node,
        type: "person focus",
        x: 50,
        y: 50,
        reveal: 0,
        opacity: 1
      };
    }

    return {
      ...node,
      type: `${node.type} ghost`,
      reveal: 0,
      opacity: 0.12
    };
  });
}

function renderNetworkPersonPanel(person) {
  let panel = $("#networkPersonPanel");
  if (!person) {
    panel?.classList.remove("visible");
    return;
  }

  if (!panel) {
    panel = document.createElement("aside");
    panel.id = "networkPersonPanel";
    panel.className = "network-person-panel";
    elements.networkView.querySelector(".network-stage").appendChild(panel);
  }

  const category = categoryById(person.categoryId);
  const expanded = state.focusPersonPanelExpanded === true;
  panel.innerHTML = `
    <p class="eyebrow">${escapeHtml(category?.name || "关系")} / ${escapeHtml(person.relation || "未设置关系")}</p>
    <h2>${escapeHtml(person.name)}</h2>
    <p class="meta-line">${escapeHtml(personContextLine(person))}</p>
    <p class="meta-line">${escapeHtml(person.personality || "还没有性格画像。")}</p>
    <div class="mini-insights">
      ${renderMiniInsight("说话风格", person.profile?.communication)}
      ${renderMiniInsight("好感触发", person.profile?.goodwill)}
      ${renderMiniInsight("避雷点", person.profile?.avoid)}
      ${expanded ? renderMiniInsight("做事风格", person.profile?.work) : ""}
      ${expanded ? renderMiniInsight("推荐回复结构", recommendStructure(person)) : ""}
      ${expanded ? renderMiniInsight("关系策略", relationshipStrategy(person)) : ""}
    </div>
    ${
      expanded
        ? `<div class="focused-detail-block">
            <section>
              <strong>人物背景</strong>
              <p>${escapeHtml(personBackgroundText(person))}</p>
            </section>
            <section>
              <strong>相处注意事项</strong>
              <p>${escapeHtml(person.notes || "暂无。")}</p>
            </section>
            <section>
              <strong>历史蒸馏</strong>
              ${renderNetworkMemoryManager(person)}
            </section>
            <section class="distill-panel">
              <strong>蒸馏调整画像</strong>
              <textarea id="networkDistillInput" placeholder="粘贴这个人的历史聊天、会议表达、真实反馈，用来更新说话风格、好感触发和避雷点。"></textarea>
              <div class="distill-actions compact-actions">
                <button class="primary-button" id="networkDistillButton">
                  <i data-lucide="sparkles"></i>
                  <span>蒸馏并调整</span>
                </button>
                <button class="ghost-button" id="networkImportChatButton" type="button">
                  <i data-lucide="file-up"></i>
                  <span>导入聊天记录</span>
                </button>
                <input type="file" id="networkChatImportInput" accept=".txt,.csv,.json,.md,.html,.htm,.bak,.bat,text/plain,text/csv,text/html,application/json" hidden />
              </div>
              <p class="meta-line" id="chatImportStatus">支持 TXT、CSV、JSON、Markdown、HTML，也会尝试读取 QQ 的 BAK/BAT；如果文件是备份或脚本，需要先转成可读文本。</p>
            </section>
          </div>`
        : ""
    }
    <div class="network-panel-actions">
      <button class="primary-button" id="openFocusedPerson">
        <i data-lucide="user-round-search"></i>
        <span>${expanded ? "收起详情" : "查看此人详情"}</span>
      </button>
      <button class="ghost-button" id="simulateFocusedPerson">
        <i data-lucide="messages-square"></i>
        <span>进入模拟</span>
      </button>
      <button class="ghost-button danger-button" id="deleteFocusedPerson">
        <i data-lucide="trash-2"></i>
        <span>删除人物</span>
      </button>
    </div>
  `;

  window.setTimeout(() => panel.classList.toggle("visible", state.graphPersonStage === "detail"), 30);
  panel.classList.toggle("expanded", expanded);

  $("#openFocusedPerson").addEventListener("click", () => {
    state.selectedPersonId = person.id;
    state.focusPersonPanelExpanded = !state.focusPersonPanelExpanded;
    saveState();
    renderNetwork();
  });

  $("#networkDistillButton")?.addEventListener("click", () => {
    distillPersonProfile(person.id, $("#networkDistillInput").value, "network");
  });
  $("#networkImportChatButton")?.addEventListener("click", () => $("#networkChatImportInput")?.click());
  $("#networkChatImportInput")?.addEventListener("change", async (event) => {
    await importChatTranscriptFile(person.id, event.target.files?.[0], "network");
    event.target.value = "";
  });

  $("#simulateFocusedPerson").addEventListener("click", () => {
    state.selectedPersonId = person.id;
    state.focusPersonId = null;
    state.focusPersonPanelExpanded = false;
    setRoute("dialogue");
  });

  $("#deleteFocusedPerson").addEventListener("click", () => deletePerson(person.id));
  bindNetworkMemoryManager(person);

  if (window.lucide) lucide.createIcons();
}

function renderNetworkMemoryManager(person) {
  ensurePersonDialogueData(person);
  if (!person.memories.length) return "<p>还没有沉淀记录。</p>";
  return person.memories
    .slice(0, 4)
    .map(
      (memory) => `
        <article class="memory-editor compact-memory-editor" data-network-memory-id="${escapeAttr(memory.id)}">
          <input class="memory-title-input" value="${escapeAttr(memory.title || "记忆")}" aria-label="记忆标题" />
          <textarea class="memory-text-input" aria-label="记忆内容">${escapeHtml(memory.text || "")}</textarea>
          <div class="memory-editor-actions">
            <span>${escapeHtml(memory.createdAt ? new Date(memory.createdAt).toLocaleDateString("zh-CN") : "本地记忆")}</span>
            <button class="ghost-button" type="button" data-network-memory-action="save">保存</button>
            <button class="ghost-button danger-button" type="button" data-network-memory-action="delete">删除</button>
          </div>
        </article>
      `
    )
    .join("");
}

function bindNetworkMemoryManager(person) {
  $("#networkPersonPanel")?.querySelectorAll("[data-network-memory-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-network-memory-id]");
      const memoryId = card?.dataset.networkMemoryId;
      const memory = person.memories.find((item) => item.id === memoryId);
      if (!memory) return;

      if (button.dataset.networkMemoryAction === "delete") {
        person.memories = person.memories.filter((item) => item.id !== memoryId);
      } else {
        memory.title = card.querySelector(".memory-title-input")?.value.trim() || "记忆";
        memory.text = card.querySelector(".memory-text-input")?.value.trim() || "";
        memory.updatedAt = new Date().toISOString();
      }
      saveState();
      renderNetwork();
    });
  });
}

function renderMiniInsight(title, text) {
  return `
    <section>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text || "需要更多对话样本来判断。")}</span>
    </section>
  `;
}

function drawGraphNodes(nodes, renderToken = graphRenderToken) {
  const previousNodes = new Map(lastGraphNodes);
  const wantedIds = new Set(nodes.map((node) => node.id));
  const focusOrigin =
    previousNodes.get(state.focusPersonId) ||
    previousNodes.get(state.focusCategoryId) ||
    previousNodes.get("self") ||
    Array.from(previousNodes.values())[0] ||
    { x: 50, y: 52 };

  Array.from(elements.nodeLayer.querySelectorAll(".node")).forEach((element) => {
    if (!wantedIds.has(element.dataset.id)) {
      const id = element.dataset.id;
      window.clearTimeout(graphNodeExitTimers.get(id));
      graphNodeExitTimers.delete(id);
      element.style.transitionDelay = "0ms";
      element.dataset.leavingToken = String(renderToken);
      element.classList.add("is-leaving");
      element.style.left = `${focusOrigin.x}%`;
      element.style.top = `${focusOrigin.y}%`;
      const timer = window.setTimeout(() => {
        if (element.dataset.leavingToken === String(renderToken)) element.remove();
        graphNodeExitTimers.delete(id);
      }, 460);
      graphNodeExitTimers.set(id, timer);
    }
  });

  nodes.forEach((node) => {
    let element = elements.nodeLayer.querySelector(`[data-id="${cssEscape(node.id)}"]`);
    const kind = nodeKind(node);
    const revealDelay = Math.round((node.reveal || 0) * 90);

    if (!element) {
      element = document.createElement("button");
      element.className = `node ${node.type} is-entering`;
      element.dataset.id = node.id;
      element.dataset.type = kind;
      element.innerHTML = `<span>${escapeHtml(node.label)}</span>`;
      element.style.left = `${focusOrigin.x}%`;
      element.style.top = `${focusOrigin.y}%`;
      element.style.opacity = "0";
      element.addEventListener("click", () => handleNodeClick(element.dataset.type, element.dataset.id));
      elements.nodeLayer.appendChild(element);

      window.requestAnimationFrame(() => {
        if (renderToken !== graphRenderToken) return;
        element.style.transitionDelay = `${revealDelay}ms`;
        element.style.left = `${node.x}%`;
        element.style.top = `${node.y}%`;
        element.style.opacity = String(node.opacity ?? 1);
        element.classList.remove("is-entering");
      });
    } else {
      window.clearTimeout(graphNodeExitTimers.get(node.id));
      graphNodeExitTimers.delete(node.id);
      element.classList.remove("is-leaving", "is-entering");
      delete element.dataset.leavingToken;
      element.className = `node ${node.type}`;
      element.dataset.type = kind;
      element.querySelector("span").textContent = node.label;
      element.style.transitionDelay = `${revealDelay}ms`;
      element.style.left = `${node.x}%`;
      element.style.top = `${node.y}%`;
      element.style.opacity = String(node.opacity ?? 1);
    }
  });

  lastGraphNodes = new Map(nodes.map((node) => [node.id, { x: node.x, y: node.y, type: node.type }]));
}

function drawGraphEdges(edges, renderToken = graphRenderToken) {
  const wantedIds = new Set(edges.map((edge) => edge.id || `${edge.from.id}->${edge.to.id}`));

  Array.from(elements.edgeLayer.querySelectorAll(".edge")).forEach((line) => {
    if (!wantedIds.has(line.dataset.id)) {
      const id = line.dataset.id;
      window.clearTimeout(graphEdgeTimers.get(id));
      graphEdgeTimers.delete(id);
      line.style.transitionDelay = "0ms";
      line.dataset.leavingToken = String(renderToken);
      line.classList.add("is-leaving");
      const timer = window.setTimeout(() => {
        if (line.dataset.leavingToken === String(renderToken)) line.remove();
        graphEdgeTimers.delete(id);
      }, 130);
      graphEdgeTimers.set(id, timer);
    }
  });

  edges.forEach((edge, index) => {
    if (!edge.from || !edge.to) return;

    const id = edge.id || `${edge.from.id}->${edge.to.id}`;
    let line = elements.edgeLayer.querySelector(`[data-id="${cssEscape(id)}"]`);
    const reveal = Math.max(edge.from.reveal || 0, edge.to.reveal || 0);
    const delay = Math.min(440 + reveal * 80 + index * 26, 860);
    const finalOpacity = String(edge.opacity ?? 1);

    if (!line) {
      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.dataset.id = id;
      line.setAttribute("x1", `${edge.from.x}%`);
      line.setAttribute("y1", `${edge.from.y}%`);
      line.setAttribute("x2", `${edge.from.x}%`);
      line.setAttribute("y2", `${edge.from.y}%`);
      line.style.opacity = "0";
      elements.edgeLayer.appendChild(line);
    }

    window.clearTimeout(graphEdgeTimers.get(id));
    graphEdgeTimers.delete(id);
    line.classList.remove("is-leaving");
    delete line.dataset.leavingToken;
    line.setAttribute("class", `edge ${edge.active ? "active-edge" : ""}`);
    line.style.transitionDelay = "0ms";
    line.style.opacity = "0";
    line.dataset.renderToken = String(renderToken);

    const timer = window.setTimeout(() => {
      if (line.dataset.renderToken !== String(graphRenderToken) || !line.isConnected) return;
      line.setAttribute("x1", `${edge.from.x}%`);
      line.setAttribute("y1", `${edge.from.y}%`);
      line.setAttribute("x2", `${edge.to.x}%`);
      line.setAttribute("y2", `${edge.to.y}%`);
      line.style.transitionDelay = "0ms";
      line.style.opacity = finalOpacity;
      graphEdgeTimers.delete(id);
    }, delay);
    graphEdgeTimers.set(id, timer);
  });
}

function nodeKind(node) {
  return String(node.type).split(" ")[0];
}

function uniqueRelations(people, category = null) {
  const names = people.map((person) => normalizedRelation(person, category));
  return [...new Set(names)];
}

function normalizedRelation(person, category = null) {
  const relation = (person.relation || "").trim();
  if (!relation) return "未分组";
  const categoryName = category?.name || categoryById(person.categoryId)?.name || "";
  if (categoryName && relation.includes(categoryName)) {
    return relation.length > categoryName.length ? relation.slice(0, 6) : "默认分组";
  }
  if (relation.includes("领导")) return "领导";
  if (relation.includes("平级") || relation.includes("跨部门")) return "跨部门";
  if (relation.includes("同部门")) return "同部门";
  if (relation.includes("亲戚")) return "亲戚";
  if (relation.includes("朋友")) return "朋友关系";
  return relation.length > 6 ? relation.slice(0, 6) : relation;
}

function slugify(value) {
  return String(value)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "") || "group";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
}

function relationAngle(index, total) {
  const presets = {
    1: [-90],
    2: [-135, -45],
    3: [-150, -90, -30],
    4: [-155, -112, -68, -25],
    5: [-162, -126, -90, -54, -18]
  };
  const degrees = presets[total]?.[index] ?? -165 + (index / Math.max(total - 1, 1)) * 150;
  return (degrees * Math.PI) / 180;
}

function branchVectors(anchor) {
  const dxRaw = anchor.x - 50;
  const dyRaw = anchor.y - 52;
  const length = Math.hypot(dxRaw, dyRaw) || 1;
  const dx = dxRaw / length;
  const dy = dyRaw / length;
  return {
    dx,
    dy,
    px: -dy,
    py: dx
  };
}

function viewportForAnchor(anchor) {
  return {
    targetX: 50,
    targetY: 52,
    offsetX: 50 - anchor.x,
    offsetY: 52 - anchor.y
  };
}

function translateMapNode(node, viewport, type = node.type) {
  return {
    ...node,
    type,
    x: node.x + viewport.offsetX,
    y: node.y + viewport.offsetY
  };
}

function centeredOffset(index, total, step) {
  return (index - (total - 1) / 2) * step;
}

function handleNodeClick(type, id) {
  if (type === "self") {
    clearPersonFocusTimer();
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.focusCategoryId = null;
    setRoute("network");
    return;
  }

  if (type === "category") {
    clearPersonFocusTimer();
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.focusCategoryId = id;
    state.selectedCategoryId = id;
    setRoute("network");
    return;
  }

  if (type === "person") {
    focusPersonInNetwork(id);
  }
}

function focusPersonInNetwork(id) {
  const person = personById(id);
  if (!person) return;

  clearPersonFocusTimer();
  state.selectedPersonId = id;
  state.focusPersonId = id;
  state.focusCategoryId = person.categoryId;
  state.selectedCategoryId = person.categoryId;
  state.graphPersonStage = "center";
  state.focusPersonPanelExpanded = false;
  state.route = "network";
  state.viewMode = "graph";
  saveState();
  render();

  personFocusTimer = window.setTimeout(() => {
    if (state.focusPersonId !== id || state.route !== "network") return;
    state.graphPersonStage = "detail";
    saveState();
    render();
  }, 820);
}

function clearPersonFocusTimer() {
  if (!personFocusTimer) return;
  window.clearTimeout(personFocusTimer);
  personFocusTimer = null;
}

function goBack() {
  clearPersonFocusTimer();
  if (!confirmDiscardMemoryDraft()) return;

  if (state.route === "network" && state.focusPersonId) {
    markGraphTransition("graph-returning");
    const person = personById(state.focusPersonId);
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.focusCategoryId = person?.categoryId || state.focusCategoryId;
    state.selectedCategoryId = state.focusCategoryId || "all";
    state.viewMode = "graph";
    saveState();
    render();
    return;
  }

  if (state.route === "network" && state.viewMode === "manage") {
    state.viewMode = "graph";
    saveState();
    render();
    return;
  }

  if (state.route === "network" && state.focusCategoryId) {
    state.focusCategoryId = null;
    state.selectedCategoryId = "all";
    saveState();
    render();
    return;
  }

  if (state.route === "person") {
    const person = personById(state.selectedPersonId);
    state.route = "network";
    state.viewMode = "graph";
    state.focusCategoryId = person?.categoryId || null;
    state.selectedCategoryId = state.focusCategoryId || "all";
    saveState();
    render();
    return;
  }

  if (state.route === "dialogue") {
    setRoute("person");
    return;
  }

  setRoute("network");
}

function markGraphTransition(className) {
  const stage = elements.networkView?.querySelector(".network-stage");
  if (!stage) return;
  stage.classList.add(className);
  window.setTimeout(() => stage.classList.remove(className), 860);
}

function renderCategoryRail(target) {
  target.innerHTML = [
    { id: "all", name: "全部" },
    ...state.categories
  ]
    .map(
      (category) => `
        <button class="category-row ${state.selectedCategoryId === category.id ? "active" : ""}" data-category="${category.id}">
          <span>${escapeHtml(category.name)}</span>
          <span class="caret"></span>
        </button>
      `
    )
    .join("");

  target.querySelectorAll(".category-row").forEach((button) => {
    button.addEventListener("click", () => {
      clearPersonFocusTimer();
      state.focusPersonId = null;
      state.graphPersonStage = null;
      state.focusPersonPanelExpanded = false;
      state.selectedCategoryId = button.dataset.category;
      state.focusCategoryId = button.dataset.category === "all" ? null : button.dataset.category;
      saveState();
      render();
    });
  });
}

function renderManage() {
  renderCategoryRail(elements.categoryRail);
  const selected = categoryById(state.selectedCategoryId);
  elements.directoryTitle.textContent = selected ? selected.name : "全部关系";
  renderCategoryEditor(elements.manageCategoryEditor, { compact: true });
  renderManageFilters();

  const people = filteredManagePeople();
  elements.personGrid.innerHTML = people.length
    ? people.map(renderPersonCard).join("")
    : `<div class="memory-card"><h3>没有匹配的人物</h3><p>可以调整搜索词、重要程度筛选，或添加一个真实联系人。</p></div>`;

  elements.personGrid.querySelectorAll(".person-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedPersonId = card.dataset.personId;
      setRoute("person");
    });
  });

  elements.personGrid.querySelectorAll("[data-person-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const personId = button.closest(".person-card").dataset.personId;
      const action = button.dataset.personAction;
      if (action === "view") {
        state.selectedPersonId = personId;
        setRoute("person");
      }
      if (action === "edit") openPersonModal(personId);
      if (action === "delete") deletePerson(personId);
    });
  });
}

function renderManageFilters() {
  const filters = state.manageFilters || {};
  if (elements.manageSearchInput) elements.manageSearchInput.value = filters.keyword || "";
  if (elements.manageImportanceFilter) elements.manageImportanceFilter.value = filters.importance || "all";
  if (elements.manageSortSelect) elements.manageSortSelect.value = filters.sort || "recent";
}

function filteredManagePeople() {
  const filters = state.manageFilters || {};
  const keyword = String(filters.keyword || "").trim().toLowerCase();
  const importance = filters.importance || "all";
  const sort = filters.sort || "recent";
  const people = peopleInCategory(state.selectedCategoryId).filter((person) => {
    const context = normalizePersonContext(person);
    const haystack = [
      person.name,
      person.relation,
      person.importance,
      categoryById(person.categoryId)?.name,
      person.personality,
      person.notes,
      context.roleWeight,
      context.closeness,
      context.contactFrequency,
      context.background,
      person.profile?.communication,
      person.profile?.work,
      person.profile?.goodwill,
      person.profile?.avoid
    ].filter(Boolean).join(" ").toLowerCase();
    return (!keyword || haystack.includes(keyword)) && (importance === "all" || person.importance === importance);
  });

  return people.sort((a, b) => {
    if (sort === "importance") return importanceWeight(b.importance) - importanceWeight(a.importance);
    if (sort === "name") return a.name.localeCompare(b.name, "zh-CN");
    if (sort === "profile") return profileCompleteness(b) - profileCompleteness(a);
    return latestPersonActivity(b) - latestPersonActivity(a);
  });
}

function profileCompleteness(person) {
  return ["communication", "work", "goodwill", "avoid"].filter((key) => person.profile?.[key]).length
    + (person.personality ? 1 : 0)
    + (normalizePersonContext(person).background ? 1 : 0)
    + ((person.memories || []).length ? 1 : 0);
}

function latestPersonActivity(person) {
  const dates = [
    ...(person.chatHistory || []).map((message) => message.savedAt || message.updatedAt || message.createdAt),
    ...(person.memories || []).map((memory) => memory.updatedAt || memory.createdAt)
  ].filter(Boolean).map((value) => new Date(value).getTime()).filter(Number.isFinite);
  return dates.length ? Math.max(...dates) : 0;
}

function renderCategoryEditor(target, options = {}) {
  if (!target) return;

  const categories = options.compact && state.selectedCategoryId !== "all"
    ? state.categories.filter((category) => category.id === state.selectedCategoryId)
    : state.categories;

  target.innerHTML = categories
    .map((category) => renderCategoryEditorItem(category, options))
    .join("");

  target.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const row = input.closest(".editor-item");
      const category = categoryById(row.dataset.category);
      if (!category) return;
      category[input.dataset.field] = input.value.trim();
      saveState();
      render();
    });
  });

  target.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => deleteCategory(button.closest(".editor-item").dataset.category));
  });
}

function renderCategoryEditorItem(category, options = {}) {
  const count = peopleInCategory(category.id).length;
  return `
    <div class="editor-item ${options.compact ? "compact-editor" : ""}" data-category="${category.id}">
      <input data-field="name" value="${escapeAttr(category.name)}" aria-label="分类名称" />
      <input data-field="description" value="${escapeAttr(category.description)}" aria-label="分类说明" />
      <span class="category-count">${count} 人</span>
      <button class="icon-only" data-action="delete" title="删除分类" ${state.categories.length <= 1 ? "disabled" : ""}>
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `;
}

function deleteCategory(categoryId) {
  if (state.categories.length <= 1) return;
  const fallbackId = state.categories.find((category) => category.id !== categoryId)?.id;
  if (!fallbackId) return;

  state.people.forEach((person) => {
    if (person.categoryId === categoryId) person.categoryId = fallbackId;
  });
  state.categories = state.categories.filter((category) => category.id !== categoryId);
  state.selectedCategoryId = fallbackId;
  state.focusCategoryId = fallbackId;
  saveState();
  render();
}

function renderPersonCard(person) {
  const category = categoryById(person.categoryId);
  return `
    <article class="person-card" data-person-id="${person.id}">
      <button class="person-card-main" data-person-action="view">
        <strong>${escapeHtml(person.name)}</strong>
        <p class="meta-line">${escapeHtml(category?.name || "未分类")} / ${escapeHtml(person.relation || "未设置关系")}</p>
        <p class="meta-line">${escapeHtml(personContextLine(person))}</p>
        <p class="meta-line">${escapeHtml(person.personality || "还没有画像，适合先喂一段历史对话。")}</p>
      </button>
      <div class="tag-row">
        <span class="tag">重要程度 ${escapeHtml(person.importance || "中")}</span>
        <span class="tag">${person.memories?.length || 0} 条记忆</span>
      </div>
      <div class="person-card-actions">
        <button class="icon-only" data-person-action="view" title="查看详情">
          <i data-lucide="eye"></i>
        </button>
        <button class="icon-only" data-person-action="edit" title="编辑人物">
          <i data-lucide="pencil"></i>
        </button>
        <button class="icon-only danger" data-person-action="delete" title="删除人物">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </article>
  `;
}

function deletePerson(personId) {
  const person = personById(personId);
  if (!person) return;
  pendingDeletePersonId = personId;
  elements.deletePersonName.textContent = person.name;
  elements.deletePersonModal.showModal();
  if (window.lucide) lucide.createIcons();
}

function cancelDeletePerson() {
  pendingDeletePersonId = null;
  elements.deletePersonModal.close();
}

function confirmDeletePerson() {
  const personId = pendingDeletePersonId;
  if (!personId) return;
  const person = personById(personId);
  pendingDeletePersonId = null;
  elements.deletePersonModal.close();
  if (!person) return;

  state.people = state.people.filter((item) => item.id !== personId);
  if (state.selectedPersonId === personId) {
    state.selectedPersonId = firstPersonId();
  }
  if (state.focusPersonId === personId) {
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
  }
  if (state.route === "person" && !state.selectedPersonId) {
    state.route = "network";
    state.viewMode = "manage";
  }
  saveState();
  render();
}
function renderInsight(title, text) {
  return `
    <section class="insight-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text || "需要更多对话样本来判断。")}</p>
    </section>
  `;
}

function normalizePersonContext(person = {}) {
  const context = person.context || {};
  return {
    roleWeight: context.roleWeight || person.roleWeight || (person.importance === "高" ? "关键关系" : "普通往来"),
    closeness: context.closeness || person.closeness || "正常关系",
    contactFrequency: context.contactFrequency || person.contactFrequency || "不定期联系",
    background: context.background || person.background || ""
  };
}

function personContextLine(person) {
  const context = normalizePersonContext(person);
  return [context.roleWeight, context.closeness, context.contactFrequency].filter(Boolean).join(" / ");
}

function personBackgroundText(person) {
  const context = normalizePersonContext(person);
  return context.background || "还没有补充现实背景。可以写清楚关系分量、来往频率、对方负责什么、你希望维持到什么程度。";
}

function recommendStructure(person) {
  const context = normalizePersonContext(person);
  if (person.importance === "高" || /关键|领导|决策|重要/.test(context.roleWeight)) return "先结论，再风险，最后给下一步或需要对方拍板的点。";
  if (/亲近|私人|家庭/.test(`${context.closeness}${context.roleWeight}`) || person.categoryId === "friends" || person.categoryId === "family") return "先回应关系和感受，再回应事情，最后自然收束。";
  return "先确认对方诉求，再说明你的判断，最后给明确行动。";
}

function relationshipStrategy(person) {
  const category = categoryById(person.categoryId)?.name || "";
  const context = normalizePersonContext(person);
  if (/关键|领导|决策|高频/.test(`${context.roleWeight}${context.contactFrequency}`)) return "优先维护稳定预期：固定节奏同步，风险提前说，重要事项带方案。";
  if (category.includes("同事") || category.includes("客户")) return "把边界、时间点和责任写清楚，减少误会。";
  if (category.includes("亲人") || /亲近|家庭/.test(`${context.closeness}${context.roleWeight}`)) return "保留尊重感和连续关心，遇到分歧先降低对抗性。";
  return "保持真实和连续性，记住对方上次关心的事情。";
}

function buildConversationAnalysis(person) {
  const messages = (person?.chatHistory || []).slice(-8);
  const lastIncoming = [...messages].reverse().find((message) => message.role === "incoming")?.text || state.dialogueOpponentText || "";
  const lastOutgoing = [...messages].reverse().find((message) => message.role === "outgoing")?.text || state.dialogueOpeningText || "";
  const relation = person?.relation || "这段关系";
  const style = trimEndingPunctuation(person?.profile?.communication || person?.personality || "还需要继续观察");
  const structure = recommendStructure(person || {});

  if (!messages.length && !lastIncoming && !lastOutgoing) {
    return state.dialogueMode === "report"
      ? `你可以先写下想开口的话。系统会结合${relation}、对方画像和你的表达目标，判断怎么说更自然、风险更低。`
      : `把对方的话发进来后，这里会分析整段对话的真实诉求、模糊点、语气风险，以及你下一句该怎么接。`;
  }

  if (state.dialogueMode === "report") {
    return `当前更像“我方主动开口”。建议先明确你的真实目的，再按「${structure}」组织表达。对方已知风格：${style}。如果你担心显得冒犯，可以先给事实，再给选择题。`;
  }

  if (/随便|看着办|尽快|有空|再说|你觉得|都行|差不多/.test(lastIncoming)) {
    return `对方最近的话有模糊空间，可能在试探你的态度、优先级或责任边界。建议先确认目标和时间，不要直接承诺。面对${relation}，回复里最好补一个可执行下一步。`;
  }

  return `这段对话可以先按“诉求识别”处理：对方可能在要信息、要承诺、要情绪回应，或要你主动推进。对方已知风格：${style}。建议回复结构：${structure}。`;
}

async function analyzeDialogueIntent(person) {
  const intent = ($("#dialogueIntentInput")?.value || state.dialogueIntentInput || "").trim();
  if (!intent) return;
  state.dialogueIntentInput = intent;
  state.dialogueIntentAnalysis = canUseOnlineAi() ? "AI 正在分析你的问题类型、关系策略和下一步做法..." : buildLocalIntentAnalysis(person, intent);
  saveState();
  renderDialogueAnalysisPanel(person);

  if (!canUseOnlineAi()) return;

  try {
    const online = await buildIntentAnalysisWithAi(person, intent);
    state.dialogueIntentAnalysis = online || buildLocalIntentAnalysis(person, intent);
  } catch (error) {
    state.dialogueIntentAnalysis = `在线 AI 分析失败，已使用本地规则：${error.message || error} / ${buildLocalIntentAnalysis(person, intent)}`;
  }
  saveState();
  renderDialogueAnalysisPanel(person);
}

function buildLocalIntentAnalysis(person, intent) {
  const cleanIntent = trimEndingPunctuation(intent);
  const relation = person?.relation || "这段关系";
  const context = normalizePersonContext(person || {});
  const contextHint = personContextLine(person || {});
  const style = trimEndingPunctuation(person?.profile?.communication || person?.personality || "需要更多样本判断");
  const structure = recommendStructure(person || {});
  const asksForStrategy = /怎么做|该怎么|怎么办|节奏|频率|安排|计划|策略|建议|分析|了解|判断|适合|比较好|要不要|需不需要|如何/.test(intent);
  const asksForMessage = /怎么说|怎么回|回复|开口|发给|告诉|表达|汇报.*怎么写|话术/.test(intent);
  if (asksForStrategy && !asksForMessage) {
    const strategy = /汇报|进度|同步|节奏|频率/.test(intent)
      ? `建议建立“固定节奏 + 异常即时同步”：普通进度每周或每个关键节点给一次短同步；进入交付前可以提高到两三天一次；风险、延期、资源缺口一出现就即时同步。面对${relation}，结合“${contextHint}”，重点不是问对方什么时候想听，而是让对方稳定感知你在推进。`
      : /关系|好感|信任|印象|相处/.test(intent)
        ? `建议从“可靠感”入手：少做突然承诺，多做提前同步；少解释动机，多给可验证结果。面对${relation}，结合“${contextHint}”，让对方觉得你稳定、可预期、能兜住事情。`
        : `建议先把问题拆成目标、风险、对方关注点和你的下一步动作。面对${relation}，结合“${contextHint}”，优先选择能降低对方不确定感的做法。`;
    return `这是策略咨询，不是要直接发给对方的话。你的问题：${cleanIntent}。${strategy} 人物背景：${context.background || "暂无补充"}。可参考结构：「${trimEndingPunctuation(structure)}」。对方已知风格：${style}。`;
  }

  const risk = /风险|延期|来不及|问题|担心|不确定|做不到/.test(intent)
    ? "核心风险是被理解成推责或制造压力，所以要同时给事实、影响和备选方案。"
    : /拒绝|不想|不能|不方便|边界/.test(intent)
      ? "核心风险是显得生硬。建议先承认对方需求，再说明边界和可替代方案。"
      : /帮忙|支持|资源|协调|配合/.test(intent)
        ? "核心风险是诉求不够具体。建议说清需要谁、做什么、截止到什么时候。"
        : "核心风险是目的太隐含，对方可能不知道你要他判断、配合还是只需要知情。";
  return `这是表达优化。你的目标：${cleanIntent}。面对${relation}，建议按「${trimEndingPunctuation(structure)}」说，先让对方知道你不是单纯表达情绪，而是在推进问题。${risk} 对方已知风格：${style}。`;
}

async function buildIntentAnalysisWithAi(person, intent) {
  const config = state.aiConfig || {};
  const response = await fetch(aiEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: "你是一个中文人际关系策略助手。用户输入可能是两类：1）策略咨询：想知道针对某个人该怎么做、怎么安排节奏、如何维护关系；2）表达优化：已经准备对对方说一段话，想知道怎么说更好。你必须先判断属于哪类。若是策略咨询，不要把用户的话当成要发给对方的话，不要生成“你可以这样问他”的话术，优先给行动建议、判断依据、节奏安排和注意事项。若是表达优化，再分析真实意图、表达风险、对方可能怎么理解，并给更自然的说法。输出一段中文，具体、克制、可执行，不要空泛。"
        },
        {
          role: "user",
          content: [
            `对象：${person?.name || "对方"} / ${person?.relation || "未设置关系"}`,
            `人物背景：${JSON.stringify(normalizePersonContext(person || {}), null, 2)}`,
            `对方画像：${person?.profile?.communication || person?.personality || "未知"}`,
            `近期对话：`,
            ...(person?.chatHistory || []).slice(-10).map((message) => `${message.role === "incoming" ? "对方" : "我方"}：${message.text}`),
            `用户输入的问题或意图：${intent}`
          ].join("\n")
        }
      ],
      temperature: 0.55
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}${errorText ? `：${errorText.slice(0, 120)}` : ""}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

function canUseOnlineAi() {
  const config = normalizeAiConfig();
  return config.enabled === true && !!config.apiKey && !!config.baseUrl && !!config.model;
}

function normalizeAiBaseUrl(value = "") {
  return String(value || "").trim().replace(/\/+$/, "");
}

function buildAiUrl(path) {
  const baseUrl = normalizeAiBaseUrl(normalizeAiConfig().baseUrl);
  if (!baseUrl) return "";
  const cleanPath = String(path || "").replace(/^\/+/, "");
  if (cleanPath === "chat/completions" && /\/chat\/completions$/i.test(baseUrl)) return baseUrl;
  if (cleanPath === "models" && /\/chat\/completions$/i.test(baseUrl)) {
    return baseUrl.replace(/\/chat\/completions$/i, "/models");
  }
  return `${baseUrl}/${cleanPath}`;
}

function aiEndpoint() {
  return buildAiUrl("chat/completions");
}

function aiModelsEndpoint() {
  return buildAiUrl("models");
}

function aiSystemPrompt() {
  return [
    "你是一个中文人际沟通助手，帮助用户判断对方意图、生成高情商且真实可执行的回复。",
    "不要操控他人，不要把心理分析当事实，要用“可能、倾向、建议”表达不确定性。",
    "先判断用户是在要“行动策略”还是要“发送给对方的话”。如果是行动策略，不要把用户的问题改写成要发给对方的句子。",
    "回复建议要贴合人物背景、关系分量、亲近程度、来往频率、历史记忆和当前上下文。",
    "选项 A/B/C 应体现不同沟通策略：稳妥推进、亲和缓冲、边界确认，不能只是换同义词。",
    "如果信息不足，要在 analysis 里指出缺口，并给可确认的问题或下一步。",
    "必须只返回 JSON，不要 Markdown，不要解释。",
    "JSON 格式：{\"opponentText\":\"...\",\"analysis\":\"...\",\"options\":[{\"key\":\"A\",\"title\":\"稳妥版\",\"text\":\"...\"},{\"key\":\"B\",\"title\":\"亲和版\",\"text\":\"...\"},{\"key\":\"C\",\"title\":\"边界版\",\"text\":\"...\"}]}",
    "options 必须正好 3 条，key 必须是 A、B、C。"
  ].join("\n");
}

function aiUserPrompt(person, mode, input, opponentText = "") {
  const category = categoryById(person?.categoryId)?.name || "未分类";
  const memories = (person?.memories || [])
    .slice(0, 6)
    .map((memory) => `${memory.title}: ${memory.text}`)
    .join("\n");
  return [
    `当前模式：${mode === "report" ? "我方先说，先模拟对方可能回复，再生成我方下一轮回复" : "对方已经说了这句话，生成我方回复建议"}`,
    `人物：${person?.name || "对方"}`,
    `分类：${category}`,
    `关系：${person?.relation || "未设置"}`,
    `人物背景：${JSON.stringify(normalizePersonContext(person || {}), null, 2)}`,
    `性格/说话风格：${person?.personality || "暂无"}`,
    `注意事项：${person?.notes || "暂无"}`,
    `画像：${JSON.stringify(person?.profile || {}, null, 2)}`,
    `历史记忆：${memories || "暂无"}`,
    `用户输入：${input || "无"}`,
    `对方真实/预测回复：${opponentText || "无"}`,
    mode === "report"
      ? "请生成 opponentText，表示对方可能会怎么回；同时生成我方下一轮可选回复。"
      : "请不要编造 opponentText，opponentText 返回空字符串；请分析对方意图并生成我方可选回复。"
  ].join("\n\n");
}

function extractJsonObject(text) {
  const raw = String(text || "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("模型返回不是 JSON");
    return JSON.parse(match[0]);
  }
}

function normalizeAiAdvice(payload, fallback) {
  const options = Array.isArray(payload.options) ? payload.options.slice(0, 3) : [];
  const normalizedOptions = ["A", "B", "C"].map((key, index) => {
    const option = options[index] || fallback.options?.[index] || {};
    return {
      key,
      title: String(option.title || fallback.options?.[index]?.title || `${key} 方案`).slice(0, 24),
      text: String(option.text || fallback.options?.[index]?.text || "").trim()
    };
  });

  return {
    opponentText: String(payload.opponentText || fallback.opponentText || "").trim(),
    analysis: String(payload.analysis || fallback.analysis || "").trim(),
    options: normalizedOptions.every((option) => option.text) ? normalizedOptions : fallback.options
  };
}

async function buildAdviceWithAi(person, mode, input, opponentText = "") {
  const fallback = buildAdvice(person, mode, input, opponentText);
  if (!canUseOnlineAi()) return fallback;

  const config = normalizeAiConfig();
  try {
    const response = await fetch(aiEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: aiSystemPrompt() },
          { role: "user", content: aiUserPrompt(person, mode, input, opponentText) }
        ],
        temperature: 0.45
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${errorText ? `：${errorText.slice(0, 120)}` : ""}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return normalizeAiAdvice(extractJsonObject(content), fallback);
  } catch (error) {
    return {
      ...fallback,
      analysis: `在线 AI 请求失败，已回退本地模拟：${error.message || error}\n\n${fallback.analysis}`
    };
  }
}

async function distillPersonProfile(personId, rawText, surface, options = {}) {
  const person = personById(personId);
  const text = String(rawText || "").trim();
  if (!person || !text) return;
  const statusEl = $("#chatImportStatus");
  if (statusEl && surface === "person") {
    statusEl.textContent = canUseOnlineAi() ? "正在调用 AI 蒸馏画像..." : "正在使用本地规则蒸馏画像...";
  }

  person.profile = person.profile || {};
  person.memories = person.memories || [];
  const distilled = await buildProfileDistillWithAi(person, text);
  person.profile.communication = distilled.communication || inferCommunication(text, person.profile.communication);
  person.profile.work = distilled.work || inferWorkStyle(text, person.profile.work);
  person.profile.goodwill = distilled.goodwill || inferGoodwill(text, person.profile.goodwill);
  person.profile.avoid = distilled.avoid || inferAvoidance(text, person.profile.avoid);
  if (distilled.notes) person.notes = distilled.notes;
  person.personality = summarizePersonality(person);
  person.memories.unshift({
    id: `mem_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title: options.title || "画像蒸馏",
    text: distilled.memoryText || `Sample: ${text.slice(0, 180)} / Updated: ${person.profile.communication}`,
    createdAt: new Date().toISOString()
  });
  state.lessons.unshift(`蒸馏${person.name}：${person.profile.communication}`.slice(0, 90));
  saveState();

  if (surface === "network") {
    state.focusPersonPanelExpanded = true;
    renderNetwork();
    return;
  }

  renderPerson();
}

function localProfileDistill(person, text) {
  return {
    communication: inferCommunication(text, person.profile?.communication),
    work: inferWorkStyle(text, person.profile?.work),
    goodwill: inferGoodwill(text, person.profile?.goodwill),
    avoid: inferAvoidance(text, person.profile?.avoid),
    notes: person.notes || "",
    memoryText: `样本摘要：${text.slice(0, 180)} / 更新：${inferCommunication(text, person.profile?.communication)}`
  };
}

function profileDistillSystemPrompt() {
  return [
    "你是一个中文人际关系画像蒸馏助手。",
    "你会从聊天记录中总结对方的说话风格、做事风格、好感触发、避雷点和相处注意事项。",
    "用户手动填写的人物背景、关系分量、亲近程度和来往频率是重要上下文，不要忽略；但不要擅自改写这些事实。",
    "优先总结稳定、反复出现的模式；对偶发情绪、单句反应、玩笑话要降低权重。",
    "如果聊天记录中我方/对方身份不清楚，要在 notes 或 memoryText 里提示样本置信度不足。",
    "不要把猜测当事实，要用“倾向、可能、建议”表达不确定性。",
    "只返回 JSON，不要 Markdown，不要解释。",
    "JSON 格式：{\"communication\":\"...\",\"work\":\"...\",\"goodwill\":\"...\",\"avoid\":\"...\",\"notes\":\"...\",\"memoryText\":\"...\"}",
    "每个字段都要短而具体，memoryText 用 180 字以内概括这次导入得到的新信息。"
  ].join("\n");
}

function profileDistillUserPrompt(person, text) {
  return [
    `人物：${person.name}`,
    `关系：${person.relation || "未设置"}`,
    `人物背景：${JSON.stringify(normalizePersonContext(person || {}), null, 2)}`,
    `已有性格：${person.personality || "暂无"}`,
    `已有画像：${JSON.stringify(person.profile || {}, null, 2)}`,
    `已有注意事项：${person.notes || "暂无"}`,
    "聊天记录或导入摘要：",
    text.slice(0, 12000)
  ].join("\n\n");
}

function normalizeProfileDistill(payload, fallback) {
  return {
    communication: String(payload.communication || fallback.communication || "").trim(),
    work: String(payload.work || fallback.work || "").trim(),
    goodwill: String(payload.goodwill || fallback.goodwill || "").trim(),
    avoid: String(payload.avoid || fallback.avoid || "").trim(),
    notes: String(payload.notes || fallback.notes || "").trim(),
    memoryText: String(payload.memoryText || fallback.memoryText || "").trim()
  };
}

async function buildProfileDistillWithAi(person, text) {
  const fallback = localProfileDistill(person, text);
  if (!canUseOnlineAi()) return fallback;

  const config = normalizeAiConfig();
  try {
    const response = await fetch(aiEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: profileDistillSystemPrompt() },
          { role: "user", content: profileDistillUserPrompt(person, text) }
        ],
        temperature: 0.35
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${errorText ? `：${errorText.slice(0, 120)}` : ""}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return normalizeProfileDistill(extractJsonObject(content), fallback);
  } catch (error) {
    return {
      ...fallback,
      memoryText: `在线 AI 蒸馏失败，已使用本地规则：${error.message || error} / ${fallback.memoryText}`
    };
  }
}

async function importChatTranscriptFile(personId, file, surface = "person") {
  const person = personById(personId);
  const statusEl = $("#chatImportStatus");
  if (!person || !file) return;

  if (statusEl) statusEl.textContent = `正在读取 ${file.name}...`;
  try {
    const rawText = await readTextFile(file);
    assertReadableChatText(rawText, file.name);
    const parsed = parseChatTranscript(rawText, person, file.name);
    if (!parsed.distillText.trim()) throw new Error("文件中没有可识别的文本内容");
    if (surface === "person") {
      state.pendingChatImport = {
        personId,
        fileName: file.name,
        distillText: parsed.distillText,
        stats: parsed.stats,
        preview: parsed.messages.slice(0, 20).map((message) => ({
          role: message.role,
          speaker: message.speaker,
          text: message.text.slice(0, 160)
        })),
        createdAt: new Date().toISOString()
      };
      saveState();
      renderPerson();
      return;
    }
    if (statusEl) {
      statusEl.textContent = `已识别 ${parsed.stats.total} 条消息：我方 ${parsed.stats.self}，对方 ${parsed.stats.opponent}，未知 ${parsed.stats.unknown}。正在蒸馏...`;
    }
    await distillPersonProfile(personId, parsed.distillText, surface, {
      source: "file",
      title: `导入蒸馏：${file.name}`
    });
    const refreshedStatus = $("#chatImportStatus");
    if (refreshedStatus) {
      refreshedStatus.textContent = `导入完成：${file.name}，识别 ${parsed.stats.total} 条消息。识别不准时，可把昵称改成“我：”和“${person.name}：”后重新导入。`;
    }
  } catch (error) {
    if (statusEl) statusEl.textContent = `导入失败：${error.message || error}`;
  }
}

async function confirmPendingChatImport() {
  const pending = state.pendingChatImport;
  const person = personById(pending?.personId);
  if (!pending || !person) return;
  await distillPersonProfile(person.id, pending.distillText, "person", {
    source: "file",
    title: `导入蒸馏：${pending.fileName}`
  });
  state.pendingChatImport = null;
  saveState();
  renderPerson();
}

function cancelPendingChatImport() {
  state.pendingChatImport = null;
  saveState();
  renderPerson();
}

async function readTextFile(file) {
  if (file.arrayBuffer && window.TextDecoder) {
    const buffer = await file.arrayBuffer();
    return decodeChatTextBuffer(buffer);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("无法读取文件"));
    reader.readAsText(file, "utf-8");
  });
}

function decodeChatTextBuffer(buffer) {
  const encodings = ["utf-8", "gb18030"];
  const decoded = encodings
    .map((encoding) => {
      try {
        return {
          encoding,
          text: new TextDecoder(encoding, { fatal: false }).decode(buffer)
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return decoded
    .sort((left, right) => scoreDecodedChatText(right.text) - scoreDecodedChatText(left.text))[0]?.text || "";
}

function scoreDecodedChatText(text) {
  const raw = String(text || "");
  const replacementChars = (raw.match(/\uFFFD/g) || []).length;
  const chineseChars = (raw.match(/[\u4e00-\u9fff]/g) || []).length;
  const chatMarks = (raw.match(/[：:]|20\d{2}[-/年.]|\d{1,2}:\d{2}|消息记录|聊天记录/g) || []).length;
  const controlChars = (raw.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  return chineseChars * 2 + chatMarks * 8 - replacementChars * 20 - controlChars * 12;
}

function parseChatTranscript(rawText, person, fileName = "聊天记录") {
  const raw = normalizeImportedChatText(rawText, fileName);
  const fromJson = parseChatJson(raw, person);
  const messages = fromJson.length ? fromJson : parsePlainChatLines(raw, person);
  const usable = messages.length
    ? messages
    : raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 600)
        .map((text) => ({ role: "unknown", speaker: "未知", text }));
  const stats = usable.reduce(
    (result, message) => {
      result.total += 1;
      result[message.role] = (result[message.role] || 0) + 1;
      return result;
    },
    { total: 0, self: 0, opponent: 0, unknown: 0 }
  );
  const compactLines = usable
    .slice(-900)
    .map((message) => `${roleLabel(message.role)}${message.speaker ? `(${message.speaker})` : ""}: ${message.text}`)
    .join("\n");

  return {
    stats,
    messages: usable,
    distillText: [
      `导入文件：${fileName}`,
      `识别统计：共 ${stats.total} 条，我方 ${stats.self}，对方 ${stats.opponent}，未知 ${stats.unknown}。`,
      `说明：未知说话人不要强行归因，只作为语境参考。`,
      compactLines.slice(0, 18000)
    ].join("\n")
  };
}

function normalizeImportedChatText(rawText, fileName = "") {
  let raw = String(rawText || "");
  if (/\.(html?|mht)$/i.test(fileName) || /<\/?[a-z][\s\S]*>/i.test(raw.slice(0, 2000))) {
    raw = raw
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");
  }
  return raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function assertReadableChatText(rawText, fileName = "") {
  const raw = String(rawText || "");
  const ext = (fileName.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
  const visible = raw.replace(/\s/g, "");
  const controlChars = (raw.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  const replacementChars = (raw.match(/\uFFFD/g) || []).length;
  const suspiciousBinary = controlChars > Math.max(12, raw.length * 0.015) || replacementChars > Math.max(12, raw.length * 0.02);
  const scriptLikeBat = ext === "bat" && /^\s*(@echo\s+off|echo\s+|set\s+|chcp\s+|cd\s+|copy\s+|xcopy\s+|start\s+|cmd\s+|pause\b)/i.test(raw.slice(0, 1200));

  if (!visible) {
    throw new Error("文件没有可读取文本。QQ 备份文件请在消息管理器里另存为 TXT 或 HTML 后再导入。");
  }

  if (suspiciousBinary) {
    throw new Error("这个文件看起来不是明文聊天记录，可能是 QQ 备份文件。请在 QQ 消息管理器里导出 TXT/HTML，或把内容复制到 TXT 后再导入。");
  }

  if (scriptLikeBat) {
    throw new Error("这个 BAT 看起来是批处理脚本，不是聊天记录。请在 QQ 消息管理器里导出 TXT/HTML，或打开记录后复制可读聊天内容到 TXT 再导入。");
  }
}

function parseChatJson(raw, person) {
  try {
    const payload = JSON.parse(raw);
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.messages)
        ? payload.messages
        : Array.isArray(payload.chatHistory)
          ? payload.chatHistory
          : [];
    return list
      .map((item) => {
        const speaker = String(item.sender || item.name || item.speaker || item.from || item.role || "").trim();
        const text = String(item.text || item.content || item.message || "").trim();
        if (!text) return null;
        return {
          role: classifySpeaker(speaker, person),
          speaker,
          text
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parsePlainChatLines(raw, person) {
  const messages = [];
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  const speakerLine = /^(.{1,32}?)[：:]\s*(.+)$/;
  const bracketLine = /^(?:\[?20\d{2}[^\]]{0,24}\]?\s*)?(.{1,32}?)[：:]\s*(.+)$/;
  const timeSpeakerLine = /^(?:20\d{2}[-/年.]\d{1,2}[-/月.]\d{1,2}[^\s]{0,3}\s+\d{1,2}:\d{2}(?::\d{2})?\s+)(.{1,32})$/;
  let pendingSpeaker = "";

  lines.forEach((line) => {
    const timeSpeaker = line.match(timeSpeakerLine);
    if (timeSpeaker) {
      pendingSpeaker = timeSpeaker[1].trim();
      return;
    }

    const matched = line.match(bracketLine) || line.match(speakerLine);
    if (matched && !/https?:\/\//i.test(matched[1])) {
      const speaker = cleanSpeakerName(matched[1]);
      const text = matched[2].trim();
      if (text) messages.push({ role: classifySpeaker(speaker, person), speaker, text });
      pendingSpeaker = "";
      return;
    }

    if (pendingSpeaker) {
      messages.push({
        role: classifySpeaker(pendingSpeaker, person),
        speaker: cleanSpeakerName(pendingSpeaker),
        text: line
      });
      pendingSpeaker = "";
      return;
    }

    const last = messages[messages.length - 1];
    if (last && line.length < 500) {
      last.text = `${last.text}\n${line}`;
    } else {
      messages.push({ role: "unknown", speaker: "未知", text: line });
    }
  });

  return messages.filter((message) => message.text && !/^\[?(图片|表情|语音|视频|文件)\]?$/i.test(message.text));
}

function cleanSpeakerName(value) {
  return String(value || "")
    .replace(/^\[?20\d{2}[-/年.]\d{1,2}[-/月.]\d{1,2}[^\]]*\]?\s*/, "")
    .replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*/, "")
    .trim();
}

function classifySpeaker(speaker, person) {
  const name = String(speaker || "").trim().toLowerCase();
  const userName = String(state.userProfile?.displayName || "").trim().toLowerCase();
  const opponentName = String(person?.name || "").trim().toLowerCase();
  if (!name) return "unknown";
  if (["我", "本人", "自己", "me", "self", "user", "outgoing"].includes(name) || (userName && name.includes(userName))) return "self";
  if (["对方", "ta", "incoming"].includes(name) || (opponentName && name.includes(opponentName))) return "opponent";
  return "unknown";
}

function roleLabel(role) {
  if (role === "self") return "我方";
  if (role === "opponent") return "对方";
  return "未知";
}

function inferCommunication(input, fallback) {
  if (/马上|尽快|今天|截止|结果|进度|风险/.test(input)) return "更关注效率、结果和明确时间点。";
  if (/感觉|难受|开心|在意|不舒服|谢谢/.test(input)) return "更重视情绪回应和关系里的被看见感。";
  if (/责任|流程|确认|邮件|记录|范围/.test(input)) return "更关注流程、边界和留痕。";
  return fallback || "需要更多样本继续判断。";
}

function inferWorkStyle(input, fallback) {
  if (/流程|审批|记录|邮件|确认|责任|范围/.test(input)) return "做事偏谨慎，重流程、记录和责任边界。";
  if (/结果|指标|进度|截止|马上|尽快|效率/.test(input)) return "做事结果导向，关注进度、效率和可交付结果。";
  if (/感受|关系|舒服|理解|支持|谢谢/.test(input)) return "做事会考虑关系氛围和对方感受，适合留出情绪缓冲。";
  return fallback || "需要更多样本继续判断。";
}

function inferGoodwill(input, fallback) {
  if (/谢谢|辛苦|理解|支持|帮忙|感谢/.test(input)) return "先表达理解和感谢，再给具体回应，会更容易建立好感。";
  if (/风险|问题|担心|不确定|影响/.test(input)) return "提前同步风险，并带着可选方案沟通，会更容易获得信任。";
  if (/确认|时间|范围|截止|责任/.test(input)) return "给出明确时间点、范围和下一步，会让对方感觉可靠。";
  return fallback || "继续积累真实对话，优先记录对方反复强调的点。";
}

function inferAvoidance(input, fallback) {
  if (/别|不要|不希望|不接受|不能|不行/.test(input)) return "避免直接否定或硬碰硬，先确认对方底线再表达你的边界。";
  if (/责任|甩锅|范围|确认/.test(input)) return "避免模糊承诺和口头拍板，重要事项要留痕。";
  if (/着急|马上|尽快|催/.test(input)) return "避免沉默或只回“好的”，要补充反馈时间和下一步。";
  return fallback || "需要更多样本继续判断。";
}

function summarizePersonality(person) {
  return [person.profile?.communication, person.profile?.work]
    .filter(Boolean)
    .map((item) => trimEndingPunctuation(item))
    .join("，")
    .slice(0, 90) || person.personality || "";
}

function trimEndingPunctuation(value = "") {
  return String(value).replace(/[。！？!?.,，；;]+$/g, "");
}

function renderSchedule() {
  const today = new Date();
  if (elements.scheduleDate) {
    elements.scheduleDate.textContent = today.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "short"
    });
  }
  renderMonthCalendar(today);
  renderScheduleForm();

  const scheduleItems = buildScheduleItems();
  elements.todoList.innerHTML = scheduleItems.length
    ? scheduleItems.map(renderScheduleItem).join("")
    : `<div class="empty-schedule">还没有人物档案。先添加联系人后，这里会自动生成关系维护时间表。</div>`;

  if (elements.weeklyPlan) {
    elements.weeklyPlan.innerHTML = buildWeeklyPlan()
      .map(
        (item) => `
          <div class="week-item ${item.active ? "active" : ""}">
            <strong>${escapeHtml(item.day)}</strong>
            <span>${escapeHtml(item.focus)}</span>
          </div>
        `
      )
      .join("");
  }

  elements.lessonList.innerHTML = state.lessons
    .slice(0, 5)
    .map(
      (lesson) => `
        <div class="todo-item compact">
          <strong>学习点</strong>
          <span>${escapeHtml(lesson)}</span>
        </div>
      `
    )
    .join("");

  elements.todoList.querySelectorAll("[data-schedule-person]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPersonId = button.dataset.schedulePerson;
      setRoute("person");
    });
  });
  elements.todoList.querySelectorAll("[data-schedule-action]").forEach((button) => {
    button.addEventListener("click", () => updateManualSchedule(button.dataset.scheduleId, button.dataset.scheduleAction));
  });
}

function renderScheduleForm() {
  const form = elements.scheduleForm;
  if (!form) return;
  form.elements.personId.innerHTML = [
    `<option value="">不绑定人物</option>`,
    ...state.people.map((person) => `<option value="${escapeAttr(person.id)}">${escapeHtml(person.name)}</option>`)
  ].join("");
}

function renderMonthCalendar(today = new Date()) {
  if (!elements.monthCalendar) return;

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const leading = (firstDay.getDay() + 6) % 7;
  const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
  const cells = Array.from({ length: 42 }, (_, index) => {
    const offset = index - leading + 1;
    const inMonth = offset >= 1 && offset <= daysInMonth;
    const day = inMonth ? offset : offset < 1 ? daysInPrevMonth + offset : offset - daysInMonth;
    const date = inMonth ? new Date(year, month, day) : offset < 1 ? new Date(year, month - 1, day) : new Date(year, month + 1, day);
    return { date, day, inMonth, today: isSameDate(date, today) };
  });

  elements.monthCalendar.innerHTML = `
    <div class="month-calendar-head">
      <strong>${escapeHtml(today.toLocaleDateString("zh-CN", { year: "numeric", month: "long" }))}</strong>
      <span>${escapeHtml(lunarDayLabel(today))}</span>
    </div>
    <div class="month-weekdays">
      ${weekdays.map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
    </div>
    <div class="month-grid">
      ${cells
        .map(
          (cell) => `
            <span class="month-day ${cell.inMonth ? "" : "muted"} ${cell.today ? "today" : ""}">
              <strong>${cell.day}</strong>
              <small>${escapeHtml(lunarDayLabel(cell.date))}</small>
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function lunarDayLabel(date) {
  try {
    const label = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", { month: "long", day: "numeric" }).format(date);
    const day = label.replace(/^.*月/, "").replace(/日$/, "");
    return /[初十廿卅]/.test(day) ? day : label;
  } catch {
    return ["初一", "初二", "初三", "初四", "初五", "初六", "初七"][date.getDate() % 7];
  }
}

function buildScheduleItems() {
  const rankedPeople = [...state.people].sort((a, b) => importanceWeight(b.importance) - importanceWeight(a.importance));
  const primary = rankedPeople[0];
  const secondary = rankedPeople[1];
  const social = rankedPeople.find((person) => ["friends", "family"].includes(person.categoryId)) || rankedPeople[2];
  const peopleToReview = rankedPeople.slice(0, 3).map((person) => person.name).join("、");

  const autoItems = [
    primary && {
      time: "09:30",
      duration: "15 分钟",
      type: "重点",
      title: `${primary.name}：预判今天可能要沟通的事项`,
      detail: `${relationshipStrategy(primary)} 先准备一个“结论-风险-下一步”的简短版本。`,
      personId: primary.id
    },
    secondary && {
      time: "11:00",
      duration: "10 分钟",
      type: "跟进",
      title: `${secondary.name}：补一条低打扰跟进`,
      detail: `确认对方是否需要你补信息，避免只说“好的”。推荐结构：${recommendStructure(secondary)}`,
      personId: secondary.id
    },
    {
      time: "14:30",
      duration: "20 分钟",
      type: "项目",
      title: "整理项目汇报素材",
      detail: "把进度、风险、需要拍板的问题分开写，后续进入模拟对话时可以直接生成汇报话术。"
    },
    social && {
      time: "17:30",
      duration: "8 分钟",
      type: "维护",
      title: `${social.name}：自然问候或回应近况`,
      detail: "不要像任务打卡，选择一个具体小事切入，让关系维护更像真实关心。",
      personId: social.id
    },
    {
      time: "20:30",
      duration: "12 分钟",
      type: "复盘",
      title: "记录今天的人际反馈",
      detail: peopleToReview ? `回看 ${peopleToReview} 的互动，有新信息就补进画像或记忆。` : "记录今天遇到的模糊表达、有效回复和踩雷点。"
    }
  ].filter(Boolean).map((item, index) => ({ ...item, id: `auto_${index}`, source: "auto", status: "todo" }));

  const manualItems = (state.manualSchedules || []).map((item) => ({
    ...item,
    source: "manual",
    duration: item.duration || "10 分钟",
    type: item.status === "done" ? "已完成" : item.status === "delayed" ? "延期" : item.status === "ignored" ? "忽略" : item.type || "手动"
  }));

  return [...manualItems, ...autoItems].sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
}

function renderScheduleItem(item) {
  const statusClass = item.status && item.status !== "todo" ? ` ${item.status}` : "";
  return `
    <article class="time-row${statusClass}">
      <div class="time-slot">
        <strong>${escapeHtml(item.time)}</strong>
        <span>${escapeHtml(item.duration)}</span>
      </div>
      <div class="schedule-event">
        <div class="event-head">
          <span class="event-type">${escapeHtml(item.type)}</span>
          ${item.personId ? `<button class="mini-link" data-schedule-person="${item.personId}">查看人物</button>` : ""}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.detail)}</p>
        ${item.source === "manual" ? `
          <div class="schedule-actions">
            <button class="mini-link" data-schedule-id="${escapeAttr(item.id)}" data-schedule-action="done">完成</button>
            <button class="mini-link" data-schedule-id="${escapeAttr(item.id)}" data-schedule-action="delayed">延期</button>
            <button class="mini-link" data-schedule-id="${escapeAttr(item.id)}" data-schedule-action="ignored">忽略</button>
            <button class="mini-link danger-link" data-schedule-id="${escapeAttr(item.id)}" data-schedule-action="delete">删除</button>
          </div>
        ` : ""}
      </div>
    </article>
  `;
}

function addManualScheduleFromForm() {
  const form = elements.scheduleForm;
  if (!form) return;
  const title = form.elements.title.value.trim();
  if (!title) return;
  const person = personById(form.elements.personId.value);
  state.manualSchedules.unshift({
    id: `schedule_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    time: form.elements.time.value || "09:30",
    duration: "10 分钟",
    type: "手动",
    title,
    detail: person ? `绑定人物：${person.name}。建议结合此人的画像准备沟通。` : "手动添加的关系维护事项。",
    personId: person?.id || "",
    status: "todo",
    createdAt: new Date().toISOString()
  });
  form.elements.title.value = "";
  form.elements.personId.value = "";
  saveState();
  renderSchedule();
}

function updateManualSchedule(scheduleId, action) {
  const item = (state.manualSchedules || []).find((schedule) => schedule.id === scheduleId);
  if (!item) return;
  if (action === "delete") {
    state.manualSchedules = state.manualSchedules.filter((schedule) => schedule.id !== scheduleId);
  } else {
    item.status = action;
    item.updatedAt = new Date().toISOString();
  }
  saveState();
  renderSchedule();
}

function buildWeeklyPlan() {
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const focus = ["领导/高优先级", "同事协作", "朋友近况", "客户/外部", "复盘沉淀", "轻维护", "下周预案"];
  const todayIndex = (new Date().getDay() + 6) % 7;
  return days.map((day, index) => ({ day, focus: focus[index], active: index === todayIndex }));
}

function importanceWeight(value) {
  if (value === "高") return 3;
  if (value === "中") return 2;
  return 1;
}

function renderSettings() {
  if (elements.offlineModeToggle) {
    elements.offlineModeToggle.checked = state.offlineMode !== false;
  }
  if (elements.memoryStatus) {
    elements.memoryStatus.textContent = lastStateSaveError
      ? `保存失败：${lastStateSaveError}。请先导出记忆，避免刷新后丢失。`
      : lastStateLoadError ? `读取本地缓存失败：${lastStateLoadError}。已尝试保留损坏缓存备份，请导入最近备份恢复。`
      : state.offlineMode === false ? "云同步预留模式：当前仍只保存在本地。" : "离线模式开启：当前记忆只保存在本地浏览器。";
  }
  if (elements.storageLocation) {
    elements.storageLocation.textContent = window.desktopBridge
      ? "当前存储位置：软件本机数据目录（Windows 通常在 %APPDATA%\\AI人际管家），安装包更新不会覆盖。"
      : "当前存储位置：当前浏览器 localStorage，换浏览器或清理站点数据前请先导出记忆。";
  }

  renderAiConfig();
  renderCategoryEditor(elements.categoryEditor);
  renderDiagnostics();
}

function renderDiagnostics() {
  if (!elements.diagnosticsPanel) return;
  const memoryCount = state.people.reduce((sum, person) => sum + (person.memories || []).length, 0);
  const chatCount = state.people.reduce((sum, person) => sum + (person.chatHistory || []).length, 0);
  const config = normalizeAiConfig();
  const aiReady = config.enabled && config.apiKey && config.baseUrl && config.model;
  const storageLabel = window.desktopBridge ? "%APPDATA%\\AI人际管家" : "localStorage";
  const lastBackup = state.lastBackupAt ? new Date(state.lastBackupAt).toLocaleString("zh-CN") : "尚未备份";
  const diagnostics = [
    ["版本", appVersion()],
    ["存储位置", storageLabel],
    ["分类数量", state.categories.length],
    ["人物数量", state.people.length],
    ["记忆数量", memoryCount],
    ["真实对话", chatCount],
    ["手动日程", (state.manualSchedules || []).length],
    ["AI 状态", aiReady ? "在线配置可用" : "本地模拟/配置未完整"],
    ["最近备份", lastBackup],
    ["读取状态", lastStateLoadError || "正常"],
    ["保存状态", lastStateSaveError || "正常"]
  ];
  elements.diagnosticsPanel.innerHTML = diagnostics
    .map(([label, value]) => `
      <div class="diagnostic-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `)
    .join("");
}

function appVersion() {
  return "0.1.8";
}

function renderAiConfig() {
  const config = normalizeAiConfig();
  if (elements.aiEnabledToggle) elements.aiEnabledToggle.checked = config.enabled === true;
  if (elements.aiProviderSelect) elements.aiProviderSelect.value = config.provider || "deepseek";
  if (elements.aiModelInput) elements.aiModelInput.value = config.model || "";
  if (elements.aiBaseUrlInput) elements.aiBaseUrlInput.value = config.baseUrl || "";
  if (elements.aiApiKeyInput) elements.aiApiKeyInput.value = config.apiKey || "";
  if (elements.aiConfigStatus) {
    const keyStatus = config.apiKey ? "已保存 API Key" : "未填写 API Key";
    const modeStatus = config.enabled && config.apiKey ? "在线 AI 配置已启用" : config.enabled ? "已启用在线配置，但缺少 API Key，暂不能请求" : "当前仍使用本地模拟";
    elements.aiConfigStatus.textContent = `${modeStatus} / ${config.provider || "自定义"} / ${config.model || "未设置模型"} / ${keyStatus}。正式上线建议通过后端代理调用模型。`;
  }
}

function normalizeAiConfig() {
  state.aiConfig = {
    ...structuredClone(defaultState.aiConfig),
    ...(state.aiConfig || {})
  };
  return state.aiConfig;
}

function applyDeepSeekPreset() {
  state.aiConfig = {
    ...normalizeAiConfig(),
    enabled: true,
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash",
    preset: "deepseek"
  };
  saveState();
  renderSettings();
}

function saveAiConfigFromForm() {
  const config = normalizeAiConfig();
  state.aiConfig = {
    ...config,
    enabled: elements.aiEnabledToggle?.checked === true,
    provider: elements.aiProviderSelect?.value || "custom",
    baseUrl: elements.aiBaseUrlInput?.value.trim() || "",
    model: elements.aiModelInput?.value.trim() || "",
    apiKey: elements.aiApiKeyInput?.value.trim() || "",
    preset: elements.aiProviderSelect?.value === "deepseek" ? "deepseek" : "custom"
  };
  saveState();
  renderSettings();
}

async function testAiConfig() {
  saveAiConfigFromForm();
  const config = normalizeAiConfig();
  if (elements.aiConfigStatus) {
    elements.aiConfigStatus.textContent = "正在测试模型连接...";
  }
  if (!config.apiKey || !config.baseUrl || !config.model) {
    if (elements.aiConfigStatus) {
      elements.aiConfigStatus.textContent = "测试失败：请先填写 Base URL、模型和 API Key。";
    }
    return;
  }

  try {
    const response = await fetch(aiModelsEndpoint(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      }
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${errorText ? `：${errorText.slice(0, 120)}` : ""}`);
    }
    if (elements.aiConfigStatus) {
      elements.aiConfigStatus.textContent = `连接成功：${config.provider || "自定义"} / ${config.model}。聊天、策略分析和蒸馏会优先调用在线 AI。`;
    }
  } catch (error) {
    const reason = error?.message || String(error);
    if (elements.aiConfigStatus) {
      elements.aiConfigStatus.textContent = `测试失败：${reason}。网页版若被浏览器跨域限制，请优先用软件版或后端代理调用模型。`;
    }
  }
}

function openPersonModal(personId = null) {
  const form = elements.personForm;
  const person = personId ? personById(personId) : null;
  state.editingPersonId = personId;
  elements.personModalTitle.textContent = person ? "编辑人物" : "添加人物";

  form.elements.name.value = person?.name || "";
  form.elements.categoryId.innerHTML = state.categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  const defaultCategoryId = person?.categoryId || (state.selectedCategoryId !== "all" ? state.selectedCategoryId : state.categories[0].id);
  form.elements.categoryId.value = defaultCategoryId;
  if (!categoryById(form.elements.categoryId.value)) form.elements.categoryId.value = state.categories[0].id;
  form.elements.relation.value = person?.relation || "";
  form.elements.importance.value = person?.importance || "中";
  const context = normalizePersonContext(person || {});
  setSelectValue(form.elements.roleWeight, context.roleWeight || "普通往来", "普通往来");
  setSelectValue(form.elements.closeness, context.closeness || "正常关系", "正常关系");
  setSelectValue(form.elements.contactFrequency, context.contactFrequency || "不定期联系", "不定期联系");
  form.elements.personality.value = person?.personality || "";
  form.elements.background.value = context.background || "";
  form.elements.notes.value = person?.notes || "";

  elements.personModal.showModal();
  if (window.lucide) lucide.createIcons();
}

function setSelectValue(select, value, fallback) {
  if (!select) return;
  const values = Array.from(select.options).map((option) => option.value);
  select.value = values.includes(value) ? value : fallback;
}

function openProfileModal() {
  const form = elements.profileForm;
  const profile = state.userProfile || {};
  form.elements.displayName.value = profile.displayName || "我";
  form.elements.role.value = profile.role || "";
  form.elements.goals.value = profile.goals || "";
  form.elements.notes.value = profile.notes || "";
  elements.profileModal.showModal();
  if (window.lucide) lucide.createIcons();
}

function saveProfileFromForm() {
  const form = elements.profileForm;
  state.userProfile = {
    displayName: form.elements.displayName.value.trim() || "我",
    role: form.elements.role.value.trim(),
    goals: form.elements.goals.value.trim(),
    notes: form.elements.notes.value.trim()
  };
  saveState();
  elements.profileModal.close();
  render();
}

function savePersonFromForm() {
  const form = elements.personForm;
  const values = {
    name: form.elements.name.value.trim(),
    categoryId: form.elements.categoryId.value,
    relation: form.elements.relation.value.trim(),
    importance: form.elements.importance.value,
    context: {
      roleWeight: form.elements.roleWeight.value,
      closeness: form.elements.closeness.value,
      contactFrequency: form.elements.contactFrequency.value,
      background: form.elements.background.value.trim()
    },
    personality: form.elements.personality.value.trim(),
    notes: form.elements.notes.value.trim()
  };
  if (!values.name) return;

  if (state.editingPersonId) {
    const person = personById(state.editingPersonId);
    Object.assign(person, values);
    person.profile = {
      ...(person.profile || {}),
      communication: person.profile?.communication || values.personality,
      work: person.profile?.work || "需要更多样本继续判断。",
      goodwill: person.profile?.goodwill || "通过真实互动反馈逐步更新。",
      avoid: person.profile?.avoid || values.notes
    };
    state.selectedPersonId = person.id;
  } else {
    const person = {
      id: `p_${Date.now()}`,
      ...values,
      profile: {
        communication: values.personality || "需要更多对话样本来判断。",
        work: "需要更多对话样本来判断。",
        goodwill: "通过真实互动反馈逐步更新。",
        avoid: values.notes || "暂无。"
      },
      memories: []
    };
    state.people.unshift(person);
    state.selectedPersonId = person.id;
    state.selectedCategoryId = person.categoryId;
  }

  saveState();
  elements.personModal.close();
  setRoute("person");
}

function addCategory() {
  const index = state.categories.length + 1;
  const category = {
    id: `cat_${Date.now()}`,
    name: `新分类 ${index}`,
    description: "可改成小学同学、母亲亲戚、项目客户等更细分类。"
  };
  state.categories.push(category);
  state.selectedCategoryId = category.id;
  state.focusCategoryId = category.id;
  state.route = "network";
  state.viewMode = "manage";
  saveState();
  render();
}

function isPresetPerson(person) {
  return person.preset === true || presetPersonIds.has(person.id);
}

function clearPresetPeople() {
  const ok = window.confirm("确定清空默认预设人物吗？你自己新增的人物会保留。");
  if (!ok) return;

  state.people = state.people.filter((person) => !isPresetPerson(person));
  state.selectedPersonId = firstPersonId();
  state.focusPersonId = null;
  state.graphPersonStage = null;
  state.focusPersonPanelExpanded = false;
  saveState();
  render();
}

function restoreDefaultTemplate() {
  const ok = window.confirm("确定恢复默认模板吗？这会重置默认分类和默认人物，但会保留你自己新增的人物。");
  if (!ok) return;

  const template = structuredClone(defaultState);
  const customPeople = state.people.filter((person) => !isPresetPerson(person));
  const fallbackCategoryId = template.categories[0]?.id || "work";
  state.categories = template.categories;
  state.people = [
    ...template.people.map((person) => ({ ...person, preset: true })),
    ...customPeople.map((person) => ({
      ...person,
      categoryId: template.categories.some((category) => category.id === person.categoryId) ? person.categoryId : fallbackCategoryId
    }))
  ];
  state.selectedCategoryId = "all";
  state.focusCategoryId = null;
  state.focusPersonId = null;
  state.graphPersonStage = null;
  state.focusPersonPanelExpanded = false;
  state.selectedPersonId = firstPersonId();
  state.route = "network";
  state.viewMode = "manage";
  saveState();
  render();
}

function exportMemory() {
  const payload = buildMemoryPayload();
  downloadJson(payload, `ai-relationship-memory-${new Date().toISOString().slice(0, 10)}.json`);
  state.lastBackupAt = new Date().toISOString();
  saveState();
  setMemoryStatus("已导出本地记忆文件。");
}

function buildMemoryPayload() {
  return {
    app: "AI 人际管家",
    version: 1,
    exportedAt: new Date().toISOString(),
    state: {
      offlineMode: state.offlineMode !== false,
      userProfile: state.userProfile,
      categories: state.categories,
      people: state.people,
      lessons: state.lessons || [],
      manualSchedules: state.manualSchedules || [],
      lastBackupAt: state.lastBackupAt || ""
    }
  };
}

function downloadJson(payload, fileName) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportEncryptedMemory() {
  const password = window.prompt("设置一个备份密码。导入时必须输入同一个密码。");
  if (!password) return;
  try {
    const encrypted = await encryptJsonPayload(buildMemoryPayload(), password);
    downloadJson(encrypted, `ai-relationship-memory-encrypted-${new Date().toISOString().slice(0, 10)}.json`);
    state.lastBackupAt = new Date().toISOString();
    saveState();
    setMemoryStatus("已导出加密记忆文件。请单独保存好密码，软件不会记录这个密码。");
  } catch (error) {
    setMemoryStatus(`加密导出失败：${error.message || error}`);
  }
}

function importMemory(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const payload = JSON.parse(String(reader.result || ""));
      const plainPayload = payload.encrypted ? await decryptMemoryPayload(payload) : payload;
      importMemoryPayload(plainPayload);
      setMemoryStatus(payload.encrypted ? "已导入加密记忆文件，当前显示导入后的人物库。" : "已导入记忆文件，当前显示导入后的人物库。");
      render();
    } catch (error) {
      setMemoryStatus(`导入失败：${error.message || "请选择 AI 人际管家导出的 JSON 文件。"}`);
    } finally {
      elements.importMemoryInput.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

function importMemoryPayload(payload) {
      const imported = payload.state || payload;
      if (!Array.isArray(imported.categories) || !Array.isArray(imported.people)) {
        throw new Error("Invalid memory file");
      }

      state = {
        ...state,
        offlineMode: imported.offlineMode !== false,
        userProfile: {
          ...structuredClone(defaultState.userProfile),
          ...(imported.userProfile || {})
        },
        categories: imported.categories,
        people: imported.people,
        lessons: Array.isArray(imported.lessons) ? imported.lessons : state.lessons || [],
        manualSchedules: Array.isArray(imported.manualSchedules) ? imported.manualSchedules : state.manualSchedules || [],
        lastBackupAt: imported.lastBackupAt || state.lastBackupAt || "",
        selectedCategoryId: "all",
        selectedPersonId: imported.people[0]?.id || null,
        pendingChatImport: null,
        pendingMemoryDraft: null,
        focusCategoryId: null,
        focusPersonId: null,
        graphPersonStage: null,
        route: "network",
        viewMode: "manage"
      };
      saveState();
}

async function encryptJsonPayload(payload, password) {
  ensureCryptoSupport();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveBackupKey(password, salt);
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    app: "AI 人际管家",
    version: 1,
    encrypted: true,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: 120000,
    exportedAt: new Date().toISOString(),
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(cipher))
  };
}

async function decryptMemoryPayload(payload) {
  ensureCryptoSupport();
  const password = window.prompt("这是加密备份，请输入导出时设置的密码。");
  if (!password) throw new Error("已取消导入。");
  const salt = base64ToBytes(payload.salt || "");
  const iv = base64ToBytes(payload.iv || "");
  const data = base64ToBytes(payload.data || "");
  const key = await deriveBackupKey(password, salt, payload.iterations || 120000);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    throw new Error("密码错误或备份文件已损坏。");
  }
}

async function deriveBackupKey(password, salt, iterations = 120000) {
  const rawKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function ensureCryptoSupport() {
  if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
    throw new Error("当前环境不支持加密备份，请升级软件或使用普通导出。");
  }
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function setMemoryStatus(message) {
  if (elements.memoryStatus) elements.memoryStatus.textContent = message;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("\n", " ");
}

function renderMemoryManager(person) {
  ensurePersonDialogueData(person);
  if (!person.memories.length) return `<p class="meta-line">还没有沉淀记录。普通模拟不会自动保存，点击对话页“新增记忆”并保存后才会写入这里。</p>`;
  return person.memories
    .map(
      (memory) => `
        <article class="memory-editor" data-memory-id="${escapeAttr(memory.id)}">
          <input class="memory-title-input" value="${escapeAttr(memory.title || "记忆")}" aria-label="记忆标题" />
          <textarea class="memory-text-input" aria-label="记忆内容">${escapeHtml(memory.text || "")}</textarea>
          <div class="memory-editor-actions">
            <span>${escapeHtml(memory.createdAt ? new Date(memory.createdAt).toLocaleDateString("zh-CN") : "本地记忆")}</span>
            <button class="ghost-button" type="button" data-memory-action="save">保存</button>
            <button class="ghost-button danger-button" type="button" data-memory-action="delete">删除</button>
          </div>
        </article>
      `
    )
    .join("");
}

function bindMemoryManager(person) {
  elements.personDetail.querySelectorAll("[data-memory-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-memory-id]");
      const memoryId = card?.dataset.memoryId;
      const memory = person.memories.find((item) => item.id === memoryId);
      if (!memory) return;

      if (button.dataset.memoryAction === "delete") {
        person.memories = person.memories.filter((item) => item.id !== memoryId);
      } else {
        memory.title = card.querySelector(".memory-title-input")?.value.trim() || "记忆";
        memory.text = card.querySelector(".memory-text-input")?.value.trim() || "";
        memory.updatedAt = new Date().toISOString();
      }
      saveState();
      renderPerson();
    });
  });
}

function renderPerson() {
  renderCategoryRail(elements.personCategoryRail);
  const person = personById(state.selectedPersonId);
  if (!person) {
    setRoute("network");
    return;
  }
  ensurePersonDialogueData(person);

  elements.personDetail.innerHTML = `
    <div class="profile-hero">
      <section class="profile-summary">
        <p class="eyebrow">${escapeHtml(categoryById(person.categoryId)?.name || "关系")}</p>
        <h2>${escapeHtml(person.name)}</h2>
        <p class="meta-line">${escapeHtml(person.relation || "未设置关系")} / 重要程度 ${escapeHtml(person.importance || "中")}</p>
        <p class="meta-line">${escapeHtml(person.personality || "还没有性格画像。")}</p>
        <div class="profile-actions">
          <button class="primary-button" id="talkToPerson">
            <i data-lucide="messages-square"></i>
            <span>进入对话</span>
          </button>
          <button class="ghost-button" id="editPerson">
            <i data-lucide="pencil"></i>
            <span>编辑画像</span>
          </button>
          <button class="ghost-button" id="importPersonChatTop" type="button">
            <i data-lucide="file-up"></i>
            <span>导入聊天</span>
          </button>
          <input type="file" id="personChatImportTopInput" accept=".txt,.csv,.json,.md,.html,.htm,.bak,.bat,text/plain,text/csv,text/html,application/json" hidden />
          <button class="ghost-button danger-button" id="deletePerson">
            <i data-lucide="trash-2"></i>
            <span>删除人物</span>
          </button>
        </div>
      </section>
      <section class="profile-notes">
        <p class="eyebrow">相处注意事项</p>
        <p>${escapeHtml(person.notes || "暂无。")}</p>
      </section>
    </div>
    <div class="insight-grid">
      ${renderInsight("说话风格", person.profile?.communication)}
      ${renderInsight("做事风格", person.profile?.work)}
      ${renderInsight("好感触发", person.profile?.goodwill)}
      ${renderInsight("避雷点", person.profile?.avoid)}
      ${renderInsight("推荐回复结构", recommendStructure(person))}
      ${renderInsight("关系策略", relationshipStrategy(person))}
    </div>
    <section class="memory-card">
      <h3>历史记忆管理</h3>
      <div class="memory-list">
        ${renderMemoryManager(person)}
      </div>
    </section>
    <section class="memory-card distill-workbench">
      <h3>蒸馏调整画像</h3>
      <p class="meta-line">少量新聊天可以直接粘贴；几百到几千条历史记录建议导入文件。系统会自动识别常见“时间 / 昵称 / 内容”和“昵称：内容”格式，不需要你每句手动备注是谁说的。</p>
      <div class="distill-rules">
        <span>识别规则</span>
        <p>能识别“我、本人、${escapeHtml(state.userProfile?.displayName || "用户")}”为我方；识别“${escapeHtml(person.name)}”为对方；群聊或昵称不稳定时，建议先导出与此人相关片段。</p>
      </div>
      <textarea id="personDistillInput" placeholder="例如：粘贴一段你们的聊天记录，或记录一次对方对你回复的真实反应。"></textarea>
      <div class="distill-actions">
        <button class="primary-button" id="personDistillButton">
          <i data-lucide="sparkles"></i>
          <span>蒸馏并调整画像</span>
        </button>
        <button class="ghost-button" id="importChatButton" type="button">
          <i data-lucide="file-up"></i>
          <span>导入聊天记录文件</span>
        </button>
        <input type="file" id="personChatImportInput" accept=".txt,.csv,.json,.md,.html,.htm,.bak,.bat,text/plain,text/csv,text/html,application/json" hidden />
      </div>
      <p class="meta-line" id="chatImportStatus">支持 TXT、CSV、JSON、Markdown、HTML，也会尝试读取 QQ 的 BAK/BAT；如果文件是备份或脚本，需要先转成可读文本再导入。</p>
      ${renderChatImportPreview(person)}
    </section>
  `;

  $("#talkToPerson").addEventListener("click", () => {
    state.selectedPersonId = person.id;
    setRoute("dialogue");
  });
  $("#editPerson").addEventListener("click", () => openPersonModal(person.id));
  $("#deletePerson").addEventListener("click", () => deletePerson(person.id));
  $("#importPersonChatTop").addEventListener("click", () => $("#personChatImportTopInput")?.click());
  $("#personChatImportTopInput").addEventListener("change", async (event) => {
    await importChatTranscriptFile(person.id, event.target.files?.[0]);
    event.target.value = "";
  });
  $("#personDistillButton").addEventListener("click", async () => {
    await distillPersonProfile(person.id, $("#personDistillInput").value, "person", { source: "manual" });
  });
  $("#importChatButton").addEventListener("click", () => $("#personChatImportInput")?.click());
  $("#personChatImportInput").addEventListener("change", async (event) => {
    await importChatTranscriptFile(person.id, event.target.files?.[0]);
    event.target.value = "";
  });
  $("#confirmChatImportButton")?.addEventListener("click", confirmPendingChatImport);
  $("#cancelChatImportButton")?.addEventListener("click", cancelPendingChatImport);
  bindMemoryManager(person);
  if (window.lucide) lucide.createIcons();
}

function renderChatImportPreview(person) {
  const pending = state.pendingChatImport;
  if (!pending || pending.personId !== person.id) return "";
  const stats = pending.stats || {};
  return `
    <div class="chat-import-preview">
      <div class="preview-head">
        <strong>导入预览：${escapeHtml(pending.fileName)}</strong>
        <span>共 ${stats.total || 0} 条 / 我方 ${stats.self || 0} / 对方 ${stats.opponent || 0} / 未知 ${stats.unknown || 0}</span>
      </div>
      <div class="preview-lines">
        ${(pending.preview || []).map((message) => `
          <p><strong>${escapeHtml(roleLabel(message.role))}</strong>${escapeHtml(message.speaker ? ` ${message.speaker}` : "")}：${escapeHtml(message.text)}</p>
        `).join("")}
      </div>
      <div class="memory-editor-actions">
        <span>确认后才会蒸馏并写入此人画像。</span>
        <button class="ghost-button" type="button" id="cancelChatImportButton">取消</button>
        <button class="primary-button" type="button" id="confirmChatImportButton">确认蒸馏</button>
      </div>
    </div>
  `;
}

function renderDialogue() {
  if (state.dialogueMode === "distill") state.dialogueMode = "incoming";
  const person = personById(state.selectedPersonId) || state.people[0] || null;
  if (person && state.selectedPersonId !== person.id) state.selectedPersonId = person.id;

  renderDialogueHistory();
  renderDialogueHeader(person);

  $$(".segment").forEach((segment) => {
    segment.classList.toggle("active", segment.dataset.mode === state.dialogueMode);
  });

  if (elements.analysisTitle) {
    elements.analysisTitle.textContent = state.dialogueMode === "report" ? "开口策略分析" : "整段对话分析";
  }
  renderDialogueAnalysisPanel(person);
  if (elements.composerHint) {
    elements.composerHint.textContent =
      state.dialogueMode === "report"
        ? "我方述说模式：先输入你想说的话并发送，系统会模拟对方回应，再生成我方回复建议。"
        : "对方所说模式：先输入对方的话并发送，然后在我方气泡里选择或自定义回复。";
  }

  renderDialogueThread(person);
  renderDialogueMemoryDraft(person);
}

function renderDialogueAnalysisPanel(person) {
  if (!elements.analysisBox) return;
  const analysis = state.dialogueAnalysis || buildConversationAnalysis(person);
  elements.analysisBox.innerHTML = `
    <div class="analysis-card main-analysis-card">
      <strong>${state.dialogueMode === "report" ? "我方开口策略" : "对话走势判断"}</strong>
      <p>${escapeHtml(analysis)}</p>
    </div>
    <div class="intent-panel">
      <div class="intent-panel-head">
        <strong>策略咨询</strong>
        <span>可以问“我该怎么做”，也可以粘贴准备发给对方的话</span>
      </div>
      <textarea id="dialogueIntentInput" class="intent-input" placeholder="例如：对这个领导来说，我大概什么汇报节奏比较好？">${escapeHtml(state.dialogueIntentInput || "")}</textarea>
      <div class="intent-actions">
        <button class="ghost-button compact-button" type="button" id="clearIntentButton">清空</button>
        <button class="primary-button compact-button" type="button" id="analyzeIntentButton">分析策略</button>
      </div>
      <div class="intent-result ${state.dialogueIntentAnalysis ? "active" : ""}" id="dialogueIntentResult">
        ${
          state.dialogueIntentAnalysis
            ? `<strong>策略建议</strong><p>${escapeHtml(state.dialogueIntentAnalysis)}</p>`
            : `<p>输入你想咨询的问题，AI 会先判断这是“行动策略”还是“表达优化”，再给针对这个人的建议。</p>`
        }
      </div>
    </div>
  `;

  $("#dialogueIntentInput")?.addEventListener("input", (event) => {
    state.dialogueIntentInput = event.target.value;
    saveState();
  });
  $("#clearIntentButton")?.addEventListener("click", () => {
    state.dialogueIntentInput = "";
    state.dialogueIntentAnalysis = "";
    saveState();
    renderDialogueAnalysisPanel(person);
  });
  $("#analyzeIntentButton")?.addEventListener("click", async () => {
    await analyzeDialogueIntent(person);
  });
}

function renderDialogueMemoryDraft(person) {
  if (!elements.memoryNote) return;
  const draft = state.pendingMemoryDraft;
  if (draft?.personId === person?.id) {
    elements.memoryNote.innerHTML = `
      <strong>新增记忆草稿</strong>
      <label>
        <span>标题</span>
        <input id="memoryDraftTitle" class="memory-title-input" value="${escapeAttr(draft.title || "真实互动记录")}" />
      </label>
      <label>
        <span>内容</span>
        <textarea id="memoryDraftText" class="memory-text-input">${escapeHtml(draft.text || "")}</textarea>
      </label>
      <div class="memory-editor-actions">
        <span>保存后才会写入此人记忆并蒸馏画像。</span>
        <button class="ghost-button" type="button" id="cancelMemoryDraftButton">取消</button>
        <button class="primary-button" type="button" id="commitMemoryDraftButton">保存记忆</button>
      </div>
    `;
    $("#memoryDraftTitle")?.addEventListener("input", (event) => {
      state.pendingMemoryDraft.title = event.target.value;
      state.pendingMemoryDraft.dirty = true;
    });
    $("#memoryDraftText")?.addEventListener("input", (event) => {
      state.pendingMemoryDraft.text = event.target.value;
      state.pendingMemoryDraft.dirty = true;
    });
    $("#cancelMemoryDraftButton")?.addEventListener("click", () => {
      state.pendingMemoryDraft = null;
      saveState();
      renderDialogue();
    });
    $("#commitMemoryDraftButton")?.addEventListener("click", commitMemoryDraft);
    return;
  }

  elements.memoryNote.innerHTML = `
    <strong>记忆规则</strong>
    <p>普通模拟不会自动写入人物记忆。点击“新增记忆”后编辑并保存，才会作为真实记录参与画像蒸馏。</p>
  `;
}

function beginMemoryDraft() {
  const person = personById(state.selectedPersonId);
  if (!person) return;
  if (hasUnsavedMemoryDraft() && !confirmDiscardMemoryDraft()) return;
  const messagesForDraft = currentDialogueMessages(person).slice(-12);
  const recentMessages = messagesForDraft
    .slice(-10)
    .map((message) => `${message.role === "incoming" ? "对方" : message.role === "outgoing" ? "我方" : "系统"}：${message.text}`)
    .join("\n");
  const text = [
    recentMessages,
    state.dialogueAnalysis ? `AI 分析：${state.dialogueAnalysis}` : ""
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();
  state.pendingMemoryDraft = {
    personId: person.id,
    title: "真实互动记录",
    text,
    messages: messagesForDraft.map((message) => ({ ...message })),
    dirty: true,
    createdAt: new Date().toISOString()
  };
  saveState();
  renderDialogue();
}

async function commitMemoryDraft() {
  const draft = state.pendingMemoryDraft;
  const person = personById(draft?.personId);
  if (!draft || !person) return;
  const title = ($("#memoryDraftTitle")?.value || draft.title || "真实互动记录").trim();
  const text = ($("#memoryDraftText")?.value || draft.text || "").trim();
  if (!text) return;
  promoteSessionDialogueToHistory(person, Array.isArray(draft.messages) ? draft.messages : null);
  clearSessionDialogue(person.id);
  addMemory(person, title, [text]);
  const distilled = await buildProfileDistillWithAi(person, text);
  person.profile = person.profile || {};
  person.profile.communication = distilled.communication || person.profile.communication;
  person.profile.work = distilled.work || person.profile.work;
  person.profile.goodwill = distilled.goodwill || person.profile.goodwill;
  person.profile.avoid = distilled.avoid || person.profile.avoid;
  if (distilled.notes) person.notes = distilled.notes;
  person.personality = summarizePersonality(person);
  state.pendingMemoryDraft = null;
  state.dialogueAnalysis = distilled.memoryText || state.dialogueAnalysis;
  saveState();
  renderDialogue();
}

function renderDialogueHistory() {
  if (!elements.dialoguePersonSelect || !elements.dialogueHistoryList) return;
  const keyword = (elements.dialogueSearchInput?.value || "").trim().toLowerCase();
  const people = state.people.filter((person) => {
    const context = normalizePersonContext(person);
    const haystack = `${person.name} ${person.relation || ""} ${categoryById(person.categoryId)?.name || ""} ${personContextLine(person)} ${context.background || ""}`.toLowerCase();
    return !keyword || haystack.includes(keyword);
  });

  elements.dialoguePersonSelect.innerHTML = state.people
    .map((person) => `<option value="${person.id}" ${person.id === state.selectedPersonId ? "selected" : ""}>${escapeHtml(person.name)}</option>`)
    .join("");

  elements.dialogueHistoryList.innerHTML = people
    .map((person) => {
      const active = person.id === state.selectedPersonId;
      const lastMessage = person.chatHistory?.[person.chatHistory.length - 1]?.text;
      const last = lastMessage || person.memories?.[0]?.text || person.notes || person.personality || "点击进入对话";
      return `
        <button class="history-item ${active ? "active" : ""}" data-dialogue-person="${escapeAttr(person.id)}">
          <span class="history-avatar">${escapeHtml(person.name.slice(0, 1))}</span>
          <span class="history-main">
            <strong>${escapeHtml(person.name)}</strong>
            <small>${escapeHtml(last.slice(0, 34))}</small>
          </span>
          <span class="history-time">${active ? "当前" : " "}</span>
        </button>
      `;
    })
    .join("");

  elements.dialogueHistoryList.querySelectorAll("[data-dialogue-person]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.dialoguePerson !== state.selectedPersonId && !confirmDiscardMemoryDraft()) return;
      clearSessionDialogue(state.selectedPersonId);
      state.selectedPersonId = button.dataset.dialoguePerson;
      resetDialogueRound(false);
      saveState();
      renderDialogue();
    });
  });
}

function renderDialogueHeader(person) {
  if (elements.dialogueChatTitle) elements.dialogueChatTitle.textContent = person?.name || "模拟对话";
  if (elements.dialogueChatMeta) {
    const category = categoryById(person?.categoryId)?.name || "关系";
    elements.dialogueChatMeta.textContent = `${category} / ${person?.relation || "未设置关系"}`;
  }
  if (elements.autoReplyToggle) {
    elements.autoReplyToggle.checked = state.autoAiReply !== false;
  }
}

function resetDialogueRound(clearMode = true) {
  clearSessionDialogue();
  state.dialogueOpponentText = "";
  state.dialogueEditingOpponent = false;
  state.dialogueEditingMessageId = "";
  state.dialogueOpeningText = "";
  state.dialogueSentReply = "";
  state.dialogueSelectedReply = "";
  state.dialogueDraftOptions = [];
  state.dialogueTyping = "";
  state.dialogueAnalysis = "";
  if (clearMode && state.dialogueMode === "distill") state.dialogueMode = "incoming";
  if (elements.customReply) elements.customReply.value = "";
  if (elements.dialogueInput) elements.dialogueInput.value = "";
}

function renderDialogueThread(person) {
  if (!elements.chatThread) return;
  if (!person) {
    elements.chatThread.innerHTML = systemRow("还没有可对话的人物。请先在人际网或管理关系里新增人物。");
    elements.replyOptions = null;
    elements.opponentActualInput = null;
    return;
  }
  ensurePersonDialogueData(person);
  const mode = state.dialogueMode;
  const isReport = mode === "report";
  const opening = state.dialogueOpeningText || "";
  const opponent = state.dialogueOpponentText || "";
  const selectedReply = state.dialogueSelectedReply || "";
  const options = state.dialogueDraftOptions || [];
  const sessionMessages = sessionMessagesFor(person.id);
  const rows = (person.chatHistory || []).map(renderChatHistoryMessage);
  if (sessionMessages.length) {
    rows.push(systemRow("本轮为模拟对话，未保存记忆前不会写入真实记录，也不会参与长期画像判断。"));
    rows.push(...sessionMessages.map(renderChatHistoryMessage));
  }
  const draftEnterClass = state.dialogueDraftAnimated ? "message-enter options-enter" : "";

  if (!rows.length && isReport) {
    if (opening) rows.push(outgoingRow(opening, ""));
    else rows.push(systemRow("先在底部输入你想主动说的话，点击生成选项后，我会先模拟对方怎么回。"));
    if (opponent) rows.push(opponentRow(person, opponent));
  } else if (!rows.length) {
    if (opponent) rows.push(incomingRow(opponent, ""));
    else rows.push(systemRow("先在底部输入对方说的话，再生成可选回复。"));
  }

  if (options.length) {
    rows.push(pendingReplyRow(options, selectedReply, draftEnterClass));
  }

  if (state.dialogueTyping) {
    rows.push(typingRow(state.dialogueTyping));
  }

  elements.chatThread.innerHTML = rows.join("");
  elements.replyOptions = $("#replyOptions");
  elements.opponentActualInput = $("#opponentActualInput");

  elements.chatThread.querySelectorAll("[data-reply]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dialogueSelectedReply = button.dataset.reply || "";
      if (elements.dialogueInput) elements.dialogueInput.value = state.dialogueSelectedReply;
      if (elements.customReply) elements.customReply.value = state.dialogueSelectedReply;
      saveState();
      renderDialogueThread(person);
    });
  });

  elements.chatThread.querySelectorAll("[data-edit-opponent]").forEach((button) => {
    button.addEventListener("click", () => {
      const messageId = button.dataset.editOpponent || "";
      if (!messageId) {
        state.dialogueEditingOpponent = !state.dialogueEditingOpponent;
      } else {
        state.dialogueEditingMessageId = state.dialogueEditingMessageId === messageId ? "" : messageId;
      }
      saveState();
      renderDialogueThread(person);
    });
  });

  elements.chatThread.querySelectorAll("[data-apply-opponent]").forEach((button) => {
    button.addEventListener("click", async () => {
      const messageId = button.dataset.applyOpponent || "";
      const input = messageId
        ? elements.chatThread.querySelector(`[data-opponent-input="${cssEscape(messageId)}"]`)?.value.trim()
        : elements.opponentActualInput?.value.trim();
      const actualText = input || state.dialogueOpponentText;
      if (!actualText) return;

      state.dialogueOpponentText = actualText;
      state.dialogueEditingOpponent = false;
      state.dialogueEditingMessageId = "";
      state.dialogueMode = "incoming";

      const messages = currentDialogueMessages(person);
      const targetMessage = messageId
        ? messages.find((message) => message.id === messageId)
        : [...messages].reverse().find((message) => message.role === "incoming");
      if (targetMessage) {
        targetMessage.text = actualText;
        targetMessage.label = "真实回复";
        targetMessage.updatedAt = new Date().toISOString();
      } else {
        addSessionChatMessage(person, "incoming", actualText, "真实回复");
      }

      state.dialogueAnalysis = canUseOnlineAi() ? "AI 正在根据真实回复重新生成建议..." : state.dialogueAnalysis;
      if (canUseOnlineAi()) renderDialogueAnalysisPanel(person);
      const advice = await buildAdviceWithAi(person, "incoming", actualText, actualText);
      state.dialogueDraftOptions = advice.options;
      state.dialogueDraftAnimated = true;
      state.dialogueAnalysis = advice.analysis;
      state.dialogueSelectedReply = "";
      saveState();
      renderDialogue();
    });
  });

  if (state.dialogueAnimatedMessageId) {
    state.dialogueAnimatedMessageId = "";
    window.setTimeout(() => {
      elements.chatThread?.querySelectorAll(".message-enter").forEach((row) => row.classList.remove("message-enter"));
    }, 520);
  }
  if (state.dialogueDraftAnimated) {
    state.dialogueDraftAnimated = false;
    window.setTimeout(() => {
      elements.chatThread?.querySelectorAll(".options-enter").forEach((row) => row.classList.remove("options-enter"));
    }, 720);
  }
  scrollDialogueToBottom();
}

function scrollDialogueToBottom(behavior = "smooth") {
  const thread = elements.chatThread;
  if (!thread) return;
  const scroll = () => {
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior
    });
  };
  window.requestAnimationFrame(() => {
    scroll();
    window.requestAnimationFrame(scroll);
    window.setTimeout(scroll, 180);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function ensurePersonDialogueData(person) {
  if (!person) return;
  person.chatHistory = Array.isArray(person.chatHistory) ? person.chatHistory : [];
  person.memories = Array.isArray(person.memories) ? person.memories : [];
  person.memories.forEach((memory, index) => {
    if (!memory.id) memory.id = `mem_${Date.now()}_${index}_${Math.random().toString(16).slice(2)}`;
  });
}

function sessionMessagesFor(personId) {
  if (!personId) return [];
  if (!sessionDialogueMessages.has(personId)) sessionDialogueMessages.set(personId, []);
  return sessionDialogueMessages.get(personId);
}

function currentDialogueMessages(person) {
  if (!person) return [];
  ensurePersonDialogueData(person);
  return [...(person.chatHistory || []), ...sessionMessagesFor(person.id)];
}

function clearSessionDialogue(personId = state.selectedPersonId) {
  if (personId) sessionDialogueMessages.set(personId, []);
}

function renderChatHistoryMessage(message) {
  const enterClass = message.id && message.id === state.dialogueAnimatedMessageId ? "message-enter" : "";
  if (message.role === "incoming") return incomingRow(message.text, "", enterClass, message);
  if (message.role === "outgoing") return outgoingRow(message.text, "", enterClass);
  return systemRow(message.text || "");
}

function createDialogueMessage(role, text, label = "", extra = {}) {
  const content = String(text || "").trim();
  if (!content) return null;
  return {
    id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    role,
    label,
    text: content,
    createdAt: new Date().toISOString(),
    ...extra
  };
}

function addSessionChatMessage(person, role, text, label = "") {
  const content = String(text || "").trim();
  if (!person || !content) return null;
  const messages = sessionMessagesFor(person.id);
  const last = messages[messages.length - 1];
  if (last && last.role === role && last.text === content && last.label === label) return last;
  const recentDuplicate = messages
    .slice(-4)
    .some((message) => message.role === role && message.text === content && message.label === label);
  if (recentDuplicate) return null;
  const message = createDialogueMessage(role, content, label, { simulated: true });
  messages.push(message);
  state.dialogueAnimatedMessageId = message.id;
  if (messages.length > 80) sessionDialogueMessages.set(person.id, messages.slice(-80));
  return message;
}

function addChatMessage(person, role, text, label = "") {
  const message = createDialogueMessage(role, text, label, { saved: true });
  if (!person || !message) return null;
  ensurePersonDialogueData(person);
  person.chatHistory.push(message);
  state.dialogueAnimatedMessageId = message.id;
  if (person.chatHistory.length > 120) person.chatHistory = person.chatHistory.slice(-120);
  return message;
}

function promoteSessionDialogueToHistory(person, messages = null) {
  if (!person) return [];
  ensurePersonDialogueData(person);
  const source = (messages || sessionMessagesFor(person.id)).filter((message) => message?.text);
  if (!source.length) return [];
  const promoted = source.map((message) => ({
    id: message.id || `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    role: message.role,
    label: message.label || "",
    text: message.text,
    createdAt: message.createdAt || new Date().toISOString(),
    savedAt: new Date().toISOString()
  }));
  const existingKeys = new Set((person.chatHistory || []).map((message) => `${message.role}|${message.label}|${message.text}|${message.createdAt}`));
  promoted.forEach((message) => {
    const key = `${message.role}|${message.label}|${message.text}|${message.createdAt}`;
    if (!existingKeys.has(key)) person.chatHistory.push(message);
  });
  if (person.chatHistory.length > 120) person.chatHistory = person.chatHistory.slice(-120);
  if (!messages) sessionDialogueMessages.set(person.id, []);
  return promoted;
}

function addMemory(person, title, parts) {
  if (!person) return;
  ensurePersonDialogueData(person);
  const text = parts.filter(Boolean).join(" / ").slice(0, 260);
  if (!text) return;
  const last = person.memories[0];
  if (last?.title === title && last?.text === text) return;
  person.memories.unshift({
    id: `mem_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title,
    text,
    createdAt: new Date().toISOString()
  });
}

function incomingRow(text, label = "", extraClass = "", message = null) {
  const labelHtml = label ? `<span class="bubble-label">${escapeHtml(label)}</span>` : "";
  const messageId = message?.id || "";
  const isEditing = messageId && state.dialogueEditingMessageId === messageId;
  const actionHtml = messageId
    ? `
        <div class="bubble-under-actions">
          ${labelHtml || (message?.label ? `<span class="bubble-label">${escapeHtml(message.label)}</span>` : "")}
          <button class="mini-link bubble-edit" type="button" data-edit-opponent="${escapeAttr(messageId)}">${isEditing ? "取消" : "修改"}</button>
        </div>
      `
    : labelHtml;
  return `
    <div class="chat-row incoming ${extraClass}">
      <div class="chat-avatar">TA</div>
      <div class="incoming-stack">
        <div class="chat-bubble wechat-bubble incoming-bubble">
          ${
            isEditing
              ? `
                <textarea class="opponent-edit-input" data-opponent-input="${escapeAttr(messageId)}">${escapeHtml(text)}</textarea>
                <button class="mini-link apply-opponent" type="button" data-apply-opponent="${escapeAttr(messageId)}">用这句话继续推荐</button>
              `
              : `<p>${escapeHtml(text)}</p>`
          }
        </div>
        ${actionHtml}
      </div>
    </div>
  `;
}

function outgoingRow(text, label = "", extraClass = "") {
  const labelHtml = label ? `<span class="bubble-label">${escapeHtml(label)}</span>` : "";
  return `
    <div class="chat-row outgoing ${extraClass}">
      <div class="chat-bubble wechat-bubble outgoing-bubble">
        ${labelHtml}
        <p>${escapeHtml(text)}</p>
      </div>
      <div class="chat-avatar">${escapeHtml(shortUserName())}</div>
    </div>
  `;
}

function systemRow(text) {
  return `
    <div class="chat-row system">
      <div class="chat-bubble system-bubble">${escapeHtml(text)}</div>
    </div>
  `;
}

function typingRow(text = "对方正在输入") {
  return `
    <div class="chat-row incoming typing-row message-enter">
      <div class="chat-avatar">TA</div>
      <div class="chat-bubble wechat-bubble incoming-bubble typing-bubble">
        <span>${escapeHtml(text)}</span>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  `;
}

function opponentRow(person, text) {
  const name = person?.name || "对方";
  return `
    <div class="chat-row incoming opponent-response">
      <div class="chat-avatar">TA</div>
      <div class="chat-bubble wechat-bubble incoming-bubble opponent-bubble">
        <div class="bubble-head">
          <span class="bubble-label">${escapeHtml(name)} 的回应${state.dialogueEditingOpponent ? " / 修改真实说法" : ""}</span>
          <button class="mini-link bubble-edit" type="button" data-edit-opponent>${state.dialogueEditingOpponent ? "取消" : "修改"}</button>
        </div>
        ${
          state.dialogueEditingOpponent
            ? `
              <textarea id="opponentActualInput" placeholder="把这里改成对方真实说的话。">${escapeHtml(text)}</textarea>
              <button class="mini-link apply-opponent" type="button" data-apply-opponent>用这句话重新生成</button>
            `
            : `<p>${escapeHtml(text)}</p>`
        }
      </div>
    </div>
  `;
}

function pendingReplyRow(options, selectedReply, extraClass = "") {
  return `
    <div class="chat-row outgoing pending-reply-row ${extraClass}">
      <div class="chat-bubble wechat-bubble outgoing-bubble pending-reply-bubble">
        <span class="bubble-label">选择一条回复，或在下方输入框自定义</span>
        <div class="bubble-option-list" id="replyOptions">
          ${options
            .map(
              (option) => `
                <button class="bubble-option ${selectedReply === option.text ? "selected" : ""}" type="button" data-reply="${escapeAttr(option.text)}">
                  <strong><span class="choice-key">${option.key}</span>${escapeHtml(option.title)}</strong>
                  <p>${escapeHtml(option.text)}</p>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="chat-avatar">${escapeHtml(shortUserName())}</div>
    </div>
  `;
}

function simulateOpponentReply(person, opening) {
  const content = opening.trim();
  const name = person?.name || "对方";
  if (!content) return "";
  if (/进度|截止|风险|方案|汇报|项目|结果/.test(content)) {
    return "我先看结论和风险点。你把当前进度、卡点、需要我判断的地方列清楚，时间节点也同步一下。";
  }
  if (/抱歉|不好意思|误会|解释|沟通/.test(content)) {
    return "我理解你的意思，但我更想知道这件事接下来怎么处理，以及怎么避免后面再出现类似情况。";
  }
  if (/约|吃饭|见面|有空|方便/.test(content)) {
    return "可以先说下具体时间和事情，我看安排。如果只是简单聊聊，也可以先线上同步一下。";
  }
  return `${name}可能会先确认你的核心诉求：你希望我判断什么、配合什么，还是只需要了解这个情况？`;
}

function buildReplyOptions(person) {
  const name = person?.name || "对方";
  return [
    {
      key: "A",
      title: "稳妥版",
      text: `${name}，我理解这个事情目前需要先确认清楚。我这边先梳理一下范围和时间点，再给你一个明确反馈，避免后面理解偏差。`
    },
    {
      key: "B",
      title: "亲和版",
      text: "明白，我先看一下具体情况。为了别理解错，我会把关键点确认一下，再跟你同步一个更靠谱的回复。"
    },
    {
      key: "C",
      title: "边界版",
      text: "收到。这个事项我可以先配合确认，但需要先明确范围、优先级和截止时间，这样后续推进会更稳。"
    }
  ];
}

function buildAdvice(person, mode, input, opponentText = "") {
  const content = input.trim();
  const relation = person?.relation || "这段关系";
  const name = person?.name || "对方";
  const style = trimEndingPunctuation(person?.profile?.communication || person?.personality || "需要进一步观察");
  const structure = recommendStructure(person || {});

  if (mode === "report") {
    const opponent = opponentText.trim() || simulateOpponentReply(person, content);
    return {
      opponentText: opponent,
      options: buildReplyOptions(person),
      analysis: opponent
        ? `这是“我方开场后的一个来回”。左侧消息区里可以点“修改”把模拟回应替换成真实说法。A/B/C 是给你回复对方用的，建议结构：${structure}。面对${relation}，注意对方可能关注你的诉求、责任边界和下一步。已知风格：${style}。`
        : `先输入你想主动说的话，再生成对方可能回应。`
    };
  }

  const ambiguity = /随便|看着办|尽快|有空|再说|你觉得|都行|差不多/.test(content);
  return {
    opponentText: "",
    options: buildReplyOptions(person),
    analysis: ambiguity
      ? `对方表达里有模糊词，可能是在试探你的态度、可投入程度或是否愿意承担。建议先确认边界，不要立刻承诺。对${name}的已知风格判断：${style}。`
      : `这句话可以先按“诉求识别”处理：对方可能在要信息、要承诺、要情绪回应，或要你主动推进。面对${relation}，建议不要只回“好的”，最好补一个可执行的下一步。`
  };
}

function renderGeneratedAdvice(advice) {
  const person = personById(state.selectedPersonId);
  state.dialogueTyping = "";
  if (state.dialogueMode === "report" && advice.opponentText) {
    state.dialogueOpponentText = advice.opponentText;
    addSessionChatMessage(person, "incoming", advice.opponentText, "对方回应");
  }
  state.dialogueDraftOptions = advice.options || [];
  state.dialogueDraftAnimated = true;
  state.dialogueAnalysis = advice.analysis || "";
  state.dialogueSelectedReply = "";
  state.dialogueSentReply = "";
  if (elements.dialogueInput) elements.dialogueInput.value = "";
  if (elements.customReply) elements.customReply.value = "";
  saveState();
  renderDialogueAnalysisPanel(person);
  renderDialogueThread(person);
}

async function sendDialogueReply() {
  if (state.dialogueTyping) return;
  const text = (elements.dialogueInput?.value || state.dialogueSelectedReply || "").trim();
  if (!text) return;

  if (!state.dialogueDraftOptions?.length) {
    await startDialogueTurn(text);
    return;
  }

  state.dialogueSentReply = "";
  state.dialogueSelectedReply = "";
  state.dialogueDraftOptions = [];
  const person = personById(state.selectedPersonId);
  addSessionChatMessage(person, "outgoing", text, "");
  state.dialogueSentReply = text;
  if (elements.dialogueInput) elements.dialogueInput.value = "";
  if (elements.customReply) elements.customReply.value = "";
  saveState();
  renderDialogue();

  if (state.autoAiReply !== false) {
    state.dialogueAnalysis = canUseOnlineAi() ? "AI 正在预测对方可能回复..." : state.dialogueAnalysis;
    if (canUseOnlineAi()) renderDialogueAnalysisPanel(person);
    state.dialogueTyping = `${person.name || "对方"}正在输入`;
    saveState();
    renderDialogue();
    const [prediction] = await Promise.all([buildAdviceWithAi(person, "report", text, ""), wait(900)]);
    state.dialogueTyping = "";
    const opponentText = prediction.opponentText || simulateOpponentReply(person, text);
    addSessionChatMessage(person, "incoming", opponentText, "AI预测");
    state.dialogueMode = "incoming";
    state.dialogueOpponentText = opponentText;
    state.dialogueOpeningText = "";
    state.dialogueDraftOptions = prediction.options || [];
    state.dialogueDraftAnimated = true;
    state.dialogueAnalysis = prediction.analysis || "";
    state.dialogueSelectedReply = "";
  }
  saveState();
  renderDialogue();
}

async function startDialogueTurn(text) {
  const person = personById(state.selectedPersonId);
  if (!person) return;
  const mode = state.dialogueMode;
  if (state.dialogueMode === "report") {
    state.dialogueOpeningText = text;
    state.dialogueOpponentText = "";
    state.dialogueDraftOptions = [];
    state.dialogueDraftAnimated = false;
    addSessionChatMessage(person, "outgoing", text, "我方开场");
  } else {
    state.dialogueOpponentText = text;
    state.dialogueOpeningText = "";
    addSessionChatMessage(person, "incoming", text, "对方所说");
  }
  state.dialogueSentReply = "";
  state.dialogueSelectedReply = "";
  if (elements.dialogueInput) elements.dialogueInput.value = "";
  if (elements.customReply) elements.customReply.value = "";
  state.dialogueAnalysis = canUseOnlineAi() ? "AI 正在生成回复建议..." : state.dialogueAnalysis;
  if (canUseOnlineAi()) renderDialogueAnalysisPanel(person);
  const advicePromise = buildAdviceWithAi(person, mode, text, "");
  if (mode === "report") {
    state.dialogueTyping = `${person.name || "对方"}正在输入`;
    saveState();
    renderDialogue();
    const [advice] = await Promise.all([advicePromise, wait(900)]);
    renderGeneratedAdvice(advice);
    return;
  }
  renderGeneratedAdvice(await advicePromise);
}

function saveDialogueMemory(kind, options = {}) {
  const person = personById(state.selectedPersonId);
  if (!person) return;

  const input = state.dialogueMode === "report" ? state.dialogueOpeningText : state.dialogueOpponentText;
  const opponent = state.dialogueOpponentText || "";
  const lastOutgoing = [...(person.chatHistory || [])].reverse().find((message) => message.role === "outgoing");
  const reply = state.dialogueSentReply || elements.customReply?.value.trim() || lastOutgoing?.text || "";
  const advice = state.dialogueAnalysis || elements.analysisBox?.textContent.trim() || "";
  if (!input && !opponent && !reply && !advice) return;

  addMemory(person, kind === "reply" ? "真实回复反馈" : "新增互动记忆", [
      input ? `Input: ${input}` : "",
      opponent ? `Opponent: ${opponent}` : "",
      reply ? `Final reply: ${reply}` : "",
      advice ? `Analysis: ${advice}` : ""
    ]);
  state.lessons.unshift(`和${person.name}互动后：${reply || opponent || advice}`.slice(0, 90));
  saveState();
  if (options.rerender !== false) renderDialogue();
}

function bindEvents() {
  window.addEventListener("beforeunload", (event) => {
    if (!hasUnsavedMemoryDraft()) return;
    event.preventDefault();
    event.returnValue = "";
  });

  $$(".nav-button[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.route !== state.route && !confirmDiscardMemoryDraft()) return;
      if (button.dataset.route === "network") {
        clearPersonFocusTimer();
        state.focusPersonId = null;
        state.graphPersonStage = null;
        state.focusPersonPanelExpanded = false;
        state.focusCategoryId = null;
        state.selectedCategoryId = "all";
        state.viewMode = "graph";
      }
      setRoute(button.dataset.route);
    });
  });

  elements.themeToggle?.addEventListener("click", () => {
    state.themeMode = state.themeMode === "dark" ? "light" : "dark";
    saveState();
    render();
  });

  $("#backButton").addEventListener("click", goBack);

  $("#homeButton").addEventListener("click", () => {
    if (isNetworkCenter()) {
      openProfileModal();
      return;
    }

    clearPersonFocusTimer();
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.focusCategoryId = null;
    state.selectedCategoryId = "all";
    state.viewMode = "graph";
    setRoute("network");
  });

  $("#toggleView").addEventListener("click", () => {
    if (state.route !== "network") {
      state.route = "network";
    }
    clearPersonFocusTimer();
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.viewMode = state.viewMode === "graph" ? "manage" : "graph";
    saveState();
    render();
  });

  $("#manageButton").addEventListener("click", () => {
    clearPersonFocusTimer();
    state.focusPersonId = null;
    state.graphPersonStage = null;
    state.focusPersonPanelExpanded = false;
    state.route = "network";
    state.viewMode = "manage";
    saveState();
    render();
  });

  $("#addPersonButton").addEventListener("click", () => openPersonModal());
  $("#addManageCategoryButton").addEventListener("click", addCategory);
  $("#clearPresetButton").addEventListener("click", clearPresetPeople);
  $("#defaultTemplateButton").addEventListener("click", restoreDefaultTemplate);
  $("#addCategoryButton").addEventListener("click", addCategory);
  $("#exportMemoryButton").addEventListener("click", exportMemory);
  $("#exportEncryptedMemoryButton")?.addEventListener("click", exportEncryptedMemory);
  $("#importMemoryButton").addEventListener("click", () => elements.importMemoryInput.click());
  elements.importMemoryInput.addEventListener("change", () => importMemory(elements.importMemoryInput.files?.[0]));
  elements.manageSearchInput?.addEventListener("input", (event) => {
    state.manageFilters.keyword = event.target.value;
    saveState();
    renderManage();
  });
  elements.manageImportanceFilter?.addEventListener("change", (event) => {
    state.manageFilters.importance = event.target.value;
    saveState();
    renderManage();
  });
  elements.manageSortSelect?.addEventListener("change", (event) => {
    state.manageFilters.sort = event.target.value;
    saveState();
    renderManage();
  });
  elements.scheduleForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    addManualScheduleFromForm();
  });
  elements.offlineModeToggle.addEventListener("change", () => {
    state.offlineMode = elements.offlineModeToggle.checked;
    saveState();
    renderSettings();
  });
  $("#deepseekPresetButton")?.addEventListener("click", applyDeepSeekPreset);
  $("#saveAiConfigButton")?.addEventListener("click", saveAiConfigFromForm);
  $("#testAiConfigButton")?.addEventListener("click", testAiConfig);
  $("#runDiagnosticsButton")?.addEventListener("click", renderDiagnostics);
  elements.aiEnabledToggle?.addEventListener("change", saveAiConfigFromForm);
  elements.dialogueSearchInput?.addEventListener("input", renderDialogueHistory);
  elements.autoReplyToggle?.addEventListener("change", () => {
    state.autoAiReply = elements.autoReplyToggle.checked;
    saveState();
    renderDialogue();
  });

  elements.dialoguePersonSelect.addEventListener("change", () => {
    if (!confirmDiscardMemoryDraft()) {
      elements.dialoguePersonSelect.value = state.selectedPersonId;
      return;
    }
    clearSessionDialogue(state.selectedPersonId);
    state.selectedPersonId = elements.dialoguePersonSelect.value;
    resetDialogueRound(false);
    if (elements.replyOptions) elements.replyOptions.innerHTML = "";
    saveState();
    render();
  });

  $$(".segment").forEach((segment) => {
    segment.addEventListener("click", () => {
      state.dialogueMode = segment.dataset.mode;
      resetDialogueRound(false);
      if (elements.replyOptions) elements.replyOptions.innerHTML = "";
      saveState();
      render();
    });
  });

  $("#generateButton").addEventListener("click", async () => {
    const input = (elements.dialogueInput?.value || "").trim();
    if (input) {
      await startDialogueTurn(input);
      return;
    }
    const person = personById(state.selectedPersonId);
    const context = state.dialogueMode === "report" ? state.dialogueOpeningText : state.dialogueOpponentText;
    if (context) {
      state.dialogueAnalysis = canUseOnlineAi() ? "AI 正在重新生成回复建议..." : state.dialogueAnalysis;
      if (canUseOnlineAi()) renderDialogueAnalysisPanel(person);
      renderGeneratedAdvice(await buildAdviceWithAi(person, state.dialogueMode, context, state.dialogueOpponentText || ""));
    }
  });

  $("#saveMemoryButton").addEventListener("click", beginMemoryDraft);
  $("#confirmReplyButton").addEventListener("click", sendDialogueReply);
  elements.dialogueInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendDialogueReply();
    }
  });

  elements.personForm.addEventListener("submit", (event) => {
    event.preventDefault();
    savePersonFromForm();
  });

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfileFromForm();
  });

  elements.personModal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingPersonId = null;
      elements.personModal.close();
    });
  });

  elements.profileModal.querySelectorAll("[data-profile-close]").forEach((button) => {
    button.addEventListener("click", () => elements.profileModal.close());
  });

  elements.cancelDeletePerson.addEventListener("click", cancelDeletePerson);
  elements.cancelDeletePersonTop.addEventListener("click", cancelDeletePerson);
  elements.confirmDeletePerson.addEventListener("click", confirmDeletePerson);
}

bindEvents();
render();

