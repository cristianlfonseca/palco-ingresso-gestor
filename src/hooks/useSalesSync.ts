
import { useEffect } from 'react';
import { useSales } from './useSales';
import { useTheater } from '../context/TheaterContext';

export const useSalesSync = () => {
  const { data: sales = [], isLoading } = useSales();
  const { loadSoldSeatsFromDatabase } = useTheater();

  useEffect(() => {
    if (!isLoading && sales) {
      console.log('Sincronizando assentos com vendas:', sales.length);
      loadSoldSeatsFromDatabase(sales);
    }
  }, [sales, isLoading, loadSoldSeatsFromDatabase]);

  return { sales, isLoading };
};
