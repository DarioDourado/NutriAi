import React from 'react';
import { CheckIcon } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'w-full py-4 px-6 rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#1E8E5A] text-white hover:bg-opacity-90 focus:ring-[#84CC16]/50',
    secondary: 'bg-[#2563EB] text-white hover:bg-opacity-90 focus:ring-[#2563EB]/50',
    outline: 'bg-transparent border-2 border-[#1E8E5A] text-[#1E8E5A] hover:bg-[#1E8E5A]/10 focus:ring-[#84CC16]/50',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

// FIX: Extended CardProps with React.HTMLAttributes<HTMLDivElement> to allow onClick and other div properties.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    // FIX: Added ...props to pass down attributes like onClick. Handled potentially undefined className.
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = (current / total) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
                className="bg-[#84CC16] h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

interface ChipProps {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, isSelected, onSelect }) => {
    const baseClasses = 'px-5 py-3 rounded-full text-base font-medium cursor-pointer transition-all border-2 flex items-center justify-center';
    const selectedClasses = 'bg-[#1E8E5A] text-white border-[#1E8E5A]';
    const unselectedClasses = 'bg-white text-[#475569] border-gray-300 hover:border-[#1E8E5A] hover:text-[#1E8E5A]';
    
    return (
        <div onClick={onSelect} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            {isSelected && <CheckIcon className="w-5 h-5 mr-2" />}
            {label}
        </div>
    );
};

interface SliderInputProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({ label, min, max, value, onChange, unit }) => {
    return (
        <div className="w-full">
            <label className="block text-lg font-medium text-[#0F172A] mb-2">{label}</label>
            <div className="flex items-center space-x-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                />
                <span className="text-xl font-bold text-[#2563EB] w-24 text-right">{value} {unit}</span>
            </div>
        </div>
    );
}

interface RadioCardProps {
    icon: React.ReactNode;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({ icon, label, isSelected, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                isSelected 
                ? 'border-[#1E8E5A] bg-[#1E8E5A]/10 ring-2 ring-[#84CC16]' 
                : 'border-gray-300 bg-white hover:border-[#1E8E5A]'
            }`}
        >
            <div className={`w-12 h-12 ${isSelected ? 'text-[#1E8E5A]' : 'text-[#475569]'}`}>{icon}</div>
            <p className={`font-semibold ${isSelected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{label}</p>
        </div>
    )
}