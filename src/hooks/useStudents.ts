
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  student_name: string;
  responsible_name: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Student[];
    }
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar aluno",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...student }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluno",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive"
      });
    }
  });
};
