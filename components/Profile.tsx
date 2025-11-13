
import React from 'react';
import { OnboardingData } from '../types';
import { Card, Button } from './UI';
import { UserIcon, ChevronRightIcon, BellIcon, QuestionMarkCircleIcon, LogoutIcon } from './Icons';

const ProfileHeader: React.FC = () => (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="w-24 h-24 rounded-full bg-[#1E8E5A] flex items-center justify-center mb-4 ring-4 ring-white shadow-md">
            <UserIcon className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Utilizador NutriAI</h1>
        <p className="text-[#475569]">Membro desde {new Date().getFullYear()}</p>
    </div>
);

interface ProfileListItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-6 h-6 mr-4 text-[#475569]">{icon}</div>
        <span className="flex-grow text-lg text-[#0F172A] font-medium">{label}</span>
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
    </button>
);


interface ProfileProps {
    onboardingData: OnboardingData;
}

export const Profile: React.FC<ProfileProps> = ({ onboardingData }) => {
    return (
        <div className="bg-[#F8FAFC]">
            <ProfileHeader />
            <main className="p-6 space-y-6">
                <Card>
                    <h2 className="text-xl font-bold text-[#0F172A] mb-4">O Meu Plano</h2>
                    <ul className="space-y-3 text-base text-[#0F172A]">
                        <li className="flex justify-between items-center"><span><strong>Objetivo:</strong></span> <span className="text-[#475569] font-medium">{onboardingData.goal}</span></li>
                        <li className="flex justify-between items-center"><span><strong>Nível de Atividade:</strong></span> <span className="text-[#475569] font-medium">{onboardingData.activityLevel}</span></li>
                        <li className="flex justify-between items-center"><span><strong>Peso:</strong></span> <span className="text-[#475569] font-medium">{onboardingData.weight} kg</span></li>
                        <li className="flex justify-between items-center"><span><strong>Altura:</strong></span> <span className="text-[#475569] font-medium">{onboardingData.height} cm</span></li>
                        {onboardingData.dietaryRestrictions.length > 0 && (
                            <li className="flex justify-between items-start">
                                <span><strong>Restrições:</strong></span> 
                                <span className="text-[#475569] font-medium text-right ml-4">{onboardingData.dietaryRestrictions.join(', ')}</span>
                            </li>
                        )}
                    </ul>
                </Card>
                
                <Card className="p-2">
                     <ProfileListItem icon={<UserIcon className="w-full h-full" />} label="Editar Perfil" />
                     <ProfileListItem icon={<BellIcon className="w-full h-full" />} label="Notificações" />
                     <ProfileListItem icon={<QuestionMarkCircleIcon className="w-full h-full" />} label="Ajuda e Suporte" />
                </Card>

                <div className="pt-4">
                     <Button variant="outline">
                        <div className="flex items-center justify-center">
                            <LogoutIcon className="w-6 h-6 mr-3"/>
                            Terminar Sessão
                        </div>
                     </Button>
                </div>

            </main>
        </div>
    );
};
