
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Smartphone } from "lucide-react";
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

  // Verificar se o dispositivo suporta Web Share API
  const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    if (!canUseNativeShare) {
      toast.error('Compartilhamento não suportado neste dispositivo');
      return;
    }

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

      await navigator.share({
        title: title,
        text: description,
        url: publicUrl
      });
      
      toast.success('Link compartilhado com sucesso!');
    } catch (error: any) {
      // Se o usuário cancelar o compartilhamento, não mostra erro
      if (error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        toast.error('Erro ao compartilhar link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading || !canUseNativeShare}
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 touch-target ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
      ) : canUseNativeShare ? (
        <Smartphone className="h-3 w-3" />
      ) : (
        <Share className="h-3 w-3" />
      )}
      <span>
        {isLoading ? 'Gerando...' : 'Compartilhar'}
      </span>
    </Button>
  );
};

export default ShareMenuWithGeneration;
