import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  bucket = "book-covers",
  folder = "uploads",
  label = "Upload Image",
  className = ""
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum image size is 5MB.", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast({ title: "Upload Successful", description: "Image has been processed and saved." });
    } catch (error: unknown) {
      console.error("Upload error:", error);
      toast({ title: "Upload Failed", description: (error as Error).message || "Failed to upload image.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>}
      
      <div 
        className={`relative h-40 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 overflow-hidden focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 ${
          dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                type="button"
                onClick={() => onChange("")}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Upload className="w-8 h-8 opacity-20" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">
                {isUploading ? "Uploading..." : "Drag & Drop Image"}
              </p>
              <p className="text-[9px] font-medium opacity-60 mt-1">PNG, JPG or WebP (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
              accept="image/*"
              disabled={isUploading}
            />
          </div>
        )}
      </div>
    </div>
  );
};
