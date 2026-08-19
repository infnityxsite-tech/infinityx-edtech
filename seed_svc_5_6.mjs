import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed(client, svcSlug, data) {
  const { rows } = await client.query(`SELECT id FROM services WHERE slug = $1`, [svcSlug]);
  if (!rows.length) { console.log(`  ⚠️ ${svcSlug} not found`); return; }
  const id = rows[0].id;

  // Update service fields
  await client.query(`UPDATE services SET hero_image_url=$1, problem_statement=$2, problem_statement_ar=$3, overview_long=$4, overview_long_ar=$5 WHERE id=$6`,
    [data.hero, data.problem, data.problemAr, data.overview, data.overviewAr, id]);

  // Deliverables
  for (const d of data.deliverables) {
    await client.query(`INSERT INTO service_deliverables (service_id, title, title_ar, description, description_ar, expected_timeline) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
      [id, d.t, d.tAr, d.d, d.dAr, d.timeline]);
  }
  // Use cases
  for (const u of data.useCases) {
    await client.query(`INSERT INTO service_use_cases (service_id, title, title_ar, description, description_ar, industry, business_impact, business_impact_ar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
      [id, u.t, u.tAr, u.d, u.dAr, u.ind, u.impact, u.impactAr]);
  }
  // Packages
  for (const p of data.packages) {
    await client.query(`INSERT INTO service_pricing_models (service_id, model_type, starting_price, typical_range, scope_summary, scope_summary_ar, deliverables_json, support_terms, support_terms_ar, ip_ownership_notes, ip_ownership_notes_ar, features_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING`,
      [id, p.type, p.price, p.range, p.scope, p.scopeAr, JSON.stringify(p.dels), p.support, p.supportAr, p.ip, p.ipAr, JSON.stringify(p.dels)]);
  }
  // FAQ
  for (const f of data.faq) {
    await client.query(`INSERT INTO service_faq (service_id, question, question_ar, answer, answer_ar, order_index) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
      [id, f.q, f.qAr, f.a, f.aAr, f.idx]);
  }
  // Tech stack
  for (let i = 0; i < data.tech.length; i++) {
    await client.query(`INSERT INTO service_tech_stack (service_id, name, category, order_index) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [id, data.tech[i], 'core', i]);
  }
  // Impact metrics
  for (let i = 0; i < data.impacts.length; i++) {
    const m = data.impacts[i];
    await client.query(`INSERT INTO service_impact_metrics (service_id, metric_title, metric_title_ar, metric_value, metric_description, metric_description_ar, impact_category, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, m.t, m.tAr, m.v, m.d, m.dAr, m.cat, i]);
  }
  console.log(`  ✅ ${svcSlug} seeded`);
}

async function run() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding services 5-6...\n');

    await seed(client, 'ai-automation-systems', {
      hero: '/uploads/hero_ai_automation.webp',
      problem: 'Enterprises waste thousands of hours on repetitive manual processes that are error-prone, slow, and impossible to scale. Traditional RPA tools handle simple tasks but fail when processes require contextual understanding, decision-making, or adaptation to changing conditions.',
      problemAr: 'تهدر المؤسسات آلاف الساعات في عمليات يدوية متكررة معرضة للأخطاء وبطيئة ومستحيلة التوسع. أدوات الأتمتة التقليدية تتعامل مع المهام البسيطة لكنها تفشل عندما تتطلب العمليات فهماً سياقياً أو اتخاذ قرارات أو تكيفاً مع الظروف المتغيرة.',
      overview: 'Our AI Automation Systems combine intelligent agents, workflow orchestration engines, and decision-making models to automate complex business processes end-to-end. Unlike traditional RPA, our solutions understand context, learn from outcomes, and adapt to exceptions — delivering true autonomous operation.\n\nWe design automation architectures that integrate with your existing enterprise systems (ERP, CRM, HRIS) through secure APIs, processing documents, emails, and structured data with near-human accuracy while operating 24/7 without fatigue.',
      overviewAr: 'تجمع أنظمة الأتمتة بالذكاء الاصطناعي لدينا بين الوكلاء الذكيين ومحركات تنسيق سير العمل ونماذج اتخاذ القرار لأتمتة العمليات التجارية المعقدة من البداية إلى النهاية. على عكس أدوات الأتمتة التقليدية، تفهم حلولنا السياق وتتعلم من النتائج وتتكيف مع الاستثناءات.\n\nنصمم بنيات أتمتة تتكامل مع أنظمتك المؤسسية القائمة من خلال واجهات برمجة آمنة، تعالج المستندات والبريد الإلكتروني والبيانات المهيكلة بدقة شبه بشرية مع التشغيل على مدار الساعة.',
      deliverables: [
        { t: 'Process Automation Blueprint', tAr: 'مخطط أتمتة العمليات', d: 'Comprehensive mapping of target processes with automation feasibility scores and ROI projections.', dAr: 'خريطة شاملة للعمليات المستهدفة مع درجات جدوى الأتمتة وتوقعات العائد على الاستثمار.', timeline: '2-3 weeks' },
        { t: 'AI Agent Development', tAr: 'تطوير الوكلاء الذكيين', d: 'Custom intelligent agents trained on your business rules, capable of handling exceptions and edge cases.', dAr: 'وكلاء ذكيون مخصصون مدربون على قواعد عملك، قادرون على التعامل مع الاستثناءات والحالات الحدية.', timeline: '4-8 weeks' },
        { t: 'Workflow Orchestration Engine', tAr: 'محرك تنسيق سير العمل', d: 'Central automation platform coordinating multiple agents, APIs, and human-in-the-loop checkpoints.', dAr: 'منصة أتمتة مركزية تنسق بين عدة وكلاء وواجهات برمجة ونقاط تدخل بشري.', timeline: '3-5 weeks' },
        { t: 'Integration Layer', tAr: 'طبقة التكامل', d: 'Secure connectors to your ERP, CRM, email, and document management systems.', dAr: 'موصلات آمنة لأنظمة تخطيط الموارد وإدارة العلاقات والبريد الإلكتروني وإدارة المستندات.', timeline: '2-3 weeks' },
        { t: 'Monitoring Dashboard', tAr: 'لوحة المراقبة', d: 'Real-time dashboard tracking automation performance, error rates, and cost savings.', dAr: 'لوحة معلومات لحظية لتتبع أداء الأتمتة ومعدلات الأخطاء وتوفير التكاليف.', timeline: '1-2 weeks' },
      ],
      useCases: [
        { t: 'Invoice Processing Automation', tAr: 'أتمتة معالجة الفواتير', d: 'AI agents extract, validate, and route invoices automatically, reducing processing time from days to minutes.', dAr: 'وكلاء ذكيون يستخرجون ويتحققون من الفواتير ويوجهونها تلقائياً، مما يقلل وقت المعالجة من أيام إلى دقائق.', ind: 'Enterprise Operations', impact: '90% reduction in processing time', impactAr: 'تقليل ٩٠٪ في وقت المعالجة' },
        { t: 'Customer Onboarding Automation', tAr: 'أتمتة تسجيل العملاء', d: 'Automated KYC verification, document collection, account setup, and welcome communications.', dAr: 'تحقق آلي من الهوية وجمع المستندات وإعداد الحسابات واتصالات الترحيب.', ind: 'Finance', impact: '75% faster onboarding cycle', impactAr: 'تسريع دورة التسجيل بنسبة ٧٥٪' },
        { t: 'Supply Chain Order Processing', tAr: 'أتمتة معالجة طلبات سلاسل الإمداد', d: 'End-to-end order intake, inventory check, fulfillment routing, and status notification automation.', dAr: 'أتمتة شاملة لاستقبال الطلبات وفحص المخزون وتوجيه التنفيذ وإشعارات الحالة.', ind: 'Logistics & Supply Chain', impact: '60% reduction in order errors', impactAr: 'تقليل ٦٠٪ في أخطاء الطلبات' },
      ],
      packages: [
        { type: 'Discovery', price: 'Starting from $3,000', range: '$3,000 - $10,000', scope: 'Process audit, automation opportunity mapping, and ROI analysis.', scopeAr: 'تدقيق العمليات وخريطة فرص الأتمتة وتحليل العائد على الاستثمار.', dels: ['Process Audit Report', 'Automation Roadmap', 'ROI Projection', 'Technology Recommendation'], support: '2 revision rounds', supportAr: 'جولتان من المراجعات', ip: 'All deliverables transferred to client.', ipAr: 'جميع المخرجات تُنقل للعميل.' },
        { type: 'Implementation', price: 'Starting from $15,000', range: '$15,000 - $80,000', scope: 'Full agent development, workflow orchestration, system integration, and deployment.', scopeAr: 'تطوير كامل للوكلاء وتنسيق سير العمل وتكامل الأنظمة والنشر.', dels: ['Custom AI Agents', 'Workflow Engine', 'System Integration', 'Testing & QA', 'Production Deployment', 'Documentation'], support: '60-day post-launch support', supportAr: 'دعم ٦٠ يوماً بعد الإطلاق', ip: 'Full IP transfer including all source code.', ipAr: 'نقل كامل للملكية الفكرية شاملاً الشفرة المصدرية.' },
        { type: 'Retainer', price: 'From $2,500/month', range: '$2,500 - $10,000/month', scope: 'Ongoing optimization, new process automation, monitoring, and strategic advisory.', scopeAr: 'تحسين مستمر وأتمتة عمليات جديدة ومراقبة واستشارات استراتيجية.', dels: ['24/7 Monitoring', 'Monthly Optimization', 'New Agent Development', 'Priority Support'], support: 'Priority SLA with 4-hour response', supportAr: 'اتفاقية خدمة ذات أولوية مع استجابة ٤ ساعات', ip: 'All improvements transferred monthly.', ipAr: 'جميع التحسينات تُنقل شهرياً.' },
      ],
      faq: [
        { q: 'How is AI automation different from traditional RPA?', qAr: 'كيف تختلف الأتمتة بالذكاء الاصطناعي عن الأتمتة التقليدية؟', a: 'Traditional RPA follows rigid rules and breaks when processes change. AI automation uses machine learning to understand context, handle exceptions, and adapt to new scenarios without reprogramming.', aAr: 'الأتمتة التقليدية تتبع قواعد صارمة وتتعطل عند تغير العمليات. أتمتة الذكاء الاصطناعي تستخدم التعلم الآلي لفهم السياق والتعامل مع الاستثناءات والتكيف مع السيناريوهات الجديدة.', idx: 0 },
        { q: 'What systems can you integrate with?', qAr: 'ما الأنظمة التي يمكنكم التكامل معها؟', a: 'We integrate with all major enterprise platforms including SAP, Oracle, Salesforce, Microsoft 365, and custom APIs. Our integration layer supports REST, SOAP, and direct database connections.', aAr: 'نتكامل مع جميع المنصات المؤسسية الرئيسية بما في ذلك SAP وOracle وSalesforce وMicrosoft 365 وواجهات البرمجة المخصصة.', idx: 1 },
        { q: 'How long does implementation typically take?', qAr: 'كم يستغرق التنفيذ عادةً؟', a: 'A typical automation project takes 6-12 weeks from discovery to production deployment, depending on complexity and number of processes being automated.', aAr: 'يستغرق مشروع أتمتة نموذجي ٦-١٢ أسبوعاً من الاستكشاف إلى النشر في الإنتاج، حسب التعقيد وعدد العمليات المُؤتمتة.', idx: 2 },
      ],
      tech: ['Python', 'LangChain', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
      impacts: [
        { t: 'Process Speed', tAr: 'سرعة العمليات', v: '10x Faster', d: 'Average acceleration in automated process execution.', dAr: 'متوسط تسريع تنفيذ العمليات المؤتمتة.', cat: 'efficiency' },
        { t: 'Error Reduction', tAr: 'تقليل الأخطاء', v: '95%', d: 'Reduction in human-error related incidents.', dAr: 'تقليل في الحوادث المرتبطة بالأخطاء البشرية.', cat: 'risk_reduction' },
        { t: 'Cost Savings', tAr: 'توفير التكاليف', v: '40-70%', d: 'Average reduction in operational costs through automation.', dAr: 'متوسط خفض التكاليف التشغيلية من خلال الأتمتة.', cat: 'cost_reduction' },
      ],
    });

    await seed(client, 'custom-llm-solutions', {
      hero: '/uploads/hero_custom_llm.webp',
      problem: 'Off-the-shelf LLMs produce generic outputs that lack domain expertise, hallucinate on industry-specific questions, and cannot access proprietary enterprise data — making them unreliable for critical business applications.',
      problemAr: 'النماذج اللغوية الجاهزة تنتج مخرجات عامة تفتقر للخبرة التخصصية وتُهلوس في الأسئلة الصناعية المتخصصة ولا تستطيع الوصول لبيانات المؤسسة الخاصة — مما يجعلها غير موثوقة للتطبيقات التجارية الحرجة.',
      overview: 'We build enterprise-grade LLM solutions that are fine-tuned on your domain data, integrated with your knowledge bases, and deployed within your security perimeter. Our custom models understand your industry terminology, follow your business rules, and generate outputs that meet your quality standards.\n\nFrom intelligent chatbots and content generation engines to code assistants and document analysis tools, we deliver LLM applications that transform how your teams work with information.',
      overviewAr: 'نبني حلول نماذج لغوية كبيرة بمستوى مؤسسي مضبوطة على بيانات مجالك، متكاملة مع قواعد معرفتك، ومنشورة ضمن محيطك الأمني. نماذجنا المخصصة تفهم مصطلحات صناعتك وتتبع قواعد عملك وتولد مخرجات تلبي معايير الجودة لديك.\n\nمن روبوتات المحادثة الذكية ومحركات توليد المحتوى إلى مساعدي البرمجة وأدوات تحليل المستندات، نقدم تطبيقات نماذج لغوية تحوّل طريقة عمل فرقك مع المعلومات.',
      deliverables: [
        { t: 'Domain-Tuned LLM', tAr: 'نموذج لغوي مضبوط للمجال', d: 'Custom fine-tuned language model trained on your proprietary data and domain terminology.', dAr: 'نموذج لغوي مخصص مضبوط على بياناتك الخاصة ومصطلحات مجالك.', timeline: '4-6 weeks' },
        { t: 'Enterprise Chatbot', tAr: 'روبوت محادثة مؤسسي', d: 'Intelligent conversational interface with multi-turn memory, citation support, and escalation workflows.', dAr: 'واجهة محادثة ذكية مع ذاكرة متعددة الأدوار ودعم الاستشهادات وتدفقات التصعيد.', timeline: '3-5 weeks' },
        { t: 'Knowledge Integration Pipeline', tAr: 'خط أنابيب تكامل المعرفة', d: 'Automated ingestion pipeline connecting your document repositories, wikis, and databases to the LLM.', dAr: 'خط أنابيب استيعاب آلي يربط مستودعات مستنداتك وقواعد بياناتك بالنموذج اللغوي.', timeline: '2-3 weeks' },
        { t: 'Safety & Guardrails System', tAr: 'نظام الأمان والحواجز', d: 'Content filtering, hallucination detection, and compliance guardrails ensuring safe outputs.', dAr: 'تصفية المحتوى واكتشاف الهلوسة وحواجز الامتثال لضمان مخرجات آمنة.', timeline: '2-3 weeks' },
        { t: 'Evaluation Framework', tAr: 'إطار التقييم', d: 'Automated testing suite measuring accuracy, relevance, safety, and performance metrics.', dAr: 'مجموعة اختبارات آلية لقياس الدقة والملاءمة والأمان ومقاييس الأداء.', timeline: '1-2 weeks' },
      ],
      useCases: [
        { t: 'Internal Knowledge Assistant', tAr: 'مساعد المعرفة الداخلي', d: 'AI assistant that answers employee questions using internal documentation, policies, and knowledge bases.', dAr: 'مساعد ذكي يجيب على أسئلة الموظفين باستخدام الوثائق والسياسات وقواعد المعرفة الداخلية.', ind: 'Enterprise Operations', impact: '60% reduction in support tickets', impactAr: 'تقليل ٦٠٪ في تذاكر الدعم' },
        { t: 'Legal Document Analysis', tAr: 'تحليل المستندات القانونية', d: 'Automated contract review, clause extraction, and risk identification for legal teams.', dAr: 'مراجعة آلية للعقود واستخراج البنود وتحديد المخاطر للفرق القانونية.', ind: 'Finance', impact: '80% faster contract review', impactAr: 'تسريع مراجعة العقود بنسبة ٨٠٪' },
        { t: 'Technical Documentation Generator', tAr: 'مولد الوثائق التقنية', d: 'AI-powered documentation generation from code, APIs, and architecture specifications.', dAr: 'توليد وثائق مدعوم بالذكاء الاصطناعي من الشفرة البرمجية وواجهات البرمجة والمواصفات المعمارية.', ind: 'Enterprise Operations', impact: '70% reduction in documentation effort', impactAr: 'تقليل ٧٠٪ في جهد التوثيق' },
      ],
      packages: [
        { type: 'Discovery', price: 'Starting from $5,000', range: '$5,000 - $15,000', scope: 'Use case assessment, data audit, model selection, and architecture proposal.', scopeAr: 'تقييم حالة الاستخدام وتدقيق البيانات واختيار النموذج ومقترح معماري.', dels: ['Use Case Assessment', 'Data Audit Report', 'Model Selection Analysis', 'Architecture Proposal'], support: '2 revision rounds', supportAr: 'جولتان من المراجعات', ip: 'All deliverables transferred.', ipAr: 'جميع المخرجات تُنقل للعميل.' },
        { type: 'Implementation', price: 'Starting from $25,000', range: '$25,000 - $120,000', scope: 'Full model fine-tuning, application development, integration, and production deployment.', scopeAr: 'ضبط كامل للنموذج وتطوير التطبيق والتكامل والنشر في الإنتاج.', dels: ['Fine-tuned Model', 'Application Interface', 'Knowledge Pipeline', 'Safety Guardrails', 'Production Deployment', 'Technical Documentation'], support: '90-day post-deployment support', supportAr: 'دعم ٩٠ يوماً بعد النشر', ip: 'Full IP transfer including model weights.', ipAr: 'نقل كامل للملكية الفكرية شاملاً أوزان النموذج.' },
        { type: 'Retainer', price: 'From $3,000/month', range: '$3,000 - $12,000/month', scope: 'Ongoing model updates, knowledge base maintenance, performance monitoring, and optimization.', scopeAr: 'تحديثات مستمرة للنموذج وصيانة قاعدة المعرفة ومراقبة الأداء والتحسين.', dels: ['Monthly Model Updates', 'Knowledge Sync', 'Performance Reviews', 'Priority Support'], support: 'Priority SLA', supportAr: 'اتفاقية خدمة ذات أولوية', ip: 'All improvements transferred monthly.', ipAr: 'جميع التحسينات تُنقل شهرياً.' },
      ],
      faq: [
        { q: 'Do you use open-source or proprietary models?', qAr: 'هل تستخدمون نماذج مفتوحة المصدر أم خاصة؟', a: 'We select the best model architecture based on your requirements. We work with Llama, Mistral, and other open-source foundations, as well as GPT-4 and Claude APIs when appropriate.', aAr: 'نختار أفضل بنية نموذج بناءً على متطلباتك. نعمل مع Llama وMistral وأسس مفتوحة المصدر أخرى، بالإضافة إلى واجهات GPT-4 وClaude عند الحاجة.', idx: 0 },
        { q: 'Can the model be deployed on-premise?', qAr: 'هل يمكن نشر النموذج محلياً في مقر المؤسسة؟', a: 'Yes. We offer both cloud and on-premise deployment options. For sensitive data, we recommend on-premise or private cloud deployment within your security perimeter.', aAr: 'نعم. نوفر خيارات النشر السحابي والمحلي. للبيانات الحساسة، ننصح بالنشر المحلي أو السحابي الخاص ضمن محيطك الأمني.', idx: 1 },
        { q: 'How do you handle hallucinations?', qAr: 'كيف تتعاملون مع الهلوسة في المخرجات؟', a: 'We implement RAG pipelines with source citations, confidence scoring, and multi-layer guardrails. Our evaluation framework continuously monitors for hallucination rates.', aAr: 'ننفذ خطوط أنابيب RAG مع استشهادات المصادر وتقييم الثقة وحواجز متعددة الطبقات. إطار التقييم لدينا يراقب باستمرار معدلات الهلوسة.', idx: 2 },
      ],
      tech: ['PyTorch', 'Hugging Face', 'vLLM', 'LangChain', 'Pinecone', 'FastAPI', 'Docker', 'CUDA'],
      impacts: [
        { t: 'Response Accuracy', tAr: 'دقة الاستجابة', v: '95%+', d: 'Domain-specific accuracy after fine-tuning.', dAr: 'دقة متخصصة في المجال بعد الضبط.', cat: 'efficiency' },
        { t: 'Knowledge Access', tAr: 'الوصول للمعرفة', v: '5x Faster', d: 'Speed of finding information vs manual search.', dAr: 'سرعة العثور على المعلومات مقارنة بالبحث اليدوي.', cat: 'efficiency' },
        { t: 'Cost per Query', tAr: 'تكلفة الاستعلام', v: '-80%', d: 'Reduction compared to human support costs.', dAr: 'تقليل مقارنة بتكاليف الدعم البشري.', cat: 'cost_reduction' },
      ],
    });

    console.log('\n🎉 Services 5-6 seeded!');
  } finally { client.release(); await pool.end(); }
}
run();
