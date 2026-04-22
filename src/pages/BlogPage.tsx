import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { BookOpen, Star, ArrowRight, Bookmark, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const getIcon = (category: string) => {
    if (category === "RECOMMENDATIONS") return <Star className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  const filteredPosts = selectedCategory === "ALL" 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const renderBlogGrid = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground font-sans">Loading journal entries...</p>
        </div>
      );
    }
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-sans">No journal entries found in this category.</p>
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {filteredPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer flex flex-col h-full space-y-8">
            <div className="w-full aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-background relative shadow-2xl shadow-black/5 shrink-0">
              <img 
                src={post.featured_image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop&fm=webp"} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                <div className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-[10px] font-bold text-primary flex items-center gap-2 shadow-sm uppercase tracking-widest border border-white/20">
                  {getIcon(post.category)} {post.category}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-5 px-4 flex flex-col flex-1">
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.3em]">
                  {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                </span>
                <div className="h-px flex-1 bg-muted" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight shrink-0">
                {post.title}
              </h3>
              <p className="font-sans text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                {post.excerpt || post.content?.slice(0, 150) + "..."}
              </p>
              <div className="pt-4 flex items-center justify-between w-full shrink-0">
                <span className="flex items-center gap-3 font-sans font-bold text-primary uppercase text-[11px] tracking-widest border-b-2 border-primary/10 pb-1 group-hover:border-secondary transition-all">
                  Continue Reading <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <Bookmark className="w-5 h-5 text-muted hover:text-secondary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <InfoPageLayout 
      label="Reader's Journal"
      title="Nuria Insights"
      subtitle="Deep dives into Kenyan literature, habit-changing guides, and curated book recommendations for the modern reader."
    >
      <div className="space-y-16">
        {/* 🏷️ Filter Tabs */}
        <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mr-4">Filter By</span>
          {["ALL", "BOOK REVIEWS", "RECOMMENDATIONS"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-bold tracking-[0.1em] transition-all uppercase border ${
                selectedCategory === cat 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                  : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📰 Blog Grid */}
        {renderBlogGrid()}

        {/* 📚 Load More Placeholder */}
        <div className="pt-20 text-center border-t border-border">
          <p className="font-sans text-muted-foreground italic mb-8">You've reached the end of the current entries. Check back for fresh insights weekly.</p>
          <button className="px-12 py-5 bg-background border border-border rounded-2xl font-sans font-bold text-foreground text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
            Subscribe to Insights
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default BlogPage;
