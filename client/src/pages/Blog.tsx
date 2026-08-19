import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Loader2, BookOpen, Sparkles, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.admin.getBlogPosts.useQuery();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useSEO({
    title: "Insights & Tech Blog | Infinity X",
    description: "Deep technical articles on applied AI systems, space tech, MLOps, and software engineering by Infinity X specialists.",
    canonical: "https://infx.space/blog",
    robots: "index, follow",
  });

  const featuredPost = useMemo(() => {
    if (!posts || posts.length === 0) return null;
    return posts.find((p: any) => p.isFeatured) || posts[0];
  }, [posts]);

  const remainingPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    if (!featuredPost) return posts;
    return posts.filter((p: any) => p.id !== featuredPost.id);
  }, [posts, featuredPost]);

  const stripHtml = (html: string | undefined | null) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <div className={`ix-page min-h-screen font-sans ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-14 border-b border-[#D8DDD8]/60 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-[#E4EBE6] border border-[#D8DDD8] text-[#52735F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("InfinityX Insights & News", "رؤى وأخبار InfinityX", "InfinityX Insights")}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-[#1F2925]">
            {t("The Future of Tech, ", "مستقبل التكنولوجيا، ", "The Future of Tech, ")}
            <span className="text-[#52735F]">{t("Decoded.", "مكشوف.", "Decoded.")}</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light text-[#5E6862]">
            {t(
              "Deep dives into Artificial Intelligence, Space Tech, and Software Engineering. Written by experts, for innovators.",
              "غوص عميق في الذكاء الاصطناعي، تكنولوجيا الفضاء، وهندسة البرمجيات. بقلم خبراء، للمبتكرين.",
              "Deep dives into AI, Space Tech, and Software Engineering."
            )}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-20">
        {/* 🔄 LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-[#D8DDD8]">
            <Loader2 className="w-10 h-10 animate-spin text-[#52735F] mb-4" />
            <p className="text-[#5E6862] font-medium">Loading insights...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#D8DDD8]">
            <div className="bg-[#EAEDEA] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-[#7B847F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2925]">No articles yet</h3>
            <p className="text-[#5E6862] mt-2">Check back soon for new content.</p>
          </div>
        ) : (
          <>
            {/* 🌟 FEATURED POST */}
            {featuredPost && (
              <div className="mb-16">
                <h2 className="text-xs font-bold tracking-widest text-[#7B847F] uppercase mb-4 ml-1">
                  {t("Featured Article", "مقال مميز", "Featured Article")}
                </h2>
                <Link href={`/blog/${featuredPost.id}`}>
                  <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#D8DDD8] shadow-md hover:shadow-xl hover:border-[#52735F] transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Side */}
                    <div className="relative h-64 lg:h-auto overflow-hidden bg-[#EAEDEA]">
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EAEDEA] flex items-center justify-center text-[#7B847F]">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#52735F] text-white border-0 shadow-sm">
                          {t("Latest Release", "أحدث إصدار", "Latest Release")}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                      <div className="flex items-center gap-4 text-xs font-medium text-[#7B847F] mb-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#52735F]" />
                          {featuredPost.author || "InfinityX Team"}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[#D8DDD8]"></div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#52735F]" />
                          {new Date(featuredPost.publishedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-4xl font-bold mb-4 group-hover:text-[#52735F] transition-colors leading-tight text-[#1F2925]">
                        {featuredPost.title}
                      </h2>

                      <p className="text-base leading-relaxed mb-6 line-clamp-3 text-[#5E6862]">
                        {featuredPost.excerpt ? stripHtml(featuredPost.excerpt) : stripHtml(featuredPost.content)?.substring(0, 200)}...
                      </p>

                      <div className="flex items-center text-[#52735F] font-semibold group-hover:translate-x-1 transition-transform">
                        {t("Read Full Article", "اقرأ المقال كاملاً", "Read Full Article")} <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 📰 ALL POSTS GRID */}
            {remainingPosts.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#1F2925]">{t("Recent Articles", "المقالات الأخيرة", "Recent Articles")}</h2>
                  <div className="h-px bg-[#D8DDD8] flex-1 ml-6"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <Card className="group h-full flex flex-col border border-[#D8DDD8] bg-white hover:border-[#52735F] hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl cursor-pointer p-0 gap-0">
                        {/* Card Image */}
                        <div className="relative h-48 overflow-hidden bg-[#EAEDEA]">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#7B847F]">
                              <BookOpen className="w-8 h-8 opacity-50" />
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <CardHeader className="p-5 pb-2">
                          <div className="flex items-center justify-between text-xs text-[#7B847F] mb-3">
                            <span className="flex items-center gap-1.5 bg-[#EAEDEA] px-2 py-1 rounded">
                              <Calendar className="w-3 h-3 text-[#52735F]" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-[#52735F] transition-colors text-[#1F2925]">
                            {post.title}
                          </h3>
                        </CardHeader>

                        <CardContent className="px-5 py-2 flex-1">
                          <p className="text-[#5E6862] text-sm line-clamp-3 leading-relaxed">
                            {post.excerpt ? stripHtml(post.excerpt) : stripHtml(post.content).substring(0, 120)}...
                          </p>
                        </CardContent>

                        <div className="p-5 pt-0 mt-auto flex items-center text-xs font-semibold text-[#52735F] group-hover:translate-x-1 transition-transform">
                          {t("Read Article", "اقرأ المقال", "Read Article")} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
