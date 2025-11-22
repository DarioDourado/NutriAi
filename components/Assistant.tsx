
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { OnboardingData } from '../types';
import { SendIcon, SparklesIcon, CameraIcon, MicIcon, XMarkIcon } from './Icons';
import { AssistantMode } from '../App';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  audio?: boolean; // Indicator if the message contained audio
}

interface AssistantProps {
  onboardingData: OnboardingData;
  initialMode: AssistantMode;
  onModeReset: () => void;
}

interface Attachment {
    data: string; // Base64
    mimeType: string;
    type: 'image' | 'audio';
}

export const Assistant: React.FC<AssistantProps> = ({ onboardingData, initialMode, onModeReset }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `Olá! Sou o teu assistente NutriAI. Vejo que o teu objetivo é **${onboardingData.goal?.toLowerCase()}**. Podes enviar fotos das tuas refeições ou usar a voz para registar alimentos!`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat
  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
          És um nutricionista e personal trainer experiente.
          O teu cliente tem o seguinte perfil:
          - Idade: ${onboardingData.age} anos
          - Peso: ${onboardingData.weight} kg
          - Objetivo: ${onboardingData.goal}
          - Restrições: ${onboardingData.dietaryRestrictions.join(', ') || 'Nenhuma'}
          
          Responde sempre em Português de Portugal.
          
          CAPACIDADES ESPECIAIS:
          1. ANÁLISE DE IMAGEM: Se o utilizador enviar uma foto de comida, identifica os alimentos, estima calorias e macronutrientes (proteína, carbs, gordura) aproximados. Dá um feedback construtivo.
          2. ANÁLISE DE ÁUDIO: Se o utilizador enviar um áudio, transcreve mentalmente o que foi dito e processa o pedido (ex: registar refeição).
          
          Sê conciso. Usa emojis.
        `;

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
          }
        });

        chatSessionRef.current = chat;
      } catch (error) {
        console.error("Failed to initialize chat", error);
      }
    };

    if (!chatSessionRef.current) {
        initChat();
    }
  }, [onboardingData]);

  // Handle Initial Modes (Voice/Photo)
  useEffect(() => {
      if (initialMode === 'photo') {
          fileInputRef.current?.click();
      } else if (initialMode === 'voice') {
          startRecording();
      }
      // We don't reset immediately to allow the action to complete, 
      // logic handles reset after capture/cancel.
  }, [initialMode]);

  // --- Image Handling ---

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              // Remove header data:image/jpeg;base64,
              const base64Data = base64String.split(',')[1];
              
              setAttachment({
                  data: base64Data,
                  mimeType: file.type,
                  type: 'image'
              });
              // Reset mode so we don't trigger again on re-render
              onModeReset();
          };
          reader.readAsDataURL(file);
      } else {
          onModeReset();
      }
  };

  // --- Audio Handling ---

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
              }
          };

          mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // webm is typical for chrome/android
              const reader = new FileReader();
              reader.onloadend = () => {
                  const base64String = reader.result as string;
                  const base64Data = base64String.split(',')[1];
                  
                  setAttachment({
                      data: base64Data,
                      mimeType: 'audio/webm', // Standardize mostly
                      type: 'audio'
                  });
                  // Automatically send if it was a quick voice log, or let user confirm? 
                  // Let's let user confirm by adding to input area logic, but for voice UX, auto-send is often better.
                  // For now, just attach it so user can add text context if needed.
              };
              reader.readAsDataURL(audioBlob);
              
              // Stop all tracks
              stream.getTracks().forEach(track => track.stop());
              setIsRecording(false);
              onModeReset();
          };

          mediaRecorder.start();
          setIsRecording(true);
      } catch (err) {
          console.error("Error accessing microphone", err);
          alert("Não foi possível aceder ao microfone.");
          onModeReset();
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
      }
  };

  const cancelAttachment = () => {
      setAttachment(null);
      if (isRecording) stopRecording(); // actually stop logic handles saving, so this is just UI cleanup if manual cancel
      setIsRecording(false);
      onModeReset();
  };

  // --- Sending ---

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !attachment) || !chatSessionRef.current || isLoading) return;

    const currentAttachment = attachment;
    const currentInput = inputValue;

    // UI Update
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput || (currentAttachment?.type === 'image' ? '📷 [Foto]' : '🎤 [Áudio]'),
      image: currentAttachment?.type === 'image' ? `data:${currentAttachment.mimeType};base64,${currentAttachment.data}` : undefined,
      audio: currentAttachment?.type === 'audio'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachment(null);
    setIsLoading(true);

    try {
      // Prepare Content
      const parts: any[] = [];
      
      if (currentAttachment) {
          parts.push({
              inlineData: {
                  mimeType: currentAttachment.mimeType,
                  data: currentAttachment.data
              }
          });
      }

      // If there is text, add it. If audio/image only, add a prompt to context.
      if (currentInput) {
          parts.push({ text: currentInput });
      } else {
          // Default prompts for media-only messages
          if (currentAttachment?.type === 'image') {
             parts.push({ text: "Analisa esta refeição, estima as calorias e regista-a no meu diário." }); 
          } else if (currentAttachment?.type === 'audio') {
             parts.push({ text: "Ouve este registo e adiciona ao meu diário." });
          }
      }

      const response = await chatSessionRef.current.sendMessage(parts);
      const responseText = response.text;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Recebido!"
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message", error);
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Ocorreu um erro. Tenta novamente."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E8E5A] to-[#14653F] flex items-center justify-center text-white shadow-sm">
            <SparklesIcon className="w-6 h-6" />
        </div>
        <div>
            <h1 className="font-bold text-[#0F172A]">Assistente NutriAI</h1>
            <p className="text-xs text-[#1E8E5A] flex items-center font-medium">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] mr-1 animate-pulse"></span>
                Online
            </p>
        </div>
      </div>

      {/* Recording Overlay */}
      {isRecording && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="w-32 h-32 rounded-full bg-[#1E8E5A]/20 flex items-center justify-center animate-pulse mb-8">
                  <div className="w-24 h-24 rounded-full bg-[#1E8E5A] flex items-center justify-center">
                      <MicIcon className="w-12 h-12 text-white" />
                  </div>
              </div>
              <p className="text-white text-xl font-bold mb-8 animate-pulse">A ouvir...</p>
              <button 
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105"
              >
                  Parar Gravação
              </button>
          </div>
      )}

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-36">
        {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Image Preview in Chat */}
                    {msg.image && (
                        <img 
                            src={msg.image} 
                            alt="User upload" 
                            className="max-w-full h-auto rounded-2xl mb-2 border-2 border-white shadow-md w-48 object-cover"
                        />
                    )}
                    {msg.audio && (
                        <div className="bg-gray-100 px-4 py-2 rounded-xl mb-2 flex items-center text-xs text-gray-500">
                            <MicIcon className="w-4 h-4 mr-1" /> Áudio enviado
                        </div>
                    )}

                    <div className={`p-4 rounded-2xl shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-[#1E8E5A] text-white rounded-tr-none' 
                        : 'bg-white text-[#0F172A] border border-gray-100 rounded-tl-none'
                    }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-md mx-auto pb-4">
        
        {/* Attachment Preview */}
        {attachment && (
            <div className="absolute bottom-full left-4 mb-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center animate-fade-in-up">
                {attachment.type === 'image' ? (
                    <img src={`data:${attachment.mimeType};base64,${attachment.data}`} className="w-12 h-12 rounded-lg object-cover border" alt="preview" />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#1E8E5A]/10 flex items-center justify-center">
                        <MicIcon className="w-6 h-6 text-[#1E8E5A]" />
                    </div>
                )}
                <div className="ml-3 mr-2">
                    <p className="text-xs font-bold text-[#0F172A]">{attachment.type === 'image' ? 'Foto pronta' : 'Áudio pronto'}</p>
                    <p className="text-[10px] text-gray-500">Será enviada com a mensagem</p>
                </div>
                <button onClick={cancelAttachment} className="ml-2 p-1 hover:bg-gray-100 rounded-full text-gray-400">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        )}

        <div className="flex items-center space-x-2 bg-[#F1F5F9] rounded-2xl px-2 py-2 border border-transparent focus-within:border-[#1E8E5A]/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E8E5A]/10 transition-all">
            
            {/* Media Buttons */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-[#1E8E5A] transition-colors"
                disabled={isLoading}
            >
                <CameraIcon className="w-6 h-6" />
            </button>
             <button 
                onClick={startRecording}
                className="p-2 text-gray-400 hover:text-[#1E8E5A] transition-colors"
                disabled={isLoading}
            >
                <MicIcon className="w-6 h-6" />
            </button>

            <input 
                type="text" 
                className="flex-grow bg-transparent border-none focus:ring-0 text-[#0F172A] placeholder-gray-400 outline-none py-2"
                placeholder="Escreva algo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
            />
            <button 
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && !attachment) || isLoading}
                className={`p-2 rounded-xl transition-all duration-200 ${
                    (inputValue.trim() || attachment) && !isLoading 
                    ? 'bg-[#1E8E5A] text-white hover:bg-[#14653F] shadow-sm transform active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
