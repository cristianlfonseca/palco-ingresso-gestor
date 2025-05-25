
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, ShoppingCart, BarChart3 } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Teatro Manager</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Mapa de Assentos
              </Button>
            </Link>
            
            <Link to="/students">
              <Button 
                variant={isActive('/students') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Alunos
              </Button>
            </Link>
            
            <Link to="/sale">
              <Button 
                variant={isActive('/sale') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Finalizar Venda
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
