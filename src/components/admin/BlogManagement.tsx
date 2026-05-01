import React, { useState } from "react";
import { Plus, Edit3, Trash2, Calendar, FileText, Image as ImageIcon, X, Save, Tag, Loader2 } from "lucide-react";
import { useAdminPosts } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";

export const BlogManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useAdminPosts();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState("");

  const invalidate = (key: string[]) => queryClient.invalidateQueries({ queryKey: key });

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      invalidate(["admin", "posts"]);
      toast({ title: "Post deleted" });
    }
  };

  const openEditor = (post: Record<string, unknown> | null = null) => {
    setEditingPost(post);
    setHeroImage(post?.image_url || "");
    setShowEditor(true);
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const postData: Record<string, unknown> = {
      title: formData.get("title"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt"),
      featured_image: heroImage,
      image_url: heroImage, // Keep both for compatibility
      is_published: true,
      category: formData.get("category"),
      slug: (formData.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    };

    // Only include author if column exists (graceful handling)
    postData.author = "Nuria Editorial";

    const { error } = editingPost 
      ? await supabase.from("posts").update(postData).eq("id", editingPost.id)
      : await supabase.from("posts").insert([postData]);

    if (error) {
      // If author column error, retry without it
      if (error.message?.includes("author")) {
        delete postData.author;
        const retry = editingPost 
          ? await supabase.from("posts").update(postData).eq("id", editingPost.id)
          : await supabase.from("posts").insert([postData]);
        if (retry.error) {
          toast({ title: "Failed to save", description: retry.error.message, variant: "destructive" });
          setSaving(false);
          return;
        }
      } else {
        toast({ title: "Failed to save", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    invalidate(["admin", "posts"]);
    setShowEditor(false);
    setEditingPost(null);
    setHeroImage("");
    toast({ title: editingPost ? "Post updated" : "Post published" });
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Blog</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage blog posts</p>
        </div>
        
        <button 
          onClick={() => openEditor()} 
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(() => {
          if (isLoading) {
            return Array.from({ length: 4 }).map(() => (
              <div key={crypto.randomUUID()} className="h-48 bg-muted/30 rounded-2xl animate-pulse" />
            ));
          }
          if ((posts || []).length === 0) {
            return (
              <div className="col-span-full py-20 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No blog posts yet. Create your first one.</p>
              </div>
            );
          }
          return (posts || []).map((post: Record<string, unknown>) => (
            <div key={post.id} className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 hover:shadow-md transition-all">
              {/* Image */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
                {post.category && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-semibold uppercase text-foreground">
                    {post.category}
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{post.excerpt || "No excerpt"}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditor(post)} className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/5 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePost(post.id)} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ));
        })()}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-2xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-foreground">{editingPost ? "Edit Post" : "New Post"}</h3>
              <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={savePost} className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Cover Image
                    </label>
                    <ImageUploader 
                      value={heroImage} 
                      onChange={setHeroImage}
                      label="Blog Header Image"
                      bucket="blog-images"
                      folder="post-headers"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="post-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</label>
                    <input id="post-title" name="title" defaultValue={editingPost?.title} required placeholder="Post title" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                   
                  <div className="space-y-2">
                    <label htmlFor="post-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Category
                    </label>
                    <input id="post-category" name="category" defaultValue={editingPost?.category} placeholder="e.g. Culture, Tech, News" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="post-excerpt" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Excerpt</label>
                    <textarea id="post-excerpt" name="excerpt" defaultValue={editingPost?.excerpt} placeholder="A brief summary..." className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium h-20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <label htmlFor="post-content" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Content (Markdown)
                  </label>
                  <textarea id="post-content" name="content" defaultValue={editingPost?.content} required placeholder="Write your blog post here..." className="flex-1 w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-mono min-h-[300px]" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowEditor(false)} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
