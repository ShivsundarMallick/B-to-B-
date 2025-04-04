import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Product, products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useToast } from "../ui/use-toast";

interface ProductSuggestionsProps {
  productId: string;
}

export const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  productId,
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Get related products based on the current product
  const currentProduct = products.find((p) => p.id === productId);
  const relatedProductIds = currentProduct?.related || [];
  const suggestedProducts = products.filter((p) =>
    relatedProductIds.includes(p.id)
  );

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
      variant: "success",
    });
  };

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">You might also like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex sm:flex-row h-full">
              <div className="w-1/3 sm:h-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-3 w-2/3">
                <h4 className="font-medium text-sm line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1 mb-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={() => handleQuickAdd(product)}
                  >
                    Quick Add
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
