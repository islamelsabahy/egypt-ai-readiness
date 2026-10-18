/* Egypt AI Readiness engine: scoring, gaps, use-case fit and a 90-day roadmap. Pure functions, no I/O. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Readiness = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  // Answer scale for every question: 0 none, 1 ad hoc, 2 partial, 3 defined, 4 measured and improving.
  var DIMS = [
    { id: "strategy", w: 0.15, ar: "الاستراتيجية والقيادة", en: "Strategy & leadership", q: [
      ["الإدارة العليا محددة أهداف واضحة للـ AI مربوطة بأرقام الشركة", "Top management has clear AI goals tied to business numbers"],
      ["فيه شخص مسؤول (owner) عن مبادرات الـ AI وله صلاحية", "A named owner with authority runs AI initiatives"],
      ["فيه ميزانية مخصصة للتجارب والتطوير", "There is a dedicated budget for pilots and build-out"],
      ["حالات الاستخدام بتتختار بمعيار قيمة/جهد مش بالموضة", "Use cases are chosen by value vs effort, not by hype"]] },
    { id: "data", w: 0.17, ar: "البيانات", en: "Data", q: [
      ["بيانات العملاء والمبيعات في نظام واحد مش ملفات Excel متفرقة", "Customer and sales data live in one system, not scattered spreadsheets"],
      ["فيه تعريفات موحدة للأرقام (مثلاً: يعني إيه عميل نشط)", "Metrics have agreed definitions (e.g. what an active customer is)"],
      ["جودة البيانات بتتراجع دوريًا (تكرار، نواقص، أخطاء)", "Data quality is checked regularly (duplicates, gaps, errors)"],
      ["المستندات (عقود، فواتير، مراسلات) متخزنة رقميًا وممكن البحث فيها", "Documents (contracts, invoices, correspondence) are digital and searchable"],
      ["فيه صلاحيات واضحة مين يشوف أنهي بيانات", "Clear access rights define who can see which data"]] },
    { id: "infra", w: 0.12, ar: "البنية التحتية والسحابة", en: "Infrastructure & cloud", q: [
      ["الأنظمة الأساسية على سحابة أو سيرفرات مستقرة بنسخ احتياطي مجرَّب", "Core systems run on cloud or stable servers with tested backups"],
      ["الإنترنت والشبكة في المواقع والفروع مستقرين", "Internet and network are stable across sites and branches"],
      ["فيه حسابات مؤسسية (Microsoft 365 / Google Workspace) لكل الموظفين", "Every employee has a company account (Microsoft 365 / Google Workspace)"],
      ["تقدر تشتري خدمات سحابية وAPIs بالدولار من غير تعطيل طويل", "You can buy cloud services and APIs in USD without long delays"]] },
    { id: "systems", w: 0.12, ar: "الأنظمة والتكامل", en: "Systems & integration", q: [
      ["فيه ERP أو نظام محاسبي شغال ومستخدم فعلًا", "An ERP or accounting system is live and actually used"],
      ["فيه CRM للمبيعات والعملاء", "A CRM is used for sales and customers"],
      ["الأنظمة مربوطة ببعض (APIs / تكامل) بدل الإدخال اليدوي المكرر", "Systems are integrated (APIs) instead of double data entry"],
      ["الفاتورة الإلكترونية (ETA) متكاملة مع النظام", "ETA e-invoicing is integrated with the system"]] },
    { id: "people", w: 0.14, ar: "الناس والمهارات", en: "People & skills", q: [
      ["فريق الـ IT عنده خبرة في الأتمتة أو البيانات أو الـ AI", "The IT team has automation, data or AI experience"],
      ["الموظفين اتدربوا على استخدام أدوات الـ AI بأمان", "Staff are trained to use AI tools safely"],
      ["فيه ثقافة تجربة وقياس (pilot ثم قرار)", "There is a culture of pilot, measure, then decide"],
      ["الإدارات (مالية، مبيعات، HR) متعاونة مع الـ IT في المشاريع", "Departments (finance, sales, HR) co-own projects with IT"]] },
    { id: "governance", w: 0.12, ar: "الحوكمة والقانون", en: "Governance & legal", q: [
      ["فيه سياسة مكتوبة لاستخدام أدوات الـ AI (إيه المسموح وإيه الممنوع)", "A written AI acceptable-use policy exists"],
      ["الشركة مطابقة لقانون حماية البيانات الشخصية 151 لسنة 2020", "The company complies with Egypt's Personal Data Protection Law 151/2020"],
      ["عقود الموردين فيها بنود عن البيانات وأماكن تخزينها", "Vendor contracts cover data use and storage location"],
      ["فيه سجل لمخاطر الـ AI ومراجعة بشرية للقرارات الحساسة", "There is an AI risk register and human review of sensitive decisions"]] },
    { id: "security", w: 0.10, ar: "الأمن السيبراني", en: "Security", q: [
      ["التحقق الثنائي (MFA) مفعّل على البريد والأنظمة المهمة", "MFA is enabled on email and critical systems"],
      ["فيه منع لرفع بيانات حساسة على أدوات AI عامة (DLP أو ضوابط)", "Sensitive data is blocked from public AI tools (DLP or controls)"],
      ["فيه مراقبة وتسجيل للدخول والأحداث الأمنية", "Logins and security events are monitored and logged"],
      ["فيه خطة استجابة للحوادث ومجرَّبة", "An incident response plan exists and has been tested"]] },
    { id: "value", w: 0.08, ar: "قياس القيمة", en: "Value tracking", q: [
      ["كل مبادرة ليها خط أساس (baseline) قبل البدء", "Every initiative has a baseline before it starts"],
      ["بتقيس الوفر بالساعات أو الجنيه بعد التنفيذ", "Savings are measured in hours or EGP after delivery"],
      ["فيه قرار واضح لإيقاف التجارب اللي مش بتجيب نتيجة", "There is a clear kill decision for pilots that do not deliver"]] }
  ];
  var LEVELS = [[20, "غير مستعدة", "Unaware"], [40, "بتستكشف", "Exploring"], [60, "جاهزة للتجربة", "Ready to pilot"], [80, "جاهزة للتوسع", "Ready to scale"], [101, "رائدة", "Leading"]];
  var SECTORS = { realestate: ["تطوير عقاري", "Real estate development"], manufacturing: ["تصنيع", "Manufacturing"], retail: ["تجزئة وتوزيع", "Retail & distribution"], services: ["خدمات مهنية", "Professional services"], healthcare: ["رعاية صحية", "Healthcare"], finance: ["خدمات مالية", "Financial services"] };
  // band: cost band key; value/effort 1..5; needs: minimum dimension scores (0..100); sectors: [] = all
  var USECASES = [
    { id: "doc-qa", ar: "مساعد أسئلة على مستندات الشركة (سياسات، عقود، إجراءات)", en: "Q&A assistant over company documents (policies, contracts, procedures)", sectors: [], value: 4, effort: 2, band: "low", needs: { data: 40, governance: 30, security: 40 } },
    { id: "meeting", ar: "ملخصات الاجتماعات واستخراج المهام", en: "Meeting summaries and action extraction", sectors: [], value: 3, effort: 1, band: "low", needs: { governance: 25, security: 35 } },
    { id: "email-draft", ar: "صياغة الردود والمراسلات بالعربي والإنجليزي", en: "Drafting replies and correspondence in Arabic and English", sectors: [], value: 3, effort: 1, band: "low", needs: { governance: 20 } },
    { id: "invoice-ocr", ar: "قراءة الفواتير والشيكات آليًا وإدخالها في النظام", en: "Automatic invoice and cheque reading into the system", sectors: [], value: 4, effort: 3, band: "medium", needs: { systems: 45, data: 35 } },
    { id: "helpdesk", ar: "فرز تذاكر الدعم الفني والرد على الأسئلة المتكررة", en: "IT helpdesk triage and answers to repeated questions", sectors: [], value: 3, effort: 2, band: "low", needs: { systems: 30, people: 30 } },
    { id: "hr-screen", ar: "فرز السير الذاتية ومقابلات أولية منظمة", en: "CV screening and structured first interviews", sectors: [], value: 3, effort: 2, band: "low", needs: { governance: 45, data: 30 } },
    { id: "re-sales-agent", ar: "وكيل مبيعات واتساب بالعامية لتأهيل العملاء", en: "WhatsApp sales agent in Egyptian Arabic to qualify leads", sectors: ["realestate", "retail"], value: 5, effort: 3, band: "medium", needs: { systems: 45, data: 45, governance: 35 } },
    { id: "re-collections", ar: "توقع تعثر الأقساط وترتيب أولويات التحصيل", en: "Instalment default prediction and collections prioritisation", sectors: ["realestate", "finance"], value: 5, effort: 3, band: "medium", needs: { data: 55, systems: 45 } },
    { id: "re-contract", ar: "مراجعة أولية لعقود البيع والإيجار العربية", en: "First-pass review of Arabic sale and lease contracts", sectors: ["realestate", "services"], value: 4, effort: 2, band: "low", needs: { governance: 40, data: 30 } },
    { id: "re-site", ar: "تقارير الموقع اليومية من الصور والملاحظات", en: "Daily site reports from photos and notes", sectors: ["realestate", "manufacturing"], value: 3, effort: 3, band: "medium", needs: { infra: 45, people: 35 } },
    { id: "forecast", ar: "توقع المبيعات والطلب", en: "Sales and demand forecasting", sectors: ["retail", "manufacturing", "realestate"], value: 4, effort: 4, band: "high", needs: { data: 65, value: 40, people: 45 } },
    { id: "quality", ar: "فحص الجودة بالصور على خط الإنتاج", en: "Visual quality inspection on the line", sectors: ["manufacturing"], value: 4, effort: 4, band: "high", needs: { infra: 60, data: 55, people: 50 } },
    { id: "claims", ar: "مراجعة المطالبات والمستندات الطبية", en: "Claims and medical document review", sectors: ["healthcare", "finance"], value: 4, effort: 4, band: "high", needs: { governance: 65, security: 65, data: 55 } },
    { id: "kyc", ar: "التحقق من هوية العملاء ومستنداتهم", en: "Customer identity and document verification (KYC)", sectors: ["finance"], value: 4, effort: 3, band: "medium", needs: { governance: 60, security: 60 } },
    { id: "bi-chat", ar: "اسأل لوحة المؤشرات بالعربي", en: "Ask your dashboards in Arabic", sectors: [], value: 4, effort: 3, band: "medium", needs: { data: 60, systems: 50 } }
  ];
  var ACTIONS = {
    strategy: [["عيّن owner للـ AI وحدد 3 أهداف مربوطة بأرقام (وقت، تكلفة، إيراد)", "Name an AI owner and set 3 goals tied to numbers (time, cost, revenue)"], ["خصص ميزانية تجارب صغيرة بقرار إيقاف واضح", "Ring-fence a small pilot budget with a clear kill rule"]],
    data: [["اجمع بيانات العملاء والمبيعات في مصدر واحد ووحّد التعريفات", "Consolidate customer and sales data into one source with shared definitions"], ["نظّف أهم 3 جداول (تكرار ونواقص) وحط مراجعة شهرية", "Clean the top 3 tables (duplicates, gaps) and add a monthly check"]],
    infra: [["ثبّت النسخ الاحتياطي وجرّب الاسترجاع فعلًا", "Fix backups and actually test a restore"], ["وفّر طريقة دفع دولاري للخدمات السحابية", "Set up a USD payment route for cloud services"]],
    systems: [["اربط الـ ERP بالـ CRM أو على الأقل صدّر بيانات يومية آليًا", "Integrate ERP and CRM, or at least automate a daily export"], ["فعّل تكامل الفاتورة الإلكترونية لو مش متفعّل", "Complete ETA e-invoicing integration if missing"]],
    people: [["درّب كل الموظفين ساعتين على الاستخدام الآمن للـ AI", "Give all staff two hours of safe-AI-use training"], ["اختار champion في كل إدارة يشارك في التجارب", "Pick a champion in each department to co-own pilots"]],
    governance: [["اكتب سياسة استخدام AI صفحة واحدة واعتمدها", "Write and approve a one-page AI acceptable-use policy"], ["راجع المطابقة لقانون 151 لسنة 2020 وبنود البيانات في عقود الموردين", "Review Law 151/2020 compliance and data clauses in vendor contracts"]],
    security: [["فعّل MFA على البريد والأنظمة المهمة", "Enable MFA on email and critical systems"], ["امنع لصق البيانات الحساسة في أدوات AI العامة ووفّر أداة مؤسسية بديلة", "Block sensitive data in public AI tools and provide an approved enterprise tool"]],
    value: [["سجّل خط أساس (ساعات/تكلفة) لكل عملية قبل أتمتتها", "Record a baseline (hours/cost) for each process before automating it"], ["راجع كل تجربة بعد 30 يوم: كمّل أو وقّف", "Review each pilot at day 30: continue or stop"]]
  };
  var BANDS = { low: 150000, medium: 600000, high: 2000000 };

  function dimScore(d, answers) {
    var a = answers[d.id] || [], s = 0;
    for (var i = 0; i < d.q.length; i++) { var v = Number(a[i] || 0); if (!(v >= 0 && v <= 4)) throw new Error("answer must be 0..4"); s += v; }
    return 100 * s / (4 * d.q.length);
  }
  function level(score) { for (var i = 0; i < LEVELS.length; i++) if (score < LEVELS[i][0]) return i; return LEVELS.length - 1; }
  function assess(answers, opts) {
    opts = opts || {}; var sector = opts.sector || "realestate", bands = opts.bands || BANDS;
    var dims = {}, total = 0;
    DIMS.forEach(function (d) { dims[d.id] = dimScore(d, answers); total += d.w * dims[d.id]; });
    var gaps = DIMS.map(function (d) { return { id: d.id, score: dims[d.id], weighted_gap: d.w * (100 - dims[d.id]) }; })
      .sort(function (a, b) { return b.weighted_gap - a.weighted_gap || (a.id < b.id ? -1 : 1); });
    var uc = USECASES.filter(function (u) { return !u.sectors.length || u.sectors.indexOf(sector) >= 0; }).map(function (u) {
      var missing = [], fit = 1;
      for (var k in u.needs) { if (dims[k] < u.needs[k]) { missing.push({ dim: k, need: u.needs[k], have: dims[k] }); fit = Math.min(fit, dims[k] / u.needs[k]); } }
      var priority = (u.value / u.effort) * fit;
      return { id: u.id, ready: missing.length === 0, fit: fit, missing: missing, priority: priority, value: u.value, effort: u.effort, band: u.band, cost: bands[u.band] };
    }).sort(function (a, b) { return (b.ready - a.ready) || (b.priority - a.priority) || (a.id < b.id ? -1 : 1); });
    var weak = gaps.filter(function (g) { return g.score < 50; }).slice(0, 3);
    if (!weak.length) weak = gaps.slice(0, 1);
    var pilots = uc.filter(function (u) { return u.ready; }).slice(0, 2);
    var blockers = {};
    uc.filter(function (u) { return !u.ready; }).slice(0, 3).forEach(function (u) { u.missing.forEach(function (m) { blockers[m.dim] = 1; }); });
    var road = [
      { phase: 1, days: "0-30", items: weak.map(function (g) { return { kind: "fix", dim: g.id, action: 0 }; }) },
      { phase: 2, days: "31-60", items: pilots.map(function (u) { return { kind: "pilot", usecase: u.id }; }).concat(weak.map(function (g) { return { kind: "fix", dim: g.id, action: 1 }; })) },
      { phase: 3, days: "61-90", items: [{ kind: "fix", dim: "value", action: 1 }].concat(Object.keys(blockers).filter(function (k) { return weak.every(function (g) { return g.id !== k; }); }).map(function (k) { return { kind: "fix", dim: k, action: 0 }; })) }
    ];
    var budget = pilots.reduce(function (a, u) { return a + u.cost; }, 0);
    return { total: total, level: level(total), dims: dims, gaps: gaps, usecases: uc, roadmap: road, pilot_budget: budget };
  }
  function encode(answers) { return DIMS.map(function (d) { var a = answers[d.id] || []; return d.q.map(function (_, i) { return a[i] || 0; }).join(""); }).join("-"); }
  function decode(s) {
    var parts = String(s || "").split("-"), out = {};
    DIMS.forEach(function (d, j) { var p = parts[j] || ""; out[d.id] = d.q.map(function (_, i) { var v = +p.charAt(i); return v >= 0 && v <= 4 ? v : 0; }); });
    return out;
  }
  return { DIMS: DIMS, LEVELS: LEVELS, SECTORS: SECTORS, USECASES: USECASES, ACTIONS: ACTIONS, BANDS: BANDS, assess: assess, encode: encode, decode: decode, level: level };
});
