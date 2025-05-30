
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TheaterState, Seat, Student, Sale } from '../types';
import { useSales } from '@/hooks/useSales';

interface TheaterContextType {
  state: TheaterState;
  selectSeat: (seatId: string) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  completeSale: (buyerName: string, buyerPhone: string, studentId?: string) => void;
  loadSoldSeatsFromDatabase: (sales: any[]) => void;
  refreshSeats: () => void;
}

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

// Gerar layout de assentos conforme especificação
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 'ABCDEFGHIJLMNOPQRSTUVWXYZ'.split('').slice(0, 21); // A-U
  
  // Configuração específica de assentos por fileira
  const seatConfig: { [key: string]: { esq: number[], central: number[], dir: number[] } } = {
    'A': { esq: [1, 2, 3], central: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], dir: [22, 23, 24] },
    'B': { esq: [1, 2, 3, 4, 5], central: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], dir: [24, 25, 26, 27, 28] },
    'C': { esq: [1, 2, 3, 4, 5, 6], central: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], dir: [25, 26, 27, 28, 29, 30] },
    'D': { esq: [1, 2, 3, 4, 5, 6, 7], central: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], dir: [26, 27, 28, 29, 30, 31, 32] },
    'E': { esq: [1, 2, 3, 4, 5, 6, 7, 8], central: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], dir: [27, 28, 29, 30, 31, 32, 33, 34] },
    'F': { esq: [1, 2, 3, 4, 5, 6, 7, 8, 9], central: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], dir: [28, 29, 30, 31, 32, 33, 34, 35, 36] }
  };

  // Para fileiras G até T (de 1 a 10 na esquerda, central, de 29 a 38 na direita)
  for (let i = 6; i < 20; i++) { // G=6, H=7, ..., T=19
    const row = rows[i];
    seatConfig[row] = {
      esq: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      central: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      dir: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38]
    };
  }

  // Fila U (de 1 a 9 na esquerda, central, de 28 a 36 na direita)
  seatConfig['U'] = {
    esq: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    central: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    dir: [28, 29, 30, 31, 32, 33, 34, 35, 36]
  };

  rows.forEach(row => {
    const config = seatConfig[row];
    if (!config) return;
    
    // PNE ESQ
    config.esq.forEach(number => {
      seats.push({
        id: `${row}${number}-ESQ`,
        sector: 'PNE ESQ',
        row,
        number,
        status: 'available'
      });
    });
    
    // CENTRAL
    config.central.forEach(number => {
      seats.push({
        id: `${row}${number}-CENTRAL`,
        sector: 'CENTRAL',
        row,
        number,
        status: 'available'
      });
    });
    
    // PNE DIR
    config.dir.forEach(number => {
      seats.push({
        id: `${row}${number}-DIR`,
        sector: 'PNE DIR',
        row,
        number,
        status: 'available'
      });
    });
  });

  return seats;
};

const initialState: TheaterState = {
  seats: generateSeats(),
  students: [],
  sales: [],
  selectedSeats: []
};

type Action =
  | { type: 'SELECT_SEAT'; payload: string }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: { id: string; student: Partial<Student> } }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'COMPLETE_SALE'; payload: Sale }
  | { type: 'LOAD_STATE'; payload: TheaterState }
  | { type: 'UPDATE_SEATS_FROM_SALES'; payload: any[] }
  | { type: 'REFRESH_SEATS' };

const theaterReducer = (state: TheaterState, action: Action): TheaterState => {
  switch (action.type) {
    case 'SELECT_SEAT':
      if (state.selectedSeats.includes(action.payload)) return state;
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
        seats: state.seats.map(seat =>
          seat.id === action.payload ? { ...seat, status: 'selected' } : seat
        )
      };
    
    case 'DESELECT_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(id => id !== action.payload),
        seats: state.seats.map(seat =>
          seat.id === action.payload ? { ...seat, status: 'available' } : seat
        )
      };
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedSeats: [],
        seats: state.seats.map(seat =>
          seat.status === 'selected' ? { ...seat, status: 'available' } : seat
        )
      };
    
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload]
      };
    
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? { ...student, ...action.payload.student } : student
        )
      };
    
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(student => student.id !== action.payload)
      };
    
    case 'COMPLETE_SALE':
      return {
        ...state,
        sales: [...state.sales, action.payload],
        seats: state.seats.map(seat =>
          action.payload.seats.includes(seat.id) 
            ? { ...seat, status: 'sold', soldTo: action.payload.id }
            : seat
        ),
        selectedSeats: []
      };
    
    case 'UPDATE_SEATS_FROM_SALES':
      const soldSeats: string[] = [];
      action.payload.forEach(sale => {
        if (sale.seats && Array.isArray(sale.seats)) {
          soldSeats.push(...sale.seats);
        }
      });
      
      return {
        ...state,
        seats: state.seats.map(seat => {
          if (soldSeats.includes(seat.id)) {
            return { ...seat, status: 'sold' };
          } else if (seat.status === 'sold' && !soldSeats.includes(seat.id)) {
            return { ...seat, status: 'available' };
          } else if (state.selectedSeats.includes(seat.id)) {
            return { ...seat, status: 'selected' };
          } else if (seat.status !== 'blocked') {
            return { ...seat, status: 'available' };
          }
          return seat;
        })
      };

    case 'REFRESH_SEATS':
      return {
        ...state,
        seats: generateSeats(),
        selectedSeats: []
      };
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
};

export const TheaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(theaterReducer, initialState);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('theaterState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('theaterState', JSON.stringify(state));
  }, [state]);

  const selectSeat = (seatId: string) => {
    const seat = state.seats.find(s => s.id === seatId);
    if (seat && seat.status === 'available') {
      dispatch({ type: 'SELECT_SEAT', payload: seatId });
    }
  };

  const deselectSeat = (seatId: string) => {
    dispatch({ type: 'DESELECT_SEAT', payload: seatId });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_STUDENT', payload: newStudent });
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    dispatch({ type: 'UPDATE_STUDENT', payload: { id, student } });
  };

  const deleteStudent = (id: string) => {
    dispatch({ type: 'DELETE_STUDENT', payload: id });
  };

  const completeSale = (buyerName: string, buyerPhone: string, studentId?: string) => {
    const sale: Sale = {
      id: Date.now().toString(),
      seats: [...state.selectedSeats],
      buyerName,
      buyerPhone,
      studentId,
      saleDate: Date.now(),
      totalValue: state.selectedSeats.length * 10 // R$ 10 por ingresso
    };
    dispatch({ type: 'COMPLETE_SALE', payload: sale });
  };

  const loadSoldSeatsFromDatabase = (sales: any[]) => {
    dispatch({ type: 'UPDATE_SEATS_FROM_SALES', payload: sales });
  };

  const refreshSeats = () => {
    dispatch({ type: 'REFRESH_SEATS' });
  };

  return (
    <TheaterContext.Provider value={{
      state,
      selectSeat,
      deselectSeat,
      clearSelection,
      addStudent,
      updateStudent,
      deleteStudent,
      completeSale,
      loadSoldSeatsFromDatabase,
      refreshSeats
    }}>
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheater must be used within TheaterProvider');
  }
  return context;
};
