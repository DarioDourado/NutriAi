
import React from 'react';
import { HomeIcon, TargetIcon, ChatIcon, UserIcon } from './Icons';
import { View } from '../App';

interface BottomNavProps {
    activeView: View;
    onViewChange: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
    const navItems = [
        { icon: <HomeIcon className="w-7 h-7" />, label: "Início", view: 'dashboard' as View },
        { icon: <TargetIcon className="w-7 h-7" />, label: "Objetivos", view: 'goals' as View },
        { icon: <ChatIcon className="w-7 h-7" />, label: "Assistente", view: 'assistant' as View },
        { icon: <UserIcon className="w-7 h-7" />, label: "Perfil", view: 'profile' as View },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] max-w-md mx-auto rounded-t-2xl">
            <div className="flex justify-around items-center h-20">
                {navItems.map((item) => (
                    <button 
                        key={item.view} 
                        onClick={() => onViewChange(item.view)}
                        className={`flex flex-col items-center space-y-1 ${activeView === item.view ? 'text-[#1E8E5A]' : 'text-gray-400'} transition-colors duration-200`}
                        aria-label={item.label}
                    >
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
