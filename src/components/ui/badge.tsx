import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "text-foreground border border-border",
        books: "bg-category-books/15 text-category-books",
        electronics: "bg-category-electronics/15 text-category-electronics",
        furniture: "bg-category-furniture/15 text-category-furniture",
        clothing: "bg-category-clothing/15 text-category-clothing",
        other: "bg-category-other/15 text-category-other",
        new: "bg-condition-new/15 text-condition-new",
        good: "bg-condition-good/15 text-condition-good",
        fair: "bg-condition-fair/15 text-condition-fair",
        used: "bg-condition-used/15 text-condition-used",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
