
import { useEffect } from 'react';
import { useSales } from './useSales';
import { useTheater } from '../context/TheaterContext';

export const useSalesSync = () => {
  const { data: sales = [], isLoading, error } = useSales();
  const { loadSoldSeatsFromDatabase } = useTheater();

  useEffect(() => {
    if (!isLoading && sales && !error) {
      console.log('Sincronizando assentos com vendas:', sales.length);
      loadSoldSeatsFromDatabase(sales);
    }
  }, [sales, isLoading, error, loadSoldSeatsFromDatabase]);

  return { sales, isLoading, error };
};
