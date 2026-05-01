import React, { useState } from "react";
import { useAdminProducts } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ProductFilters } from "./ProductManagement/ProductFilters";
import { ProductTable } from "./ProductManagement/ProductTable";
import { ProductPagination } from "./ProductManagement/ProductPagination";

export const ProductManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [productSearch, setProductSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const pageSize = 15;

  const { data: productsData, isLoading } = useAdminProducts({ search: productSearch, page: productPage, pageSize });

  const invalidate = (key: string[]) => queryClient.invalidateQueries({ queryKey: key });

  const toggleProductStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (!error) {
      invalidate(["admin", "products"]);
      toast({ title: `Product ${current ? "hidden" : "published"}` });
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_featured: !current }).eq("id", id);
    if (!error) {
      invalidate(["admin", "products"]);
      invalidate(["products"]);
      toast({ title: current ? "Removed from featured" : "Added to featured" });
    } else {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      invalidate(["admin", "products"]);
      toast({ title: "Product deleted" });
    }
  };

  const bulkAction = async (action: "delete" | "feature" | "unfeature") => {
    if (selectedProducts.length === 0) return;
    if (action === "delete") {
      if (!confirm(`Delete ${selectedProducts.length} products?`)) return;
      await supabase.from("products").delete().in("id", selectedProducts);
    } else {
      await supabase.from("products").update({ is_featured: action === "feature" }).in("id", selectedProducts);
      invalidate(["products"]);
    }
    invalidate(["admin", "products"]);
    
    let actionText = "unfeatured";
    if (action === "delete") actionText = "deleted";
    else if (action === "feature") actionText = "featured";

    setSelectedProducts([]);
    toast({ title: `${selectedProducts.length} products ${actionText}` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ProductFilters 
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        selectedProducts={selectedProducts}
        bulkAction={bulkAction}
      />
      <ProductTable 
        productsData={productsData}
        isLoading={isLoading}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        toggleProductStatus={toggleProductStatus}
        toggleFeatured={toggleFeatured}
        bulkAction={bulkAction}
        deleteProduct={deleteProduct}
      />
      <ProductPagination 
        productsData={productsData}
        pageSize={pageSize}
        productPage={productPage}
        setProductPage={setProductPage}
      />
    </div>
  );
};
