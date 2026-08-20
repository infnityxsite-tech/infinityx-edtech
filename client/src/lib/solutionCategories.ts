import { ScanLine, Sparkles, Workflow } from "lucide-react";

export const SOLUTION_CATEGORY_ORDER = ["operations", "computer-vision", "product-systems"] as const;

export const solutionCategoryPresentation = {
  operations: {
    icon: Workflow,
    name: { en: "Operations", ar: "العمليات" },
    homeHeading: { en: "Run a better operation", ar: "شغّل عملية أفضل" },
    homeDetail: {
      en: "Make repetitive work visible, reliable, and easier to act on.",
      ar: "اجعل العمل المتكرر واضحاً وموثوقاً وأسهل في اتخاذ إجراء بشأنه.",
    },
  },
  "computer-vision": {
    icon: ScanLine,
    name: { en: "Computer Vision", ar: "الرؤية الحاسوبية" },
    homeHeading: { en: "See what is happening", ar: "شاهد ما يحدث" },
    homeDetail: {
      en: "Turn visual signals into quality, safety, and production decisions.",
      ar: "حوّل الإشارات البصرية إلى قرارات للجودة والسلامة والإنتاج.",
    },
  },
  "product-systems": {
    icon: Sparkles,
    name: { en: "Product Systems", ar: "أنظمة المنتجات" },
    homeHeading: { en: "Build an intelligent product", ar: "ابنِ منتجاً ذكياً" },
    homeDetail: {
      en: "Move from an isolated model to a software experience people can own.",
      ar: "انتقل من نموذج منفصل إلى تجربة برمجية يمكن للناس امتلاكها.",
    },
  },
} as const;

export function isSolutionCategorySlug(slug: string): slug is keyof typeof solutionCategoryPresentation {
  return slug in solutionCategoryPresentation;
}
