import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, User, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Streamdown, Block } from "streamdown";
import { VideoEmbed } from "@/components/VideoEmbed";
import React, { useMemo } from "react";

const CustomBlock = React.memo((props: any) => {
  const contentStr = props.content?.trim() || "";
  if (contentStr.startsWith(":::youtube")) {
    const match = contentStr.match(/^:::youtube\s+([^ \n]+)/);
    if (match && match[1]) {
      return <VideoEmbed videoId={match[1]} />;
    }
  }
  return <Block {...props} />;
});
CustomBlock.displayName = "CustomBlock";
export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:id");
  const postId = params?.id || null;

  // FIX 1: Extract 'isLoading' from the query instead of hardcoding it
  const { data: posts = [], isLoading } = trpc.admin.getBlogPosts.useQuery();

  // FIX 2: Convert both IDs to String to ensure they match (e.g. "5" matches 5)
  const post = posts.find((p: any) => String(p.id) === String(postId));

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

  // 1. Check if ID exists in URL
  if (!postId) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600">Invalid Post URL</p>
        </div>
      </div>
    );
  }

  // 2. Show loading spinner WHILE data is fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  // 3. If data loaded but post is still missing, THEN show Not Found
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Post Not Found</h1>
          <p className="text-slate-600 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link href="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Article Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
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
        <div className="max-w-4xl mx-auto px-4">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <Streamdown BlockComponent={CustomBlock}>
              {processedContent}
            </Streamdown>
          </div>
        </div>
      </section>

      {/* Related Posts Link */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">More Articles</h2>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Read More Blog Posts
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 InfinityX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}