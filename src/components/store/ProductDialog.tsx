import { Check, MessageCircle, Truck, MapPin, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductGallery from "./ProductGallery";
import { formatNaira, productWhatsAppUrl, type StoreProduct } from "@/data/storeProducts";

interface ProductDialogProps {
  product: StoreProduct | null;
  onOpenChange: (open: boolean) => void;
}

const ProductDialog = ({ product, onOpenChange }: ProductDialogProps) => (
  <Dialog open={!!product} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      {product && (
        <>
          <DialogHeader>
            <DialogTitle className="text-left text-xl">{product.name}</DialogTitle>
            <DialogDescription className="text-left">{product.tagline}</DialogDescription>
          </DialogHeader>

          <ProductGallery images={product.images} className="aspect-square w-full" />

          <div className="flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatNaira(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-muted-foreground line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div>
            <h4 className="mb-2 text-sm font-semibold">What you get</h4>
            <ul className="space-y-1.5">
              {product.specs.map((spec) => (
                <li key={spec} className="flex gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 rounded-lg border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-primary" /> Nationwide delivery
            </p>
            <p className="flex items-center gap-2">
              <Banknote size={16} className="text-primary" /> Pay on delivery
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Centre pickup
            </p>
          </div>

          <Button asChild size="lg" className="w-full">
            <a
              href={productWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <MessageCircle className="mr-2" size={18} /> Order on WhatsApp
            </a>
          </Button>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default ProductDialog;
