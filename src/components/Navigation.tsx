
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, ShoppingCart, BarChart3, LogOut, Phone, List, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Teatro Manager</h1>
            </div> */}
              <img 
                src="/logo.jpg" 
                alt="Logo Teatro Manager"
                className="h-10 object-contain"
              />
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Assentos
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
            
            <Link to="/sales-management">
              <Button 
                variant={isActive('/sales-management') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Vendas
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

            <Link to="/password-control">
              <Button 
                variant={isActive('/password-control') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Senhas
              </Button>
            </Link>

            <Link to="/panel">
              <Button 
                variant={isActive('/panel') ? 'default' : 'ghost'} 
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                
              </Button>
            </Link>

            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-600">
                  Olá, {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
