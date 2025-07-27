
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share, MessageCircle, Copy, Mail, Twitter, Facebook } from "lucide-react";
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

  const handleWhatsApp = () => {
    const message = `*${title}*\n\n${description}\n\n${publicUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${publicUrl}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${title} - ${description}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(publicUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <DropdownMenu>
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
        <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          <span>Copiar Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp} className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail} className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitter} className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook} className="flex items-center gap-2">
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
