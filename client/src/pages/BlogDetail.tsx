import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";

// Custom YouTube embed renderer for markdown
function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-[#D8DDD8] shadow-lg shadow-black/5 aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

// Custom link renderer to make links interactive
function CustomLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (!href) return <span>{children}</span>;
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-[#6453C2] hover:text-[#5342AE] underline underline-offset-4 decoration-[#6453C2]/40 hover:decoration-[#6453C2] font-medium transition-colors cursor-pointer"
    >
      {children}
    </a>
  );
}

const customComponents = {
  a: ({ href, children, ...props }: any) => (
    <CustomLink href={href} {...props}>
      {children}
    </CustomLink>
  ),
  div: ({ className, children, ...props }: any) => {
    if (className?.includes("youtube-embed") && props["data-video-id"]) {
      return <YouTubeEmbed videoId={props["data-video-id"]} />;
    }
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
  p: ({ children, ...props }: any) => {
    if (typeof children === "string" && children.startsWith(":::youtube ")) {
      const match = children.match(/:::youtube\s+([^\s]+)/);
      if (match) {
        return <YouTubeEmbed videoId={match[1]} />;
      }
    }
    return <p {...props}>{children}</p>;
  },
};

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : 0;

  const {
    data: post,
    isLoading,
    isError: isApiError,
  } = trpc.admin.getBlogPostById.useQuery(
    { id: postId },
    {
      enabled: !isNaN(postId) && postId > 0,
      retry: 1,
    }
  );

  const isNotFound = !isLoading && !isApiError && post === null;

  useSEO({
    title: post ? `${post.title} | Infinity X Insights` : "Article | Infinity X Insights",
    description: post?.excerpt || "Read insightful engineering and AI analysis from Infinity X.",
    canonical: `https://infx.space/blog/${postId || ""}`,
    robots: isLoading ? undefined : post ? "index, follow" : "noindex, follow",
  });

  const processedContent = useMemo(() => {
    if (!post?.content) return "";
    let content = post.content;
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/gim;
    content = content.replace(youtubeUrlRegex, "\n\n:::youtube $1\n\n");
    return content;
  }, [post?.content]);

  if (!postId) {
    return (
      <div className="ix-page min-h-screen bg-[#F5F4EF] text-[#1F2925]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-[#5E6862]">Invalid Post URL</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="ix-page min-h-screen bg-[#F5F4EF] text-[#1F2925]">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6453C2]" />
        </div>
      </div>
    );
  }

  if (isApiError) {
    return (
      <div className="ix-page min-h-screen bg-[#F5F4EF] text-[#1F2925]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-[#1F2925] mb-2">Unable to Load Article</h1>
          <p className="text-[#5E6862] mb-6">A temporary error occurred while loading this article. Please try again shortly.</p>
          <Link href="/blog">
            <Button className="bg-[#6453C2] hover:bg-[#5342AE] text-white rounded-xl">Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="ix-page min-h-screen bg-[#F5F4EF] text-[#1F2925]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-[#1F2925] mb-2">Post Not Found</h1>
          <p className="text-[#5E6862] mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-[#6453C2] hover:bg-[#5342AE] text-white rounded-xl">Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ix-page min-h-screen bg-[#F5F4EF] text-[#1F2925]">
      <Navigation />

      {/* Article Header */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden border-b border-[#D8DDD8]/60">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/blog">
            <Button variant="ghost" className="text-[#5E6862] hover:text-[#1F2925] hover:bg-[#EAEDEA] mb-6 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-[#1F2925]">{post!.title}</h1>
          <div className="flex items-center gap-6 text-[#5E6862]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EFEBFA] border border-[#D8DDD8] flex items-center justify-center text-[#6453C2] text-xs font-bold">
                {(post!.author || "A").charAt(0)}
              </div>
              <span className="text-sm font-semibold">{post!.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#6453C2]" />
              {new Date(post!.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {post!.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-[#D8DDD8] mb-10 shadow-lg shadow-black/5">
              <img src={post!.imageUrl} alt={post!.title} className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none
            prose-headings:text-[#1F2925] prose-headings:font-bold
            prose-p:text-[#5E6862] prose-p:leading-relaxed
            prose-a:text-[#6453C2] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1F2925]
            prose-code:text-[#6453C2] prose-code:bg-[#EAEDEA] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white prose-pre:border prose-pre:border-[#D8DDD8] prose-pre:rounded-xl
            prose-blockquote:border-[#6453C2] prose-blockquote:text-[#5E6862]
            prose-li:text-[#5E6862]
            prose-img:rounded-xl prose-img:border prose-img:border-[#D8DDD8]
          "
          >
            <Streamdown components={customComponents}>{processedContent}</Streamdown>
          </div>
        </div>
      </section>

      {/* Related Posts CTA */}
      <section className="py-16 border-t border-[#D8DDD8] bg-[#EAEDEA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white border border-[#D8DDD8] rounded-2xl p-10 shadow-sm">
            <h2 className="text-2xl font-bold mb-3 text-[#1F2925]">More Articles</h2>
            <p className="text-[#5E6862] mb-6">Explore more insights on AI, Space Tech, and Engineering.</p>
            <Link href="/blog">
              <Button className="bg-[#6453C2] hover:bg-[#5342AE] text-white rounded-xl px-8 shadow-md shadow-[#6453C2]/20">
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