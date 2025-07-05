
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  User,
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { useStudents } from '@/hooks/useStudents';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Função auxiliar para formatar informações do assento
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

const SeatSearch = () => {
  const { data: sales = [], isLoading } = useSales();
  const { data: students = [] } = useStudents();
  
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Gerar fileiras A-U
  const rows = 'ABCDEFGHIJLMNOPQRSTUVWXYZ'.split('').slice(0, 21);
  
  // Gerar números baseado no setor selecionado
  const getNumbersForSector = (sector: string, row: string) => {
    if (!sector || !row) return [];
    
    // Configuração específica de assentos por fileira (baseado no código original)
    const seatConfig: { [key: string]: { [sector: string]: number[] } } = {
      'A': { 'PNE ESQ': [1, 2, 3], 'CENTRAL': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 'PNE DIR': [22, 23, 24] },
      'B': { 'PNE ESQ': [1, 2, 3, 4, 5], 'CENTRAL': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 'PNE DIR': [24, 25, 26, 27, 28] },
      'C': { 'PNE ESQ': [1, 2, 3, 4, 5, 6], 'CENTRAL': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 'PNE DIR': [25, 26, 27, 28, 29, 30] },
      'D': { 'PNE ESQ': [1, 2, 3, 4, 5, 6, 7], 'CENTRAL': [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 'PNE DIR': [26, 27, 28, 29, 30, 31, 32] },  
      'E': { 'PNE ESQ': [1, 2, 3, 4, 5, 6, 7, 8], 'CENTRAL': [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 'PNE DIR': [27, 28, 29, 30, 31, 32, 33, 34] },
      'F': { 'PNE ESQ': [1, 2, 3, 4, 5, 6, 7, 8, 9], 'CENTRAL': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], 'PNE DIR': [28, 29, 30, 31, 32, 33, 34, 35, 36] }
    };

    // Para fileiras G até T
    for (let i = 6; i < 20; i++) {
      const rowLetter = rows[i];
      seatConfig[rowLetter] = {
        'PNE ESQ': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'CENTRAL': [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        'PNE DIR': [29, 30, 31, 32, 33, 34, 35, 36, 37, 38]
      };
    }

    // Fila U
    seatConfig['U'] = {
      'PNE ESQ': [1, 2, 3, 4, 5, 6, 7, 8, 9],
      'CENTRAL': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      'PNE DIR': [28, 29, 30, 31, 32, 33, 34, 35, 36]
    };

    return seatConfig[row]?.[sector] || [];
  };

  const searchSeat = () => {
    if (!selectedSector || !selectedRow || !selectedNumber) {
      setSearchResult(null);
      return;
    }

    // Construir o ID do assento baseado na seleção
    const seatId = `${selectedRow}${selectedNumber}-${selectedSector === 'PNE ESQ' ? 'ESQ' : selectedSector === 'PNE DIR' ? 'DIR' : 'CENTRAL'}`;
    
    // Buscar a venda que contém este assento
    const sale = sales.find(sale => sale.seats.includes(seatId));
    
    if (sale) {
      // Buscar informações do aluno se houver
      const student = students.find(s => s.id === sale.student_id);
      
      setSearchResult({
        seat: seatId,
        sale: sale,
        student: student,
        seatDisplay: getSeatInfo(seatId)
      });
    } else {
      setSearchResult({
        seat: seatId,
        sale: null,
        student: null,
        seatDisplay: getSeatInfo(seatId)
      });
    }
  };

  const clearSearch = () => {
    setSelectedSector('');
    setSelectedRow('');
    setSelectedNumber('');
    setSearchResult(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Buscar Assento</h2>
        <MapPin className="w-8 h-8 text-gray-600" />
      </div>

      {/* Formulário de Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Localizar Assento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor
              </label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PNE ESQ">ESQ</SelectItem>
                  <SelectItem value="CENTRAL">CENTRAL</SelectItem>
                  <SelectItem value="PNE DIR">DIR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fileira
              </label>
              <Select value={selectedRow} onValueChange={setSelectedRow}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fileira" />
                </SelectTrigger>
                <SelectContent>
                  {rows.map(row => (
                    <SelectItem key={row} value={row}>{row}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número
              </label>
              <Select 
                value={selectedNumber} 
                onValueChange={setSelectedNumber}
                disabled={!selectedSector || !selectedRow}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o número" />
                </SelectTrigger>
                <SelectContent>
                  {getNumbersForSector(selectedSector, selectedRow).map(number => (
                    <SelectItem key={number} value={number.toString()}>{number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                onClick={searchSeat}
                disabled={!selectedSector || !selectedRow || !selectedNumber}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={clearSearch}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Busca */}
      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Resultado da Busca: {searchResult.seatDisplay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResult.sale ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="destructive">Vendido</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Comprador
                      </h4>
                      <p className="text-lg">{searchResult.sale.buyer_name}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </h4>
                      <p>{searchResult.sale.buyer_phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Data da Venda
                      </h4>
                      <p>{new Date(searchResult.sale.sale_date).toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4" />
                        Valor Total da Venda
                      </h4>
                      <p className="text-lg font-bold text-green-600">
                        R$ {searchResult.sale.total_value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {searchResult.student ? (
                      <div>
                        <h4 className="font-semibold mb-2">Aluno Vinculado</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="font-medium text-blue-900">
                            {searchResult.student.student_name}
                          </p>
                          <p className="text-sm text-blue-700">
                            Responsável: {searchResult.student.responsible_name}
                          </p>
                          <p className="text-sm text-blue-700">
                            Telefone: {searchResult.student.phone}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold mb-2">Aluno Vinculado</h4>
                        <p className="text-gray-500">Nenhum aluno vinculado a esta venda</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-2">Outros Assentos na Mesma Venda</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.sale.seats.map(seatId => (
                          <Badge 
                            key={seatId} 
                            variant={seatId === searchResult.seat ? "default" : "secondary"}
                          >
                            {getSeatInfo(seatId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary">Disponível</Badge>
                </div>
                <p className="text-gray-600">
                  O assento <strong>{searchResult.seatDisplay}</strong> está disponível para venda.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeatSearch;
