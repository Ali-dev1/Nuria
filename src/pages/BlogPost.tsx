import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Share2, Bookmark } from "lucide-react";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";

const BLOG_POSTS = [
  {
    id: "0",
    title: "Books That Teach You a Skill & Idea or Practice",
    category: "BOOK REVIEWS",
    date: "Nov 28, 2023",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    content: `
      A book that teaches you a skill and an idea or practice is more than just a source of information. It is also a guide, a mentor, and a companion on your journey of learning and growth. In this article, we will explore some of the best books that fit this description, and how they can enrich your life.
      
      Whether you want to learn how to code, how to write, how to meditate, or how to cook, there is a book for you. But not all books are created equal. Some books just give you facts and facts are easily forgotten. Best books are the ones that give you principles, frameworks, and stories that make the learning stick.
      
      We have compiled a list of our top five favorites that have genuinely shifted how we approach our daily work and creative endeavors. Let's dive in.
    `,
    author: "Nuria Editorial",
    readTime: "5 min"
  },
  {
    id: "1",
    title: "Nuria Top 100 Kenyan Books",
    category: "RECOMMENDATIONS",
    date: "Feb 08, 2023",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    content: `
      Discover the definitive list of Kenya's most impactful literary works as curated by our experts. From historical memoirs recounting the dawn of independence to contemporary afrofuturist novels, Kenyan literature is as vibrant and diverse as its landscapes.

      We spent three months consulting with local authors, literary professors, and voracious readers across Nairobi to create a definitive reading list. If you are looking to build a library that truly represents the heart of East Africa, these 100 titles are your starting point.
    `,
    author: "Nuria Curators",
    readTime: "12 min"
  },
  {
    id: "2",
    title: "Habit Changing Books to Read in 2022",
    category: "RECOMMENDATIONS",
    date: "Jan 13, 2022",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    content: `
      A young woman walks into a laboratory. Over the past two years, she has transformed almost every area of her life. She quit smoking, ran a marathon, and got promoted. What drove these massive changes? Understanding the power of habit.

      In our fast-paced modern world, motivation is fleeting but habits are enduring. We explore the core texts—like James Clear's Atomic Habits and Charles Duhigg's The Power of Habit—to distill the absolute best strategies for rewiring your brain.
    `,
    author: "Nuria Editorial",
    readTime: "8 min"
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id) || BLOG_POSTS[0]; // fallback to first if id is invalid for mock
  
  const paragraphs = post.content.split('\n\n').filter(p => p.trim() !== "");
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-background min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 flex items-center justify-center pt-20">
          <div className="container-nuria text-center text-white max-w-4xl px-4">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>
            
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#A1440B] text-white text-[10px] font-bold uppercase tracking-widest">
                {post.category}
              </span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-xs font-sans font-medium text-white/80">
              <span className="uppercase tracking-widest">By {post.author}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="uppercase tracking-widest">{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="uppercase tracking-widest text-[#A1440B]">{post.readTime} read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="container-nuria py-20 lg:py-32 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Sticky Sidebar for Socials */}
        <div className="hidden lg:block w-16 shrink-0 relative">
          <div className="sticky top-40 flex flex-col items-center gap-6">
            <div className="w-px h-12 bg-[#E5E0D8]" />
            <button className="w-10 h-10 rounded-full border border-[#E5E0D8] bg-white text-[#6B7280] flex items-center justify-center hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all" aria-label="Save this article">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full border border-[#E5E0D8] bg-white text-[#6B7280] flex items-center justify-center hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all" aria-label="Share this article">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="w-px h-12 bg-[#E5E0D8]" />
          </div>
        </div>

        {/* Formatted Content Area */}
        <article className="max-w-3xl w-full mx-auto font-serif text-lg md:text-xl leading-relaxed text-[#1A1A1A] space-y-8">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display">
              {paragraph.trim()}
            </p>
          ))}
          
          <div className="my-16 p-8 md:p-12 bg-[#FAF7F2] rounded-3xl border border-[#E5E0D8] border-l-4 border-l-[#A1440B]">
            <p className="font-display text-2xl italic font-bold text-[#1B4332] leading-tight">
              "A reader lives a thousand lives before he dies. The man who never reads lives only one."
            </p>
            <span className="block mt-4 text-[10px] uppercase tracking-widest font-bold text-[#A1440B]">— George R.R. Martin</span>
          </div>
          
          <p>
            We hope this insight guides you to your next great read. Be sure to check our store for stock availability and leave a review once you've turned the final page. Happy reading!
          </p>
        </article>
      </section>

      {/* Keep exploring / Read Next */}
      <section className="bg-[#FAF7F2] py-24 border-t border-[#E5E0D8]">
        <div className="container-nuria">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Continue Reading</h2>
            <Link to="/blog" className="text-[10px] font-sans font-bold text-[#1B4332] hover:text-[#A1440B] transition-colors flex items-center gap-2 uppercase tracking-widest">
              View All Entries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {relatedPosts.map((related) => (
              <Link to={`/blog/${related.id}`} key={related.id} className="group bg-white rounded-3xl overflow-hidden border border-[#E5E0D8] hover:border-[#1B4332] transition-colors flex flex-col shadow-sm hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img src={related.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={related.title} />
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-bold text-[#A1440B] uppercase tracking-widest">{related.category}</span>
                  <h3 className="font-display text-2xl font-bold mt-2 text-[#1A1A1A] group-hover:text-[#1B4332] transition-colors">{related.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
