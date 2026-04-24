import React, { useState } from "react";
import { Plus, Trash2, Edit, Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "./ImageUploader";

interface Author {
  id: string;
  name: string;
  photo_url: string;
  bio: string;
  tags?: string[];
  slug: string;
  created_at: string;
}

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
      const slug = author.slug || author.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const payload = {
        name: author.name,
        photo_url: author.photo_url || "",
        bio: author.bio || "",
        slug: slug
      };

      let result;
      if (author.id) {
        result = await supabase.from("authors").update(payload).eq("id", author.id);
      } else {
        result = await supabase.from("authors").insert([payload]);
      }
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast({ title: "Profile Synchronized", description: "Author data has been updated in the registry." });
      setIsModalOpen(false);
      setEditingAuthor(null);
    },
    onError: (error: any) => {
      toast({ title: "Registry Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteAuthor = async (id: string) => {
    if (!confirm("Confirm permanent removal of this author profile?")) return;
    const { error } = await supabase.from("authors").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast({ title: "Profile Purged" });
    }
  };

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Author Spotlight</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Manage featured literary profiles</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Filter names…" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-border rounded-xl"
            />
          </div>
          <Button 
            onClick={() => { setEditingAuthor({}); setIsModalOpen(true); }}
            className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Author
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded-[2rem]" />)
        ) : (
          filteredAuthors.map((author) => (
            <div key={author.id} className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden group">
              <div className="h-48 relative bg-muted overflow-hidden">
                <img src={author.photo_url} alt={author.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-6 font-display text-xl font-bold text-white">{author.name}</h3>
              </div>
              <div className="p-6 flex items-center justify-between border-t border-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Featured Profile</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingAuthor(author); setIsModalOpen(true); }} className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteAuthor(author.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-muted/5 shrink-0">
              <h3 className="text-xl font-black text-foreground tracking-tight">{editingAuthor?.id ? "Edit Identity" : "Register Author"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-6 h-6 text-muted-foreground" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Author Image</label>
                <ImageUploader 
                  value={editingAuthor?.photo_url} 
                  onChange={(url) => setEditingAuthor(prev => ({ ...prev!, photo_url: url }))}
                  bucket="author-photos"
                  folder="author-portraits"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <Input 
                  value={editingAuthor?.name || ""} 
                  onChange={e => setEditingAuthor(prev => ({ ...prev!, name: e.target.value }))}
                  placeholder="e.g. Miguna Miguna"
                  className="bg-muted/30 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Narrative Biography</label>
                <Textarea 
                  value={editingAuthor?.bio || ""} 
                  onChange={e => setEditingAuthor(prev => ({ ...prev!, bio: e.target.value }))}
                  placeholder="Tell their story..."
                  className="bg-muted/30 min-h-[150px] rounded-xl resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-8 border-t border-border bg-muted/10 flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Cancel</button>
              <button 
                onClick={() => saveMutation.mutate(editingAuthor!)}
                disabled={saveMutation.isPending || !editingAuthor?.name}
                className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
