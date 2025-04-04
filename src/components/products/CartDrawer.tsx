import React from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const navigate = useNavigate();

  const handleIncrement = (id: string, currentQty: number, maxQty: number) => {
    if (currentQty < maxQty) {
      updateQuantity(id, currentQty + 1);
    }
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleCheckout = () => {
    navigate("/transaction");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative w-9 h-9 p-0">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-10rem)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto">
                {cart.map((item) => (
                  <div key={item.id} className="py-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleDecrement(item.id, item.quantity)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleIncrement(
                                item.id,
                                item.quantity,
                                item.maxQuantity
                              )
                            }
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Max: {item.maxQuantity})
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
