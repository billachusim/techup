import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProductGallery from "./ProductGallery";
import { formatNaira, productWhatsAppUrl, type StoreProduct } from "@/data/storeProducts";

interface ProductCardProps {
  product: StoreProduct;
  onOpenDetails: (product: StoreProduct) => void;
}

const ProductCard = ({ product, onOpenDetails }: ProductCardProps) => (
  <Card className="flex flex-col overflow-hidden border-border/70 transition-shadow hover:shadow-lg">
    <ProductGallery images={product.images} className="aspect-square rounded-none" />

    <CardContent className="flex flex-1 flex-col gap-3 pt-5">
      <div className="flex flex-wrap gap-1.5">
        {product.badges.slice(0, 2).map((badge) => (
          <Badge key={badge} variant="secondary" className="text-[11px] font-medium">
            {badge}
          </Badge>
        ))}
      </div>

      <div>
        <h3 className="text-base font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.shortDescription}</p>
      </div>

      <div className="mt-auto flex items-baseline gap-2">
        <span className="text-xl font-bold">{formatNaira(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {formatNaira(product.compareAtPrice)}
          </span>
        )}
      </div>
    </CardContent>

    <CardFooter className="flex flex-col gap-2">
      <Button asChild className="w-full">
        <a
          href={productWhatsAppUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <MessageCircle className="mr-2" size={18} /> Order on WhatsApp
        </a>
      </Button>
      <Button variant="ghost" size="sm" className="w-full" onClick={() => onOpenDetails(product)}>
        View details & specs
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        Pay on delivery available · Nationwide delivery
      </p>
    </CardFooter>
  </Card>
);

export default ProductCard;
