
import React, { useState } from 'react';
import { useTheater } from '../context/TheaterContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SaleFinalization = () => {
  const { state, completeSale, clearSelection } = useTheater();
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [useStudentData, setUseStudentData] = useState(false);

  const selectedSeats = state.seats.filter(seat => 
    state.selectedSeats.includes(seat.id)
  );

  const totalValue = selectedSeats.length * 10; // R$ 10 por ingresso

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (studentId && studentId !== 'new') {
      const student = state.students.find(s => s.id === studentId);
      if (student) {
        setBuyerName(student.responsibleName);
        setBuyerPhone(student.phone);
        setUseStudentData(true);
      }
    } else {
      setBuyerName('');
      setBuyerPhone('');
      setUseStudentData(false);
    }
  };

  const handleCompleteSale = (e: React.FormEvent) => {
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

    completeSale(
      buyerName, 
      buyerPhone, 
      selectedStudentId && selectedStudentId !== 'new' ? selectedStudentId : undefined
    );

    toast({
      title: "Venda Realizada!",
      description: `${selectedSeats.length} ingresso(s) vendido(s) com sucesso!`,
    });

    navigate('/');
  };

  const handleCancel = () => {
    clearSelection();
    navigate('/');
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold text-gray-900">Finalizar Venda</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
                      <span className="text-green-600 font-semibold">R$ 10,00</span>
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
                    {state.students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.studentName} - {student.responsibleName}
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
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Confirmar Venda
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaleFinalization;
