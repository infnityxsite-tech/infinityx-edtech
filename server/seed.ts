// server/seed.ts - Firebase Database Seeding Script
import * as db from "./db";

async function seed() {
  console.log("🌱 Starting Firebase database seed...");

  try {
    // Seed Home page content
    console.log("📄 Seeding Home page content...");
    await db.updatePageContent("home", {
      pageKey: "home",
      headline: "Transform Your Future with AI-Powered Education",
      subHeadline: "Join thousands of students mastering cutting-edge technology skills with InfinityX",
      studentsTrained: 5000,
      expertInstructors: 50,
      jobPlacementRate: 92,
      heroImageUrl: "/assets/hero-banner.jpg",
      visionImageUrl: "/assets/vision-learning.jpg",
    });
    console.log("✅ Home page content created");

    // Seed About page content
    console.log("📄 Seeding About page content...");
    await db.updatePageContent("about", {
      pageKey: "about",
      aboutCompany: "InfinityX is a leading EdTech platform dedicated to empowering individuals with the skills needed to thrive in the digital age. We combine cutting-edge technology with expert instruction to deliver world-class education.",
      founderBio: "Dr. Ahmed Hassan, Founder & CEO",
      founderMessage: "Our mission is to democratize access to quality tech education and prepare the next generation of innovators.",
      missionText: "To provide accessible, high-quality technology education that transforms lives and careers.",
      visionText: "To become the world's most trusted platform for technology education and career advancement.",
      bannerImageUrl: "/assets/about-banner.jpg",
      founderImageUrl: "/assets/founder-portrait.jpg",
      companyImageUrl: "/assets/vision-learning.jpg",
      missionImageUrl: "/assets/mission-education.jpg",
    });
    console.log("✅ About page content created");

    console.log("🎉 Firebase database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  console.log("✨ Seed script finished");
  process.exit(0);
}

seed();
