
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Calendar, 
  Phone, 
  MapPin, 
  Trash2, 
  Eye,
  Filter,
  DollarSign,
  User
} from 'lucide-react';
import { useSales, useDeleteSale } from '@/hooks/useSales';
import { useStudents } from '@/hooks/useStudents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesManagement = () => {
  const { data: sales = [], isLoading } = useSales();
  const { data: students = [] } = useStudents();
  const deleteSale = useDeleteSale();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.buyer_phone.includes(searchTerm);

    const matchesDate = !filterDate || 
                       new Date(sale.sale_date).toISOString().split('T')[0] === filterDate;

    const matchesStudent = !filterStudent || 
                          sale.student_id === filterStudent;

    return matchesSearch && matchesDate && matchesStudent;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSeatInfo = (seatId: string) => {
    const parts = seatId.split('-');
    if (parts.length === 2) {
      const seatPart = parts[0];
      const sector = parts[1];
      const row = seatPart.charAt(0);
      const number = seatPart.slice(1);
      return `${sector} ${row}${number}`;
    }
    return seatId;
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await deleteSale.mutateAsync(saleId);
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    setFilterStudent('');
  };

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_value, 0);
  const totalTickets = filteredSales.reduce((sum, sale) => sum + sale.seats.length, 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Gerenciamento de Vendas</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando vendas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Gerenciamento de Vendas</h2>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-600">{sales.length} vendas realizadas</span>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Filtradas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSales.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de vendas na busca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              Total de assentos vendidos
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
              Receita das vendas filtradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filtrar por data"
            />
            
            <Select value={filterStudent} onValueChange={setFilterStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os compradores</SelectItem>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.student_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {sales.length === 0 
                ? 'Nenhuma venda realizada ainda' 
                : 'Nenhuma venda encontrada com os filtros aplicados'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Assentos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.buyer_name}</TableCell>
                    <TableCell>{sale.buyer_phone}</TableCell>
                    <TableCell>
                      {sale.students ? (
                        <Badge variant="secondary">
                          {sale.students.student_name}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDateOnly(sale.sale_date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sale.seats.length} assento{sale.seats.length > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      R$ {sale.total_value.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Venda</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Comprador
                                  </h4>
                                  <p>{sale.buyer_name}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Telefone
                                  </h4>
                                  <p>{sale.buyer_phone}</p>
                                </div>
                              </div>
                              
                              {sale.students && (
                                <div>
                                  <h4 className="font-semibold">Aluno Vinculado</h4>
                                  <p>{sale.students.student_name}</p>
                                  <p className="text-sm text-gray-600">Responsável: {sale.students.responsible_name}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Data da Venda
                                </h4>
                                <p>{formatDate(sale.sale_date)}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Assentos Comprados
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {sale.seats.map(seatId => (
                                    <Badge key={seatId} variant="secondary">
                                      {getSeatInfo(seatId)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  Valor Total
                                </h4>
                                <p className="text-2xl font-bold text-green-600">R$ {sale.total_value.toFixed(2)}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={deleteSale.isPending}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deletar Venda</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja deletar esta venda? Esta ação não pode ser desfeita.
                                <br /><br />
                                <strong>Comprador:</strong> {sale.buyer_name}<br />
                                <strong>Valor:</strong> R$ {sale.total_value.toFixed(2)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagement;
