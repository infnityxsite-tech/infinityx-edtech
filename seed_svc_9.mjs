import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const c = await pool.connect();
  try {
    const {rows} = await c.query(`SELECT id FROM services WHERE slug='rag-knowledge-systems'`);
    if (!rows.length) { console.log('not found'); return; }
    const id = rows[0].id;
    await c.query(`UPDATE services SET hero_image_url=$1, problem_statement=$2, problem_statement_ar=$3, overview_long=$4, overview_long_ar=$5 WHERE id=$6`, [
      '/uploads/hero_rag_knowledge.png',
      'Enterprise knowledge is trapped in thousands of documents, wikis, emails, and databases. Employees spend 20% of their time searching for information, and critical institutional knowledge walks out the door when experienced staff leave.',
      'المعرفة المؤسسية محتجزة في آلاف المستندات والويكيات والبريد الإلكتروني وقواعد البيانات. يقضي الموظفون ٢٠٪ من وقتهم في البحث عن المعلومات، والمعرفة المؤسسية الحرجة تغادر مع مغادرة الموظفين ذوي الخبرة.',
      'We build Retrieval-Augmented Generation systems that connect LLMs to your enterprise knowledge bases, enabling accurate, cited answers from your own data. Our RAG pipelines handle documents, databases, APIs, and multimedia content.\n\nEvery system includes citation tracking, confidence scoring, and feedback loops that continuously improve retrieval accuracy.',
      'نبني أنظمة التوليد المعزز بالاسترجاع التي تربط النماذج اللغوية بقواعد معرفة مؤسستك، مما يمكّن من إجابات دقيقة ومُستشهد بها من بياناتك الخاصة. خطوط أنابيب RAG لدينا تتعامل مع المستندات وقواعد البيانات وواجهات البرمجة والمحتوى المتعدد الوسائط.\n\nكل نظام يتضمن تتبع الاستشهادات وتقييم الثقة وحلقات تغذية راجعة تحسّن دقة الاسترجاع باستمرار.',
      id
    ]);
    const dels = [
      ['Document Ingestion Pipeline','خط أنابيب استيعاب المستندات','Automated pipeline processing PDFs, Word docs, emails, and web content into searchable vector embeddings.','خط أنابيب آلي يعالج ملفات PDF ومستندات Word والبريد الإلكتروني ومحتوى الويب إلى تضمينات متجهية قابلة للبحث.','2-3 weeks'],
      ['Vector Search Engine','محرك البحث المتجهي','High-performance semantic search engine with hybrid keyword+vector retrieval and re-ranking.','محرك بحث دلالي عالي الأداء مع استرجاع هجين بالكلمات المفتاحية والمتجهات وإعادة الترتيب.','2-3 weeks'],
      ['Knowledge Chat Interface','واجهة محادثة المعرفة','Conversational interface with source citations, follow-up questions, and multi-turn context.','واجهة محادثة مع استشهادات المصادر وأسئلة المتابعة وسياق متعدد الأدوار.','3-4 weeks'],
      ['Admin Knowledge Panel','لوحة إدارة المعرفة','Management dashboard for monitoring queries, tracking accuracy, and managing knowledge sources.','لوحة إدارة لمراقبة الاستعلامات وتتبع الدقة وإدارة مصادر المعرفة.','1-2 weeks'],
      ['Feedback & Learning Loop','حلقة التغذية الراجعة والتعلم','User feedback collection system that continuously improves retrieval relevance and answer quality.','نظام جمع تغذية راجعة من المستخدمين يحسّن باستمرار ملاءمة الاسترجاع وجودة الإجابات.','1-2 weeks'],
    ];
    for (const d of dels) await c.query(`INSERT INTO service_deliverables (service_id,title,title_ar,description,description_ar,expected_timeline) VALUES ($1,$2,$3,$4,$5,$6)`,[id,...d]);
    const ucs = [
      ['Employee Knowledge Portal','بوابة معرفة الموظفين','AI-powered portal answering employee questions using HR policies, SOPs, and training materials.','بوابة مدعومة بالذكاء الاصطناعي تجيب على أسئلة الموظفين باستخدام سياسات الموارد البشرية وإجراءات التشغيل.','Enterprise Operations','50% reduction in HR queries','تقليل ٥٠٪ في استفسارات الموارد البشرية'],
      ['Technical Documentation Search','بحث الوثائق التقنية','Semantic search across engineering documentation, API specs, and architecture diagrams.','بحث دلالي عبر الوثائق الهندسية ومواصفات واجهات البرمجة والمخططات المعمارية.','Enterprise Operations','4x faster information retrieval','تسريع استرجاع المعلومات ٤ مرات'],
      ['Regulatory Compliance Assistant','مساعد الامتثال التنظيمي','AI assistant that retrieves relevant regulatory requirements and checks compliance status.','مساعد ذكي يسترجع المتطلبات التنظيمية ذات الصلة ويتحقق من حالة الامتثال.','Finance','85% faster compliance checks','تسريع فحوصات الامتثال ٨٥٪'],
    ];
    for (const u of ucs) await c.query(`INSERT INTO service_use_cases (service_id,title,title_ar,description,description_ar,industry,business_impact,business_impact_ar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,[id,...u]);
    const pkgs = [
      ['Discovery','Starting from $5,000','$5,000 - $12,000','Knowledge audit, source mapping, and RAG architecture proposal.','تدقيق المعرفة وخرائط المصادر ومقترح بنية RAG.',JSON.stringify(['Knowledge Audit','Source Mapping','Architecture Proposal','Feasibility Report']),'2 revision rounds','جولتان من المراجعات','All deliverables transferred.','جميع المخرجات تُنقل للعميل.'],
      ['Implementation','Starting from $20,000','$20,000 - $90,000','Full RAG system development, knowledge ingestion, chat interface, and deployment.','تطوير كامل لنظام RAG واستيعاب المعرفة وواجهة المحادثة والنشر.',JSON.stringify(['RAG Pipeline','Vector Store','Chat Interface','Admin Panel','Deployment','Documentation']),'90-day support','دعم ٩٠ يوماً','Full IP transfer.','نقل كامل للملكية الفكرية.'],
      ['Retainer','From $2,500/month','$2,500 - $10,000/month','Knowledge base maintenance, model updates, accuracy monitoring, and new source integration.','صيانة قاعدة المعرفة وتحديثات النموذج ومراقبة الدقة وتكامل مصادر جديدة.',JSON.stringify(['Knowledge Sync','Model Updates','Accuracy Monitoring','Priority Support']),'Priority SLA','اتفاقية خدمة ذات أولوية','All improvements transferred.','جميع التحسينات تُنقل شهرياً.'],
    ];
    for (const p of pkgs) await c.query(`INSERT INTO service_pricing_models (service_id,model_type,starting_price,typical_range,scope_summary,scope_summary_ar,deliverables_json,support_terms,support_terms_ar,ip_ownership_notes,ip_ownership_notes_ar,features_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$7)`,[id,...p]);
    const faqs = [
      ['What document formats do you support?','ما تنسيقات المستندات التي تدعمونها؟','We support PDF, Word, Excel, PowerPoint, HTML, Markdown, plain text, and can extract text from images via OCR.','ندعم PDF وWord وExcel وPowerPoint وHTML وMarkdown والنص العادي ويمكننا استخراج النص من الصور عبر OCR.',0],
      ['How accurate are the answers?','ما مدى دقة الإجابات؟','With proper RAG implementation, we achieve 90-95% accuracy on domain-specific questions, with source citations for verification.','مع تنفيذ RAG السليم نحقق دقة ٩٠-٩٥٪ في الأسئلة المتخصصة مع استشهادات المصادر للتحقق.',1],
      ['How is this different from basic search?','كيف يختلف هذا عن البحث الأساسي؟','RAG understands meaning and context, not just keywords. It synthesizes answers from multiple sources and provides natural language responses with citations.','يفهم RAG المعنى والسياق وليس فقط الكلمات المفتاحية. يجمع الإجابات من مصادر متعددة ويقدم استجابات بلغة طبيعية مع استشهادات.',2],
    ];
    for (const f of faqs) await c.query(`INSERT INTO service_faq (service_id,question,question_ar,answer,answer_ar,order_index) VALUES ($1,$2,$3,$4,$5,$6)`,[id,...f]);
    for (const [i,t] of ['LangChain','Pinecone','Weaviate','OpenAI','Hugging Face','FastAPI','React','PostgreSQL'].entries())
      await c.query(`INSERT INTO service_tech_stack (service_id,name,category,order_index) VALUES ($1,$2,'core',$3)`,[id,t,i]);
    const imps = [
      ['Search Accuracy','دقة البحث','95%','Domain-specific retrieval accuracy.','دقة الاسترجاع المتخصصة في المجال.','efficiency'],
      ['Time Saved','الوقت الموفر','3hrs/day','Average time saved per knowledge worker.','متوسط الوقت الموفر لكل عامل معرفي.','efficiency'],
      ['Knowledge Retention','الاحتفاظ بالمعرفة','100%','Institutional knowledge captured permanently.','المعرفة المؤسسية محفوظة بشكل دائم.','risk_reduction'],
    ];
    for (const [i,m] of imps.entries()) await c.query(`INSERT INTO service_impact_metrics (service_id,metric_title,metric_title_ar,metric_value,metric_description,metric_description_ar,impact_category,order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,[id,...m,i]);
    console.log('✅ rag-knowledge-systems seeded');
  } finally { c.release(); await pool.end(); }
}
run();
