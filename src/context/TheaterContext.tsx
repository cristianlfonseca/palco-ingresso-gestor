
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TheaterState, Seat, Student, Sale } from '../types';

interface TheaterContextType {
  state: TheaterState;
  selectSeat: (seatId: string) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  completeSale: (buyerName: string, buyerPhone: string, studentId?: string) => void;
}

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

// Gerar layout de assentos baseado na imagem
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, 21); // A-U
  
  // Configuração específica de assentos por fileira baseada na imagem
  const seatConfig: { [key: string]: number } = {
    'A': 4, 'B': 6, 'C': 7, 'D': 8, 'E': 9, 'F': 10,
    'G': 11, 'H': 12, 'I': 13, 'J': 14, 'K': 15, 'L': 16,
    'M': 17, 'N': 18, 'O': 19, 'P': 20, 'Q': 21, 'R': 22,
    'S': 23, 'T': 24, 'U': 28
  };

  rows.forEach(row => {
    const seatsInRow = seatConfig[row] || 10;
    
    // PNE ESQ
    for (let i = 1; i <= seatsInRow; i++) {
      seats.push({
        id: `${row}${i}-ESQ`,
        sector: 'PNE ESQ',
        row,
        number: i,
        status: 'available'
      });
    }
    
    // PNE DIR
    for (let i = 1; i <= seatsInRow; i++) {
      seats.push({
        id: `${row}${i}-DIR`,
        sector: 'PNE DIR',
        row,
        number: i,
        status: 'available'
      });
    }
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
  | { type: 'LOAD_STATE'; payload: TheaterState };

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

  return (
    <TheaterContext.Provider value={{
      state,
      selectSeat,
      deselectSeat,
      clearSelection,
      addStudent,
      updateStudent,
      deleteStudent,
      completeSale
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
