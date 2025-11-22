
import React from 'react';
import { Card } from './UI';
import { HomeIcon, TargetIcon, ChatIcon, UserIcon, CameraIcon, MicIcon, PlusIcon } from './Icons';
import { View, AssistantMode } from '../App';

const StatCard: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
  <div className="flex flex-col items-center">
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-[#475569]">{label}</p>
  </div>
);

interface DashboardProps {
    onNavigate: (view: View, mode?: AssistantMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#F8FAFC]">
      <header className="p-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">Resumo Diário</h1>
        <p className="text-lg text-[#475569]">Olá! Veja como está o seu progresso hoje.</p>
      </header>

      <main className="px-6 space-y-6">
        <Card className="bg-gradient-to-r from-[#1E8E5A] to-[#14653F] text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">Calorias Consumidas</p>
              <p className="text-5xl font-bold">1250 <span className="text-2xl">/ 2000 kcal</span></p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-[#84CC16] flex items-center justify-center bg-[#1E8E5A]/50">
                <span className="text-2xl font-bold">62%</span>
            </div>
          </div>
          <div className="mt-6 flex justify-around">
            <StatCard value="80g" label="Proteína" color="text-white" />
            <StatCard value="110g" label="Carbs" color="text-white" />
            <StatCard value="45g" label="Gordura" color="text-white" />
          </div>
        </Card>
        
        <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Registar Refeição</h2>
            <p className="text-[#475569] mb-4">Adicione a sua última refeição de forma rápida.</p>
            <div className="flex justify-center items-center space-x-4">
                 <button 
                    onClick={() => onNavigate('assistant', 'voice')}
                    className="flex flex-col items-center justify-center w-24 h-24 bg-[#2563EB] text-white rounded-2xl shadow-lg transition-transform transform active:scale-95"
                 >
                    <MicIcon className="w-8 h-8 mb-1"/>
                    <span className="font-semibold text-sm">Voz</span>
                </button>
                 <button 
                    onClick={() => onNavigate('assistant', 'photo')}
                    className="flex flex-col items-center justify-center w-24 h-24 bg-[#2563EB] text-white rounded-2xl shadow-lg transition-transform transform active:scale-95"
                 >
                    <CameraIcon className="w-8 h-8 mb-1"/>
                    <span className="font-semibold text-sm">Foto</span>
                </button>
                 <button 
                    onClick={() => onNavigate('assistant', 'chat')}
                    className="flex flex-col items-center justify-center w-24 h-24 bg-white text-[#475569] border-2 border-gray-300 rounded-2xl shadow-lg transition-transform transform active:scale-95"
                 >
                    <PlusIcon className="w-8 h-8 mb-1"/>
                    <span className="font-semibold text-sm">Manual</span>
                </button>
            </div>
        </div>

        <Card>
            <h3 className="text-xl font-bold text-[#0F172A] mb-3">Recomendação do Dia</h3>
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-[#84CC16]/20 rounded-xl flex items-center justify-center">
                    <img src="https://picsum.photos/seed/salad/64" alt="Salada" className="rounded-lg"/>
                </div>
                <div>
                    <p className="font-semibold text-[#0F172A]">Salada de Quinoa e Abacate</p>
                    <p className="text-sm text-[#475569]">Uma ótima opção para o almoço, rica em fibras e gorduras saudáveis.</p>
                    <button className="text-sm font-semibold text-[#2563EB] mt-1">Porquê esta sugestão?</button>
                </div>
            </div>
        </Card>

        <Card>
            <h3 className="text-xl font-bold text-[#0F172A] mb-3">Dica Rápida</h3>
            <p className="text-[#475569]">Não se esqueça de beber pelo menos 2L de água hoje para se manter hidratado(a)!</p>
        </Card>

      </main>

    </div>
  );
};
