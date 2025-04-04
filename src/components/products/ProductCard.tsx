import React, { useState } from "react";
// import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Product, ProductVariant } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      id: selectedVariant.id,
      productId: product.id,
      name: `${product.name} - ${selectedVariant.company}`,
      price: selectedVariant.price,
      image: product.image,
      quantity: quantity,
      maxQuantity: selectedVariant.quantity,
      company: selectedVariant.company,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} - ${selectedVariant.company} added to your cart`,
      variant: "success",
    });
  };

  const handleBuyNow = () => {
    // Check if quantity is valid and variant selected
    if (quantity < 1 || !selectedVariant) return;

    // Add to cart first
    addToCart({
      id: selectedVariant.id,
      productId: product.id,
      name: `${product.name} - ${selectedVariant.company}`,
      price: selectedVariant.price,
      image: product.image,
      quantity: quantity,
      maxQuantity: selectedVariant.quantity,
      company: selectedVariant.company,
    });

    // Navigate to transaction page
    navigate("/transaction");
  };

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && selectedVariant) {
      setQuantity(Math.min(value, selectedVariant.quantity));
    } else if (e.target.value === "") {
      setQuantity(0);
    }
  };

  // Get best price variant for display
  const bestPriceVariant = product.variants.reduce(
    (prev, current) => (current.price < prev.price ? current : prev),
    product.variants[0]
  );

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <Badge variant="secondary" className="ml-2">
            {bestPriceVariant.company}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">
            From ${bestPriceVariant.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {selectedVariant
              ? `Stock: ${selectedVariant.quantity}`
              : "Select variant"}
          </span>
        </div>

        {/* Simple variant selector */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Select Option:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`p-2 border rounded cursor-pointer text-sm ${
                  selectedVariant?.id === variant.id
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="font-medium">{variant.company}</div>
                <div className="text-gray-600">${variant.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center mb-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-md p-0"
            onClick={decrementQuantity}
            disabled={!selectedVariant}
          >
            -
          </Button>
          <input
            type="number"
            className="mx-2 h-8 w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
            max={selectedVariant?.quantity || 1}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={!selectedVariant}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-md p-0"
            onClick={incrementQuantity}
            disabled={
              !selectedVariant || quantity >= (selectedVariant?.quantity || 0)
            }
          >
            +
          </Button>
        </div>
        <div className="text-sm font-medium text-right mb-2">
          Total: $
          {selectedVariant
            ? (selectedVariant.price * quantity).toFixed(2)
            : "0.00"}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-gray-50 border-t flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!selectedVariant || quantity <= 0}
        >
          Add to Cart
        </Button>
        <Button
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!selectedVariant || quantity <= 0}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};
