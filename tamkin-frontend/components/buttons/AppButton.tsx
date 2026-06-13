import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Loader2 } from "lucide-react";

const AppButton = ({
  variant = "default",
  children,
  className,
  onClick,
  isLoading = false,
  canSend = true,
  showed = true,
}: {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick?: () => Promise<any> | any;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  canSend?: boolean;
  showed?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={!canSend || isLoading || !showed}
      variant={variant}
      // showed must be not shown on html tags
      className={`${className} ${!showed ? "hidden" : ""}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppButton;
