import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { CheckCircle2, Award, Rocket, Target, Users, BookOpen, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <InfoPageLayout 
      label="Our Journey" 
      title="The Nuria Story"
      subtitle="Discover how a passion for literature evolved into Kenya's premier digital bookstore and a vibrant community for African authors."
    >
      <div className="space-y-24">
        {/* ✨ Hero Section with Stats Overlay */}
        <section className="relative">
          <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative min-h-[500px] flex items-center shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.3em] mb-4 block">Who We Are</span>
              <h2 className="font-display text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                More than just a bookstore. <br />
                <span className="text-secondary">We are a movement.</span>
              </h2>
              <p className="font-sans text-xl text-white/80 leading-relaxed mb-10">
                Founded in 2015, Nuria was born out of a simple but powerful realization: Kenya needed a digital home for high-impact literature that reflects its own soul.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Ethical Sourcing
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Author First
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar (Absolute below hero on LG) */}
          <div className="lg:absolute -bottom-16 left-1/2 lg:-translate-x-1/2 w-full max-w-5xl mt-8 lg:mt-0 px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { val: "2015", label: "Est. Year", icon: Rocket },
                { val: "2,000+", label: "Daily Readers", icon: Users },
                { val: "15k+", label: "Book Titles", icon: BookOpen },
                { val: "700+", label: "Local Authors", icon: Award }
              ].map((stat, i) => (
                <div key={stat.label} className="bg-white p-8 rounded-3xl border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-center group hover:border-secondary/30 transition-all">
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-display text-3xl font-bold text-foreground">{stat.val}</p>
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 📖 The Narrative Timeline */}
        <section className="pt-20 lg:pt-32">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.3em]">The Timeline</span>
              <h2 className="font-display text-5xl font-bold text-foreground mt-4 leading-tight">
                Our evolution, <br />
                chapter by chapter.
              </h2>
              <div className="w-[100px] h-[4px] bg-secondary mt-6 rounded-full" />
              <p className="mt-8 font-sans text-muted-foreground text-lg leading-relaxed max-w-sm">
                From a single shelf to Kenya's leading online marketplace—our story is one of persistence and a love for the written word.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-12">
              {[
                {
                  year: "2015",
                  title: "The Seed is Sown",
                  content: "Nuria was established to bridge the gap between Kenyan readers and the literature they crave. We started with a focus on Self-help and African Literature."
                },
                {
                  year: "2018",
                  title: "Digital Transformation",
                  content: "We expanded our digital reach, implementing a seamless online shopping experience that allowed us to serve readers in all 47 counties of Kenya."
                },
                {
                  year: "2021",
                  title: "Empowering Authors",
                  content: "Launching our vendor marketplace, we became the first platform in the region to offer authors a direct, low-commission path to their readers."
                },
                {
                  year: "2025",
                  title: "The Honest Store",
                  content: "Today, we stand as 'The Honest Store'—a haven for over 15,000 titles and a thriving community of over 700 local authors and publishers."
                }
              ].map((chapter, i) => (
                <div key={chapter.year} className="relative pl-12 border-l-2 border-border group pb-4">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary group-hover:border-secondary transition-colors" />
                  <span className="text-[12px] font-bold text-secondary uppercase tracking-widest">{chapter.year}</span>
                  <h4 className="font-display text-2xl font-bold text-foreground mt-2 mb-4 group-hover:text-primary transition-colors">{chapter.title}</h4>
                  <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                    {chapter.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🏔️ Core Values */}
        <section className="bg-white rounded-[4rem] p-12 lg:p-20 border border-border">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground">Our Core Values</h2>
            <p className="mt-4 font-sans text-muted-foreground text-lg">The principles that guide every decision we make.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Author First",
                desc: "We believe authors are the backbone of culture. Our platform is designed to maximize their earnings and visibility.",
                icon: Target
              },
              {
                title: "Curation Excellence",
                desc: "We don't just sell books; we curate experiences. Every title in our library meets our standards for impact and quality.",
                icon: Award
              },
              {
                title: "Radical Transparency",
                desc: "From pricing to vendor payouts, we operate with honesty. It's why we're known as The Honest Store.",
                icon: Globe
              }
            ].map((value, i) => (
              <div key={value.title} className="text-center space-y-6">
                <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto transition-transform hover:rotate-6 hover:bg-secondary/5">
                  <value.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">{value.title}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default AboutPage;
