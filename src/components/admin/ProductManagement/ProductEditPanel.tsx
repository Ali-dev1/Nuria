import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

interface ProductEditPanelProps {
  editData: any;
  setEditData: (data: any) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductEditPanel: React.FC<ProductEditPanelProps> = ({
  editData,
  setEditData,
  saving,
  onSave,
  onCancel,
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300 mt-4 md:mt-0">
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Media</h4>
        <ImageUploader 
          value={Array.isArray(editData.images) ? editData.images[0] : editData.images}
          onChange={(url) => setEditData({...editData, images: [url]})}
          label="Product Cover"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Price (KSH)</label>
            <input 
              type="number" 
              value={editData.price} 
              onChange={e => setEditData({...editData, price: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Stock</label>
            <input 
              type="number" 
              value={editData.stock} 
              onChange={e => setEditData({...editData, stock: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Details</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Title</label>
            <input 
              value={editData.title} 
              onChange={e => setEditData({...editData, title: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Author</label>
            <input 
              value={editData.author} 
              onChange={e => setEditData({...editData, author: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Category</label>
            <input 
              value={editData.category} 
              onChange={e => setEditData({...editData, category: e.target.value})}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Description</h4>
          <span className={`text-xs ${editData.description.length > 500 ? "text-amber-600" : "text-muted-foreground"}`}>
            {editData.description.length}/1000
          </span>
        </div>
        <textarea 
          value={editData.description} 
          onChange={e => setEditData({...editData, description: e.target.value.slice(0, 1000)})}
          className="flex-1 w-full p-3 bg-white border border-border rounded-xl text-sm leading-relaxed resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]"
          placeholder="Product description..."
        />
        <div className="flex gap-2">
          <button 
            onClick={onCancel} 
            className="flex-1 py-2.5 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button 
            onClick={onSave}
            disabled={saving}
            className="flex-[2] py-2.5 px-4 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
