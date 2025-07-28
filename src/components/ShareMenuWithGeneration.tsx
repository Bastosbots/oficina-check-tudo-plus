
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Copy } from "lucide-react";
import { toast } from "sonner";
import { useCreatePublicLink, useCreateBudgetPublicLink } from "@/hooks/usePublicLinks";

interface ShareMenuWithGenerationProps {
  id: string;
  type: 'checklist' | 'budget';
  title: string;
  description?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
}

const ShareMenuWithGeneration = ({ 
  id,
  type,
  title, 
  description = "Confira este documento",
  variant = "outline",
  size = "sm",
  className = ""
}: ShareMenuWithGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const createChecklistLink = useCreatePublicLink();
  const createBudgetLink = useCreateBudgetPublicLink();

  const handleCopyLink = async () => {
    setIsLoading(true);
    
    try {
      let token = '';
      if (type === 'checklist') {
        token = await createChecklistLink.mutateAsync(id);
      } else {
        token = await createBudgetLink.mutateAsync(id);
      }
      
      const publicUrl = `${window.location.origin}/public/${type}/${token}`;
      console.log('Generated public URL:', publicUrl);

      await navigator.clipboard.writeText(publicUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error: any) {
      console.error('Erro ao copiar link:', error);
      toast.error('Erro ao copiar link público');
    } finally {
      setIsLoading(false);
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
      <span>
        {isLoading ? 'Gerando...' : 'Copiar Link'}
      </span>
    </Button>
  );
};

export default ShareMenuWithGeneration;
