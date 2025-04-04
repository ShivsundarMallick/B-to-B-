import React, { useState } from "react";
import {
  Category,
  Product,
  ProductVariant,
  ProductModel,
  SubProduct,
} from "../../data/products";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useCart } from "../../context/CartContext";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CategoryCardProps {
  category: Category;
  subProducts: SubProduct[];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  subProducts,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, ProductVariant>
  >({});
  const [selectedModels, setSelectedModels] = useState<
    Record<string, ProductModel>
  >({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [subProductQuantities, setSubProductQuantities] = useState<
    Record<string, number>
  >({});

  // Calculate total quantity for this category
  const calculateTotalQuantity = () => {
    let total = 0;
    category.products.forEach((product) => {
      product.variants.forEach((variant) => {
        total += variant.quantity;
      });
    });
    return total;
  };

  const handleSelectVariant = (productId: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));

    // Clear previously selected model when changing variant
    setSelectedModels((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });

    // Initialize quantity to 1 when variant is selected
    if (!quantities[productId]) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: 1,
      }));
    }
  };

  const handleSelectModel = (productId: string, model: ProductModel) => {
    // Update selected model
    setSelectedModels((prev) => ({
      ...prev,
      [productId]: model,
    }));

    // Initialize quantity to 1 only if not already set
    if (!quantities[`${productId}-${model.id}`]) {
      setQuantities((prev) => ({
        ...prev,
        [`${productId}-${model.id}`]: 1,
      }));
    }
  };

  const incrementQuantity = (productId: string, modelId: string) => {
    const key = `${productId}-${modelId}`;
    const variant = selectedVariants[productId];
    if (!variant) return;

    const model = variant.models.find((m) => m.id === modelId);
    if (!model) return;

    const currentQty = quantities[key] || 1;
    if (currentQty < model.quantity) {
      setQuantities((prev) => ({
        ...prev,
        [key]: currentQty + 1,
      }));
    }
  };

  const decrementQuantity = (productId: string, modelId: string) => {
    const key = `${productId}-${modelId}`;
    const currentQty = quantities[key] || 1;
    if (currentQty > 1) {
      setQuantities((prev) => ({
        ...prev,
        [key]: currentQty - 1,
      }));
    }
  };

  const handleQuantityChange = (
    productId: string,
    modelId: string,
    value: string
  ) => {
    const key = `${productId}-${modelId}`;
    const variant = selectedVariants[productId];
    if (!variant) return;

    const model = variant.models.find((m) => m.id === modelId);
    if (!model) return;

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      // Ensure quantity doesn't exceed available stock
      const maxQty = model.quantity;
      const safeQty = Math.min(numValue, maxQty);

      setQuantities((prev) => ({
        ...prev,
        [key]: safeQty,
      }));
    } else if (value === "") {
      setQuantities((prev) => ({
        ...prev,
        [key]: 0,
      }));
    }
  };

  const handleAddToCart = (productId: string, modelId: string) => {
    const variant = selectedVariants[productId];
    if (!variant) {
      toast({
        title: "No option selected",
        description: "Please select a company option first",
        variant: "destructive",
      });
      return;
    }

    const model = variant.models.find((m) => m.id === modelId);
    if (!model) {
      toast({
        title: "No model selected",
        description: "Please select a model first",
        variant: "destructive",
      });
      return;
    }

    const product = category.products.find((p) => p.id === productId);
    if (!product) return;

    const key = `${productId}-${modelId}`;
    const quantity = quantities[key] || 1;

    // Add to cart
    addToCart({
      id: model.id,
      productId: product.id,
      name: `${product.name} - ${variant.company} ${model.name}`,
      price: model.price,
      image: model.image || product.image,
      quantity: quantity,
      maxQuantity: model.quantity,
      company: variant.company,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} - ${variant.company} ${model.name} added to your cart`,
    });
  };

  const handleBuyNow = (productId: string, modelId: string) => {
    const variant = selectedVariants[productId];
    if (!variant) {
      toast({
        title: "No option selected",
        description: "Please select a company option first",
        variant: "destructive",
      });
      return;
    }

    const model = variant.models.find((m) => m.id === modelId);
    if (!model) {
      toast({
        title: "No model selected",
        description: "Please select a model first",
        variant: "destructive",
      });
      return;
    }

    const product = category.products.find((p) => p.id === productId);
    if (!product) return;

    const key = `${productId}-${modelId}`;
    const quantity = quantities[key] || 1;

    // Add to cart and navigate to transaction page
    addToCart({
      id: model.id,
      productId: product.id,
      name: `${product.name} - ${variant.company} ${model.name}`,
      price: model.price,
      image: model.image || product.image,
      quantity: quantity,
      maxQuantity: model.quantity,
      company: variant.company,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} - ${variant.company} ${model.name} has been added to your cart`,
    });

    navigate("/transaction");
  };

  // Handler for recommended products
  const incrementSubProductQuantity = (subProductId: string) => {
    const currentQty = subProductQuantities[subProductId] || 1;
    setSubProductQuantities((prev) => ({
      ...prev,
      [subProductId]: currentQty + 1,
    }));
  };

  const decrementSubProductQuantity = (subProductId: string) => {
    const currentQty = subProductQuantities[subProductId] || 1;
    if (currentQty > 1) {
      setSubProductQuantities((prev) => ({
        ...prev,
        [subProductId]: currentQty - 1,
      }));
    }
  };

  const handleSubProductQuantityChange = (
    subProductId: string,
    value: string
  ) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSubProductQuantities((prev) => ({
        ...prev,
        [subProductId]: numValue,
      }));
    } else if (value === "") {
      setSubProductQuantities((prev) => ({
        ...prev,
        [subProductId]: 0,
      }));
    }
  };

  const addSubProductToCart = (subProduct: SubProduct) => {
    const quantity = subProductQuantities[subProduct.id] || 1;

    // Add to cart
    addToCart({
      id: subProduct.id,
      productId: subProduct.id,
      name: subProduct.name,
      price: subProduct.price,
      image: subProduct.image,
      quantity: quantity,
      maxQuantity: 10, // Default max quantity for subproducts
      company: "Recommended",
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${subProduct.name} added to your cart`,
    });
  };

  const getRecommendationsForProduct = (productId: string): SubProduct[] => {
    return subProducts.filter(
      (subProduct) => subProduct.parentProductId === productId
    );
  };

  return (
    <Card className="w-full mb-6 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{category.name}</CardTitle>
          <Badge variant="secondary">
            Total: {calculateTotalQuantity()} items
          </Badge>
        </div>
        <CardDescription>
          {category.products.length} products available in this category
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {category.products.map((product) => (
          <div key={product.id} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4">
                <img
                  src={selectedModels[product.id]?.image || product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-md object-cover"
                  style={{ maxHeight: "200px" }}
                />
              </div>

              <div className="md:w-3/4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-3">{product.description}</p>

                <Tabs defaultValue="companies" className="w-full mb-4">
                  <TabsList className="mb-2">
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                    {selectedVariants[product.id] && (
                      <TabsTrigger value="models">Models</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="companies">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          onClick={() =>
                            handleSelectVariant(product.id, variant)
                          }
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedVariants[product.id]?.id === variant.id
                              ? "bg-blue-50 border-blue-300"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{variant.company}</div>
                          <div className="text-sm text-gray-600">
                            {variant.models.length} models available
                          </div>
                          <div className="font-semibold text-blue-600">
                            From $
                            {Math.min(
                              ...variant.models.map((m) => m.price)
                            ).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {selectedVariants[product.id] && (
                    <TabsContent value="models">
                      <div className="grid grid-cols-1 gap-3">
                        {selectedVariants[product.id].models.map((model) => {
                          const modelKey = `${product.id}-${model.id}`;
                          const hasQuantity =
                            quantities[modelKey] && quantities[modelKey] > 0;

                          return (
                            <div
                              key={model.id}
                              onClick={() =>
                                handleSelectModel(product.id, model)
                              }
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedModels[product.id]?.id === model.id
                                  ? "bg-blue-50 border-blue-300"
                                  : hasQuantity
                                  ? "bg-gray-50 border-gray-300"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start mb-3">
                                <img
                                  src={model.image || product.image}
                                  alt={model.name}
                                  className="w-16 h-16 rounded object-cover mr-3"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {model.name}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    {selectedVariants[product.id].company} model
                                  </div>
                                  <div className="font-semibold text-blue-600">
                                    ${model.price.toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {/* Always show controls if quantity is set or model is selected */}
                              {(hasQuantity ||
                                selectedModels[product.id]?.id ===
                                  model.id) && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t">
                                  <div className="flex items-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 w-7 rounded-md p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        decrementQuantity(product.id, model.id);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Input
                                      type="number"
                                      className="mx-2 h-7 w-16 rounded-md text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      min="1"
                                      max={model.quantity}
                                      value={quantities[modelKey] || 1}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleQuantityChange(
                                          product.id,
                                          model.id,
                                          e.target.value
                                        );
                                      }}
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 w-7 rounded-md p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        incrementQuantity(product.id, model.id);
                                      }}
                                      disabled={
                                        (quantities[modelKey] || 1) >=
                                        model.quantity
                                      }
                                    >
                                      +
                                    </Button>
                                    <span className="ml-3 text-sm text-gray-600">
                                      Stock: {model.quantity}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                                    <div className="text-sm font-medium">
                                      Total: $
                                      {(
                                        (quantities[modelKey] || 1) *
                                        model.price
                                      ).toFixed(2)}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(product.id, model.id);
                                        }}
                                        className="whitespace-nowrap"
                                      >
                                        Add to Cart
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleBuyNow(product.id, model.id);
                                        }}
                                      >
                                        Buy Now
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* Recommendations */}
                {getRecommendationsForProduct(product.id).length > 0 && (
                  <div className="mt-5 border rounded-md p-3">
                    <h4 className="text-sm font-semibold mb-2">
                      Recommended Products
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {getRecommendationsForProduct(product.id).map(
                        (subProduct) => (
                          <div
                            key={subProduct.id}
                            className="p-3 border rounded-md"
                          >
                            <div className="flex items-start mb-3">
                              <img
                                src={subProduct.image}
                                alt={subProduct.name}
                                className="w-16 h-16 rounded object-cover mr-3"
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {subProduct.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  {subProduct.description}
                                </div>
                                <div className="font-semibold text-blue-600">
                                  ${subProduct.price.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 rounded-md p-0"
                                  onClick={() =>
                                    decrementSubProductQuantity(subProduct.id)
                                  }
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  className="mx-2 h-7 w-16 rounded-md text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="1"
                                  value={
                                    subProductQuantities[subProduct.id] || 1
                                  }
                                  onChange={(e) =>
                                    handleSubProductQuantityChange(
                                      subProduct.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 rounded-md p-0"
                                  onClick={() =>
                                    incrementSubProductQuantity(subProduct.id)
                                  }
                                >
                                  +
                                </Button>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                                <div className="text-sm font-medium">
                                  Total: $
                                  {(
                                    (subProductQuantities[subProduct.id] || 1) *
                                    subProduct.price
                                  ).toFixed(2)}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    addSubProductToCart(subProduct)
                                  }
                                  className="whitespace-nowrap"
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add separator between products */}
            <Separator className="my-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
