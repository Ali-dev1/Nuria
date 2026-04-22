import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, ArrowRight, BookOpen, Globe, Heart, 
  Baby, Lightbulb, Smartphone, Shirt, ChevronRight,
} from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { CATEGORIES } from "@/lib/constants";
import { useProducts } from "@/hooks/useProducts";
import { useAuthors } from "@/hooks/useAuthors";
import { Skeleton } from "@/components/shared/Skeleton";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Lightbulb, Baby, Heart, Globe, Smartphone, Shirt,
};

const BookGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {['isk1', 'isk2', 'isk3', 'isk4', 'isk5', 'isk6', 'isk7', 'isk8'].map((id) => (
      <div key={id} className="space-y-3">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

const SectionHeading = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-10">
    <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{title}</h2>
    <div className="w-[80px] h-[4px] bg-secondary mt-4 rounded-full" />
  </div>
);

const Index = () => {
  const { data: featuredData, isLoading: isFeaturedLoading } = useProducts({ featured: true, limit: 8 });
  const { data: newArrivalsData, isLoading: isNewLoading } = useProducts({ limit: 8 });
  const { isLoading: isBestLoading } = useProducts({ limit: 8 });
  const { data: authors = [], isLoading: loadingAuthors } = useAuthors();

  const featured = featuredData?.products || [];
  const newArrivals = newArrivalsData?.products || [];

  const isLoading = isFeaturedLoading || isNewLoading || isBestLoading;

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [api]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const slides = [
    {
      id: 1,
      title: "New Arrivals",
      subtitle: "Discover the latest titles added to our collection this week.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=60&w=1200&auto=format&fit=crop&fm=webp",
      cta: "Shop New Releases",
      link: "/books?sort=newest"
    },
    {
      id: 2,
      title: "Kenyan Classics",
      subtitle: "Explore timeless works from Kenya's most celebrated authors.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=60&w=1200&auto=format&fit=crop&fm=webp",
      cta: "Explore Local Literature",
      link: "/books?category=african-literature"
    },
    {
      id: 3,
      title: "Children's Corner",
      subtitle: "Nurturing young minds with stories that inspire and educate.",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=60&w=1200&auto=format&fit=crop&fm=webp",
      cta: "Browse Children's Books",
      link: "/books?category=children"
    },
    {
      id: 4,
      title: "Academic Excellence",
      subtitle: "Primary, secondary, and tertiary resources for every learner.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=60&w=1200&auto=format&fit=crop&fm=webp",
      cta: "Shop Academic Texts",
      link: "/books?category=education"
    },
    {
      id: 5,
      title: "Gifts of Knowledge",
      subtitle: "Give the gift of reading with our premium gift card collection.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=60&w=1200&auto=format&fit=crop&fm=webp",
      cta: "Buy A Gift Card",
      link: "/gift-card"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative group">
        <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    width="1600" 
                    height="650" 
                    loading={slide.id === 1 ? "eager" : "lazy"} 
                    fetchPriority={slide.id === 1 ? "high" : "auto"} 
                    sizes="100vw"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.7]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="container-nuria relative h-full flex flex-col justify-center items-start text-left">
                    <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-700">
                      <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        {slide.title}
                      </h1>
                      <p className="text-white/90 font-sans text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <Link to={slide.link}>
                        <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-7 rounded-lg text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-2xl">
                          {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 left-4 lg:left-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="h-12 w-12 border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/40" />
          </div>
          <div className="absolute top-1/2 right-4 lg:right-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselNext className="h-12 w-12 border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-black/40" />
          </div>
        </Carousel>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
          <form onSubmit={handleSearch} className="relative group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 21,000+ Titles, Authors, Genres..."
              className="w-full pl-16 pr-4 py-7 bg-white text-foreground rounded-2xl text-lg font-sans placeholder:text-gray-400 border-none ring-0 focus:ring-4 focus:ring-secondary/20 transition-all outline-none"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm tracking-widest hover:bg-primary/90 transition-all hidden sm:block"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      <section className="hidden md:block container-nuria pt-32 pb-16">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading label="DISCOVER" title="Shop by Category" />
          <Link to="/books" className="text-sm text-secondary font-sans font-bold flex items-center gap-1 hover:underline shrink-0 mb-10 uppercase tracking-widest">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || BookOpen;
            return (
              <Link
                key={cat.id}
                to={`/books?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-sm border border-border/50 hover:border-secondary hover:bg-background group transition-all duration-300"
              >
                <div className="p-3 rounded-full bg-primary/5 group-hover:bg-secondary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <span className="font-sans text-[13px] font-bold text-foreground text-center leading-tight">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-nuria py-16">
        <div className="flex items-end justify-between">
          <SectionHeading label="CURATED" title="Featured Titles" />
          <Link to="/books?featured=true" className="text-sm text-secondary font-sans font-bold flex items-center gap-1 hover:underline shrink-0 mb-10 uppercase tracking-widest">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? <BookGridSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.slice(0, 8).map((product) => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-background py-24 sm:py-32 overflow-hidden border-y border-border">
        <div className="container-nuria">
          <div className="flex flex-col items-center text-center space-y-4 mb-16 sm:mb-20">
            <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.3em]">Supporting Our Own</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground max-w-2xl leading-tight">
              Local Authors <br />Spotlight
            </h2>
            <div className="w-[80px] h-[4px] bg-secondary mx-auto mt-6 rounded-full" />
          </div>

          <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {loadingAuthors ? (
              ['isk9', 'isk10', 'isk11', 'isk12'].map(id => <Skeleton key={id} className="shrink-0 w-[85vw] sm:w-[45vw] lg:w-[calc(25%-1.5rem)] h-[450px] rounded-[2rem]" />)
            ) : authors.map((author: any) => (
              <Link 
                key={author.slug}
                to={`/author/${author.slug}`}
                className="shrink-0 w-[85vw] sm:w-[45vw] lg:w-[calc(25%-1.5rem)] snap-center sm:snap-start group bg-white rounded-[2rem] border border-border overflow-hidden hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                <div className="h-[300px] sm:h-[350px] overflow-hidden relative bg-muted">
                  <img 
                    src={author.photo_url.includes("unsplash.com") ? `${author.photo_url}&fm=webp&q=60&w=400` : author.photo_url} 
                    alt={author.name}
                    width="600"
                    height="800"
                    loading="lazy"
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center bg-white border-t border-border">
                  <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{author.name}</h3>
                  <span className="mt-5 flex items-center gap-2 font-sans font-bold text-muted-foreground group-hover:text-secondary uppercase text-[10px] tracking-widest transition-colors">
                    Read Profile <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-nuria py-16">
        <div className="flex items-center justify-between mb-12">
          <SectionHeading label="LATEST" title="New Arrivals" />
          <Link to="/books" className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 uppercase tracking-widest">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? <BookGridSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {newArrivals.map((product) => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container-nuria py-20">
        <div className="bg-background border-2 border-dashed border-primary/20 rounded-[3rem] p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Are you an Author or Publisher?</h2>
            <p className="font-sans text-muted-foreground text-lg">
              Join Kenya's fastest-growing online bookstore. Reach thousands of readers across the country and manage your sales with our transparent vendor dashboard.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              to="/vendor/guide"
              className="inline-flex items-center gap-2 px-10 py-5 bg-secondary text-white font-sans font-bold rounded-xl hover:bg-secondary/90 transition-all text-sm uppercase tracking-widest shadow-xl shadow-secondary/20"
            >
              Start Selling <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
