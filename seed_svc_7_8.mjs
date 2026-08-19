import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed(client, svcSlug, data) {
  const { rows } = await client.query(`SELECT id FROM services WHERE slug = $1`, [svcSlug]);
  if (!rows.length) { console.log(`  ⚠️ ${svcSlug} not found`); return; }
  const id = rows[0].id;
  await client.query(`UPDATE services SET hero_image_url=$1, problem_statement=$2, problem_statement_ar=$3, overview_long=$4, overview_long_ar=$5 WHERE id=$6`,
    [data.hero, data.problem, data.problemAr, data.overview, data.overviewAr, id]);
  for (const d of data.deliverables) { await client.query(`INSERT INTO service_deliverables (service_id,title,title_ar,description,description_ar,expected_timeline) VALUES ($1,$2,$3,$4,$5,$6)`, [id,d.t,d.tAr,d.d,d.dAr,d.timeline]); }
  for (const u of data.useCases) { await client.query(`INSERT INTO service_use_cases (service_id,title,title_ar,description,description_ar,industry,business_impact,business_impact_ar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [id,u.t,u.tAr,u.d,u.dAr,u.ind,u.impact,u.impactAr]); }
  for (const p of data.packages) { await client.query(`INSERT INTO service_pricing_models (service_id,model_type,starting_price,typical_range,scope_summary,scope_summary_ar,deliverables_json,support_terms,support_terms_ar,ip_ownership_notes,ip_ownership_notes_ar,features_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [id,p.type,p.price,p.range,p.scope,p.scopeAr,JSON.stringify(p.dels),p.support,p.supportAr,p.ip,p.ipAr,JSON.stringify(p.dels)]); }
  for (const f of data.faq) { await client.query(`INSERT INTO service_faq (service_id,question,question_ar,answer,answer_ar,order_index) VALUES ($1,$2,$3,$4,$5,$6)`, [id,f.q,f.qAr,f.a,f.aAr,f.idx]); }
  for (let i=0;i<data.tech.length;i++) { await client.query(`INSERT INTO service_tech_stack (service_id,name,category,order_index) VALUES ($1,$2,$3,$4)`, [id,data.tech[i],'core',i]); }
  for (let i=0;i<data.impacts.length;i++) { const m=data.impacts[i]; await client.query(`INSERT INTO service_impact_metrics (service_id,metric_title,metric_title_ar,metric_value,metric_description,metric_description_ar,impact_category,order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [id,m.t,m.tAr,m.v,m.d,m.dAr,m.cat,i]); }
  console.log(`  ✅ ${svcSlug} seeded`);
}

async function run() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding services 7-8...\n');

    await seed(client, 'data-engineering', {
      hero: '/uploads/hero_data_engineering.webp',
      problem: 'Organizations sit on massive volumes of data scattered across silos, legacy systems, and cloud platforms — but lack the infrastructure to transform raw data into reliable, real-time insights that drive decisions.',
      problemAr: 'تمتلك المؤسسات أحجاماً هائلة من البيانات المتناثرة عبر صوامع وأنظمة قديمة ومنصات سحابية — لكنها تفتقر للبنية التحتية لتحويل البيانات الخام إلى رؤى موثوقة ولحظية تقود القرارات.',
      overview: 'We architect and deploy enterprise-grade data infrastructure — from scalable data lakes and real-time streaming pipelines to governed data warehouses and automated ETL workflows. Our solutions ensure your data is clean, accessible, and ready for AI/ML workloads.\n\nEvery pipeline we build follows DataOps best practices with version-controlled transformations, automated quality checks, and comprehensive lineage tracking.',
      overviewAr: 'نصمم وننشر بنية تحتية للبيانات بمستوى مؤسسي — من بحيرات البيانات القابلة للتوسع وخطوط البث اللحظي إلى مستودعات البيانات المحوكمة وتدفقات ETL المؤتمتة. تضمن حلولنا أن بياناتك نظيفة وقابلة للوصول وجاهزة لأحمال عمل الذكاء الاصطناعي.\n\nكل خط أنابيب نبنيه يتبع أفضل ممارسات DataOps مع تحويلات مُتحكم بإصداراتها وفحوصات جودة آلية وتتبع شامل للنسب.',
      deliverables: [
        {t:'Data Architecture Blueprint',tAr:'مخطط بنية البيانات',d:'Comprehensive data architecture design with source mapping, schema design, and scalability planning.',dAr:'تصميم شامل لبنية البيانات مع خرائط المصادر وتصميم المخططات وتخطيط قابلية التوسع.',timeline:'2-3 weeks'},
        {t:'ETL/ELT Pipeline Development',tAr:'تطوير خطوط أنابيب ETL/ELT',d:'Production-grade data transformation pipelines with error handling, retry logic, and monitoring.',dAr:'خطوط أنابيب تحويل بيانات بمستوى الإنتاج مع معالجة الأخطاء ومنطق إعادة المحاولة والمراقبة.',timeline:'4-8 weeks'},
        {t:'Data Lake/Warehouse Setup',tAr:'إعداد بحيرة/مستودع البيانات',d:'Scalable storage layer with partitioning, indexing, and access control optimized for analytical queries.',dAr:'طبقة تخزين قابلة للتوسع مع تقسيم وفهرسة وتحكم بالوصول محسّنة للاستعلامات التحليلية.',timeline:'3-5 weeks'},
        {t:'Data Quality Framework',tAr:'إطار جودة البيانات',d:'Automated validation rules, anomaly detection, and data profiling dashboards.',dAr:'قواعد تحقق آلية واكتشاف الشذوذ ولوحات معلومات تحليل البيانات.',timeline:'2-3 weeks'},
        {t:'Data Governance Layer',tAr:'طبقة حوكمة البيانات',d:'Metadata management, lineage tracking, access policies, and compliance documentation.',dAr:'إدارة البيانات الوصفية وتتبع النسب وسياسات الوصول ووثائق الامتثال.',timeline:'2-3 weeks'},
      ],
      useCases: [
        {t:'Real-time IoT Data Pipeline',tAr:'خط بيانات إنترنت الأشياء اللحظي',d:'Streaming pipeline processing millions of IoT sensor events per second for real-time monitoring.',dAr:'خط أنابيب بث يعالج ملايين أحداث مستشعرات إنترنت الأشياء في الثانية للمراقبة اللحظية.',ind:'Smart Infrastructure',impact:'Sub-second data latency',impactAr:'زمن وصول بيانات أقل من ثانية'},
        {t:'Enterprise Data Warehouse Migration',tAr:'ترحيل مستودع بيانات المؤسسة',d:'Migration from legacy on-premise databases to modern cloud-native data warehouse with zero downtime.',dAr:'ترحيل من قواعد بيانات محلية قديمة إلى مستودع بيانات سحابي حديث دون توقف.',ind:'Enterprise Operations',impact:'60% reduction in query costs',impactAr:'تقليل ٦٠٪ في تكاليف الاستعلامات'},
        {t:'ML Feature Store',tAr:'متجر خصائص التعلم الآلي',d:'Centralized feature engineering platform serving consistent features to all ML models in production.',dAr:'منصة مركزية لهندسة الخصائص تقدم خصائص متسقة لجميع نماذج التعلم الآلي في الإنتاج.',ind:'Enterprise Operations',impact:'3x faster model development',impactAr:'تسريع تطوير النماذج ٣ مرات'},
      ],
      packages: [
        {type:'Discovery',price:'Starting from $5,000',range:'$5,000 - $15,000',scope:'Data landscape assessment, architecture proposal, and migration roadmap.',scopeAr:'تقييم المشهد البياني ومقترح معماري وخريطة طريق الترحيل.',dels:['Data Landscape Audit','Architecture Proposal','Migration Roadmap','Cost Analysis'],support:'2 revision rounds',supportAr:'جولتان من المراجعات',ip:'All deliverables transferred.',ipAr:'جميع المخرجات تُنقل للعميل.'},
        {type:'Implementation',price:'Starting from $20,000',range:'$20,000 - $120,000',scope:'Full pipeline development, data lake setup, governance implementation, and production deployment.',scopeAr:'تطوير كامل لخطوط الأنابيب وإعداد بحيرة البيانات وتنفيذ الحوكمة والنشر.',dels:['Data Pipelines','Storage Layer','Quality Framework','Governance','Monitoring','Documentation'],support:'90-day post-deployment support',supportAr:'دعم ٩٠ يوماً بعد النشر',ip:'Full IP transfer.',ipAr:'نقل كامل للملكية الفكرية.'},
        {type:'Retainer',price:'From $3,000/month',range:'$3,000 - $12,000/month',scope:'Pipeline monitoring, optimization, new source integration, and data quality management.',scopeAr:'مراقبة خطوط الأنابيب والتحسين وتكامل مصادر جديدة وإدارة جودة البيانات.',dels:['24/7 Monitoring','Pipeline Optimization','New Integrations','Priority Support'],support:'Priority SLA',supportAr:'اتفاقية خدمة ذات أولوية',ip:'All improvements transferred.',ipAr:'جميع التحسينات تُنقل شهرياً.'},
      ],
      faq: [
        {q:'What cloud platforms do you support?',qAr:'ما المنصات السحابية التي تدعمونها؟',a:'We work with AWS (Redshift, S3, Glue), GCP (BigQuery, Dataflow), and Azure (Synapse, Data Factory). We also support hybrid and multi-cloud architectures.',aAr:'نعمل مع AWS وGCP وAzure. كما ندعم البنيات الهجينة ومتعددة السحب.',idx:0},
        {q:'Can you handle real-time streaming data?',qAr:'هل تتعاملون مع بيانات البث اللحظي؟',a:'Yes. We build streaming pipelines using Apache Kafka, Apache Flink, and cloud-native streaming services capable of processing millions of events per second.',aAr:'نعم. نبني خطوط أنابيب بث باستخدام Apache Kafka وApache Flink وخدمات البث السحابية القادرة على معالجة ملايين الأحداث في الثانية.',idx:1},
        {q:'How do you ensure data quality?',qAr:'كيف تضمنون جودة البيانات؟',a:'We implement automated quality checks at every pipeline stage including schema validation, null checks, range validation, and statistical anomaly detection with alerting.',aAr:'ننفذ فحوصات جودة آلية في كل مرحلة من مراحل خط الأنابيب بما في ذلك التحقق من المخطط وفحوصات القيم الفارغة واكتشاف الشذوذ الإحصائي مع التنبيهات.',idx:2},
      ],
      tech: ['Apache Kafka','Apache Spark','dbt','Airflow','PostgreSQL','BigQuery','Snowflake','Docker'],
      impacts: [
        {t:'Data Freshness',tAr:'حداثة البيانات',v:'Real-time',d:'From batch to real-time data availability.',dAr:'من معالجة الدُفعات إلى توفر البيانات اللحظي.',cat:'efficiency'},
        {t:'Query Performance',tAr:'أداء الاستعلامات',v:'10x Faster',d:'Average improvement in analytical query speed.',dAr:'متوسط تحسين سرعة الاستعلامات التحليلية.',cat:'efficiency'},
        {t:'Infrastructure Cost',tAr:'تكلفة البنية التحتية',v:'-50%',d:'Reduction through optimized storage and compute.',dAr:'تقليل من خلال التخزين والحوسبة المحسّنة.',cat:'cost_reduction'},
      ],
    });

    await seed(client, 'intelligent-dashboards', {
      hero: '/uploads/hero_dashboards.webp',
      problem: 'Executives and operations teams rely on static reports and spreadsheets that are outdated by the time they are reviewed, making it impossible to respond to changing conditions with the speed that modern business demands.',
      problemAr: 'يعتمد المديرون التنفيذيون وفرق العمليات على تقارير ثابتة وجداول بيانات تصبح قديمة بحلول وقت مراجعتها، مما يجعل من المستحيل الاستجابة للظروف المتغيرة بالسرعة التي يتطلبها العمل الحديث.',
      overview: 'We design and build interactive business intelligence dashboards with real-time data visualization, predictive KPI tracking, and executive reporting capabilities. Our dashboards connect to live data sources and update automatically.\n\nEvery dashboard is built with role-based access control, mobile responsiveness, and embedded alerting — turning passive data consumption into active decision-making.',
      overviewAr: 'نصمم ونبني لوحات معلومات تفاعلية مع تصور بيانات لحظي وتتبع مؤشرات أداء تنبؤية وقدرات تقارير تنفيذية. لوحاتنا تتصل بمصادر بيانات حية وتتحدث تلقائياً.\n\nكل لوحة مبنية بتحكم وصول قائم على الأدوار واستجابة للأجهزة المحمولة وتنبيهات مدمجة — لتحويل استهلاك البيانات السلبي إلى اتخاذ قرارات فعال.',
      deliverables: [
        {t:'Dashboard Design System',tAr:'نظام تصميم لوحة المعلومات',d:'Custom design system with reusable chart components, color palettes, and layout templates.',dAr:'نظام تصميم مخصص مع مكونات رسوم بيانية قابلة لإعادة الاستخدام وقوالب تخطيط.',timeline:'1-2 weeks'},
        {t:'Real-time Data Connectors',tAr:'موصلات البيانات اللحظية',d:'Live connectors to databases, APIs, and third-party platforms with automatic refresh.',dAr:'موصلات حية لقواعد البيانات وواجهات البرمجة والمنصات الخارجية مع تحديث تلقائي.',timeline:'2-3 weeks'},
        {t:'Executive Dashboard Suite',tAr:'مجموعة لوحات المعلومات التنفيذية',d:'C-level dashboards with KPI tracking, trend analysis, and drill-down capabilities.',dAr:'لوحات معلومات للإدارة العليا مع تتبع مؤشرات الأداء وتحليل الاتجاهات والتعمق في التفاصيل.',timeline:'3-4 weeks'},
        {t:'Operational Monitoring Views',tAr:'طبقات المراقبة التشغيلية',d:'Real-time operational dashboards with alerts, thresholds, and anomaly highlighting.',dAr:'لوحات مراقبة تشغيلية لحظية مع تنبيهات وعتبات وإبراز الشذوذ.',timeline:'2-3 weeks'},
        {t:'Mobile-Responsive Reports',tAr:'تقارير متجاوبة للأجهزة المحمولة',d:'Optimized views for tablets and phones with touch-friendly interactions.',dAr:'عروض محسّنة للأجهزة اللوحية والهواتف مع تفاعلات صديقة للمس.',timeline:'1-2 weeks'},
      ],
      useCases: [
        {t:'Manufacturing Operations Dashboard',tAr:'لوحة عمليات التصنيع',d:'Real-time production monitoring with OEE tracking, defect rates, and predictive maintenance alerts.',dAr:'مراقبة إنتاج لحظية مع تتبع فعالية المعدات ومعدلات العيوب وتنبيهات الصيانة التنبؤية.',ind:'Manufacturing',impact:'25% improvement in OEE',impactAr:'تحسين ٢٥٪ في فعالية المعدات'},
        {t:'Sales Performance Analytics',tAr:'تحليلات أداء المبيعات',d:'Pipeline visualization, conversion tracking, revenue forecasting, and team performance scorecards.',dAr:'تصور خط الأنابيب وتتبع التحويلات والتنبؤ بالإيرادات وبطاقات أداء الفريق.',ind:'Enterprise Operations',impact:'15% increase in conversion rates',impactAr:'زيادة ١٥٪ في معدلات التحويل'},
        {t:'Fleet Management Dashboard',tAr:'لوحة إدارة الأسطول',d:'Live vehicle tracking, route optimization analytics, fuel consumption, and driver performance metrics.',dAr:'تتبع مركبات حي وتحليلات تحسين المسار واستهلاك الوقود ومقاييس أداء السائقين.',ind:'Logistics & Supply Chain',impact:'20% reduction in fuel costs',impactAr:'تقليل ٢٠٪ في تكاليف الوقود'},
      ],
      packages: [
        {type:'Discovery',price:'Starting from $3,000',range:'$3,000 - $8,000',scope:'Requirements gathering, data source mapping, and dashboard wireframes.',scopeAr:'جمع المتطلبات وخرائط مصادر البيانات ونماذج أولية للوحات المعلومات.',dels:['Requirements Document','Data Source Map','Dashboard Wireframes','KPI Framework'],support:'2 revision rounds',supportAr:'جولتان من المراجعات',ip:'All deliverables transferred.',ipAr:'جميع المخرجات تُنقل للعميل.'},
        {type:'Implementation',price:'Starting from $12,000',range:'$12,000 - $60,000',scope:'Full dashboard development, data integration, testing, and deployment.',scopeAr:'تطوير كامل للوحات المعلومات وتكامل البيانات والاختبار والنشر.',dels:['Dashboard Suite','Data Connectors','Alert System','Mobile Views','User Training','Documentation'],support:'60-day support included',supportAr:'دعم ٦٠ يوماً مشمول',ip:'Full IP transfer.',ipAr:'نقل كامل للملكية الفكرية.'},
        {type:'Retainer',price:'From $2,000/month',range:'$2,000 - $8,000/month',scope:'Dashboard maintenance, new view creation, data source updates, and optimization.',scopeAr:'صيانة لوحات المعلومات وإنشاء عروض جديدة وتحديث مصادر البيانات والتحسين.',dels:['Monthly Updates','New Views','Performance Optimization','Priority Support'],support:'Priority SLA',supportAr:'اتفاقية خدمة ذات أولوية',ip:'All improvements transferred.',ipAr:'جميع التحسينات تُنقل.'},
      ],
      faq: [
        {q:'What BI tools do you use?',qAr:'ما أدوات ذكاء الأعمال التي تستخدمونها؟',a:'We build custom dashboards using React, D3.js, and Recharts for maximum flexibility. We also work with Metabase, Grafana, and Apache Superset for rapid deployments.',aAr:'نبني لوحات معلومات مخصصة باستخدام React وD3.js وRecharts للمرونة القصوى. كما نعمل مع Metabase وGrafana وApache Superset للنشر السريع.',idx:0},
        {q:'Can dashboards be embedded in our existing apps?',qAr:'هل يمكن تضمين لوحات المعلومات في تطبيقاتنا الحالية؟',a:'Yes. Our dashboards can be embedded via iframes or as React components directly into your existing web applications with SSO integration.',aAr:'نعم. يمكن تضمين لوحاتنا عبر iframes أو كمكونات React مباشرة في تطبيقات الويب الحالية مع تكامل تسجيل الدخول الموحد.',idx:1},
        {q:'How often do dashboards refresh?',qAr:'كم مرة تتحدث لوحات المعلومات؟',a:'Depending on your data sources, we support real-time streaming updates (sub-second), polling intervals (every few seconds), or scheduled refreshes (hourly/daily).',aAr:'حسب مصادر بياناتك، ندعم تحديثات البث اللحظي (أقل من ثانية) أو فترات الاستطلاع (كل بضع ثوانٍ) أو التحديثات المجدولة.',idx:2},
      ],
      tech: ['React','D3.js','Recharts','Metabase','Grafana','PostgreSQL','WebSocket','Node.js'],
      impacts: [
        {t:'Decision Speed',tAr:'سرعة القرار',v:'5x Faster',d:'Time to actionable insight from data.',dAr:'الوقت للوصول إلى رؤية قابلة للتنفيذ.',cat:'efficiency'},
        {t:'Report Automation',tAr:'أتمتة التقارير',v:'100%',d:'Elimination of manual report generation.',dAr:'إلغاء كامل لتوليد التقارير اليدوية.',cat:'efficiency'},
        {t:'Data Accuracy',tAr:'دقة البيانات',v:'99.9%',d:'Real-time data accuracy vs stale spreadsheets.',dAr:'دقة البيانات اللحظية مقابل جداول البيانات القديمة.',cat:'risk_reduction'},
      ],
    });

    console.log('\n🎉 Services 7-8 seeded!');
  } finally { client.release(); await pool.end(); }
}
run();
