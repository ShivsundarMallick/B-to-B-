import React, { useState } from "react";
import { categories, subProducts } from "../../data/products";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { CartDrawer } from "./CartDrawer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Filter categories based on search query and selected category
  const filteredCategories = categories.filter((category) => {
    // Filter by category name if selected
    if (selectedCategory && category.id !== selectedCategory) {
      return false;
    }

    // Search in category name and product names/descriptions
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const categoryMatches = category.name.toLowerCase().includes(query);
      const productMatches = category.products.some(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.variants.some((variant) =>
            variant.company.toLowerCase().includes(query)
          )
      );
      return categoryMatches || productMatches;
    }

    return true;
  });

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Product Catalog</h1>

          <div className="relative w-full sm:w-1/3">
            <Input
              className="pr-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex gap-2">
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-1 p-4">
        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Category cards */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                subProducts={subProducts}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center">
        <p className="text-gray-600">
          © 2023 E-commerce Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
