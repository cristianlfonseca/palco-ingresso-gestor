
import React, { useState } from 'react';
import { useTheater } from '../context/TheaterContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { useCreateSale, useSales } from '@/hooks/useSales';
import { useSettings } from '@/hooks/useSettings';

const SaleFinalization = () => {
  const { state, clearSelection } = useTheater();
  const navigate = useNavigate();
  const { data: students = [] } = useStudents();
  const { data: settings } = useSettings();
  const { data: allSales = [] } = useSales();
  const createSale = useCreateSale();
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [useStudentData, setUseStudentData] = useState(false);

  const selectedSeats = state.seats.filter(seat => 
    state.selectedSeats.includes(seat.id)
  );

  const ticketPrice = settings?.ticket_price || 10;
  const totalValue = selectedSeats.length * ticketPrice;

  // Filtrar vendas do aluno selecionado
  const studentSales = selectedStudentId && selectedStudentId !== 'new' 
    ? allSales.filter(sale => sale.student_id === selectedStudentId)
    : [];

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (studentId && studentId !== 'new') {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setBuyerName(student.responsible_name);
        setBuyerPhone(student.phone);
        setUseStudentData(true);
      }
    } else {
      setBuyerName('');
      setBuyerPhone('');
      setUseStudentData(false);
    }
  };

  const handleCompleteSale = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName || !buyerPhone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum assento selecionado",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSale.mutateAsync({
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        student_id: selectedStudentId && selectedStudentId !== 'new' ? selectedStudentId : undefined,
        seats: state.selectedSeats,
        total_value: totalValue,
        sale_date: new Date().toISOString()
      });

      clearSelection();
      navigate('/');
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
    }
  };

  const handleCancel = () => {
    clearSelection();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
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

  if (selectedSeats.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Card>
          <CardContent className="pt-6">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum assento selecionado</h2>
            <p className="text-gray-600 mb-4">
              Selecione assentos no mapa para finalizar uma venda.
            </p>
            <Button onClick={() => navigate('/')}>
              Voltar ao Mapa de Assentos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold text-gray-900">Finalizar Venda</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Resumo da Compra */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Assentos Selecionados:</h4>
                <div className="space-y-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{seat.sector} - Fileira {seat.row}, Assento {seat.number}</span>
                      <span className="text-green-600 font-semibold">R$ {ticketPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Comprador */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Comprador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompleteSale} className="space-y-4">
              <div>
                <Label htmlFor="student-select">Selecionar Aluno Cadastrado (opcional)</Label>
                <Select value={selectedStudentId} onValueChange={handleStudentSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno ou digite novos dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Novo comprador</SelectItem>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.student_name} - {student.responsible_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buyerName">Nome do Comprador *</Label>
                <Input
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  disabled={useStudentData}
                />
              </div>

              <div>
                <Label htmlFor="buyerPhone">Telefone *</Label>
                <Input
                  id="buyerPhone"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                  required
                  disabled={useStudentData}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={createSale.isPending}
                >
                  {createSale.isPending ? 'Processando...' : 'Confirmar Venda'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Compras do Aluno */}
      {selectedStudentId && selectedStudentId !== 'new' && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Compras do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            {studentSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Este aluno ainda não possui compras registradas.
              </div>
            ) : (
              <div className="space-y-4">
                {studentSales.map(sale => (
                  <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{sale.buyer_name}</h4>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(sale.sale_date)}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        R$ {sale.total_value.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
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
      )}
    </div>
  );
};

export default SaleFinalization;
