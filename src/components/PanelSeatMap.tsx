
import React from 'react';
import { useTheater } from '../context/TheaterContext';
import { useSalesSync } from '@/hooks/useSalesSync';

const PanelSeatMap = () => {
  const { state } = useTheater();
  const { isLoading } = useSalesSync();
  
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, 21); // A-U
  
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'selected': return 'bg-blue-500 text-white border-blue-600';
      case 'sold': return 'bg-red-500 text-white border-red-600';
      case 'blocked': return 'bg-gray-400 text-white border-gray-500';
      default: return 'bg-gray-200';
    }
  };

  const getSeatsByRowAndSector = (row: string, sector: 'PNE ESQ' | 'CENTRAL' | 'PNE DIR') => {
    return state.seats
      .filter(seat => seat.row === row && seat.sector === sector)
      .sort((a, b) => a.number - b.number);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Mapa de Assentos</h3>
        <div className="flex justify-center items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border-green-300 border rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 border-red-600 border rounded"></div>
            <span>Vendido</span>
          </div>
        </div>
      </div>

      {/* Palco */}
      <div className="text-center mb-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 px-4 rounded-lg inline-block text-sm font-semibold">
          PALCO
        </div>
      </div>

      {/* Mapa de Assentos - versão compacta */}
      <div className="flex justify-center gap-4">
        {/* Setor PNE ESQ */}
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-bold mb-2 text-gray-700">PNE ESQ</h4>
          <div className="space-y-1">
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'PNE ESQ');
              if (seats.length === 0) return null;
              return (
                <div key={`${row}-ESQ`} className="flex items-center gap-1">
                  <span className="w-4 text-center text-xs font-bold text-gray-600">{row}</span>
                  <div className="flex gap-0.5">
                    {seats.map(seat => (
                      <div
                        key={seat.id}
                        className={`w-4 h-4 text-xs border rounded ${getSeatColor(seat.status)}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setor CENTRAL */}
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-bold mb-2 text-gray-700">CENTRAL</h4>
          <div className="space-y-1">
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'CENTRAL');
              if (seats.length === 0) return null;
              return (
                <div key={`${row}-CENTRAL`} className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {seats.map(seat => (
                      <div
                        key={seat.id}
                        className={`w-4 h-4 text-xs border rounded ${getSeatColor(seat.status)}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setor PNE DIR */}
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-bold mb-2 text-gray-700">PNE DIR</h4>
          <div className="space-y-1">
            {rows.map(row => {
              const seats = getSeatsByRowAndSector(row, 'PNE DIR');
              if (seats.length === 0) return null;
              return (
                <div key={`${row}-DIR`} className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {seats.map(seat => (
                      <div
                        key={seat.id}
                        className={`w-4 h-4 text-xs border rounded ${getSeatColor(seat.status)}`}
                      />
                    ))}
                  </div>
                  <span className="w-4 text-center text-xs font-bold text-gray-600">{row}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelSeatMap;
