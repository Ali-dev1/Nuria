import React, { useState } from "react";
import { Plus, Trash2, Edit, Search, User, AlertCircle, Save, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Author } from "@/hooks/useAuthors";

export const AuthorManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ["admin", "authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Author[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (author: Partial<Author>) => {
      // Ensure slug is generated
      const slug = author.slug || author.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const payload = {
        name: author.name,
        photo_url: author.photo_url || "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&auto=format&fit=crop",
        bio: author.bio || "",
        tags: author.tags || [],
        slug: slug
      };

      if (author.id) {
        const { error } = await supabase.from("authors").update(payload).eq("id", author.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("authors").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast({ title: "Author Saved", description: "The author spotlight has been updated successfully." });
      setIsModalOpen(false);
      setEditingAuthor(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("authors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast({ title: "Author Removed", description: "The author has been removed from the spotlight." });
    }
  });

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.bio.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Author Spotlight</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Manage featured authors and their literary collections</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search authors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-border rounded-xl"
            />
          </div>
          <Button 
            onClick={() => { setEditingAuthor({}); setIsModalOpen(true); }}
            className="bg-[#1B4332] text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-[#132c21]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Author
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">Loading...</div>
        ) : filteredAuthors.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-white rounded-3xl border border-dashed border-border">
            No authors found. Click "Add Author" to start featuring local talent.
          </div>
        ) : (
          filteredAuthors.map((author) => (
            <div key={author.id} className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden group">
              <div className="h-48 relative bg-muted overflow-hidden">
                <img 
                  src={author.photo_url} 
                  alt={author.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-xl font-bold">{author.name}</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {author.bio}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C2541A]">Featured</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingAuthor(author); setIsModalOpen(true); }}
                      className="p-2 text-muted-foreground hover:text-[#1B4332] hover:bg-[#1B4332]/5 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this author?")) {
                          deleteMutation.mutate(author.id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold font-display">{editingAuthor?.id ? "Edit Author" : "New Author"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author Name</label>
                <Input 
                  value={editingAuthor?.name || ""} 
                  onChange={e => setEditingAuthor({...editingAuthor, name: e.target.value})}
                  placeholder="e.g. Miguna Miguna"
                  className="bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Photo URL
                </label>
                <Input 
                  value={editingAuthor?.photo_url || ""} 
                  onChange={e => setEditingAuthor({...editingAuthor, photo_url: e.target.value})}
                  placeholder="https://..."
                  className="bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Biography</label>
                <Textarea 
                  value={editingAuthor?.bio || ""} 
                  onChange={e => setEditingAuthor({...editingAuthor, bio: e.target.value})}
                  placeholder="A short biography about the author..."
                  className="bg-muted/30 min-h-[120px] resize-none"
                />
              </div>

              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Books matching this author's exact name will automatically be grouped and displayed on their profile page.</p>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => saveMutation.mutate(editingAuthor as Partial<Author>)}
                disabled={saveMutation.isPending || !editingAuthor?.name}
                className="bg-[#1B4332] text-white hover:bg-[#132c21]"
              >
                {saveMutation.isPending ? "Saving..." : "Save Author"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
