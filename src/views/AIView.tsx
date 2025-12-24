import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, AlertTriangle, Loader2, FileText, Menu, Plus, MessageSquare, MoreHorizontal, Bot, Trash2, ChevronRight, Mic, Save, Download } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToAI, checkRisk } from '../services/geminiService';

// Define Session Interface internally for View Logic
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const AIView: React.FC = () => {
  // --- State Management ---
  // Load from local storage if available, else default
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('pet_doctor_sessions');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{
      id: 'default',
      title: '新对话',
      updatedAt: Date.now(),
      messages: [
        {
          id: 'welcome',
          role: 'model',
          content: '你好！我是你的AI宠物医生助手。请告诉我你的宠物有什么症状，或者上传化验单让我帮你看看。',
          timestamp: Date.now()
        }
      ]
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
     // Default to the first session id
     const saved = localStorage.getItem('pet_doctor_sessions');
     if(saved) {
        const parsed = JSON.parse(saved);
        return parsed[0]?.id || 'default';
     }
     return 'default';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Save Dialog State
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Computed: Get Current Session
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession.messages;

  // --- Effects ---
  // Persist sessions to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('pet_doctor_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentSessionId]);

  // --- Handlers ---

  const handleCreateNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: '新对话',
      updatedAt: Date.now(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setIsSidebarOpen(false);
  };

  const handleSwitchSession = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      } else {
        // If all deleted, recreate a default one
        const defaultSession: ChatSession = {
            id: 'default-' + Date.now(),
            title: '新对话',
            updatedAt: Date.now(),
            messages: []
        };
        setSessions([defaultSession]);
        setCurrentSessionId(defaultSession.id);
      }
    }
  };

  // --- Save & Export Logic ---
  const handleOpenSaveDialog = () => {
    setSaveTitle(currentSession.title === '新对话' ? '' : currentSession.title);
    setIsSaveDialogOpen(true);
  };

  const handleSaveTitle = () => {
    if(!saveTitle.trim()) return;
    setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, title: saveTitle } : s
    ));
    setIsSaveDialogOpen(false);
  };

  const handleExportTxt = () => {
      const content = currentSession.messages.map(m => 
        `[${new Date(m.timestamp).toLocaleString()}] ${m.role === 'user' ? '我' : '宠医助手'}:\n${m.content}\n`
      ).join('\n-------------------\n');
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentSession.title || '问诊记录'}_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("抱歉，您的浏览器不支持语音输入功能。");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputText((prev) => prev + transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: inputText,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const isFirstUserMsg = s.messages.filter(m => m.role === 'user').length === 0;
        const newTitle = (isFirstUserMsg && inputText && s.title === '新对话') 
          ? inputText.slice(0, 12) + (inputText.length > 12 ? '...' : '') 
          : s.title;
        
        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, newUserMsg],
          updatedAt: Date.now()
        };
      }
      return s;
    }));

    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    const currentHistory = [...messages, newUserMsg];
    
    // Call API
    const rawResponseText = await sendMessageToAI(newUserMsg.content, newUserMsg.image || null, currentHistory);
    
    // Check for risk tag generated by AI
    const isRisk = checkRisk(rawResponseText);
    // Remove the tag from the display text
    const cleanResponseText = rawResponseText.replace("[RISK_DETECTED]", "").trim();

    const newAiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: cleanResponseText,
      isRisk: isRisk,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, newAiMsg],
          updatedAt: Date.now()
        };
      }
      return s;
    }));
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      
      {/* --- Sidebar (History) --- */}
      <div 
        className={`absolute inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`absolute top-0 bottom-0 left-0 w-[75%] bg-white z-50 shadow-2xl transition-transform duration-300 transform flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-primary/5 pt-16 pb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Bot className="text-primary" /> 历史对话
            </h2>
            <p className="text-xs text-gray-400 mt-1">共 {sessions.length} 个会话存档</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.sort((a,b) => b.updatedAt - a.updatedAt).map(session => (
                <div 
                    key={session.id}
                    onClick={() => handleSwitchSession(session.id)}
                    className={`group p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${
                        currentSessionId === session.id 
                        ? 'bg-primary/10 border-primary/20 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                >
                    <div className={`p-2 rounded-lg ${currentSessionId === session.id ? 'bg-white text-primary' : 'bg-gray-100 text-gray-400'}`}>
                        <MessageSquare size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-gray-900' : 'text-gray-600'}`}>
                            {session.title || '新对话'}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                           {new Date(session.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button 
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className={`p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100`}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
        
        <div className="p-4 border-t border-gray-100">
            <button 
                onClick={handleCreateNewSession}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
                <Plus size={18} /> 开启新对话
            </button>
        </div>
      </div>

      {/* --- Main Chat Header --- */}
      <div className="bg-white/95 backdrop-blur-md px-4 pt-14 pb-3 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between sticky top-0 z-30">
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition active:scale-90"
        >
            <Menu size={24} />
        </button>
        
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-900 text-base max-w-[150px] truncate">{currentSession.title}</h1>
            <div className="flex items-center gap-1.5">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
               </span>
               <span className="text-[10px] text-secondary font-medium">AI 兽医在线</span>
            </div>
        </div>

        <div className="flex items-center">
            <button 
                onClick={handleOpenSaveDialog}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition active:scale-90"
            >
                <Save size={24} />
            </button>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-[160px]">
        {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center mt-20 opacity-50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Bot size={32} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">开始一个新的话题吧...</p>
             </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[85%] gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Avatar */}
              <div className="flex items-center gap-2 px-1">
                 {msg.role === 'model' && (
                     <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                         <Bot size={14} className="text-secondary" />
                     </div>
                 )}
                 <span className="text-[10px] text-gray-400 font-medium">
                     {msg.role === 'model' ? '宠医助手' : '我'}
                 </span>
              </div>

              {/* Message Bubble */}
              <div 
                className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-soft border border-white/50'
                  }`}
              >
                {/* Risk Warning Badge - Only shows if AI explicitly tagged it as risk */}
                {msg.isRisk && msg.role === 'model' && (
                  <div className="mb-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-red-700 leading-snug">
                      <span className="font-bold block mb-0.5 text-sm">风险预警</span> 
                      监测到高危症状，建议立即前往附近宠物医院就诊！
                    </div>
                  </div>
                )}
                
                {msg.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                     <img src={msg.image} alt="User upload" className="max-w-full h-auto" />
                  </div>
                )}
                
                {/* Plain Text Display - No formatRiskText, No Markdown parsing artifacts */}
                <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-soft flex items-center gap-3 border border-white/50">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs text-gray-400 font-medium">正在思考与分析...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="absolute bottom-[84px] w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 p-3 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        {selectedImage && (
          <div className="mb-3 ml-1 relative inline-block animate-in slide-in-from-bottom-2 fade-in duration-200">
            <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-gray-100 shadow-md" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-black transition shadow-sm border-2 border-white"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          {/* File Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors active:scale-95 shrink-0"
          >
            <Plus size={24} className={`transition-transform duration-300 ${selectedImage ? 'rotate-45' : ''}`} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          {/* Text Input Container with Mic */}
          <div className="flex-1 bg-gray-50 rounded-[1.25rem] px-4 py-3 min-h-[48px] max-h-[120px] flex items-center focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                  }
              }}
              rows={1}
              placeholder={isListening ? "正在听..." : "描述症状或上传化验单..."}
              className="w-full bg-transparent border-none outline-none text-[15px] text-gray-900 placeholder-gray-400 resize-none no-scrollbar"
              style={{ minHeight: '24px' }}
            />
             <button 
                onClick={handleVoiceInput}
                className={`p-1.5 ml-1 rounded-full transition-all shrink-0 active:scale-90 ${
                    isListening 
                    ? 'bg-red-50 text-red-500 animate-pulse ring-2 ring-red-100' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
                }`}
             >
                 <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
             </button>
          </div>
          
          {/* Send Button */}
          <button 
            onClick={handleSend}
            disabled={(!inputText && !selectedImage) || isLoading}
            className={`p-3 rounded-full transition-all duration-200 shrink-0 flex items-center justify-center ${
              (!inputText && !selectedImage) || isLoading 
                ? 'bg-gray-100 text-gray-300' 
                : 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95'
            }`}
          >
            <Send size={20} className={isLoading ? 'opacity-0' : 'ml-0.5'} />
            {isLoading && <div className="absolute"><Loader2 size={18} className="animate-spin" /></div>}
          </button>
        </div>
      </div>

       {/* Save Dialog Modal */}
       {isSaveDialogOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">保存对话</h3>
                  <button onClick={() => setIsSaveDialogOpen(false)} className="text-gray-400 hover:bg-gray-50 p-1 rounded-full">
                      <X size={20} />
                  </button>
               </div>
               
               <div className="space-y-4">
                   <div>
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">对话标题</label>
                       <input 
                          type="text" 
                          value={saveTitle} 
                          onChange={(e) => setSaveTitle(e.target.value)}
                          placeholder="例如：狗狗呕吐咨询..."
                          className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900"
                       />
                   </div>

                   <button 
                      onClick={handleExportTxt}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                   >
                      <Download size={18} /> 导出为文本
                   </button>
                   
                   <button 
                      onClick={handleSaveTitle}
                      className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                   >
                      保存更改
                   </button>
               </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AIView;