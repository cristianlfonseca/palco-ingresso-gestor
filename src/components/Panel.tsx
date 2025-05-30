
// import React, { useEffect } from 'react';
// import { usePasswordCalls } from '@/hooks/usePasswordCalls';
// import { useSalesSync } from '@/hooks/useSalesSync';
// import PanelSeatMap from './PanelSeatMap';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Calendar } from 'lucide-react';

// const Panel = () => {
//   const { data: passwordCalls = [] } = usePasswordCalls();
//   const { isLoading } = useSalesSync();

//   // Atualizar a página a cada 10 segundos
//   useEffect(() => {
//     const interval = setInterval(() => {
//       window.location.reload();
//     }, 10000); // 10 segundos

//     return () => clearInterval(interval);
//   }, []);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('pt-BR');
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('pt-BR', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel do Teatro</h1>
//           <p className="text-gray-600">Atualização automática a cada 10 segundos</p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Mapa de Assentos - 2/3 da tela */}
//           <div className="lg:col-span-2">
//             <Card className="h-full">
//               <CardContent className="p-6">
//                 <PanelSeatMap />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Senhas Chamadas - 1/3 da tela */}
//           <div className="lg:col-span-1">
//             <Card className="h-full">
//               <CardHeader>
//                 <CardTitle className="text-xl">Senhas Chamadas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {passwordCalls.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     Nenhuma senha chamada
//                   </div>
//                 ) : (
//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {passwordCalls.map((call, index) => (
//                       <div 
//                         key={call.id} 
//                         className={`border rounded-lg p-3 transition-all duration-300 ${
//                           index === 0 
//                             ? 'bg-blue-50 border-blue-200  shadow-md' 
//                             : 'bg-white border-gray-200'
//                         }`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className={`font-bold text-2xl ${
//                             index === 0 ? 'text-blue-600' : 'text-gray-700'
//                           }`}>
//                             {call.password_number}
//                           </div>
//                           <div className="text-right">
//                             <div className="text-xs text-gray-500 flex items-center gap-1">
//                               <Calendar className="w-3 h-3" />
//                               {formatTime(call.called_at)}
//                             </div>
//                           </div>
//                         </div>
//                         {index === 0 && (
//                           <div className="mt-2 text-sm font-semibold text-blue-600">
//                             Senha Atual
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Rodapé com informações */}
//         <div className="mt-6 text-center text-gray-500 text-sm">
//           <p>Sistema de Controle de Teatro - Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Panel;

import React, { useEffect, useState, useRef } from 'react';
import { usePasswordCalls } from '@/hooks/usePasswordCalls';
import { useSalesSync } from '@/hooks/useSalesSync';
import PanelSeatMap from './PanelSeatMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Volume2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const Panel = () => {
  const { data: passwordCalls = [], refetch: refetchPasswords } = usePasswordCalls();
  const { refetch: refetchSales } = useSalesSync();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [previousPasswordsCount, setPreviousPasswordsCount] = useState(0);
  const queryClient = useQueryClient();
  
  // Referência para o áudio
  const audioRef = useRef(null);

  // Função para tocar o som de notificação
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Erro ao tocar som:', e));
    }
  };

  // Função para atualizar os dados
  const updateData = async () => {
    try {
      // Invalidar e refazer as queries
      await queryClient.invalidateQueries(['password-calls']);
      await queryClient.invalidateQueries(['sales']);
      
      // Refetch manual como backup
      await Promise.all([
        refetchPasswords(),
        refetchSales()
      ]);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  // Verificar se há novas senhas e tocar som
  useEffect(() => {
    if (passwordCalls.length > previousPasswordsCount && previousPasswordsCount > 0) {
      playNotificationSound();
    }
    setPreviousPasswordsCount(passwordCalls.length);
  }, [passwordCalls.length, previousPasswordsCount]);

  // Atualizar dados a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 5000); // 5 segundos para ser mais responsivo

    return () => clearInterval(interval);
  }, []);

  // Inicializar contagem na primeira carga
  useEffect(() => {
    setPreviousPasswordsCount(passwordCalls.length);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Áudio para notificações (som de sino/notification) */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src="/password-came-up.mp3" type="audio/mpeg" />
        {/* <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgFJXfH8N2QQAoUXrTp66hVFApGn+DyvmQcBSV+0PLWdSgEA=" type="audio/wav" /> */}
      password-came-up
      </audio>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel do Teatro</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Volume2 className="w-4 h-4" />
            <p>Atualização automática a cada 5 segundos • Som habilitado</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mapa de Assentos - 2/3 da tela */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <PanelSeatMap />
              </CardContent>
            </Card>
          </div>

          {/* Senhas Chamadas - 1/3 da tela */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  Senhas Chamadas
                  {passwordCalls.length > 0 && (
                    <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {passwordCalls.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {passwordCalls.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma senha chamada
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                    {passwordCalls.map((call, index) => (
                      <div 
                        key={call.id} 
                        className={`border rounded-lg p-3 transition-all duration-500 ${
                          index === 0 
                            ? 'bg-blue-50 border-blue-200 shadow-md animate-pulse' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className={`font-bold text-2xl ${
                            index === 0 ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {call.password_number}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatTime(call.called_at)}
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="mt-2 text-sm font-semibold text-blue-600 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            Senha Atual
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rodapé com informações */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Sistema de Controle de Teatro - Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            {passwordCalls.length > 0 && (
              <span className="ml-2 text-green-600">
                • {passwordCalls.length} senha{passwordCalls.length !== 1 ? 's' : ''} na fila
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Panel;
