import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.admin.getBlogPosts.useQuery();

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">InfinityX Insights</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Explore expert insights, AI trends, and cutting-edge technology articles from our community of innovators.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      {featuredPost && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Featured Article</h2>
            <Link href={`/blog/${featuredPost.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition cursor-pointer">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {featuredPost.imageUrl && (
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <CardHeader className="p-0">
                      <CardTitle className="text-3xl font-bold mb-2">
                        {featuredPost.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {featuredPost.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-slate-700 mb-6 line-clamp-3">
                        {featuredPost.summary || featuredPost.content.substring(0, 200)}...
                      </p>
                      <ButtonLink href={`/blog/${featuredPost.id}`} />
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* ALL POSTS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-slate-600 text-lg">
              No blog posts available yet.
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-8 text-slate-800">
                Latest Articles
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="hover:shadow-lg transition cursor-pointer flex flex-col h-full">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold mb-2 line-clamp-1">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 flex items-center gap-2">
                          <User className="w-4 h-4" /> {post.author} •{" "}
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-slate-600 text-sm line-clamp-3">
                          {post.summary || post.content.substring(0, 150)}...
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Want to contribute to InfinityX?</h2>
          <p className="text-blue-100 mb-8">
            Share your research, AI experiments, or learning insights with our global community of innovators.
          </p>
          <a
            href="mailto:infnityx.site@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p className="text-lg font-semibold">InfinityX EdTech Platform</p>
          <p className="text-blue-200">infnityx.site@gmail.com • +20 109 036 4947</p>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} InfinityX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ✅ Helper component for link button
function ButtonLink({ href }: { href: string }) {
  return (
    <Link href={href}>
      <div className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium">
        Read More <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
