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
      toast({ title: "Profile updated", description: "Author data has been saved successfully." });
      setIsModalOpen(false);
      setEditingAuthor(null);
    },
    onError: (error: any) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  });

  const deleteAuthor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author profile?")) return;
    const { error } = await supabase.from("authors").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast({ title: "Author deleted", description: "The profile has been removed." });
    } else {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Authors</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage author profiles and biographies</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search authors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-border rounded-xl text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditingAuthor({}); setIsModalOpen(true); }}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Author
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map(() => <div key={crypto.randomUUID()} className="h-64 bg-muted animate-pulse rounded-2xl" />)
        ) : (
          filteredAuthors.map((author) => (
            <div key={author.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
              <div className="h-40 relative bg-muted overflow-hidden">
                <img src={author.photo_url || "/placeholder.svg"} alt={author.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-3 left-4 font-bold text-lg text-white">{author.name}</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded">Featured Author</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingAuthor(author); setIsModalOpen(true); }} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteAuthor(author.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white shrink-0">
              <h3 className="text-lg font-bold text-foreground">{editingAuthor?.id ? "Edit Author" : "New Author"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Photo</label>
                <ImageUploader 
                  value={editingAuthor?.photo_url} 
                  onChange={(url) => setEditingAuthor(prev => ({ ...prev!, photo_url: url }))}
                  bucket="author-photos"
                  folder="author-portraits"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="author-name-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <Input 
                  id="author-name-input"
                  value={editingAuthor?.name || ""} 
                  onChange={e => setEditingAuthor(prev => ({ ...prev!, name: e.target.value }))}
                  placeholder="e.g. Joel Gitau"
                  className="bg-white h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="author-bio-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Biography</label>
                <Textarea 
                  id="author-bio-input"
                  value={editingAuthor?.bio || ""} 
                  onChange={e => setEditingAuthor(prev => ({ ...prev!, bio: e.target.value }))}
                  placeholder="Write a brief bio..."
                  className="bg-white min-h-[120px] rounded-xl resize-none leading-relaxed text-sm"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/5 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">Cancel</button>
              <button 
                onClick={() => saveMutation.mutate(editingAuthor!)}
                disabled={saveMutation.isPending || !editingAuthor?.name}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
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
