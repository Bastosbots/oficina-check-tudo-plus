
import { useState } from 'react';
import { useCreatePublicLink, useCreateBudgetPublicLink } from './usePublicLinks';

export const useShareWithUrl = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const createChecklistLink = useCreatePublicLink();
  const createBudgetLink = useCreateBudgetPublicLink();

  const generateChecklistUrl = async (checklistId: string) => {
    try {
      const token = await createChecklistLink.mutateAsync(checklistId);
      const publicUrl = `${window.location.origin}/public/checklist/${token}`;
      setCurrentUrl(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error generating checklist URL:', error);
      return '';
    }
  };

  const generateBudgetUrl = async (budgetId: string) => {
    try {
      const token = await createBudgetLink.mutateAsync(budgetId);
      const publicUrl = `${window.location.origin}/public/budget/${token}`;
      setCurrentUrl(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error generating budget URL:', error);
      return '';
    }
  };

  return {
    currentUrl,
    generateChecklistUrl,
    generateBudgetUrl,
    isGeneratingChecklist: createChecklistLink.isPending,
    isGeneratingBudget: createBudgetLink.isPending,
  };
};
