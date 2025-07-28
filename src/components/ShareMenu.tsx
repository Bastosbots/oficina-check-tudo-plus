
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareMenuProps {
  publicUrl: string;
  title: string;
  description?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
}

const ShareMenu = ({ 
  publicUrl, 
  title, 
  description = "Confira este documento",
  isLoading = false,
  variant = "outline",
  size = "sm",
  className = ""
}: ShareMenuProps) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={handleCopyLink}
      className={`flex items-center justify-center gap-2 touch-target ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
      ) : (
        <Copy className="h-3 w-3" />
      )}
      <span>{isLoading ? 'Gerando...' : 'Copiar Link'}</span>
    </Button>
  );
};

export default ShareMenu;
