
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Sale {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  student_id?: string;
  seats: string[];
  total_value: number;
  sale_date: string;
  created_at?: string;
  students?: {
    student_name: string;
    responsible_name: string;
  };
}

export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          students (
            student_name,
            responsible_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Sale[];
    }
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'students'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: "Sucesso",
        description: "Venda realizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar venda",
        variant: "destructive"
      });
    }
  });
};
