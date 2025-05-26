import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, ShoppingCart, MapPin, DollarSign, Calendar, Phone, Trash2 } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useSales, useDeleteSale } from '@/hooks/useSales';
import { useTheater } from '../context/TheaterContext';
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

const Dashboard = () => {
  const { state } = useTheater();
  const { data: students = [] } = useStudents();
  const { data: sales = [] } = useSales();
  const deleteSale = useDeleteSale();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Estatísticas gerais
  const totalSeats = state.seats.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_value, 0);

  // Vendas por setor - baseado nas vendas reais
  const seatsSoldESQ = sales.reduce((count, sale) => {
    return count + sale.seats.filter(seatId => seatId.includes('-ESQ')).length;
  }, 0);
  
  const seatsSoldCENTRAL = sales.reduce((count, sale) => {
    return count + sale.seats.filter(seatId => seatId.includes('-CENTRAL')).length;
  }, 0);
  
  const seatsSoldDIR = sales.reduce((count, sale) => {
    return count + sale.seats.filter(seatId => seatId.includes('-DIR')).length;
  }, 0);

  const totalSoldSeats = seatsSoldESQ + seatsSoldCENTRAL + seatsSoldDIR;

  // Filtrar vendas
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.buyer_phone.includes(searchTerm);

    const matchesDate = !filterDate || 
                       new Date(sale.sale_date).toISOString().split('T')[0] === filterDate;

    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getSeatInfo = (seatId: string) => {
    // Parse do formato "A1-ESQ" para extrair informações
    const parts = seatId.split('-');
    if (parts.length === 2) {
      const seatPart = parts[0]; // A1
      const sector = parts[1]; // ESQ
      const row = seatPart.charAt(0); // A
      const number = seatPart.slice(1); // 1
      return `${sector} ${row}${number}`;
    }
    return seatId;
  };

  const handleDeleteSale = async (saleId: string) => {
    await deleteSale.mutateAsync(saleId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assentos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeats}</div>
            <p className="text-xs text-muted-foreground">
              Capacidade total do teatro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalSoldSeats}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length} venda(s) realizada(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              {students.length === 0 
                ? 'Nenhum aluno cadastrado' 
                : 'Alunos no sistema'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Receita acumulada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vendas por Setor */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>PNE ESQ</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${totalSeats > 0 ? (seatsSoldESQ / (totalSeats / 3)) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{seatsSoldESQ}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>CENTRAL</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${totalSeats > 0 ? (seatsSoldCENTRAL / (totalSeats / 3)) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{seatsSoldCENTRAL}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>PNE DIR</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${totalSeats > 0 ? (seatsSoldDIR / (totalSeats / 3)) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{seatsSoldDIR}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total de Vendas:</span>
                <span className="font-semibold">{sales.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Ingressos Vendidos:</span>
                <span className="font-semibold">{totalSoldSeats}</span>
              </div>
              <div className="flex justify-between">
                <span>Receita Média por Venda:</span>
                <span className="font-semibold">
                  R$ {sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-40"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {sales.length === 0 
                ? 'Nenhuma venda realizada ainda' 
                : 'Nenhuma venda encontrada com os filtros aplicados'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSales.map(sale => (
                <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{sale.buyer_name}</h4>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{sale.buyer_phone}</span>
                      </div>
                      {sale.students && (
                        <div className="text-sm text-blue-600">
                          Aluno: {sale.students.student_name}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          R$ {sale.total_value.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(sale.sale_date)}</span>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar Venda</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja deletar esta venda? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSale(sale.id)}>
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Assentos: </span>
                    <span className="text-sm text-gray-600">
                      {sale.seats.map(seatId => getSeatInfo(seatId)).join(', ')}
                    </span>
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

export default Dashboard;
