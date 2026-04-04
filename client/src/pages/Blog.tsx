import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Sparkles,
  Newspaper
} from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.admin.getBlogPosts.useQuery();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

  const stripHtml = (html: string | undefined | null) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* 🏛️ HERO SECTION (Matches Courses Page) */}
      <section className={`relative pt-36 pb-24 overflow-hidden ${isLight ? '' : 'bg-[#0b1120] text-white'}`}>
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        {/* Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${isLight ? 'bg-indigo-100 border border-indigo-200 text-indigo-700' : 'bg-indigo-900/40 border border-indigo-700/50 text-indigo-300'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("InfinityX Insights & News", "رؤى وأخبار InfinityX", "InfinityX Insights")}</span>
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("The Future of Tech, ", "مستقبل التكنولوجيا، ", "The Future of Tech, ")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">{t("Decoded.", "مكشوف.", "Decoded.")}</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t(
              "Deep dives into Artificial Intelligence, Space Tech, and Software Engineering. Written by experts, for innovators.",
              "غوص عميق في الذكاء الاصطناعي، تكنولوجيا الفضاء، وهندسة البرمجيات. بقلم خبراء، للمبتكرين.",
              "Deep dives into AI, Space Tech, and Software Engineering."
            )}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">

        {/* 🔄 LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading insights...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No articles yet</h3>
            <p className="text-slate-500 mt-2">Check back soon for new content.</p>
          </div>
        ) : (
          <>
            {/* 🌟 FEATURED POST (Hero Card) */}
            {featuredPost && (
              <div className="mb-16">
                <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4 ml-1">{t("Featured Article", "مقال مميز", "Featured Article")}</h2>
                <Link href={`/blog/${featuredPost.id}`}>
                  <div className="group relative bg-[#0d1225]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Side */}
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-cyan-500/20 text-cyan-300 backdrop-blur border border-cyan-500/30 shadow-sm hover:bg-cyan-500/30">
                          {t("Latest Release", "أحدث إصدار", "Latest Release")}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          {featuredPost.author || "InfinityX Team"}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {new Date(featuredPost.publishedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <h2 className={`text-2xl lg:text-4xl font-bold mb-4 group-hover:text-cyan-400 transition-colors leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {featuredPost.title}
                      </h2>

                      <p className={`text-lg leading-relaxed mb-6 line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {featuredPost.excerpt ? stripHtml(featuredPost.excerpt) : stripHtml(featuredPost.content)?.substring(0, 200)}...
                      </p>

                      <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
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
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Recent Articles", "المقالات الأخيرة", "Recent Articles")}</h2>
                  <div className="h-px bg-white/[0.06] flex-1 ml-6"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <Card className="group h-full flex flex-col border border-white/[0.06] bg-[#0d1225]/80 backdrop-blur-xl hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 overflow-hidden rounded-xl cursor-pointer p-0 gap-0">
                        {/* Card Image */}
                        <div className="relative h-48 overflow-hidden bg-slate-900">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <BookOpen className="w-8 h-8 opacity-50" />
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <CardHeader className="p-5 pb-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className={`text-lg font-bold line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {post.title}
                          </h3>
                        </CardHeader>

                        <CardContent className="px-5 py-2 flex-1">
                          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                            {post.excerpt ? stripHtml(post.excerpt) : stripHtml(post.content).substring(0, 120)}...
                          </p>
                        </CardContent>

                        <CardFooter className="px-5 py-4 border-t border-white/[0.04] mt-auto">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                              {(post.author || "A").charAt(0)}
                            </div>
                            <span>{post.author || "InfinityX Team"}</span>
                          </div>
                          <div className="ml-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ✍️ CTA SECTION */}
      <section className={`py-24 text-center mt-12 relative overflow-hidden ${isLight ? 'bg-slate-100 text-slate-900 border-t border-slate-200' : 'bg-slate-900 text-white'}`}>
        {/* Decorative BG */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Badge variant="outline" className={`mb-4 px-3 py-1 ${isLight ? 'border-indigo-300 text-indigo-600' : 'border-indigo-500/50 text-indigo-300'}`}>{t("Community", "المجتمع", "Community")}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t("Have something to share?", "لديك شيء تشاركه؟", "Have something to share?")}</h2>
          <p className={`mb-8 text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t(
              "We are always looking for guest writers to share insights on AI, Space Tech, and Engineering. Join our community of innovators.",
              "نحن نبحث دائمًا عن كتّاب ضيوف لمشاركة رؤاهم حول الذكاء الاصطناعي وتكنولوجيا الفضاء والهندسة. انضم إلى مجتمعنا من المبتكرين.",
              "We are always looking for guest writers."
            )}
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full shadow-lg shadow-indigo-900/50">
            <a href="mailto:support@infx.space">
              {t("Become a Contributor", "كن مساهمًا", "Become a Contributor")}
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}