"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  // Get the current theme/palette from your theme context
  // If you don't have a theme context yet, you'll need to create one
  // const { currentPalette } = useTheme();

  return (
    <Sonner
      toastOptions={{
        classNames: {
          // Use Tailwind's theme variables which will reflect your dynamic colors
          toast: "group border-border bg-background text-foreground",
          title: "text-foreground text-sm font-medium",
          description: "text-muted-foreground text-xs",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          // For specific toast types
          success: "border-l-4 border-l-primary",
          error: "border-l-4 border-l-destructive",
          info: "border-l-4 border-l-accent",
          warning: "border-l-4 border-l-secondary",
        },
        // You can also use inline styles that read from your CSS variables
        style: {
          // These will pull from the CSS variables set by your generateColorCSS function
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
