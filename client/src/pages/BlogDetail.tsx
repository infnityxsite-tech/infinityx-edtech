import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, User, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Streamdown } from "streamdown";
import { VideoEmbed } from "@/components/VideoEmbed";
import React, { useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";

const customComponents = {
  p: (props: any) => {
    const firstChild = Array.isArray(props.children) ? props.children[0] : props.children;
    if (typeof firstChild === 'string' && firstChild.trim().startsWith(':::youtube')) {
      const match = firstChild.trim().match(/^:::youtube\s+([^ \n]+)/);
      if (match && match[1]) {
        return <VideoEmbed videoId={match[1]} />;
      }
    }
    return <p {...props} />;
  }
};

export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:id");
  const postId = params?.id || null;

  const { data: posts = [], isLoading } = trpc.admin.getBlogPosts.useQuery();
  const post = posts.find((p: any) => String(p.id) === String(postId));

  // Derive description from content (first 160 chars of plain text)
  const postExcerpt = useMemo(() => {
    if (!post?.content) return "";
    return post.content.replace(/[#*`>\[\]()!]/g, "").slice(0, 155).trim() + "...";
  }, [post?.content]);

  useSEO({
    title: post?.title ? `${post.title} — Infinity X Blog` : isLoading ? "Loading... — Infinity X Blog" : "Post Not Found — Infinity X Blog",
    description: post ? (postExcerpt || post.title) : "The article you are looking for does not exist or has been removed.",
    canonical: `https://infx.space/blog/${postId}`,
    robots: post ? "index, follow" : "noindex, follow",
  });

  const processedContent = useMemo(() => {
    if (!post?.content) return "";
    let content = post.content;
    const divIframeRegex = /<div[^>]*>[\s\S]*?<iframe[^>]*src="(?:https?:)?\/\/www\.youtube\.com\/embed\/([^"?]+)"[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi;
    content = content.replace(divIframeRegex, '\n\n:::youtube $1\n\n');
    const standaloneIframeRegex = /<iframe[^>]*src="(?:https?:)?\/\/www\.youtube\.com\/embed\/([^"?]+)"[^>]*>[\s\S]*?<\/iframe>/gi;
    content = content.replace(standaloneIframeRegex, '\n\n:::youtube $1\n\n');
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/gim;
    content = content.replace(youtubeUrlRegex, '\n\n:::youtube $1\n\n');
    return content;
  }, [post?.content]);

  if (!postId) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-400">Invalid Post URL</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-slate-400 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl">Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navigation />

      {/* Article Header */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/blog">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/[0.06] mb-6 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                {(post.author || "A").charAt(0)}
              </div>
              <span className="text-sm">{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {post.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-10 shadow-xl shadow-black/20">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-cyan-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#0d1225] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-xl
            prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400
            prose-li:text-slate-300
            prose-img:rounded-xl prose-img:border prose-img:border-white/[0.06]
          ">
            <Streamdown components={customComponents}>
              {processedContent}
            </Streamdown>
          </div>
        </div>
      </section>

      {/* Related Posts CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#0d1225]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-4 text-white">More Articles</h2>
            <p className="text-slate-400 mb-6">Explore more insights on AI, Space Tech, and Engineering.</p>
            <Link href="/blog">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl px-8 shadow-lg shadow-cyan-500/20">
                Read More Blog Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}