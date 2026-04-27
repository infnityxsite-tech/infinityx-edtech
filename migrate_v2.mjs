// migrate_v2.mjs — Schema extensions + rich seed data
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🔧 Phase 1: Schema extensions...');

    // 1. Add new columns to services
    const serviceCols = [
      ['hero_image_url', 'TEXT'],
      ['problem_statement', 'TEXT'],
      ['problem_statement_ar', 'TEXT'],
      ['overview_long', 'TEXT'],
      ['overview_long_ar', 'TEXT'],
    ];
    for (const [col, type] of serviceCols) {
      await client.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ services columns added');

    // 2. Add new columns to client_case_studies
    const csCols = [['outcome', 'TEXT'], ['outcome_ar', 'TEXT'], ['logo_url', 'TEXT']];
    for (const [col, type] of csCols) {
      await client.query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ client_case_studies columns added');

    // 3. Create normalized relational tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_gallery (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_faq (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        question_ar TEXT,
        answer_ar TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_tech_stack (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✅ Relational tables created (service_gallery, service_faq, service_tech_stack)');

    // 4. Ensure all existing services have slugs and are active+featured
    await client.query(`UPDATE services SET slug = LOWER(REPLACE(REPLACE(title, ' ', '-'), '&', 'and')) WHERE slug IS NULL OR slug = ''`);
    await client.query(`UPDATE services SET status = 'active' WHERE status IS NULL OR status = 'draft'`);
    await client.query(`UPDATE services SET featured = true WHERE featured IS NULL OR featured = false`);
    await client.query(`UPDATE services SET show_on_homepage = true WHERE show_on_homepage IS NULL OR show_on_homepage = false`);

    // 5. Get existing services
    const { rows: existingServices } = await client.query(`SELECT id, title, slug FROM services ORDER BY id`);
    console.log(`  📊 Found ${existingServices.length} existing services`);

    // 6. Update existing services with rich content
    const serviceEnrichments = {
      'computer-vision-systems': {
        hero_image_url: '/uploads/hero_cv_industrial.png',
        problem_statement: 'Manufacturing defects cost enterprises millions annually. Manual quality inspection is slow, inconsistent, and cannot scale to modern production speeds. Existing camera systems capture footage but lack the intelligence to detect, classify, and act on anomalies in real-time.',
        problem_statement_ar: 'تكلف عيوب التصنيع المؤسسات ملايين سنوياً. الفحص اليدوي بطيء وغير متسق ولا يمكنه مواكبة سرعات الإنتاج الحديثة.',
        overview_long: 'Infinity X deploys end-to-end computer vision pipelines that transform raw camera feeds into actionable operational intelligence. Our systems handle real-time object detection, defect classification, spatial tracking, and autonomous decision-making at the edge.\n\nWe specialize in industrial-grade deployments using YOLOv11, custom-trained models, and NVIDIA TensorRT optimization to achieve sub-12ms inference latency on edge hardware. Our pipelines integrate directly with existing SCADA, MES, and ERP systems through standardized APIs.\n\nEvery deployment includes a complete model training pipeline, allowing your team to continuously improve detection accuracy using your own proprietary data — without dependency on external vendors.',
        overview_long_ar: 'تنشر إنفينيتي إكس أنظمة رؤية حاسوبية متكاملة تحول تغذيات الكاميرا الخام إلى ذكاء تشغيلي قابل للتنفيذ.',
      },
      'enterprise-mlops-&-data': {
        hero_image_url: '/uploads/hero_ai_neural.png',
        problem_statement: 'Most AI initiatives fail not because of bad models, but because of broken data pipelines, manual deployment processes, and the inability to monitor model performance in production. Teams build prototypes that never reach production scale.',
        problem_statement_ar: 'تفشل معظم مبادرات الذكاء الاصطناعي ليس بسبب نماذج سيئة، بل بسبب مسارات بيانات معطلة وعمليات نشر يدوية.',
        overview_long: 'We architect and deploy enterprise-grade MLOps infrastructure that bridges the gap between data science experimentation and production deployment. Our systems handle the complete model lifecycle: data ingestion, feature engineering, training orchestration, model versioning, A/B testing, canary deployments, and continuous monitoring.\n\nOur infrastructure runs on Kubernetes with automated scaling, ensuring your models handle traffic spikes without manual intervention. We integrate with AWS SageMaker, Azure ML, or on-premise GPU clusters depending on your compliance and latency requirements.\n\nEvery engagement includes comprehensive data governance frameworks, ensuring your AI systems comply with regional regulations including GDPR and local data residency requirements.',
        overview_long_ar: 'نحن نصمم وننشر بنية تحتية لعمليات تعلم الآلة على مستوى المؤسسات تسد الفجوة بين التجريب ونشر الإنتاج.',
      },
      'cloud-native-architecture': {
        hero_image_url: '/uploads/hero_cloud_infra.png',
        problem_statement: 'Legacy monolithic systems cannot scale to meet modern demand. Enterprises struggle with deployment velocity, system reliability, and the ability to iterate quickly. Downtime costs mount as infrastructure complexity grows beyond team capability.',
        problem_statement_ar: 'لا تستطيع الأنظمة المتجانسة القديمة التوسع لتلبية الطلب الحديث.',
        overview_long: 'We design and build cloud-native platforms using microservices architecture, event-driven patterns, and infrastructure-as-code. Our systems are built for horizontal scalability, zero-downtime deployments, and operational excellence.\n\nOur engineering team specializes in Kubernetes orchestration, service mesh implementation, and real-time data streaming with Apache Kafka. We build APIs that handle millions of requests with consistent sub-100ms response times.\n\nEvery platform includes comprehensive observability: distributed tracing, structured logging, custom dashboards, and automated alerting — giving your operations team complete visibility into system health.',
        overview_long_ar: 'نحن نصمم ونبني منصات سحابية أصلية باستخدام بنية الخدمات المصغرة والأنماط المدفوعة بالأحداث.',
      },
      'predictive-analytics': {
        hero_image_url: '/uploads/hero_analytics_dash.png',
        problem_statement: 'Enterprises sit on vast amounts of historical data but lack the analytical infrastructure to extract predictive insights. Decision-making remains reactive rather than proactive, leading to missed opportunities and preventable losses.',
        problem_statement_ar: 'تمتلك المؤسسات كميات هائلة من البيانات التاريخية لكنها تفتقر إلى البنية التحليلية لاستخراج رؤى تنبؤية.',
        overview_long: 'Our predictive analytics practice transforms historical operational data into forward-looking intelligence. We build custom forecasting models, anomaly detection systems, and recommendation engines that integrate directly into your business workflows.\n\nWe work with time-series data, sensor telemetry, transactional records, and unstructured text to build models that predict demand patterns, equipment failures, customer behavior, and market trends with measurable accuracy.\n\nEvery model we deploy comes with interpretability layers — ensuring your stakeholders understand not just what the model predicts, but why. We build executive dashboards that translate complex statistical outputs into clear business recommendations.',
        overview_long_ar: 'تحول ممارسة التحليلات التنبؤية لدينا البيانات التشغيلية التاريخية إلى ذكاء استشرافي.',
      }
    };

    for (const svc of existingServices) {
      const enrichment = serviceEnrichments[svc.slug] || serviceEnrichments[Object.keys(serviceEnrichments)[0]];
      if (enrichment) {
        await client.query(`
          UPDATE services SET 
            hero_image_url = COALESCE(hero_image_url, $1),
            problem_statement = COALESCE(problem_statement, $2),
            problem_statement_ar = COALESCE(problem_statement_ar, $3),
            overview_long = COALESCE(overview_long, $4),
            overview_long_ar = COALESCE(overview_long_ar, $5)
          WHERE id = $6
        `, [enrichment.hero_image_url, enrichment.problem_statement, enrichment.problem_statement_ar, enrichment.overview_long, enrichment.overview_long_ar, svc.id]);
      }
    }
    console.log('  ✅ Existing services enriched with content');

    // 7. Seed relational data per service
    for (const svc of existingServices) {
      const sid = svc.id;
      // Check if already seeded
      const { rows: existingTech } = await client.query(`SELECT COUNT(*) as c FROM service_tech_stack WHERE service_id = $1`, [sid]);
      if (parseInt(existingTech[0].c) > 0) { console.log(`  ⏭️ Skipping seed for ${svc.title} (already populated)`); continue; }

      const slug = svc.slug || '';

      // Tech stack
      let techStack = [];
      if (slug.includes('vision')) techStack = ['YOLOv11','TensorRT','OpenCV','CUDA','DeepStream','NVIDIA Jetson','Python','FastAPI'];
      else if (slug.includes('mlops')) techStack = ['Kubernetes','AWS SageMaker','MLflow','Apache Airflow','Docker','PostgreSQL','Redis','Grafana'];
      else if (slug.includes('cloud')) techStack = ['Kubernetes','Docker','Terraform','Apache Kafka','Node.js','React','PostgreSQL','Nginx'];
      else techStack = ['Python','scikit-learn','XGBoost','Apache Spark','Tableau','PostgreSQL','Jupyter','Streamlit'];
      for (let i = 0; i < techStack.length; i++) {
        await client.query(`INSERT INTO service_tech_stack (service_id, name, order_index) VALUES ($1, $2, $3)`, [sid, techStack[i], i]);
      }

      // Deliverables
      let deliverables = [];
      if (slug.includes('vision')) deliverables = [
        ['Custom-Trained Detection Model','Production-ready model trained on your specific use case data'],
        ['Edge Deployment Package','Optimized inference engine for NVIDIA Jetson or equivalent hardware'],
        ['Integration API Layer','REST/gRPC APIs for connecting with existing enterprise systems'],
        ['Model Retraining Pipeline','Automated pipeline for continuous improvement using new data'],
        ['Operations Dashboard','Real-time monitoring dashboard for detection metrics and alerts'],
      ];
      else if (slug.includes('mlops')) deliverables = [
        ['Data Pipeline Architecture','Automated ingestion, validation, and feature engineering pipelines'],
        ['Model Training Infrastructure','Scalable training orchestration with experiment tracking'],
        ['CI/CD for ML Models','Automated testing, validation, and deployment pipelines'],
        ['Monitoring & Alerting','Model performance monitoring with drift detection and alerting'],
        ['Data Governance Framework','Compliance-ready data lineage and access control systems'],
      ];
      else if (slug.includes('cloud')) deliverables = [
        ['Microservices Architecture','Decomposed, independently deployable service components'],
        ['Infrastructure as Code','Terraform/Pulumi configurations for reproducible environments'],
        ['API Gateway & Service Mesh','Centralized traffic management, auth, and observability'],
        ['CI/CD Pipeline','Automated build, test, and deployment with zero-downtime releases'],
        ['Observability Stack','Distributed tracing, logging, metrics, and alerting dashboards'],
      ];
      else deliverables = [
        ['Forecasting Models','Custom time-series prediction models for your business domain'],
        ['Anomaly Detection System','Real-time anomaly detection across operational metrics'],
        ['Executive Dashboard','Interactive BI dashboard with drill-down capabilities'],
        ['Data Integration Layer','Connectors to your existing data warehouse and systems'],
        ['Model Documentation','Complete technical documentation with interpretability reports'],
      ];
      for (const [title, desc] of deliverables) {
        await client.query(`INSERT INTO service_deliverables (service_id, title, description) VALUES ($1, $2, $3)`, [sid, title, desc]);
      }

      // Use Cases
      let useCases = [];
      if (slug.includes('vision')) useCases = [
        ['Manufacturing Quality Control','Automated detection of surface defects, dimensional errors, and assembly issues on production lines at 60+ FPS'],
        ['Warehouse Inventory Tracking','Real-time tracking and counting of inventory items using overhead cameras and spatial mapping'],
        ['Safety Compliance Monitoring','Automated PPE detection and restricted zone monitoring for workplace safety compliance'],
      ];
      else if (slug.includes('mlops')) useCases = [
        ['Automated Model Retraining','Continuous model improvement triggered by data drift detection and performance degradation alerts'],
        ['Multi-Model A/B Testing','Production traffic splitting across model versions with automated rollback on performance regression'],
        ['Feature Store Management','Centralized feature computation and serving for consistent model inputs across training and inference'],
      ];
      else if (slug.includes('cloud')) useCases = [
        ['Legacy System Modernization','Decomposing monolithic applications into scalable microservices with zero-downtime migration'],
        ['Real-Time Event Processing','Building event-driven architectures for processing millions of events per second'],
        ['Multi-Region Deployment','Designing globally distributed systems with data residency compliance and sub-100ms latency'],
      ];
      else useCases = [
        ['Demand Forecasting','Predicting product demand across SKUs and regions to optimize inventory and reduce waste'],
        ['Predictive Maintenance','Forecasting equipment failures using sensor telemetry to prevent unplanned downtime'],
        ['Customer Churn Analysis','Identifying at-risk customers and recommending retention strategies using behavioral patterns'],
      ];
      for (const [title, desc] of useCases) {
        await client.query(`INSERT INTO service_use_cases (service_id, title, description) VALUES ($1, $2, $3)`, [sid, title, desc]);
      }

      // Pricing Models
      const pricingModels = [
        ['Discovery','Starting from $5,000','Initial assessment, feasibility study, and architecture proposal','["Technical Assessment","Architecture Design","ROI Analysis","Implementation Roadmap"]'],
        ['Implementation','Starting from $25,000','Full development, training, deployment, and integration','["Custom Development","Model Training","System Integration","UAT & QA","Production Deployment"]'],
        ['Retainer','From $3,000/month','Ongoing optimization, monitoring, support, and model updates','["24/7 Monitoring","Monthly Performance Reviews","Model Retraining","Priority Support","Quarterly Strategy Sessions"]'],
      ];
      for (const [type, price, desc, features] of pricingModels) {
        await client.query(`INSERT INTO service_pricing_models (service_id, model_type, starting_price, description, features_json) VALUES ($1, $2, $3, $4, $5)`, [sid, type, price, desc, features]);
      }

      // FAQ
      let faqs = [];
      if (slug.includes('vision')) faqs = [
        ['What hardware do you deploy on?','We deploy on NVIDIA Jetson (Nano, Xavier, Orin), industrial PCs with NVIDIA GPUs, and cloud-based GPU instances. Hardware selection depends on your latency, throughput, and environmental requirements.'],
        ['How long does a typical CV project take?','Discovery takes 2-3 weeks. A production deployment typically takes 8-16 weeks depending on complexity, data availability, and integration requirements.'],
        ['Can you work with our existing camera infrastructure?','Yes. We integrate with IP cameras, GigE Vision cameras, USB cameras, and RTSP streams. We assess your existing infrastructure during the Discovery phase.'],
      ];
      else faqs = [
        ['How long does implementation typically take?','Discovery takes 2-3 weeks. Full implementation ranges from 8-20 weeks depending on scope and data readiness.'],
        ['Do we retain full IP ownership?','Yes. All source code, trained models, and documentation are transferred to you upon project completion.'],
        ['What ongoing support do you offer?','We offer monthly retainer packages that include monitoring, optimization, model retraining, and strategic advisory sessions.'],
      ];
      for (let i = 0; i < faqs.length; i++) {
        await client.query(`INSERT INTO service_faq (service_id, question, answer, order_index) VALUES ($1, $2, $3, $4)`, [sid, faqs[i][0], faqs[i][1], i]);
      }

      // Gallery images (use existing uploaded images)
      const galleryImages = ['/uploads/industrial_yolo_cv.png','/uploads/mlops_dashboard.png','/uploads/satellite_agri_grid.png'];
      for (let i = 0; i < galleryImages.length; i++) {
        await client.query(`INSERT INTO service_gallery (service_id, image_url, caption, order_index) VALUES ($1, $2, $3, $4)`, [sid, galleryImages[i], `${svc.title} - Implementation ${i+1}`, i]);
      }

      console.log(`  ✅ Seeded relational data for: ${svc.title}`);
    }

    // 8. Seed case studies if empty
    const { rows: csCheck } = await client.query(`SELECT COUNT(*) as c FROM client_case_studies`);
    if (parseInt(csCheck[0].c) === 0) {
      const caseStudies = [
        { client: 'ACME Manufacturing', industry: 'Manufacturing', challenge: 'Manual quality inspection was missing 15% of defects and creating a bottleneck at 200 units/hour throughput.', solution: 'Deployed a multi-camera YOLOv11 detection system with TensorRT optimization, integrated with existing MES.', outcome: 'Defect detection rate increased to 99.2%. Throughput increased to 800 units/hour. ROI achieved in 4 months.', image: '/uploads/hero_cv_industrial.png' },
        { client: 'Gulf Logistics Corp', industry: 'Logistics & Supply Chain', challenge: 'Warehouse inventory counts required 3-day manual audits with 8% error rates, causing stock discrepancies.', solution: 'Built an overhead camera grid with real-time inventory tracking and automated counting integrated with SAP WMS.', outcome: 'Inventory accuracy improved to 99.7%. Audit time reduced from 3 days to 15 minutes. Annual savings of $1.2M.', image: '/uploads/case_study_enterprise.png' },
        { client: 'National Energy Authority', industry: 'Energy & Utilities', challenge: 'Unplanned equipment failures were costing $2M annually in emergency repairs and production losses.', solution: 'Deployed predictive maintenance models using sensor telemetry data with real-time anomaly detection dashboards.', outcome: 'Unplanned downtime reduced by 73%. Maintenance costs reduced by 45%. System ROI achieved in 6 months.', image: '/uploads/hero_analytics_dash.png' },
      ];
      for (const cs of caseStudies) {
        await client.query(`
          INSERT INTO client_case_studies (client_name, industry, challenge, solution, outcome, image_url, is_published, service_id)
          VALUES ($1, $2, $3, $4, $5, $6, true, (SELECT id FROM services LIMIT 1))
        `, [cs.client, cs.industry, cs.challenge, cs.solution, cs.outcome, cs.image]);
      }
      console.log('  ✅ Seeded 3 case studies');
    } else {
      // Update existing case studies with outcome if missing
      await client.query(`UPDATE client_case_studies SET outcome = 'Significant measurable improvement in operational efficiency and cost reduction.' WHERE outcome IS NULL`);
      await client.query(`UPDATE client_case_studies SET image_url = '/uploads/case_study_enterprise.png' WHERE image_url IS NULL OR image_url = ''`);
      console.log('  ✅ Enriched existing case studies');
    }

    console.log('\n🎉 Migration complete!');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
