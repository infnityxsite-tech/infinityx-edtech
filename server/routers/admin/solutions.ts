import { publicProcedure, protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import * as db from "../../db";

export const solutionsEndpoints = {
  // ==============================
  // 🚀 HEADLESS CMS COMPOSITIONS
  // ==============================

  getSolutionsHub: publicProcedure.query(() => db.getSolutionsHub()),
  
  getSolutionBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const solution = await db.getSolutionBySlug(input.slug);
      if (!solution) throw new Error("Solution not found");
      return solution;
    }),

  // ==============================
  // 🚀 SERVICE PACKAGES
  // ==============================

  getServicePackages: protectedProcedure.query(() => db.getServicePackages()),

  getActiveServicePackages: publicProcedure.query(() => db.getActiveServicePackages()),

  createServicePackage: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        titleAr: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        featuresJson: z.string().optional(),
        priceTier: z.string().optional(),
        iconUrl: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        orderIndex: z.number().optional().default(0),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createServicePackage(input);
    }),

  updateServicePackage: protectedProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        title: z.string().optional(),
        titleAr: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        featuresJson: z.string().optional(),
        priceTier: z.string().optional(),
        iconUrl: z.string().optional(),
        isActive: z.boolean().optional(),
        orderIndex: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateServicePackage(id, data);
      return { success: true };
    }),

  deleteServicePackage: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(async ({ input }) => {
      await db.deleteServicePackage(input.id);
      return { success: true };
    }),

  // ==============================
  // 📊 CLIENT CASE STUDIES
  // ==============================

  getClientCaseStudies: protectedProcedure.query(() => db.getClientCaseStudies()),

  getPublishedCaseStudies: publicProcedure.query(() => db.getPublishedCaseStudies()),

  createClientCaseStudy: protectedProcedure
    .input(
      z.object({
        clientName: z.string(),
        clientNameAr: z.string().optional(),
        industry: z.string().optional(),
        industryAr: z.string().optional(),
        challenge: z.string().optional(),
        challengeAr: z.string().optional(),
        solution: z.string().optional(),
        solutionAr: z.string().optional(),
        resultsJson: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createClientCaseStudy(input);
    }),

  updateClientCaseStudy: protectedProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        clientName: z.string().optional(),
        clientNameAr: z.string().optional(),
        industry: z.string().optional(),
        industryAr: z.string().optional(),
        challenge: z.string().optional(),
        challengeAr: z.string().optional(),
        solution: z.string().optional(),
        solutionAr: z.string().optional(),
        resultsJson: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateClientCaseStudy(id, data);
      return { success: true };
    }),

  deleteClientCaseStudy: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(async ({ input }) => {
      await db.deleteClientCaseStudy(input.id);
      return { success: true };
    }),

  // ==============================
  // 🏗️ SOLUTION TIERS
  // ==============================

  getSolutionTiers: protectedProcedure.query(() => db.getSolutionTiers()),

  getActiveSolutionTiers: publicProcedure.query(() => db.getActiveSolutionTiers()),

  createSolutionTier: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        nameAr: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        targetAudience: z.string().optional(),
        targetAudienceAr: z.string().optional(),
        techStackJson: z.string().optional(),
        priceRange: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        orderIndex: z.number().optional().default(0),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createSolutionTier(input);
    }),

  updateSolutionTier: protectedProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        name: z.string().optional(),
        nameAr: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        targetAudience: z.string().optional(),
        targetAudienceAr: z.string().optional(),
        techStackJson: z.string().optional(),
        priceRange: z.string().optional(),
        isActive: z.boolean().optional(),
        orderIndex: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateSolutionTier(id, data);
      return { success: true };
    }),

  deleteSolutionTier: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(async ({ input }) => {
      await db.deleteSolutionTier(input.id);
      return { success: true };
    }),

  // ==============================
  // 📞 CONSULTATION LEADS (B2B SALES FUNNEL)
  // ==============================

  getConsultationLeads: protectedProcedure.query(() => db.getConsultationLeads()),

  // Public endpoint - this is what the lead capture form on the homepage calls
  submitConsultationLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name is required"),
        company: z.string().optional(),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        industryPainPoint: z.string().optional(),
        serviceInterest: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createConsultationLead({
        ...input,
        status: "new",
        notes: null,
      });
    }),

  updateConsultationLeadStatus: protectedProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        status: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateConsultationLeadStatus(input.id, input.status, input.notes);
      return { success: true };
    }),

  deleteConsultationLead: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(async ({ input }) => {
      await db.deleteConsultationLead(input.id);
      return { success: true };
    }),

  // ==============================
  // 🔧 SERVICE SUB-TABLE CRUD
  // ==============================

  updateService: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }).passthrough())
    .mutation(async ({ input }) => { const { id, ...data } = input; await db.updateService(id, data); return { success: true }; }),

  addServiceGalleryItem: protectedProcedure
    .input(z.object({ serviceId: z.number(), imageUrl: z.string(), caption: z.string().optional() }))
    .mutation(({ input }) => db.addServiceGalleryItem(input.serviceId, input.imageUrl, input.caption)),

  deleteServiceGalleryItem: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceGalleryItem(input.id)),

  addServiceFaq: protectedProcedure
    .input(z.object({ serviceId: z.number(), question: z.string(), answer: z.string(), questionAr: z.string().optional(), answerAr: z.string().optional() }))
    .mutation(({ input }) => db.addServiceFaq(input.serviceId, input.question, input.answer, input.questionAr, input.answerAr)),

  deleteServiceFaq: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceFaq(input.id)),

  addServiceTechStack: protectedProcedure
    .input(z.object({ serviceId: z.number(), name: z.string(), category: z.string().optional() }))
    .mutation(({ input }) => db.addServiceTechStack(input.serviceId, input.name, input.category)),

  deleteServiceTechStack: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceTechStack(input.id)),

  addServiceDeliverable: protectedProcedure
    .input(z.object({ serviceId: z.number(), title: z.string(), description: z.string().optional() }))
    .mutation(({ input }) => db.addServiceDeliverable(input.serviceId, input.title, input.description)),

  deleteServiceDeliverable: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceDeliverable(input.id)),

  addServiceUseCase: protectedProcedure
    .input(z.object({ serviceId: z.number(), title: z.string(), description: z.string().optional() }))
    .mutation(({ input }) => db.addServiceUseCase(input.serviceId, input.title, input.description)),

  deleteServiceUseCase: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceUseCase(input.id)),

  addServicePricingModel: protectedProcedure
    .input(z.object({ serviceId: z.number(), modelType: z.string(), startingPrice: z.string(), description: z.string().optional(), featuresJson: z.string().optional() }))
    .mutation(({ input }) => db.addServicePricingModel(input.serviceId, input.modelType, input.startingPrice, input.description, input.featuresJson)),

  deleteServicePricingModel: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServicePricingModel(input.id)),

  updateServicePricingModel: protectedProcedure
    .input(z.object({
      id: z.union([z.string(), z.number()]).transform(String),
      modelType: z.string().optional(),
      startingPrice: z.string().optional(),
      priceEgp: z.string().optional(),
      description: z.string().optional(),
      featuresJson: z.string().optional(),
    }))
    .mutation(async ({ input }) => { const { id, ...data } = input; await db.updateServicePricingModel(id, data); return { success: true }; }),

  updateClientCaseStudyFull: protectedProcedure
    .input(z.object({
      id: z.union([z.string(), z.number()]).transform(String),
      clientName: z.string().optional(),
      clientNameAr: z.string().optional(),
      industry: z.string().optional(),
      industryAr: z.string().optional(),
      challenge: z.string().optional(),
      challengeAr: z.string().optional(),
      solution: z.string().optional(),
      solutionAr: z.string().optional(),
      outcome: z.string().optional(),
      outcomeAr: z.string().optional(),
      imageUrl: z.string().optional(),
      isPublished: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => { const { id, ...data } = input; await db.updateClientCaseStudyFull(id, data); return { success: true }; }),

  // ==============================
  // 📊 IMPACT METRICS
  // ==============================

  addServiceImpactMetric: protectedProcedure
    .input(z.object({ serviceId: z.number(), metricTitle: z.string(), metricTitleAr: z.string().optional(), metricValue: z.string(), metricDescription: z.string().optional(), metricDescriptionAr: z.string().optional(), impactCategory: z.string().optional(), orderIndex: z.number().optional() }))
    .mutation(({ input }) => db.addServiceImpactMetric(input.serviceId, input)),

  deleteServiceImpactMetric: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteServiceImpactMetric(input.id)),

  // ==============================
  // 🏭 INDUSTRIES
  // ==============================

  getIndustries: publicProcedure.query(() => db.getIndustries()),

  getIndustryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => db.getIndustryBySlug(input.slug)),

  createIndustry: protectedProcedure
    .input(z.object({ slug: z.string(), title: z.string(), titleAr: z.string(), heroImageUrl: z.string().optional(), overview: z.string().optional(), overviewAr: z.string().optional(), painPointsJson: z.string().optional(), painPointsArJson: z.string().optional(), orderIndex: z.number().optional() }))
    .mutation(({ input }) => db.createIndustry(input)),

  updateIndustry: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }).passthrough())
    .mutation(async ({ input }) => { const { id, ...data } = input; await db.updateIndustry(id, data); return { success: true }; }),

  deleteIndustry: protectedProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(({ input }) => db.deleteIndustry(input.id)),

  mapIndustryService: protectedProcedure
    .input(z.object({ industryId: z.number(), serviceId: z.number() }))
    .mutation(({ input }) => db.mapIndustryService(input.industryId, input.serviceId)),

  unmapIndustryService: protectedProcedure
    .input(z.object({ industryId: z.number(), serviceId: z.number() }))
    .mutation(({ input }) => db.unmapIndustryService(input.industryId, input.serviceId)),

  // ==============================
  // 📝 PROPOSAL GENERATOR
  // ==============================

  submitProposalLead: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      company: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      industryPainPoint: z.string().optional(),
      serviceInterest: z.string().optional(),
      selectedServiceId: z.number().optional(),
      selectedPackageType: z.string().optional(),
      budgetRange: z.string().optional(),
      timelineExpectation: z.string().optional(),
      requiresFullIp: z.boolean().optional(),
      proposalSummarySnapshot: z.any().optional(),
    }))
    .mutation(({ input }) => db.createProposalLead(input)),

  getEnhancedLeads: protectedProcedure.query(() => db.getEnhancedConsultationLeads()),
};
