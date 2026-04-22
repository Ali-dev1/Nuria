import React, { useState } from "react";
import { Plus, Edit3, Trash2, Calendar, Tag, FileText, Image as ImageIcon, X, Save, Zap, ExternalLink, ChevronRight, MoreHorizontal } from "lucide-react";
import { useAdminPosts } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const BlogManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useAdminPosts();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const invalidate = (key: any[]) => queryClient.invalidateQueries({ queryKey: key });

  const deletePost = async (id: string) => {
    if (!confirm("Confirm permanent removal of this editorial asset?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) {
      invalidate(["admin", "posts"]);
      toast({ title: "Editorial Purged", description: "The blog post has been removed from the registry." });
    }
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const postData = {
      title: formData.get("title"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt"),
      image_url: formData.get("image_url"),
      category: formData.get("category"),
      slug: (formData.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      author: "Nuria Editorial"
    };

    const { error } = editingPost 
      ? await supabase.from("blog_posts").update(postData).eq("id", editingPost.id)
      : await supabase.from("blog_posts").insert([postData]);

    if (error) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } else {
      invalidate(["admin", "posts"]);
      setShowEditor(false);
      setEditingPost(null);
      toast({ title: "Registry Synchronized", description: editingPost ? "Editorial updated successfully." : "New editorial asset registered." });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Editorial Nexus</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Authorized platform content and publication oversight</p>
        </div>
        
        <button 
          onClick={() => { setEditingPost(null); setShowEditor(true); }} 
          className="px-6 py-3 bg-[#1B4332] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#132c21] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Create Editorial
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={`skeleton-${i}`} className="h-40 bg-muted/50 rounded-[2rem] animate-pulse" />
          ))
        ) : (
          (posts || []).map((post: any) => (
            <div key={post.id} className="group bg-white p-6 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 hover:border-primary/30 transition-all flex gap-6">
               <div className="relative shrink-0">
                  {post.image_url ? (
                    <img src={post.image_url} className="w-24 h-24 rounded-2xl object-cover border border-border group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center border border-border">
                       <ImageIcon className="w-8 h-8 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-white rounded-lg border border-border text-[8px] font-black uppercase tracking-widest shadow-sm">
                     {post.category || "General"}
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 italic font-medium">"{post.excerpt || "No excerpt recorded in the registry..."}"</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                       <Calendar className="w-3.5 h-3.5" />
                       {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => { setEditingPost(post); setShowEditor(true); }} className="p-2 bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deletePost(post.id)} className="p-2 bg-muted/30 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
            <div className="px-10 py-8 border-b border-border bg-muted/5 flex items-center justify-between shrink-0">
               <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">{editingPost ? "Edit Editorial Asset" : "Register New Publication"}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">Authorized editorial submission portal</p>
               </div>
               <button onClick={() => setShowEditor(false)} className="p-3 hover:bg-muted rounded-2xl transition-all"><X className="w-6 h-6 text-muted-foreground" /></button>
            </div>

            <form onSubmit={savePost} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Publication Title</label>
                        <input name="title" defaultValue={editingPost?.title} required placeholder="Enter authoritative title…" className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Category</label>
                           <input name="category" defaultValue={editingPost?.category} placeholder="E.g. Culture" className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Hero Image URL</label>
                           <input name="image_url" defaultValue={editingPost?.image_url} placeholder="https://..." className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Abstract / Excerpt</label>
                        <textarea name="excerpt" defaultValue={editingPost?.excerpt} placeholder="A brief summary for the registry…" className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-medium h-24 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none italic" />
                     </div>
                  </div>

                  <div className="space-y-2 flex flex-col h-full">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> Narrative Content (Markdown)</label>
                     <textarea name="content" defaultValue={editingPost?.content} required placeholder="Compose the editorial narrative here…" className="flex-1 w-full px-8 py-6 bg-muted/20 border border-border rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none font-mono" />
                  </div>
               </div>

               <div className="pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <Zap className="w-5 h-5 text-primary" />
                     <p className="text-[10px] font-bold text-primary italic leading-tight">Content is automatically synchronized with the global marketplace feed upon registration.</p>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Abort Changes</button>
                     <button type="submit" disabled={saving} className="px-10 py-4 bg-[#1B4332] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                        {saving ? <Zap className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Synchronizing Registry..." : "Finalize Publication"}
                     </button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
