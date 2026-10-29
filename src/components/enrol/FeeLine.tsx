import { useCurrency } from "@/contexts/CurrencyContext";
import { feeInstalments } from "@/lib/programmes";

/** A plan's flat fee and the instalment option, as every fee card shows it. */
export const FeeLine = ({
  fee,
  size = "md",
}: {
  fee: number;
  size?: "md" | "lg";
}) => {
  const { formatPrice } = useCurrency();
  const split = feeInstalments(fee);
  return (
    <div>
      <p
        className={
          size === "lg"
            ? "text-4xl font-bold tracking-tight"
            : "text-3xl font-bold tracking-tight"
        }
      >
        {formatPrice(fee)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {split ? `or 2 payments of ${formatPrice(split.deposit)}` : "Paid once"}{" "}
        · all courses included
      </p>
    </div>
  );
};
