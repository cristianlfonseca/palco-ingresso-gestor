
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PasswordCall {
  id: string;
  password_number: number;
  called_at: string;
  created_at: string;
}

export const usePasswordCalls = () => {
  return useQuery({
    queryKey: ['password-calls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_calls')
        .select('*')
        .order('called_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar senhas:', error);
        throw error;
      }

      return data as PasswordCall[];
    },
    refetchInterval: 5000, // Atualiza a cada 5 segundos
  });
};

export const useCreatePasswordCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (passwordNumber: number) => {
      const { data, error } = await supabase
        .from('password_calls')
        .insert([{ password_number: passwordNumber }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['password-calls'] });
      toast({
        title: "Senha chamada!",
        description: "A senha foi chamada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao chamar senha",
        description: "Ocorreu um erro ao chamar a senha.",
        variant: "destructive",
      });
    },
  });
};

export const useClearPasswordCalls = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('password_calls')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['password-calls'] });
      toast({
        title: "Senhas resetadas!",
        description: "Todas as senhas foram resetadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao resetar senhas",
        description: "Ocorreu um erro ao resetar as senhas.",
        variant: "destructive",
      });
    },
  });
};
