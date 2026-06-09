import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingBag, Package, Ticket } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const TechStore = () => {
  const addItem = useCartStore(state => state.addItem);

  const { data: products, isLoading } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchProducts(50),
  });

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.node.title} has been added to your cart.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Store — Tech Faculty NG | Equipment & Gadgets</title>
        <meta
          name="description"
          content="Shop laptops, accessories, and learning gear for Tech Faculty NG students. Verified Faculty IDs unlock exclusive bootcamp member discounts on every order."
        />
        <link rel="canonical" href="https://techfaculty.ng/tech-store" />
        <meta property="og:title" content="Tech Store — Tech Faculty NG" />
        <meta
          property="og:description"
          content="Curated laptops, gadgets, and bootcamp gear with Faculty ID member discounts."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/tech-store" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tech Store — Tech Faculty NG",
          description:
            "Catalog of laptops, gadgets, and learning equipment for Tech Faculty NG students with Faculty ID member discounts.",
          url: "https://techfaculty.ng/tech-store",
          isPartOf: { "@type": "WebSite", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
        })}</script>
      </Helmet>
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Tech Store</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive gadgets and gear for Tech Faculty members. Use your Faculty ID for special discounts!
            </p>
            <div className="flex justify-center mt-6">
              <CartDrawer />
            </div>
          </div>

          {/* Faculty Discount Banner */}
          <Alert className="mb-8 border-primary bg-primary/5">
            <Ticket className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold">🎉 Faculty Members Get 50% OFF!</AlertTitle>
            <AlertDescription className="text-base">
              Use code <span className="font-mono font-bold bg-primary/20 px-2 py-1 rounded">FACULTY50</span> at checkout to get 50% discount on all products. 
              This exclusive offer is available to all Tech Faculty members.
            </AlertDescription>
          </Alert>

          {/* Products Grid */}
          <div className="mt-12">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Our store is being stocked with amazing gadgets!
                </p>
                <p className="text-sm text-muted-foreground">
                  Create products by telling the chat what gadgets you'd like to sell, including the price.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: ShopifyProduct) => {
                  const image = product.node.images.edges[0]?.node;
                  const price = product.node.priceRange.minVariantPrice;
                  const variant = product.node.variants.edges[0]?.node;

                  return (
                    <Card key={product.node.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {image && (
                        <div className="aspect-square overflow-hidden bg-secondary/20">
                          <img
                            src={image.url}
                            alt={image.altText || product.node.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{product.node.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                          </span>
                          {variant?.availableForSale ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Out of Stock
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      {product.node.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.node.description}
                          </p>
                        </CardContent>
                      )}
                      <CardFooter>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={!variant?.availableForSale}
                          className="w-full"
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TechStore;
