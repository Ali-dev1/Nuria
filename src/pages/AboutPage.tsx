import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { CheckCircle2, Award, Rocket, Target, Users, BookOpen, Globe, Quote } from "lucide-react";

const AboutPage = () => {
  return (
    <InfoPageLayout 
      label="Our Journey" 
      title="The Nuria Story"
      subtitle="Discover how a passion for literature evolved into Kenya's premier digital bookstore and a vibrant community for African authors."
    >
      <div className="space-y-32">
        {/* Expanded Hero Section */}
        <section className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                <Users className="w-3.5 h-3.5" /> Founded in 2015
              </div>
              <h2 className="font-display text-5xl lg:text-7xl font-bold text-foreground leading-[1.1]">
                More than just a bookstore. <br />
                <span className="text-secondary italic">We are a movement.</span>
              </h2>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-xl">
                Founded in 2015, Nuria was born out of a simple but powerful realization: Kenya needed a digital home for high-impact literature that reflects its own soul.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Ethical Sourcing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Author First</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] bg-muted rounded-[4rem] overflow-hidden shadow-2xl shadow-black/10">
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Reading culture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl border border-border shadow-2xl hidden md:block max-w-[280px]">
                <Quote className="w-8 h-8 text-secondary mb-4 opacity-50" />
                <p className="font-sans text-sm italic text-muted-foreground leading-relaxed">
                  "Nuria has redefined how we access local stories. It's not just a shop, it's a sanctuary for African voices."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-primary rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {[
              { val: "2015", label: "Est. Year", icon: Rocket },
              { val: "50k+", label: "Monthly Readers", icon: Users },
              { val: "23k+", label: "Book Titles", icon: BookOpen },
              { val: "1.2k+", label: "African Authors", icon: Award }
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                  <stat.icon className="w-7 h-7 text-secondary" />
                </div>
                <p className="font-display text-4xl lg:text-5xl font-bold">{stat.val}</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Narrative Chapters */}
        <section>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">Our evolution, chapter by chapter.</h2>
            <p className="font-sans text-muted-foreground text-lg">From a single shelf to Kenya's leading online marketplace.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
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
                title: "African Excellence",
                content: "Today, we stand as the Home of African Books—a haven for over 23,000 titles and a thriving community of local authors and publishers."
              }
            ].map((chapter) => (
              <div key={chapter.year} className="bg-white p-10 lg:p-12 rounded-[3rem] border border-border hover:border-primary/20 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-3xl font-display font-black text-primary/10 group-hover:text-primary/20 transition-colors">{chapter.year}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h4 className="font-display text-2xl font-bold text-foreground mb-4">{chapter.title}</h4>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {chapter.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values - Horizontal Cards */}
        <section className="bg-muted/30 rounded-[4rem] p-12 lg:p-20">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
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
                title: "Transparency",
                desc: "From pricing to vendor payouts, we operate with honesty. It's why we're known as the Home of African Books.",
                icon: Globe
              }
            ].map((value) => (
              <div key={value.title} className="space-y-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-bold text-foreground">{value.title}</h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default AboutPage;
