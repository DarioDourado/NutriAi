
export enum Goal {
  LOSE_WEIGHT = 'Perder peso',
  MAINTAIN = 'Manter',
  GAIN_MUSCLE = 'Ganhar massa',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentário',
  MODERATE = 'Moderado',
  INTENSE = 'Intenso',
}

export enum Motivation {
  HEALTH = 'Saúde',
  AESTHETICS = 'Estética',
  ENERGY = 'Energia',
  WELLBEING = 'Bem-estar',
}

export enum VoicePreference {
    FEMININE = 'Feminina',
    MASCULINE = 'Masculina',
    NEUTRAL = 'Neutra',
}

export interface OnboardingData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: Goal | null;
  activityLevel: ActivityLevel | null;
  dietaryRestrictions: string[];
  motivation: Motivation | null;
  healthyEatingPerception: number;
  stressLevel: number;
  gdprConsent: boolean;
  voicePreference: VoicePreference | null;
}
