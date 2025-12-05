import { useState, useEffect, useRef } from "react";
import { Product, CoinValue } from "@/types/product";
import { fetchInitialProducts } from "@/lib/mockApi";
import { storage } from "@/lib/storage";
import { soundEffects } from "@/lib/sounds";
import { animations } from "@/lib/animations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const COINS = [
  { value: 2.00, name: "€2", emoji: "🥇" },
  { value: 1.00, name: "€1", emoji: "🥈" },
  { value: 0.50, name: "50c", emoji: "🟡" },
  { value: 0.20, name: "20c", emoji: "⚪" },
  { value: 0.10, name: "10c", emoji: "🟤" }
];

const Index = () => {
  // Simplified state management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Welcome! Insert Coins");
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<any>({});

  // Refs for vanilla JS animations
  const displayRef = useRef<HTMLDivElement>(null);
  const coinAreaRef = useRef<HTMLDivElement>(null);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      // Try localStorage first
      const saved = storage.loadProducts();
      if (saved) {
        setProducts(saved);
        setLoading(false);
        return;
      }

      // Fallback to mock API
      try {
        const data = await fetchInitialProducts();
        setProducts(data);
        storage.saveProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      storage.saveProducts(products);
    }
  }, [products]);

  // Vanilla JS: Insert coin with sound and animation
  const insertCoin = (value: number) => {
    const newAmount = amount + value;
    setAmount(parseFloat(newAmount.toFixed(2)));
    setMessage("Select a product");

    // Play sound effect
    soundEffects.coinInsert();

    // Animate coin area
    if (coinAreaRef.current) {
      animations.pulseElement(coinAreaRef.current);
    }

    toast.success(`Inserted €${value.toFixed(2)}`, { duration: 1000 });
  };

  // Select product
  const selectProduct = (product: Product) => {
    if (product.quantity === 0) {
      soundEffects.error();
      toast.error("Product out of stock");
      return;
    }

    soundEffects.buttonClick();
    setSelected(product.id);
    setMessage(`Selected: ${product.name} - €${product.price.toFixed(2)}`);
  };

  // Purchase product with validation and effects
  const purchase = () => {
    const product = products.find(p => p.id === selected);
    
    if (!product) {
      soundEffects.error();
      toast.error("Please select a product");
      return;
    }

    if (amount < product.price) {
      soundEffects.error();
      if (displayRef.current) {
        animations.shakeElement(displayRef.current);
      }
      toast.error("Insufficient funds");
      setMessage(`Insert €${(product.price - amount).toFixed(2)} more`);
      return;
    }

    const change = amount - product.price;

    // Update inventory
    setProducts(products.map(p =>
      p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
    ));

    // Play success sound
    soundEffects.purchase();

    // Reset state
    setAmount(0);
    setSelected(null);

    // Show success
    toast.success(
      `Dispensing ${product.name}! ${change > 0 ? `Change: €${change.toFixed(2)}` : ""}`,
      { duration: 3000 }
    );
    setMessage(change > 0 ? `Change: €${change.toFixed(2)}` : "Thank you!");

    setTimeout(() => setMessage("Welcome! Insert Coins"), 3000);
  };

  // Reset/refund coins
  const reset = () => {
    if (amount > 0) {
      soundEffects.refund();
      toast.info(`Returning €${amount.toFixed(2)}`);
    }
    setAmount(0);
    setSelected(null);
    setMessage("Welcome! Insert Coins");
  };

  // Admin functions - simplified
  const startEdit = (product: Product) => {
    setEditing(product.id);
    setForm(product);
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ name: "", price: 0, quantity: 0, emoji: "🎁", maxQuantity: 15 });
  };

  const saveProduct = () => {
    if (!form.name || !form.price || form.quantity === undefined) {
      toast.error("Fill all fields");
      return;
    }

    if (adding) {
      const id = (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
      setProducts([...products, { ...form, id }]);
      toast.success("Product added");
    } else if (editing) {
      setProducts(products.map(p => p.id === editing ? form : p));
      toast.success("Product updated");
    }

    setEditing(null);
    setAdding(false);
    setForm({});
  };

  const deleteProduct = (id: string) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedProduct = products.find(p => p.id === selected);
  const canPurchase = selectedProduct && amount >= selectedProduct.price;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Vending Machine
          </h1>
          <p className="text-muted-foreground">
            Accepted coins: €2, €1, 50c, 20c, 10c
          </p>
        </div>

        <Tabs defaultValue="machine" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="machine">Vending Machine</TabsTrigger>
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          </TabsList>

          <TabsContent value="machine" className="space-y-6">
            <div className="grid lg:grid-cols-[1fr,400px] gap-6">
              {/* Product Display */}
              <div className="bg-machine-glass border-4 border-primary/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Button
                      key={product.id}
                      onClick={() => selectProduct(product)}
                      disabled={product.quantity === 0}
                      variant="outline"
                      className={cn(
                        "h-32 flex flex-col gap-2 bg-card/80 backdrop-blur border-2 transition-all",
                        selected === product.id && "border-secondary ring-2 ring-secondary/50 scale-105",
                        selected !== product.id && product.quantity > 0 && "border-primary/20 hover:border-primary/50 hover:scale-105",
                        product.quantity === 0 && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <span className="text-5xl">{product.emoji}</span>
                      <div className="text-center">
                        <div className="text-sm font-semibold">{product.name}</div>
                        <div className="text-xs text-primary font-bold">€{product.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.quantity === 0 ? "OUT OF STOCK" : `Qty: ${product.quantity}`}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Control Panel */}
              <div className="space-y-6">
                <div className="bg-machine-frame p-6 rounded-2xl border-4 border-primary/30 shadow-strong">
                  {/* Digital Display */}
                  <div ref={displayRef} className="bg-display-bg border-2 border-primary/30 rounded-lg p-6 mb-6">
                    <div className="text-display-text text-center space-y-2">
                      <div className="text-3xl font-bold tracking-wider font-mono">
                        €{amount.toFixed(2)}
                      </div>
                      <div className="text-sm uppercase tracking-widest opacity-90 min-h-[20px]">
                        {message}
                      </div>
                    </div>
                  </div>

                  {/* Coin Slot */}
                  <div ref={coinAreaRef} className="space-y-4 mb-6">
                    <div className="text-center text-sm text-muted-foreground uppercase tracking-wide">
                      Insert Coins
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {COINS.map((coin) => (
                        <Button
                          key={coin.value}
                          onClick={() => insertCoin(coin.value)}
                          variant="outline"
                          className="h-20 flex flex-col gap-1 bg-card hover:bg-primary/10 border-primary/30 transition-all hover:scale-105"
                        >
                          <span className="text-3xl">{coin.emoji}</span>
                          <span className="text-xs font-medium">{coin.name}</span>
                          <span className="text-xs text-muted-foreground">€{coin.value.toFixed(2)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={purchase}
                      disabled={!canPurchase}
                      className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                    >
                      Purchase
                    </Button>
                    <Button
                      onClick={reset}
                      disabled={amount === 0}
                      variant="destructive"
                      className="h-14 font-bold text-lg"
                    >
                      Return Coins
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="bg-card border-primary/20">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
                  <Button onClick={startAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {adding && (
                  <div className="p-4 bg-muted rounded-lg space-y-4 mb-4">
                    <h3 className="font-semibold text-lg">New Product</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={form.name || ""}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <Label>Emoji</Label>
                        <Input
                          value={form.emoji || ""}
                          onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                          placeholder="🎁"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label>Price (€)</Label>
                        <Input
                          type="number"
                          step="0.05"
                          value={form.price || ""}
                          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={form.quantity || ""}
                          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                          max={15}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveProduct} className="bg-primary hover:bg-primary/90">Save</Button>
                      <Button onClick={() => { setAdding(false); setForm({}); }} variant="outline">Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                      {editing === product.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                              <Label>Emoji</Label>
                              <Input value={form.emoji || ""} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={2} />
                            </div>
                            <div>
                              <Label>Price (€)</Label>
                              <Input type="number" step="0.10" value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                              <Label>Quantity</Label>
                              <Input type="number" value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} max={15} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveProduct} className="bg-primary hover:bg-primary/90">Save</Button>
                            <Button onClick={() => { setEditing(null); setForm({}); }} variant="outline">Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl">{product.emoji}</span>
                            <div>
                              <div className="font-semibold">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                €{product.price.toFixed(2)} • Qty: {product.quantity}/{product.maxQuantity}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => startEdit(product)} variant="outline" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => deleteProduct(product.id)} variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
