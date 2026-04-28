// migrate_v3_solutions.mjs — Solutions Architecture V3
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🔧 V3 Solutions Architecture Migration\n');

    // ── 1. Extend services table ──
    const svcCols = [
      ['process_methodology_json', 'TEXT'],
    ];
    for (const [col, type] of svcCols) {
      await client.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ services extended');

    // ── 2. Extend service_pricing_models (Packages) ──
    const pkgCols = [
      ['typical_range', 'VARCHAR(255)'],
      ['scope_summary', 'TEXT'],
      ['scope_summary_ar', 'TEXT'],
      ['deliverables_json', 'TEXT'],
      ['optional_add_ons_json', 'TEXT'],
      ['support_terms', 'TEXT'],
      ['support_terms_ar', 'TEXT'],
      ['ip_ownership_notes', 'TEXT'],
      ['ip_ownership_notes_ar', 'TEXT'],
      ['description_ar', 'TEXT'],
      ['model_type_ar', 'VARCHAR(100)'],
    ];
    for (const [col, type] of pkgCols) {
      await client.query(`ALTER TABLE service_pricing_models ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ service_pricing_models extended');

    // ── 3. Extend service_deliverables ──
    const delCols = [
      ['title_ar', 'VARCHAR(255)'],
      ['description_ar', 'TEXT'],
      ['acceptance_criteria', 'TEXT'],
      ['acceptance_criteria_ar', 'TEXT'],
      ['expected_timeline', 'VARCHAR(100)'],
    ];
    for (const [col, type] of delCols) {
      await client.query(`ALTER TABLE service_deliverables ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ service_deliverables extended');

    // ── 4. Extend service_use_cases ──
    const ucCols = [
      ['title_ar', 'VARCHAR(255)'],
      ['description_ar', 'TEXT'],
      ['industry', 'VARCHAR(100)'],
      ['business_impact', 'TEXT'],
      ['business_impact_ar', 'TEXT'],
      ['example_scenario', 'TEXT'],
      ['example_scenario_ar', 'TEXT'],
    ];
    for (const [col, type] of ucCols) {
      await client.query(`ALTER TABLE service_use_cases ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ service_use_cases extended');

    // ── 5. Create service_impact_metrics ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_impact_metrics (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        metric_title VARCHAR(255) NOT NULL,
        metric_title_ar VARCHAR(255),
        metric_value VARCHAR(100) NOT NULL,
        metric_description TEXT,
        metric_description_ar TEXT,
        impact_category VARCHAR(100),
        order_index INTEGER DEFAULT 0
      )
    `);
    console.log('  ✅ service_impact_metrics created');

    // ── 6. Create industries + junction ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS industries (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        hero_image_url TEXT,
        overview TEXT,
        overview_ar TEXT,
        pain_points_json TEXT,
        pain_points_ar_json TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS industry_services (
        id SERIAL PRIMARY KEY,
        industry_id INTEGER REFERENCES industries(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        UNIQUE(industry_id, service_id)
      )
    `);
    console.log('  ✅ industries + industry_services created');

    // ── 7. Extend consultation_leads ──
    const leadCols = [
      ['selected_service_id', 'INTEGER'],
      ['selected_package_type', 'VARCHAR(100)'],
      ['budget_range', 'VARCHAR(100)'],
      ['timeline_expectation', 'VARCHAR(100)'],
      ['requires_full_ip', 'BOOLEAN DEFAULT false'],
      ['proposal_summary_snapshot', 'JSONB'],
    ];
    for (const [col, type] of leadCols) {
      await client.query(`ALTER TABLE consultation_leads ADD COLUMN IF NOT EXISTS ${col} ${type}`).catch(() => {});
    }
    console.log('  ✅ consultation_leads extended');

    // ── 8. Rename services ──
    await client.query(`UPDATE services SET title = 'Enterprise AI Deployment', title_ar = 'نشر حلول الذكاء الاصطناعي للمؤسسات', slug = 'enterprise-ai-deployment' WHERE slug LIKE '%mlops%' OR title ILIKE '%MLOps%'`);
    await client.query(`UPDATE services SET title = 'Scalable Software Platforms', title_ar = 'منصات برمجية قابلة للتوسع', slug = 'scalable-software-platforms' WHERE slug LIKE '%cloud%' OR title ILIKE '%Cloud-Native%'`);
    console.log('  ✅ Services renamed');

    // ── 9. Seed default methodology for existing services ──
    const defaultMethodology = JSON.stringify([
      { step: 1, title: 'Discovery', titleAr: 'الاستكشاف', desc: 'Requirements gathering, feasibility assessment, and architecture proposal.' },
      { step: 2, title: 'Architecture', titleAr: 'التصميم', desc: 'System design, technology selection, and detailed project planning.' },
      { step: 3, title: 'Implementation', titleAr: 'التنفيذ', desc: 'Iterative development with sprint reviews and continuous integration.' },
      { step: 4, title: 'Testing', titleAr: 'الاختبار', desc: 'Quality assurance, performance testing, and user acceptance testing.' },
      { step: 5, title: 'Deployment', titleAr: 'النشر', desc: 'Production deployment, monitoring setup, and knowledge transfer.' },
      { step: 6, title: 'Support', titleAr: 'الدعم', desc: 'Ongoing maintenance, optimization, and strategic advisory.' },
    ]);
    await client.query(`UPDATE services SET process_methodology_json = $1 WHERE process_methodology_json IS NULL`, [defaultMethodology]);
    console.log('  ✅ Default methodology seeded');

    // ── 10. Enrich existing pricing models with range data ──
    await client.query(`UPDATE service_pricing_models SET typical_range = '$5,000 - $15,000', scope_summary = 'Initial assessment, feasibility study, and architecture proposal with ROI analysis.', scope_summary_ar = 'تقييم أولي ودراسة جدوى ومقترح معماري مع تحليل العائد على الاستثمار.', deliverables_json = '["Technical Assessment Report","Architecture Design Document","ROI Analysis","Implementation Roadmap"]', support_terms = '2 revision rounds included', support_terms_ar = 'جولتان من المراجعات مشمولتان', ip_ownership_notes = 'All deliverables transferred to client upon completion.', ip_ownership_notes_ar = 'جميع المخرجات تُنقل للعميل عند الانتهاء.' WHERE model_type = 'Discovery' AND typical_range IS NULL`);

    await client.query(`UPDATE service_pricing_models SET typical_range = '$25,000 - $150,000', scope_summary = 'Full development, model training, system integration, QA, and production deployment.', scope_summary_ar = 'تطوير كامل وتدريب النماذج وتكامل الأنظمة وضمان الجودة ونشر الإنتاج.', deliverables_json = '["Custom Development","Model Training","System Integration","UAT & QA","Production Deployment","Technical Documentation"]', optional_add_ons_json = '["Extended warranty","On-site training","Data migration","Custom dashboards"]', support_terms = '90-day post-deployment support included', support_terms_ar = 'دعم ما بعد النشر لمدة ٩٠ يوماً مشمول', ip_ownership_notes = 'Full IP transfer. All source code, trained models, and documentation belong to client.', ip_ownership_notes_ar = 'نقل كامل للملكية الفكرية. جميع الشفرات المصدرية والنماذج والوثائق ملك العميل.' WHERE model_type = 'Implementation' AND typical_range IS NULL`);

    await client.query(`UPDATE service_pricing_models SET typical_range = '$3,000 - $15,000/month', scope_summary = 'Ongoing optimization, monitoring, support, model updates, and strategic advisory.', scope_summary_ar = 'تحسين مستمر ومراقبة ودعم وتحديث النماذج واستشارات استراتيجية.', deliverables_json = '["24/7 Monitoring","Monthly Performance Reviews","Model Retraining","Priority Support","Quarterly Strategy Sessions"]', optional_add_ons_json = '["Dedicated engineer","Custom reporting","SLA upgrade"]', support_terms = 'Priority SLA with 4-hour response time', support_terms_ar = 'اتفاقية مستوى خدمة ذات أولوية مع وقت استجابة ٤ ساعات', ip_ownership_notes = 'All improvements and new models transferred monthly.', ip_ownership_notes_ar = 'جميع التحسينات والنماذج الجديدة تُنقل شهرياً.' WHERE model_type = 'Retainer' AND typical_range IS NULL`);
    console.log('  ✅ Pricing models enriched');

    // ── 11. Seed impact metrics for existing services ──
    const { rows: svcs } = await client.query(`SELECT id, slug FROM services WHERE status = 'active'`);
    for (const svc of svcs) {
      const { rows: existing } = await client.query(`SELECT COUNT(*) as c FROM service_impact_metrics WHERE service_id = $1`, [svc.id]);
      if (parseInt(existing[0].c) > 0) continue;

      const metrics = [
        { title: 'Efficiency Gain', titleAr: 'تحسين الكفاءة', value: 'Up to 4x', desc: 'Typical improvement in operational throughput after deployment.', descAr: 'تحسين نموذجي في الإنتاجية التشغيلية بعد النشر.', cat: 'efficiency' },
        { title: 'Cost Reduction', titleAr: 'خفض التكاليف', value: '30-60%', desc: 'Average reduction in operational costs through automation.', descAr: 'متوسط خفض التكاليف التشغيلية من خلال الأتمتة.', cat: 'cost_reduction' },
        { title: 'Risk Reduction', titleAr: 'تقليل المخاطر', value: '85%+', desc: 'Reduction in human-error related incidents.', descAr: 'تقليل في الحوادث المرتبطة بالأخطاء البشرية.', cat: 'risk_reduction' },
      ];
      for (let i = 0; i < metrics.length; i++) {
        const m = metrics[i];
        await client.query(`INSERT INTO service_impact_metrics (service_id, metric_title, metric_title_ar, metric_value, metric_description, metric_description_ar, impact_category, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [svc.id, m.title, m.titleAr, m.value, m.desc, m.descAr, m.cat, i]);
      }
    }
    console.log('  ✅ Impact metrics seeded');

    // ── 12. Seed industries ──
    const industries = [
      { slug: 'manufacturing', title: 'Manufacturing', titleAr: 'التصنيع', overview: 'AI-powered quality inspection, predictive maintenance, and production optimization for modern factories.', overviewAr: 'فحص الجودة بالذكاء الاصطناعي والصيانة التنبؤية وتحسين الإنتاج للمصانع الحديثة.', pains: '["High defect rates in manual inspection","Unplanned equipment downtime","Inconsistent production quality"]', painsAr: '["معدلات عيوب مرتفعة في الفحص اليدوي","توقف غير مخطط للمعدات","جودة إنتاج غير متسقة"]' },
      { slug: 'logistics', title: 'Logistics & Supply Chain', titleAr: 'الخدمات اللوجستية وسلاسل الإمداد', overview: 'Intelligent tracking, demand forecasting, and warehouse automation for end-to-end supply chain visibility.', overviewAr: 'تتبع ذكي والتنبؤ بالطلب وأتمتة المستودعات لرؤية شاملة لسلسلة الإمداد.', pains: '["Inventory inaccuracies","Route optimization challenges","Demand forecasting gaps"]', painsAr: '["عدم دقة المخزون","تحديات تحسين المسارات","فجوات التنبؤ بالطلب"]' },
      { slug: 'enterprise-operations', title: 'Enterprise Operations', titleAr: 'العمليات المؤسسية', overview: 'Process automation, decision support systems, and intelligent dashboards for enterprise efficiency.', overviewAr: 'أتمتة العمليات وأنظمة دعم القرار ولوحات معلومات ذكية لكفاءة المؤسسات.', pains: '["Manual repetitive processes","Data silos across departments","Slow decision-making cycles"]', painsAr: '["عمليات يدوية متكررة","صوامع بيانات عبر الأقسام","دورات اتخاذ قرار بطيئة"]' },
      { slug: 'smart-infrastructure', title: 'Smart Infrastructure', titleAr: 'البنية التحتية الذكية', overview: 'IoT integration, real-time monitoring, and predictive systems for modern infrastructure management.', overviewAr: 'تكامل إنترنت الأشياء والمراقبة اللحظية والأنظمة التنبؤية لإدارة البنية التحتية الحديثة.', pains: '["Reactive maintenance strategies","Lack of real-time visibility","Energy inefficiency"]', painsAr: '["استراتيجيات صيانة تفاعلية","نقص الرؤية اللحظية","عدم كفاءة الطاقة"]' },
    ];
    for (const ind of industries) {
      await client.query(`INSERT INTO industries (slug, title, title_ar, overview, overview_ar, pain_points_json, pain_points_ar_json, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (slug) DO NOTHING`,
        [ind.slug, ind.title, ind.titleAr, ind.overview, ind.overviewAr, ind.pains, ind.painsAr, industries.indexOf(ind)]);
    }
    // Map services to industries
    const { rows: allSvcs } = await client.query(`SELECT id, slug FROM services WHERE status = 'active'`);
    const { rows: allInds } = await client.query(`SELECT id, slug FROM industries`);
    const indMap = Object.fromEntries(allInds.map(i => [i.slug, i.id]));
    const svcMap = Object.fromEntries(allSvcs.map(s => [s.slug, s.id]));

    const mappings = [
      ['manufacturing', 'computer-vision-systems'], ['manufacturing', 'predictive-analytics'],
      ['logistics', 'predictive-analytics'], ['logistics', 'scalable-software-platforms'],
      ['enterprise-operations', 'enterprise-ai-deployment'], ['enterprise-operations', 'scalable-software-platforms'],
      ['smart-infrastructure', 'computer-vision-systems'], ['smart-infrastructure', 'enterprise-ai-deployment'],
    ];
    for (const [indSlug, svcSlug] of mappings) {
      if (indMap[indSlug] && svcMap[svcSlug]) {
        await client.query(`INSERT INTO industry_services (industry_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [indMap[indSlug], svcMap[svcSlug]]);
      }
    }
    console.log('  ✅ Industries seeded + mapped');

    // ── 13. Seed additional services ──
    const newServices = [
      { title: 'AI Automation Systems', titleAr: 'أنظمة الأتمتة بالذكاء الاصطناعي', desc: 'End-to-end intelligent process automation using AI agents, workflow orchestration, and decision engines.', descAr: 'أتمتة شاملة للعمليات باستخدام وكلاء الذكاء الاصطناعي وتنسيق سير العمل ومحركات القرار.', icon: 'Zap', slug: 'ai-automation-systems' },
      { title: 'Custom LLM Solutions', titleAr: 'حلول نماذج اللغة المخصصة', desc: 'Fine-tuned large language models, custom chatbots, and enterprise knowledge assistants.', descAr: 'نماذج لغوية كبيرة مضبوطة ومساعدات معرفية مؤسسية وروبوتات محادثة مخصصة.', icon: 'Brain', slug: 'custom-llm-solutions' },
      { title: 'Data Engineering & Pipelines', titleAr: 'هندسة البيانات وخطوط المعالجة', desc: 'Scalable data lakes, ETL pipelines, real-time streaming, and data governance frameworks.', descAr: 'بحيرات بيانات قابلة للتوسع وخطوط ETL والبث اللحظي وأطر حوكمة البيانات.', icon: 'Database', slug: 'data-engineering' },
      { title: 'Intelligent Dashboards', titleAr: 'لوحات المعلومات الذكية', desc: 'Interactive BI dashboards with real-time data visualization, KPI tracking, and executive reporting.', descAr: 'لوحات BI تفاعلية مع تصور بيانات لحظي وتتبع مؤشرات الأداء وتقارير تنفيذية.', icon: 'BarChart3', slug: 'intelligent-dashboards' },
      { title: 'RAG & Knowledge Systems', titleAr: 'أنظمة المعرفة المؤسسية', desc: 'Retrieval-augmented generation systems for enterprise knowledge management and intelligent search.', descAr: 'أنظمة توليد معززة بالاسترجاع لإدارة المعرفة المؤسسية والبحث الذكي.', icon: 'Layers', slug: 'rag-knowledge-systems' },
      { title: 'Industrial AI Inspection', titleAr: 'الفحص الصناعي بالذكاء الاصطناعي', desc: 'Automated visual inspection, anomaly detection, and compliance monitoring for industrial operations.', descAr: 'فحص بصري آلي واكتشاف الشذوذ ومراقبة الامتثال للعمليات الصناعية.', icon: 'Eye', slug: 'industrial-ai-inspection' },
      { title: 'Decision Support Systems', titleAr: 'أنظمة دعم القرار', desc: 'AI-driven decision intelligence platforms with scenario modeling and risk assessment.', descAr: 'منصات ذكاء قرار مدعومة بالذكاء الاصطناعي مع نمذجة السيناريوهات وتقييم المخاطر.', icon: 'Target', slug: 'decision-support-systems' },
    ];
    for (let i = 0; i < newServices.length; i++) {
      const s = newServices[i];
      const { rows: ex } = await client.query(`SELECT id FROM services WHERE slug = $1`, [s.slug]);
      if (ex.length > 0) continue;
      await client.query(`INSERT INTO services (title, title_ar, description, description_ar, icon, slug, status, featured, show_on_homepage, sort_order, price_tier, process_methodology_json) VALUES ($1,$2,$3,$4,$5,$6,'active',true,false,$7,'Enterprise Level',$8)`,
        [s.title, s.titleAr, s.desc, s.descAr, s.icon, s.slug, 10 + i, defaultMethodology]);
    }
    console.log('  ✅ Additional services seeded');

    console.log('\n🎉 V3 Solutions Migration complete!');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
