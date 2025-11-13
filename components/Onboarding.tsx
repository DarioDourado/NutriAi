
import React, { useState } from 'react';
import { OnboardingData, Goal, ActivityLevel, Motivation, VoicePreference } from '../types';
import { Button, ProgressBar, Chip, SliderInput, Card, RadioCard } from './UI';
import { LeafIcon, CheckIcon } from './Icons';

// --- Helper Components defined inside Onboarding.tsx ---

const OnboardingStepLayout: React.FC<{
  title: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
}> = ({ title, children, currentStep, totalSteps, onNext, onBack, isNextDisabled }) => (
  <div className="p-6 flex flex-col h-full">
    <div className="mb-6">
      <ProgressBar current={currentStep} total={totalSteps} />
    </div>
    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">{title}</h2>
    <div className="flex-grow overflow-y-auto pb-4">{children}</div>
    <div className="mt-auto pt-4 flex space-x-4">
      <Button variant="outline" onClick={onBack} disabled={currentStep <= 1}>Voltar</Button>
      <Button onClick={onNext} disabled={isNextDisabled}>Continuar</Button>
    </div>
  </div>
);

// --- Onboarding Steps ---

const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="p-8 flex flex-col h-full items-center justify-center text-center bg-gradient-to-b from-[#1E8E5A] to-[#14653F]">
    <LeafIcon className="w-24 h-24 text-[#84CC16] mb-6" />
    <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo(a) ao NutriAI</h1>
    <p className="text-lg text-white/90 mb-12 max-w-sm">A sua jornada para uma vida mais saudável começa agora, com a ajuda da inteligência artificial.</p>
    <div className="w-full max-w-xs">
        <Button variant="secondary" onClick={onNext}>Começar</Button>
    </div>
  </div>
);

const BasicInfoStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => (
    <>
        <p className="text-lg text-[#475569] mb-8">Vamos começar com alguns dados básicos para personalizar a sua experiência.</p>
        <div className="space-y-6">
            <SliderInput label="Idade" min={18} max={99} value={data.age} onChange={e => setData(d => ({...d, age: parseInt(e.target.value)}))} unit="anos" />
            <SliderInput label="Peso" min={40} max={200} value={data.weight} onChange={e => setData(d => ({...d, weight: parseInt(e.target.value)}))} unit="kg" />
            <SliderInput label="Altura" min={140} max={220} value={data.height} onChange={e => setData(d => ({...d, height: parseInt(e.target.value)}))} unit="cm" />
        </div>
    </>
);

const GoalStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => (
    <>
        <p className="text-lg text-[#475569] mb-8">Qual é o seu principal objetivo neste momento?</p>
        <div className="space-y-4">
            {Object.values(Goal).map(goal => (
                <Card 
                    key={goal}
                    className={`cursor-pointer transition-all ${data.goal === goal ? 'border-2 border-[#1E8E5A] ring-2 ring-[#84CC16]' : 'border border-transparent'}`}
                    onClick={() => setData(d => ({...d, goal}))}
                >
                    <p className="text-xl font-semibold text-[#0F172A]">{goal}</p>
                </Card>
            ))}
        </div>
    </>
);

const ActivityLevelStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => (
    <>
        <p className="text-lg text-[#475569] mb-8">Como descreveria o seu nível de atividade física semanal?</p>
        <div className="space-y-4">
            {Object.values(ActivityLevel).map(level => (
                <Card 
                    key={level}
                    className={`cursor-pointer transition-all ${data.activityLevel === level ? 'border-2 border-[#1E8E5A] ring-2 ring-[#84CC16]' : 'border border-transparent'}`}
                    onClick={() => setData(d => ({...d, activityLevel: level}))}
                >
                    <p className="text-xl font-semibold text-[#0F172A]">{level}</p>
                </Card>
            ))}
        </div>
    </>
);

const RestrictionsStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => {
    const options = ["Vegetariano", "Vegan", "Sem glúten", "Sem lactose", "Alergia a nozes"];
    
    const handleToggle = (restriction: string) => {
        setData(d => {
            const newRestrictions = d.dietaryRestrictions.includes(restriction)
                ? d.dietaryRestrictions.filter(r => r !== restriction)
                : [...d.dietaryRestrictions, restriction];
            return {...d, dietaryRestrictions: newRestrictions};
        });
    };

    return (
        <>
            <p className="text-lg text-[#475569] mb-8">Tem alguma restrição ou preferência alimentar? Selecione todas as que se aplicam.</p>
            <div className="flex flex-wrap gap-3">
                {options.map(option => (
                    <Chip 
                        key={option}
                        label={option}
                        isSelected={data.dietaryRestrictions.includes(option)}
                        onSelect={() => handleToggle(option)}
                    />
                ))}
            </div>
        </>
    );
};


const MotivationStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => (
     <>
        <p className="text-lg text-[#475569] mb-8">O que mais o/a motiva a focar-se na sua saúde e bem-estar?</p>
        <div className="space-y-4">
            {Object.values(Motivation).map(motive => (
                <Card 
                    key={motive}
                    className={`cursor-pointer transition-all ${data.motivation === motive ? 'border-2 border-[#1E8E5A] ring-2 ring-[#84CC16]' : 'border border-transparent'}`}
                    onClick={() => setData(d => ({...d, motivation: motive}))}
                >
                    <p className="text-xl font-semibold text-[#0F172A]">{motive}</p>
                </Card>
            ))}
        </div>
    </>
);

const ConsentStep: React.FC<{
    data: OnboardingData;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => (
    <>
        <p className="text-lg text-[#475569] mb-8">Para uma experiência personalizada, precisamos do seu consentimento.</p>
        <div className="space-y-6">
            <Card className="flex items-start space-x-4">
                <input 
                    type="checkbox"
                    id="gdpr"
                    checked={data.gdprConsent}
                    onChange={e => setData(d => ({...d, gdprConsent: e.target.checked}))}
                    className="mt-1 h-6 w-6 rounded border-gray-300 text-[#1E8E5A] focus:ring-[#84CC16]"
                />
                <label htmlFor="gdpr" className="text-[#475569]">
                    Aceito o tratamento dos meus dados de saúde (voz, fotos, hábitos) para receber recomendações personalizadas, conforme o RGPD.
                </label>
            </Card>
            <div>
                <p className="text-lg text-[#475569] mb-4">Qual a sua preferência para a voz do assistente IA?</p>
                <div className="grid grid-cols-3 gap-4">
                   {Object.values(VoicePreference).map(pref => (
                       <RadioCard 
                           key={pref}
                           label={pref}
                           isSelected={data.voicePreference === pref}
                           onSelect={() => setData(d => ({ ...d, voicePreference: pref }))}
                           icon={<div className="w-full h-full" />} // Placeholder icon
                       />
                   ))}
                </div>
            </div>
        </div>
    </>
);

const SummaryStep: React.FC<{ data: OnboardingData }> = ({ data }) => (
    <>
        <p className="text-lg text-[#475569] mb-6">Confirme se as suas informações estão corretas. Estamos quase a terminar!</p>
        <Card>
            <ul className="space-y-3 text-lg text-[#0F172A]">
                <li><strong>Objetivo:</strong> {data.goal}</li>
                <li><strong>Nível de Atividade:</strong> {data.activityLevel}</li>
                <li><strong>Dados:</strong> {data.age} anos, {data.weight} kg, {data.height} cm</li>
                <li><strong>Restrições:</strong> {data.dietaryRestrictions.join(', ') || 'Nenhuma'}</li>
                <li><strong>Motivação:</strong> {data.motivation}</li>
                <li><strong>Voz do Assistente:</strong> {data.voicePreference}</li>
            </ul>
        </Card>
    </>
);

const ConfirmationStep: React.FC = () => (
    <div className="p-8 flex flex-col h-full items-center justify-center text-center bg-[#F8FAFC]">
        <div className="w-24 h-24 bg-[#16A34A] rounded-full flex items-center justify-center mb-6">
            <CheckIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Configuração concluída!</h1>
        <p className="text-lg text-[#475569] max-w-sm">As suas recomendações personalizadas já estão prontas. Vamos começar a sua jornada!</p>
    </div>
);


// --- Main Onboarding Component ---

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    age: 30,
    gender: 'Prefiro não dizer',
    weight: 70,
    height: 175,
    goal: null,
    activityLevel: null,
    dietaryRestrictions: [],
    motivation: null,
    healthyEatingPerception: 3,
    stressLevel: 3,
    gdprConsent: false,
    voicePreference: null,
  });

  const totalSteps = 7;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps + 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleFinish = () => {
      // Simulate finalization
      setTimeout(() => {
          onComplete(data);
      }, 2000);
  };
  
  const isNextDisabled = (): boolean => {
      switch (step) {
          case 2: return !data.goal;
          case 3: return !data.activityLevel;
          case 5: return !data.motivation;
          case 6: return !data.gdprConsent || !data.voicePreference;
          default: return false;
      }
  }

  if (step === 0) {
    return <WelcomeStep onNext={handleNext} />;
  }

  if (step === totalSteps + 1) {
    handleFinish();
    return <ConfirmationStep />;
  }

  const stepsContent = [
    <BasicInfoStep data={data} setData={setData} />,
    <GoalStep data={data} setData={setData} />,
    <ActivityLevelStep data={data} setData={setData} />,
    <RestrictionsStep data={data} setData={setData} />,
    <MotivationStep data={data} setData={setData} />,
    <ConsentStep data={data} setData={setData} />,
    <SummaryStep data={data} />
  ];

  const stepTitles = [
    "Sobre si",
    "O seu objetivo",
    "Nível de atividade",
    "Preferências alimentares",
    "A sua motivação",
    "Privacidade e preferências",
    "Resumo e confirmação"
  ];
  
  return (
    <OnboardingStepLayout
      title={stepTitles[step-1]}
      currentStep={step}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled()}
    >
      {stepsContent[step-1]}
    </OnboardingStepLayout>
  );
};
