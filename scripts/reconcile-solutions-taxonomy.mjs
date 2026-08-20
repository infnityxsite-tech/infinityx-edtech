import "dotenv/config";
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

/**
 * Non-destructive, idempotent reconciliation for the canonical Solutions taxonomy.
 * It only changes the three canonical categories and the eight approved systems.
 */
const CATEGORIES = [
  {
    slug: "operations",
    name: "Operations",
    description:
      "Forecasting, automation, decision intelligence, and operating visibility for complex business work.",
    orderIndex: 0,
  },
  {
    slug: "computer-vision",
    name: "Computer Vision",
    description:
      "Visual intelligence for detection, inspection, tracking, and quality control in real operating environments.",
    orderIndex: 1,
  },
  {
    slug: "product-systems",
    name: "Product Systems",
    description:
      "AI-enabled software, knowledge systems, and assistants designed for reliable internal or customer-facing use.",
    orderIndex: 2,
  },
];

function flow(...steps) {
  return steps.map(([title, titleAr, desc, descAr], index) => ({
    step: index + 1,
    title,
    titleAr,
    desc,
    descAr,
  }));
}

const SERVICES = [
  {
    slug: "predictive-analytics",
    categorySlug: "operations",
    heroImageUrl: "/uploads/hero_analytics_dash.webp",
    methodology: flow(
      [
        "Frame the decision",
        "تحديد القرار",
        "Define the operational decision, planning horizon, and outcome the forecast must support.",
        "تحديد القرار التشغيلي وأفق التخطيط والنتيجة التي يجب أن يدعمها التنبؤ.",
      ],
      [
        "Prepare the signals",
        "تهيئة الإشارات",
        "Bring together historical, transactional, and operational signals with clear data-quality checks.",
        "جمع الإشارات التاريخية والمعاملاتية والتشغيلية مع فحوصات واضحة لجودة البيانات.",
      ],
      [
        "Forecast scenarios",
        "التنبؤ بالسيناريوهات",
        "Train and validate models that expose expected demand, risk, or anomaly scenarios.",
        "تدريب والتحقق من النماذج التي توضح سيناريوهات الطلب أو المخاطر أو الشذوذ المتوقعة.",
      ],
      [
        "Act and learn",
        "التنفيذ والتعلم",
        "Route insights into planning workflows, monitor drift, and improve the model with new evidence.",
        "توجيه الرؤى إلى سير عمل التخطيط ومراقبة الانحراف وتحسين النموذج بأدلة جديدة.",
      ]
    ),
  },
  {
    slug: "ai-automation-systems",
    categorySlug: "operations",
    heroImageUrl: "/uploads/hero_ai_automation.webp",
    safeProfileCopy: {
      problemStatement:
        "Teams often move the same request across inboxes, spreadsheets, and line-of-business systems. An automation system should make routine handoffs visible, governed, and easier to review without taking accountability away from people.",
      problemStatementAr:
        "تنتقل الطلبات المتكررة غالباً بين صناديق البريد وجداول البيانات والأنظمة التشغيلية. ينبغي لنظام الأتمتة أن يجعل عمليات التسليم الروتينية واضحة ومحكومة وأسهل للمراجعة دون سحب المساءلة من الأشخاص.",
      overviewLong:
        "AI Automation Systems connect trusted business systems, documents, rules, and approval paths into a designed operating flow. They can classify incoming work, prepare context for a reviewer, trigger the next approved action, and surface exceptions that need human judgment. The work begins with the actual process and its controls, then introduces automation where it improves consistency and traceability.\n\nThe resulting system is operated with explicit owners, access boundaries, logs, escalation paths, and feedback from real exceptions. It is a practical layer for reducing manual coordination while keeping policy and decision authority clear.",
      overviewLongAr:
        "تربط أنظمة الأتمتة بالذكاء الاصطناعي بين الأنظمة التجارية الموثوقة والوثائق والقواعد ومسارات الموافقة ضمن تدفق تشغيلي مصمم. ويمكنها تصنيف العمل الوارد وتجهيز السياق للمراجع وتشغيل الإجراء التالي المعتمد وإظهار الاستثناءات التي تحتاج إلى حكم بشري. يبدأ العمل بالعملية الفعلية وضوابطها، ثم يُدخل الأتمتة حيث تحسن الاتساق وقابلية التتبع.\n\nيُشغَّل النظام الناتج بمالكين واضحين وحدود وصول وسجلات ومسارات تصعيد وتغذية راجعة من الاستثناءات الفعلية. وهو طبقة عملية لتقليل التنسيق اليدوي مع إبقاء السياسة وسلطة القرار واضحتين.",
    },
    methodology: flow(
      [
        "Map the workflow",
        "رسم سير العمل",
        "Identify handoffs, exceptions, approvals, and the work that should remain under human control.",
        "تحديد عمليات التسليم والاستثناءات والموافقات والعمل الذي يجب أن يظل تحت التحكم البشري.",
      ],
      [
        "Connect the systems",
        "ربط الأنظمة",
        "Integrate the authoritative systems, documents, and event sources through secure interfaces.",
        "تكامل الأنظمة والوثائق ومصادر الأحداث المعتمدة عبر واجهات آمنة.",
      ],
      [
        "Automate the decision path",
        "أتمتة مسار القرار",
        "Orchestrate agents, rules, and escalation paths so routine work moves without losing accountability.",
        "تنسيق الوكلاء والقواعد ومسارات التصعيد لتحريك العمل الروتيني دون فقدان المساءلة.",
      ],
      [
        "Operate and improve",
        "التشغيل والتحسين",
        "Observe outcomes, review exceptions, and tune automation as policies and volumes change.",
        "مراقبة النتائج ومراجعة الاستثناءات وضبط الأتمتة مع تغير السياسات والأحجام.",
      ]
    ),
  },
  {
    slug: "intelligent-dashboards",
    categorySlug: "operations",
    heroImageUrl: "/uploads/hero_dashboards.webp",
    methodology: flow(
      [
        "Define operating metrics",
        "تحديد مؤشرات التشغيل",
        "Agree the decisions, measures, owners, and refresh cadence that make the dashboard useful.",
        "الاتفاق على القرارات والمقاييس والمالكين ودورية التحديث التي تجعل لوحة المعلومات مفيدة.",
      ],
      [
        "Unify live data",
        "توحيد البيانات الحية",
        "Connect trusted source systems and establish the transformations behind each metric.",
        "ربط الأنظمة المصدرية الموثوقة وتحديد التحويلات خلف كل مقياس.",
      ],
      [
        "Design decision views",
        "تصميم واجهات القرار",
        "Build role-aware views, alerts, and drill-down paths around the questions each team needs answered.",
        "بناء واجهات حسب الدور والتنبيهات ومسارات التعمق حول الأسئلة التي يحتاج كل فريق إلى إجابة عنها.",
      ],
      [
        "Monitor and improve",
        "المراقبة والتحسين",
        "Review adoption and metric quality, then refine the dashboard as the operation changes.",
        "مراجعة التبني وجودة المقاييس ثم تحسين لوحة المعلومات مع تغير العملية.",
      ]
    ),
  },
  {
    slug: "decision-support-systems",
    categorySlug: "operations",
    heroImageUrl: "/uploads/hero_decision_support.webp",
    methodology: flow(
      [
        "Frame the decision",
        "تحديد القرار",
        "Clarify the decision owner, available options, constraints, and level of acceptable risk.",
        "توضيح مالك القرار والخيارات المتاحة والقيود ومستوى المخاطر المقبول.",
      ],
      [
        "Model options and constraints",
        "نمذجة الخيارات والقيود",
        "Combine operational data, policies, and dependencies into an explainable decision model.",
        "دمج البيانات التشغيلية والسياسات والتبعيات في نموذج قرار قابل للتفسير.",
      ],
      [
        "Evaluate scenarios",
        "تقييم السيناريوهات",
        "Compare likely outcomes, trade-offs, and sensitivities before a recommendation is made.",
        "مقارنة النتائج المحتملة والمفاضلات والحساسيات قبل تقديم التوصية.",
      ],
      [
        "Route accountable action",
        "توجيه الإجراء المسؤول",
        "Deliver recommendations with rationale, approvals, and feedback loops for continual improvement.",
        "تقديم التوصيات مع المبررات والموافقات وحلقات التغذية الراجعة للتحسين المستمر.",
      ]
    ),
  },
  {
    slug: "computer-vision-systems",
    categorySlug: "computer-vision",
    heroImageUrl: "/uploads/hero_cv_industrial.webp",
    safeProfileCopy: {
      problemStatement:
        "Visual operational work depends on what cameras can reliably see in changing environments. Teams need a governed way to turn images and video into signals that support detection, classification, tracking, and review.",
      problemStatementAr:
        "يعتمد العمل التشغيلي البصري على ما يمكن للكاميرات رؤيته بصورة موثوقة في بيئات متغيرة. تحتاج الفرق إلى طريقة محكومة لتحويل الصور والفيديو إلى إشارات تدعم الاكتشاف والتصنيف والتتبع والمراجعة.",
      overviewLong:
        "Computer Vision Systems turn visual inputs from cameras and imaging equipment into workflow-ready signals. A system can be designed for object detection, classification, counting, tracking, or event review, with the camera setup, lighting, data quality, and operating conditions treated as part of the product.\n\nDelivery includes representative data, agreed definitions of success, review paths for uncertain cases, and integration with the operational system that consumes the result. This keeps the system useful beyond a model demonstration and gives teams a clear process for maintaining it as the environment changes.",
      overviewLongAr:
        "تحول أنظمة الرؤية الحاسوبية المدخلات البصرية من الكاميرات ومعدات التصوير إلى إشارات جاهزة لسير العمل. ويمكن تصميم النظام لاكتشاف العناصر أو تصنيفها أو عدها أو تتبعها أو مراجعة الأحداث، مع التعامل مع إعداد الكاميرا والإضاءة وجودة البيانات وظروف التشغيل كجزء من المنتج.\n\nيشمل التسليم بيانات ممثلة وتعريفات متفقاً عليها للنجاح ومسارات مراجعة للحالات غير المؤكدة وتكاملاً مع النظام التشغيلي الذي يستهلك النتيجة. وهذا يجعل النظام مفيداً بما يتجاوز عرض النموذج ويمنح الفرق عملية واضحة لصيانته مع تغير البيئة.",
    },
    methodology: flow(
      [
        "Capture the visual signal",
        "التقاط الإشارة البصرية",
        "Assess cameras, lighting, placement, and the operating conditions that affect image quality.",
        "تقييم الكاميرات والإضاءة والمواضع وظروف التشغيل التي تؤثر في جودة الصورة.",
      ],
      [
        "Label and validate",
        "وضع العلامات والتحقق",
        "Create representative datasets and validate what the model must detect, classify, or track.",
        "إنشاء مجموعات بيانات ممثلة والتحقق مما يجب أن يكتشفه النموذج أو يصنفه أو يتتبعه.",
      ],
      [
        "Deploy inference",
        "نشر الاستدلال",
        "Optimize inference for the required latency and integrate outputs with the operational workflow.",
        "تحسين الاستدلال للزمن المطلوب ودمج المخرجات مع سير العمل التشغيلي.",
      ],
      [
        "Review exceptions",
        "مراجعة الاستثناءات",
        "Monitor confidence, review edge cases, and use approved feedback to improve performance.",
        "مراقبة الثقة ومراجعة الحالات الطرفية واستخدام الملاحظات المعتمدة لتحسين الأداء.",
      ]
    ),
  },
  {
    slug: "industrial-ai-inspection",
    categorySlug: "computer-vision",
    heroImageUrl: "/uploads/hero_industrial_inspect.webp",
    safeProfileCopy: {
      problemStatement:
        "Quality teams need inspection evidence that can be reviewed alongside the product, line conditions, and quality policy. A reliable inspection process must make defect decisions traceable and route exceptions to the people responsible for action.",
      problemStatementAr:
        "تحتاج فرق الجودة إلى أدلة فحص يمكن مراجعتها إلى جانب المنتج وظروف الخط وسياسة الجودة. يجب أن تجعل عملية الفحص الموثوقة قرارات العيوب قابلة للتتبع وأن توجه الاستثناءات إلى الأشخاص المسؤولين عن الإجراء.",
      overviewLong:
        "Industrial AI Inspection combines camera design, visual models, and quality workflow integration to help teams inspect defined product conditions. The system is configured around the actual line, defect taxonomy, sampling and review practices, and the downstream action required when an exception is found.\n\nIt can present inspection evidence to operators and quality owners, record the reason for a review, and connect outcomes to the existing quality or production system. Human review remains available for ambiguous cases and for evolving quality criteria.",
      overviewLongAr:
        "يجمع الفحص الصناعي بالذكاء الاصطناعي بين تصميم الكاميرا والنماذج البصرية والتكامل مع سير عمل الجودة لمساعدة الفرق على فحص حالات منتجات محددة. يُضبط النظام حول الخط الفعلي وتصنيف العيوب وممارسات أخذ العينات والمراجعة والإجراء اللاحق المطلوب عند العثور على استثناء.\n\nويمكنه عرض أدلة الفحص للمشغلين ومالكي الجودة وتسجيل سبب المراجعة وربط النتائج بنظام الجودة أو الإنتاج القائم. وتبقى المراجعة البشرية متاحة للحالات الملتبسة ولمعايير الجودة المتطورة.",
    },
    methodology: flow(
      [
        "Baseline the production line",
        "تحديد خط الأساس للإنتاج",
        "Document products, defect classes, quality thresholds, and the inspection point in the line.",
        "توثيق المنتجات وفئات العيوب وحدود الجودة ونقطة الفحص في خط الإنتاج.",
      ],
      [
        "Detect and classify",
        "اكتشاف العيوب وتصنيفها",
        "Train visual models to identify defects, severity, and product-specific quality conditions.",
        "تدريب نماذج بصرية لتحديد العيوب وشدتها وظروف الجودة الخاصة بالمنتج.",
      ],
      [
        "Escalate quality exceptions",
        "تصعيد استثناءات الجودة",
        "Connect inspection results to operators, quality systems, and traceable remediation actions.",
        "ربط نتائج الفحص بالمشغلين وأنظمة الجودة وإجراءات المعالجة القابلة للتتبع.",
      ],
      [
        "Continuously calibrate",
        "المعايرة المستمرة",
        "Use reviewed outcomes and new production conditions to maintain inspection reliability.",
        "استخدام النتائج المراجعة وظروف الإنتاج الجديدة للحفاظ على موثوقية الفحص.",
      ]
    ),
  },
  {
    slug: "custom-llm-solutions",
    categorySlug: "product-systems",
    heroImageUrl: "/uploads/hero_custom_llm.webp",
    methodology: flow(
      [
        "Define the assistant role",
        "تحديد دور المساعد",
        "Set the user, task boundaries, required outputs, and decisions the system may or may not make.",
        "تحديد المستخدم وحدود المهام والمخرجات المطلوبة والقرارات التي يمكن أو لا يمكن للنظام اتخاذها.",
      ],
      [
        "Prepare secure domain context",
        "تهيئة السياق المعرفي الآمن",
        "Structure approved domain knowledge, access rules, and evaluation examples for the intended use.",
        "تنظيم المعرفة المعتمدة وقواعد الوصول وأمثلة التقييم للاستخدام المقصود.",
      ],
      [
        "Build guarded interactions",
        "بناء تفاعلات محكومة",
        "Implement prompts, tools, controls, and review paths that keep responses useful and accountable.",
        "تنفيذ المطالبات والأدوات والضوابط ومسارات المراجعة التي تحافظ على فائدة الإجابات ومساءلتها.",
      ],
      [
        "Evaluate and operate",
        "التقييم والتشغيل",
        "Test against real tasks, monitor quality and safety, and improve with governed feedback.",
        "الاختبار مقابل مهام حقيقية ومراقبة الجودة والسلامة والتحسين من خلال تغذية راجعة محكومة.",
      ]
    ),
  },
  {
    slug: "rag-knowledge-systems",
    categorySlug: "product-systems",
    heroImageUrl: "/uploads/hero_rag_knowledge.webp",
    safeProfileCopy: {
      problemStatement:
        "Useful organizational knowledge is often spread across documents, systems, and owners with different access rules. People need answers that are grounded in approved source material and clear about what they do not know.",
      problemStatementAr:
        "تتوزع المعرفة التنظيمية المفيدة غالباً عبر وثائق وأنظمة ومالكين لهم قواعد وصول مختلفة. يحتاج الأشخاص إلى إجابات مستندة إلى مواد مصدر معتمدة وواضحة بشأن ما لا تعرفه.",
      overviewLong:
        "RAG & Knowledge Systems organize approved knowledge for retrieval before an assistant responds. They connect selected content sources, preserve access controls, retrieve relevant evidence, and present answers with source context where appropriate. The design accounts for content ownership, freshness, and unanswered questions rather than treating documents as a static upload.\n\nThe system includes evaluation and maintenance workflows so teams can review retrieval quality, improve the source set, and keep governance aligned with how knowledge changes. It is designed for dependable internal knowledge work, not unsupported answers.",
      overviewLongAr:
        "تنظم أنظمة RAG والمعرفة المحتوى المعتمد للاسترجاع قبل أن يجيب المساعد. فهي تربط مصادر محتوى مختارة وتحافظ على ضوابط الوصول وتسترجع الأدلة ذات الصلة وتعرض الإجابات مع سياق المصدر عند الاقتضاء. ويراعي التصميم ملكية المحتوى وحداثته والأسئلة غير المجابة بدلاً من التعامل مع الوثائق كتحميل ثابت.\n\nيتضمن النظام سير عمل للتقييم والصيانة حتى تتمكن الفرق من مراجعة جودة الاسترجاع وتحسين مجموعة المصادر والحفاظ على توافق الحوكمة مع تغير المعرفة. وهو مصمم لعمل معرفي داخلي يعتمد عليه، لا لإجابات غير مدعومة.",
    },
    methodology: flow(
      [
        "Inventory knowledge",
        "حصر المعرفة",
        "Identify the approved documents, systems, owners, and freshness requirements for the knowledge base.",
        "تحديد الوثائق والأنظمة والمالكين المعتمدين ومتطلبات حداثة قاعدة المعرفة.",
      ],
      [
        "Index and retrieve",
        "الفهرسة والاسترجاع",
        "Prepare content, retrieval strategies, and access-aware indexing for relevant source material.",
        "تهيئة المحتوى واستراتيجيات الاسترجاع والفهرسة الواعية بالصلاحيات للمواد المصدرية ذات الصلة.",
      ],
      [
        "Ground and cite answers",
        "إسناد الإجابات وتوثيقها",
        "Generate responses from retrieved evidence with citations and clear handling for uncertainty.",
        "توليد إجابات من الأدلة المسترجعة مع الإحالات والتعامل الواضح مع عدم اليقين.",
      ],
      [
        "Measure and maintain",
        "القياس والصيانة",
        "Review search quality, unanswered questions, and content changes to keep knowledge current.",
        "مراجعة جودة البحث والأسئلة غير المجابة وتغيرات المحتوى للحفاظ على حداثة المعرفة.",
      ]
    ),
  },
];

const REQUIRED_SERVICE_COLUMNS = [
  "id",
  "slug",
  "status",
  "category_id",
  "hero_image_url",
  "process_methodology_json",
];

async function ensureSchema(client) {
  const serviceTable = await client.query(
    "SELECT to_regclass('public.services') AS table_name"
  );
  if (!serviceTable.rows[0]?.table_name) {
    throw new Error(
      "The services table does not exist. Run the base database migration first."
    );
  }

  await client.query(`
    CREATE TABLE IF NOT EXISTS service_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.query(`
    ALTER TABLE services
      ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
      ADD COLUMN IF NOT EXISTS process_methodology_json TEXT
  `);

  await client.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS service_categories_slug_unique_idx ON service_categories (slug)"
  );

  const columns = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'services'
  `);
  const available = new Set(columns.rows.map(row => row.column_name));
  const missing = REQUIRED_SERVICE_COLUMNS.filter(
    column => !available.has(column)
  );
  if (missing.length) {
    throw new Error(
      "The services table is missing required columns: " + missing.join(", ")
    );
  }
}

function validateMethodology(value) {
  return (
    Array.isArray(value) &&
    value.length >= 4 &&
    value.every(
      step =>
        Number.isInteger(step?.step) &&
        typeof step?.title === "string" &&
        typeof step?.titleAr === "string" &&
        typeof step?.desc === "string" &&
        typeof step?.descAr === "string"
    )
  );
}

async function reconcile() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await ensureSchema(client);

    for (const category of CATEGORIES) {
      await client.query(
        `INSERT INTO service_categories (name, slug, description, order_index)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
           SET name = EXCLUDED.name,
               description = EXCLUDED.description,
               order_index = EXCLUDED.order_index
         WHERE service_categories.name IS DISTINCT FROM EXCLUDED.name
            OR service_categories.description IS DISTINCT FROM EXCLUDED.description
            OR service_categories.order_index IS DISTINCT FROM EXCLUDED.order_index`,
        [
          category.name,
          category.slug,
          category.description,
          category.orderIndex,
        ]
      );
    }

    const categoryRows = await client.query(
      "SELECT id, slug FROM service_categories WHERE slug = ANY($1)",
      [CATEGORIES.map(category => category.slug)]
    );
    const categoryIds = new Map(
      categoryRows.rows.map(row => [row.slug, row.id])
    );
    if (categoryIds.size !== CATEGORIES.length) {
      throw new Error(
        "Could not reconcile all three canonical service categories."
      );
    }

    const targetSlugs = SERVICES.map(service => service.slug);
    const serviceRows = await client.query(
      `SELECT id, slug, status
       FROM services
       WHERE slug = ANY($1)
       FOR UPDATE`,
      [targetSlugs]
    );
    const serviceBySlug = new Map(serviceRows.rows.map(row => [row.slug, row]));
    const missingServices = targetSlugs.filter(
      slug => !serviceBySlug.has(slug)
    );
    if (missingServices.length) {
      throw new Error(
        "Cannot reconcile missing service records: " +
          missingServices.join(", ")
      );
    }

    for (const service of SERVICES) {
      const row = serviceBySlug.get(service.slug);
      const categoryId = categoryIds.get(service.categorySlug);
      const methodologyJson = JSON.stringify(service.methodology);
      const profileCopy = service.safeProfileCopy;

      await client.query(
        `UPDATE services
         SET category_id = $1,
             hero_image_url = $2,
             process_methodology_json = $3,
             problem_statement = COALESCE($4, problem_statement),
             problem_statement_ar = COALESCE($5, problem_statement_ar),
             overview_long = COALESCE($6, overview_long),
             overview_long_ar = COALESCE($7, overview_long_ar),
             status = 'active'
         WHERE id = $8
           AND (
             category_id IS DISTINCT FROM $1
             OR hero_image_url IS DISTINCT FROM $2
             OR process_methodology_json IS DISTINCT FROM $3
             OR ($4::text IS NOT NULL AND problem_statement IS DISTINCT FROM $4)
             OR ($5::text IS NOT NULL AND problem_statement_ar IS DISTINCT FROM $5)
             OR ($6::text IS NOT NULL AND overview_long IS DISTINCT FROM $6)
             OR ($7::text IS NOT NULL AND overview_long_ar IS DISTINCT FROM $7)
             OR status IS DISTINCT FROM 'active'
           )`,
        [
          categoryId,
          service.heroImageUrl,
          methodologyJson,
          profileCopy?.problemStatement ?? null,
          profileCopy?.problemStatementAr ?? null,
          profileCopy?.overviewLong ?? null,
          profileCopy?.overviewLongAr ?? null,
          row.id,
        ]
      );
    }

    const verification = await client.query(
      `SELECT
         s.slug,
         s.status,
         c.slug AS category_slug,
         s.hero_image_url,
         s.process_methodology_json
       FROM services s
       LEFT JOIN service_categories c ON c.id = s.category_id
       WHERE s.slug = ANY($1)
       ORDER BY s.slug`,
      [targetSlugs]
    );

    const verifiedBySlug = new Map(
      verification.rows.map(row => [row.slug, row])
    );
    const failures = [];
    const methodologyFingerprints = new Set();

    for (const service of SERVICES) {
      const row = verifiedBySlug.get(service.slug);
      if (!row) {
        failures.push(
          service.slug + ": record disappeared during reconciliation"
        );
        continue;
      }
      if (row.status !== "active")
        failures.push(service.slug + ": is not active");
      if (row.category_slug !== service.categorySlug) {
        failures.push(
          service.slug + ": category is " + (row.category_slug ?? "missing")
        );
      }
      if (row.hero_image_url !== service.heroImageUrl) {
        failures.push(service.slug + ": hero image URL did not normalize");
      }

      let methodology;
      try {
        methodology = JSON.parse(row.process_methodology_json);
      } catch {
        methodology = null;
      }
      if (!validateMethodology(methodology)) {
        failures.push(
          service.slug + ": methodology is missing localized steps"
        );
      } else {
        methodologyFingerprints.add(JSON.stringify(methodology));
      }
    }

    if (verification.rows.length !== SERVICES.length) {
      failures.push(
        "expected " +
          SERVICES.length +
          " target services, found " +
          verification.rows.length
      );
    }
    if (methodologyFingerprints.size !== SERVICES.length) {
      failures.push("service methodologies are not distinct");
    }
    if (failures.length) {
      throw new Error("Verification failed:\n- " + failures.join("\n- "));
    }

    await client.query("COMMIT");
    console.log(
      "✅ Reconciled 3 canonical categories and 8 active system profiles."
    );
    console.table(
      SERVICES.map(service => ({
        slug: service.slug,
        category: service.categorySlug,
        heroImageUrl: service.heroImageUrl,
        methodologySteps: service.methodology.length,
      }))
    );
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

reconcile().catch(error => {
  console.error("❌ Solutions taxonomy reconciliation failed:", error.message);
  process.exitCode = 1;
});
