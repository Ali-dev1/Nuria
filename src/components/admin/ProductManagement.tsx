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

  const invalidate = (key: any[]) => queryClient.invalidateQueries({ queryKey: key });

  const toggleProductStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (!error) {
      invalidate(["admin", "products"]);
      toast({ title: "Status Synchronized", description: `Product is now ${!current ? "active" : "in draft"}.` });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Confirm permanent deletion of this asset?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      invalidate(["admin", "products"]);
      toast({ title: "Asset Purged", description: "The product has been removed from the registry." });
    }
  };

  const bulkAction = async (action: "delete" | "feature" | "unfeature") => {
    if (action === "delete") {
      if (!confirm(`Confirm bulk deletion of ${selectedProducts.length} assets?`)) return;
      await supabase.from("products").delete().in("id", selectedProducts);
    } else {
      await supabase.from("products").update({ is_featured: action === "feature" }).in("id", selectedProducts);
    }
    invalidate(["admin", "products"]);
    setSelectedProducts([]);
    toast({ title: "Command Executed", description: `Bulk ${action} operation completed successfully.` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
