import { useState } from "react";
import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { BookOpen, Newspaper, Star, ArrowRight, Bookmark } from "lucide-react";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const posts = [
    {
      title: "Books That Teach You a Skill & Idea or Practice",
      category: "BOOK REVIEWS",
      date: "Nov 28, 2023",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
      snippet: "A book that teaches you a skill and an idea or practice is more than just a source of information. It is also a guide...",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "Nuria Top 100 Kenyan Books",
      category: "RECOMMENDATIONS",
      date: "Feb 08, 2023",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
      snippet: "Discover the definitive list of Kenya's most impactful literary works as curated by our experts...",
      icon: <Star className="w-4 h-4" />
    },
    {
      title: "Habit Changing Books to Read in 2022",
      category: "RECOMMENDATIONS",
      date: "Jan 13, 2022",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop",
      snippet: "A young woman walks into a laboratory. Over the past two years, she has transformed almost every area of her life...",
      icon: <Star className="w-4 h-4" />
    },
    {
      title: "Elements of Godlessness in Christianity and Islam",
      category: "BOOK REVIEWS",
      date: "Jul 23, 2021",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
      snippet: "Provocative Book. Know both sides of the story. A deep dive into the theological arguments presented by Rev Kamau wa Macharia...",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "Must Read Books Written Dr. Miguna",
      category: "RECOMMENDATIONS",
      date: "Jul 09, 2021",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      snippet: "From 'Kidneys for the King' to 'Disgrace', explore the controversial and powerful works of Dr. Miguna Miguna...",
      icon: <Star className="w-4 h-4" />
    },
    {
      title: "Making Cents by Waceke Nduati",
      category: "BOOK REVIEWS",
      date: "Jul 09, 2021",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      snippet: "Brief Summary: My story entailed what I was told about money as a child, what I saw and experienced with money...",
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  const filteredPosts = selectedCategory === "ALL" 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  return (
    <InfoPageLayout 
      label="Reader's Journal"
      title="Nuria Insights"
      subtitle="Deep dives into Kenyan literature, habit-changing guides, and curated book recommendations for the modern reader."
    >
      <div className="space-y-16">
        {/* 🏷️ Filter Tabs */}
        <div className="flex flex-wrap items-center gap-4 border-b border-[#E5E0D8] pb-6">
          <span className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mr-4">Filter By</span>
          {["ALL", "BOOK REVIEWS", "RECOMMENDATIONS"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-bold tracking-[0.1em] transition-all uppercase border ${
                selectedCategory === cat 
                  ? "bg-[#1B4332] text-white border-[#1B4332] shadow-xl shadow-[#1B4332]/20" 
                  : "bg-white border-[#E5E0D8] text-[#6B7280] hover:border-[#1B4332] hover:text-[#1B4332]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📰 Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredPosts.map((post, idx) => (
            <Link to={`/blog/${idx}`} key={idx} className="group cursor-pointer flex flex-col h-full space-y-8">
              <div className="w-full aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-[#FAF7F2] relative shadow-2xl shadow-black/5 shrink-0">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <div className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#1B4332] flex items-center gap-2 shadow-sm uppercase tracking-widest border border-white/20">
                    {post.icon} {post.category}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-5 px-4 flex flex-col flex-1">
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-sans text-[11px] font-bold text-[#C2541A] uppercase tracking-[0.3em]">{post.date}</span>
                  <div className="h-px flex-1 bg-[#E5E0D8]" />
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1A1A] group-hover:text-[#1B4332] transition-colors leading-tight shrink-0">
                  {post.title}
                </h3>
                <p className="font-sans text-[#6B7280] leading-relaxed line-clamp-3 flex-1">
                  {post.snippet}
                </p>
                <div className="pt-4 flex items-center justify-between w-full shrink-0">
                  <span className="flex items-center gap-3 font-sans font-bold text-[#1B4332] uppercase text-[11px] tracking-widest border-b-2 border-[#1B4332]/10 pb-1 group-hover:border-[#C2541A] transition-all">
                    Continue Reading <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <Bookmark className="w-5 h-5 text-[#E5E0D8] hover:text-[#C2541A] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 📚 Load More Placeholder */}
        <div className="pt-20 text-center border-t border-[#E5E0D8]">
          <p className="font-sans text-[#6B7280] italic mb-8">You've reached the end of the current entries. Check back for fresh insights weekly.</p>
          <button className="px-12 py-5 bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl font-sans font-bold text-[#1A1A1A] text-[11px] uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
            Subscribe to Insights
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default BlogPage;
