
import React from 'react';
import { useTheater } from '../context/TheaterContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSalesSync } from '@/hooks/useSalesSync';

const SeatMap = () => {
  const { state, selectSeat, deselectSeat, clearSelection } = useTheater();
  const { isLoading } = useSalesSync();
  const navigate = useNavigate();
  
  // Inverter a ordem das fileiras - U até A (de baixo para cima)
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, 21).reverse(); // U-A
  
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800';
      case 'selected': return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600';
      case 'sold': return 'bg-red-500 text-white border-red-600 cursor-not-allowed';
      case 'blocked': return 'bg-gray-400 text-white border-gray-500 cursor-not-allowed';
      default: return 'bg-gray-200';
    }
  };

  const handleSeatClick = (seatId: string, status: string) => {
    if (status === 'sold' || status === 'blocked') return;
    
    if (status === 'selected') {
      deselectSeat(seatId);
    } else {
      selectSeat(seatId);
    }
  };

  const getSeatsByRowAndSector = (row: string, sector: 'PNE ESQ' | 'CENTRAL' | 'PNE DIR') => {
    return state.seats
      .filter(seat => seat.row === row && seat.sector === sector)
      .sort((a, b) => a.number - b.number);
  };

  const proceedToSale = () => {
    if (state.selectedSeats.length > 0) {
      navigate('/sale');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <p>Carregando mapa de assentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Mapa de Assentos do Teatro</h2>
        <div className="flex justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-green-300 border rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border-blue-600 border rounded"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border-red-600 border rounded"></div>
            <span>Vendido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 border-gray-500 border rounded"></div>
            <span>Bloqueado</span>
          </div>
        </div>
      </div> */}

      {/* Mapa de Assentos */}
      <div className="flex justify-center gap-8 mb-8" >
        {/* Setor ESQ */}
        <div className="flex flex-col items-center" >
          <h3 className="text-xl font-bold mb-4 text-gray-700">ESQ</h3>
          <div className="space-y-2" >
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'PNE ESQ');
              if (seats.length === 0) return null;
              return (
                // <div key={`${row}-ESQ`} className="flex items-center gap-1 ">
                <div key={`${row}-ESQ`} className="flex justify-end w-full ">
                  <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                  {/* <div className="flex gap-1" > */}
                    <div className="flex gap-1 justify-end w-full">
                    {seats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id, seat.status)}
                        className={`
                          w-8 h-8 text-xs font-semibold border-2 rounded transition-all duration-200
                          ${getSeatColor(seat.status)}
                          ${seat.status === 'available' ? 'hover:scale-105' : ''}
                        `}
                        disabled={seat.status === 'sold' || seat.status === 'blocked'}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setor CENTRAL */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-gray-700">CENTRAL</h3>
          <div className="space-y-2">
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'CENTRAL');
              if (seats.length === 0) return null;
              return (
                <div key={`${row}-CENTRAL`} className="flex items-center gap-1">
                  <div className="flex gap-1">
                    {seats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id, seat.status)}
                        className={`
                          w-8 h-8 text-xs font-semibold border-2 rounded transition-all duration-200
                          ${getSeatColor(seat.status)}
                          ${seat.status === 'available' ? 'hover:scale-105' : ''}
                        `}
                        disabled={seat.status === 'sold' || seat.status === 'blocked'}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setor DIR */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-gray-700">DIR</h3>
          <div className="space-y-2">
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'PNE DIR');
              if (seats.length === 0) return null;
              return (
                <div key={`${row}-DIR`} className="flex items-center gap-1">
                  <div className="flex gap-1">
                    {seats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id, seat.status)}
                        className={`
                          w-8 h-8 text-xs font-semibold border-2 rounded transition-all duration-200
                          ${getSeatColor(seat.status)}
                          ${seat.status === 'available' ? 'hover:scale-105' : ''}
                        `}
                        disabled={seat.status === 'sold' || seat.status === 'blocked'}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                  <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Palco */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 px-8 rounded-lg inline-block font-semibold">
          PALCO
        </div>
      </div>

     <div className="text-center mb-8">
        {/* <h2 className="text-3xl font-bold text-gray-900 mb-4">Mapa de Assentos do Teatro</h2> */}
        <div className="flex justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-green-300 border rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border-blue-600 border rounded"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border-red-600 border rounded"></div>
            <span>Vendido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 border-gray-500 border rounded"></div>
            <span>Bloqueado</span>
          </div>
        </div>
      </div>      

      
      <div className="text-center space-y-4">
        {state.selectedSeats.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-blue-800 font-semibold mb-2">
              {state.selectedSeats.length} assento(s) selecionado(s)
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={clearSelection} variant="outline" size="sm">
                Limpar Seleção
              </Button>
              <Button onClick={proceedToSale} className="bg-blue-600 hover:bg-blue-700">
                Prosseguir com Venda
              </Button>
            </div>
          </div>
        )}
        
        {state.selectedSeats.length === 0 && (
          <p className="text-gray-600">Selecione os assentos para iniciar uma venda</p>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
