
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePasswordCalls, useCreatePasswordCall, useClearPasswordCalls } from '@/hooks/usePasswordCalls';
import { Phone, Users, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PasswordControl = () => {
  const [passwordNumber, setPasswordNumber] = useState('');
  const { data: passwordCalls = [] } = usePasswordCalls();
  const createPasswordCall = useCreatePasswordCall();
  const clearPasswordCalls = useClearPasswordCalls();

  const handleCallPassword = () => {
    const number = parseInt(passwordNumber);
    if (number && number > 0) {
      createPasswordCall.mutate(number);
      setPasswordNumber('');
    }
  };

  const handleReset = () => {
    clearPasswordCalls.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Controle de Senhas</h2>

      {/* Seção para chamar nova senha */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chamar Nova Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Número da Senha
              </label>
              <Input
                id="password"
                type="number"
                placeholder="Digite o número da senha"
                value={passwordNumber}
                onChange={(e) => setPasswordNumber(e.target.value)}
                min="1"
              />
            </div>
            <Button 
              onClick={handleCallPassword}
              disabled={!passwordNumber || createPasswordCall.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createPasswordCall.isPending ? 'Chamando...' : 'Chamar Senha'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção de controle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Histórico de Senhas Chamadas</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Resetar Todas as Senhas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resetar Senhas</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja resetar todas as senhas? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Resetar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Lista de senhas chamadas */}
      <Card>
        <CardContent className="p-6">
          {passwordCalls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma senha foi chamada ainda
            </div>
          ) : (
            <div className="space-y-4">
              {passwordCalls.map((call) => (
                <div 
                  key={call.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-xl">
                        {call.password_number}
                      </div>
                      <div>
                        <p className="font-semibold">Senha {call.password_number}</p>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Chamada em: {formatDate(call.called_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordControl;
