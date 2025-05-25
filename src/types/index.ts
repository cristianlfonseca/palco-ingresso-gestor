
export interface Seat {
  id: string;
  sector: 'PNE ESQ' | 'PNE DIR';
  row: string;
  number: number;
  status: 'available' | 'selected' | 'sold' | 'blocked';
  soldTo?: string;
}

export interface Student {
  id: string;
  studentName: string;
  responsibleName: string;
  phone: string;
}

export interface Sale {
  id: string;
  seats: string[];
  buyerName: string;
  buyerPhone: string;
  studentId?: string;
  saleDate: number;
  totalValue: number;
}

export interface TheaterState {
  seats: Seat[];
  students: Student[];
  sales: Sale[];
  selectedSeats: string[];
}
