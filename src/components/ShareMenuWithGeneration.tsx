
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share, MessageCircle, Copy, Mail, Twitter, Facebook, Smartphone } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const createChecklistLink = useCreatePublicLink();
  const createBudgetLink = useCreateBudgetPublicLink();

  const isLoading = createChecklistLink.isPending || createBudgetLink.isPending;

  // Verificar se o dispositivo suporta Web Share API
  const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    
    if (open && !currentUrl) {
      try {
        let token = '';
        if (type === 'checklist') {
          token = await createChecklistLink.mutateAsync(id);
        } else {
          token = await createBudgetLink.mutateAsync(id);
        }
        
        const publicUrl = `${window.location.origin}/public/${type}/${token}`;
        setCurrentUrl(publicUrl);
        console.log('Generated public URL:', publicUrl);
      } catch (error) {
        console.error('Error generating URL:', error);
        toast.error('Erro ao gerar link');
        setIsOpen(false);
      }
    }
  };

  const handleNativeShare = async () => {
    if (!currentUrl) return;

    try {
      if (canUseNativeShare) {
        await navigator.share({
          title: title,
          text: description,
          url: currentUrl
        });
        toast.success('Link compartilhado com sucesso!');
        setIsOpen(false);
      }
    } catch (error) {
      // Se o usuário cancelar o compartilhamento, não mostra erro
      if (error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        toast.error('Erro ao compartilhar link');
      }
    }
  };

  const handleCopyLink = async () => {
    if (!currentUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleWhatsApp = () => {
    if (!currentUrl) return;
    
    const message = `*${title}*\n\n${description}\n\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    if (!currentUrl) return;
    
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${currentUrl}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handleTwitter = () => {
    if (!currentUrl) return;
    
    const text = encodeURIComponent(`${title} - ${description}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebook = () => {
    if (!currentUrl) return;
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 touch-target ${className}`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
          ) : (
            <Share className="h-3 w-3" />
          )}
          <span>{isLoading ? 'Gerando...' : 'Compartilhar'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Opção de compartilhamento nativo quando disponível */}
        {canUseNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare} className="flex items-center gap-2" disabled={!currentUrl}>
            <Smartphone className="h-4 w-4" />
            <span>Compartilhar</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2" disabled={!currentUrl}>
          <Copy className="h-4 w-4" />
          <span>Copiar Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp} className="flex items-center gap-2" disabled={!currentUrl}>
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail} className="flex items-center gap-2" disabled={!currentUrl}>
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitter} className="flex items-center gap-2" disabled={!currentUrl}>
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook} className="flex items-center gap-2" disabled={!currentUrl}>
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenuWithGeneration;
