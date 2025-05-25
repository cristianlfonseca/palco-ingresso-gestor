
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';

const Settings = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [ticketPrice, setTicketPrice] = useState('');

  useEffect(() => {
    if (settings) {
      setTicketPrice(settings.ticket_price.toString());
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(ticketPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    await updateSettings.mutateAsync({
      ticket_price: price
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <SettingsIcon className="w-8 h-8 text-gray-700" />
        <h2 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preço dos Ingressos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="max-w-sm">
                <Label htmlFor="ticketPrice">Valor do Ingresso (R$)</Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Este valor será aplicado a todos os novos ingressos vendidos.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Última atualização:</strong> {
                settings?.updated_at 
                  ? new Date(settings.updated_at).toLocaleString('pt-BR')
                  : 'Não disponível'
              }</p>
              <p><strong>Preço atual:</strong> R$ {settings?.ticket_price?.toFixed(2) || '0.00'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
