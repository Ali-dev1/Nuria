import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import type { Product } from "@/lib/types";

// Mock Data for Authors
const AUTHOR_DB: Record<string, any> = {
  "ngugi": {
    name: "Ngũgĩ wa Thiong'o",
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=600&auto=format&fit=crop",
    bio: "Ngũgĩ wa Thiong'o is a Kenyan author and academic who writes primarily in Gikuyu. His work includes novels, plays, short stories, and essays, ranging from literary and social criticism to children's literature. He is considered one of East Africa's most prominent and influential writers, known for his compelling narratives that intertwine anti-colonial struggles with deep psychological character studies.",
    tags: ["Fiction", "Post-colonialism", "Essays"]
  },
  "chimamanda": {
    name: "Chimamanda Ngozi Adichie",
    photo: "https://images.unsplash.com/photo-1531123414708-f152d5e15961?q=80&w=600&auto=format&fit=crop",
    bio: "Chimamanda Ngozi Adichie is a Nigerian writer whose works range from novels to short stories to nonfiction. She has been described in The Times Literary Supplement as the most prominent of a 'procession of critically acclaimed young anglophone authors successfully attracting a new generation of readers to African literature'. Her powerful narratives often focus on the Biafran war, feminism, and identity.",
    tags: ["Feminism", "Historical Fiction", "Essays"]
  },
  "chinua-achebe": {
    name: "Chinua Achebe",
    photo: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?q=80&w=600&auto=format&fit=crop",
    bio: "Chinua Achebe was a Nigerian novelist, poet, and critic who is regarded as the dominant figure of modern African literature. His first novel and magnum opus, Things Fall Apart, occupies a pivotal place in African literature and remains the most widely studied, translated, and read African novel. He sought to escape the colonial perspective that framed African history and literature.",
    tags: ["Classic Literature", "Poetry", "Criticism"]
  },
  "wangari-maathai": {
    name: "Wangari Maathai",
    photo: "https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=600&auto=format&fit=crop",
    bio: "Wangari Muta Maathai was a Kenyan social, environmental, and political activist and the first African woman to win the Nobel Peace Prize. Her writing powerfully advocates for sustainable development, democracy, and peace. Through her deeply personal memoirs and essays, she challenges readers to take individual responsibility for reshaping the environmental and political landscapes of their nations.",
    tags: ["Activism", "Memoir", "Environment"]
  }
};

// Mock Book Data (generic books assigned to author)
const getMockBooks = (authorName: string): Product[] => {
  return [
    {
      id: "1",
      title: `${authorName}'s Masterpiece`,
      author: authorName,
      price: 2500,
      originalPrice: 3000,
      format: "physical",
      images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"],
      category: "Fiction",
      stock: 12,
      slug: "masterpiece-1",
      description: "A compelling story spanning generations.",
      isFeatured: true,
      rating: 4.8,
      reviewCount: 156,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Echoes of the Savannah",
      author: authorName,
      price: 1800,
      format: "physical",
      images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop"],
      category: "Essays",
      stock: 5,
      slug: "echoes-2",
      description: "Deep reflections on home and identity.",
      isFeatured: false,
      rating: 4.5,
      reviewCount: 89,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "The Silent Drum",
      author: authorName,
      price: 3200,
      format: "physical",
      images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"],
      category: "Fiction",
      stock: 8,
      slug: "silent-drum-3",
      description: "A historical fiction taking root in the early 20th century.",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 312,
      createdAt: new Date().toISOString()
    }
  ];
};

const AuthorPage = () => {
  const { slug } = useParams();
  const author = slug ? AUTHOR_DB[slug] : null;

  if (!author) {
    return (
      <div className="container-nuria py-32 text-center">
        <h2 className="text-3xl font-bold font-display text-primary">Author not found</h2>
        <Link to="/" className="text-[#C2541A] font-bold uppercase text-[10px] tracking-widest mt-4 inline-block hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const books = getMockBooks(author.name);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Profile Section */}
      <section className="bg-[#FAF7F2] border-b border-[#E5E0D8] pt-16 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B4332]/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        <div className="container-nuria relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#C2541A] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl">
              <img src={author.photo} alt={author.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {author.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-white border border-[#E5E0D8] rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-[#1B4332]">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#1A1A1A] leading-tight">
                {author.name}
              </h1>
              <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
                {author.bio}
              </p>
              
              <div className="pt-4 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl text-[#1A1A1A]">{books.length}</span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Published Works</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Books grid */}
      <section className="container-nuria py-20 bg-background relative z-20 -mt-8">
        <div className="flex items-center gap-3 mb-10">
          <BookOpen className="w-6 h-6 text-[#1B4332]" />
          <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Books by {author.name.split(' ')[0]}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {books.map((product) => (
            <BookCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AuthorPage;
