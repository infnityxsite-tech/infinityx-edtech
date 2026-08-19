import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    // Get services
    const { rows: services } = await client.query(`SELECT id, slug, title FROM services ORDER BY id`);
    
    // Clear existing galleries and re-seed with unique images per service
    for (const svc of services) {
      await client.query(`DELETE FROM service_gallery WHERE service_id = $1`, [svc.id]);
      
      let images = [];
      const slug = svc.slug || '';
      
      if (slug.includes('vision')) {
        images = [
          ['/uploads/hero_cv_industrial.webp', 'Real-time object detection pipeline'],
          ['/uploads/industrial_yolo_cv.webp', 'YOLOv11 defect classification'],
          ['/uploads/satellite_agri_grid.webp', 'Spatial analysis grid overlay'],
        ];
      } else if (slug.includes('mlops')) {
        images = [
          ['/uploads/hero_ai_neural.webp', 'Neural network architecture'],
          ['/uploads/gallery_mlops_pipeline.webp', 'MLOps training dashboard'],
          ['/uploads/mlops_dashboard.webp', 'Model monitoring & metrics'],
        ];
      } else if (slug.includes('cloud')) {
        images = [
          ['/uploads/hero_cloud_infra.webp', 'Cloud infrastructure topology'],
          ['/uploads/gallery_cloud_k8s.webp', 'Kubernetes cluster visualization'],
          ['/uploads/software_architecture_hero.webp', 'Microservices architecture'],
        ];
      } else {
        images = [
          ['/uploads/hero_analytics_dash.webp', 'Predictive analytics dashboard'],
          ['/uploads/gallery_analytics_bi.webp', 'Business intelligence panels'],
          ['/uploads/ai_datacenter_hero.webp', 'Data processing infrastructure'],
        ];
      }
      
      for (let i = 0; i < images.length; i++) {
        await client.query(`INSERT INTO service_gallery (service_id, image_url, caption, order_index) VALUES ($1, $2, $3, $4)`, [svc.id, images[i][0], images[i][1], i]);
      }
      console.log(`✅ Gallery updated for: ${svc.title}`);
    }
    
    console.log('🎉 All galleries are now unique per service');
  } finally {
    client.release();
    await pool.end();
  }
}
run();
