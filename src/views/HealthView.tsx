import React, { useState, useRef, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { FileText, Syringe, Ruler, Plus, ChevronRight, AlertCircle, Camera, X, Check, ChevronLeft, Sparkles, Building2, Calendar, ChevronDown, Clock, CheckCircle2, Upload, Trash2, File, Loader2, Pencil, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PetProfile, VaccineRecord, HealthRecord, MedicalRecord } from '../types';

interface HealthViewProps {
  onToggleTabBar?: (visible: boolean) => void;
}

const MOCK_PETS_LIST: PetProfile[] = [
  {
    id: 'p1',
    name: '旺财',
    breed: '拉布拉多',
    age: '2岁3个月',
    birthday: '2021-08-15',
    gender: 'male',
    isNeutered: true,
    weight: 28.5,
    avatar: 'https://picsum.photos/200/200?random=50'
  },
  {
    id: 'p2',
    name: '咪咪',
    breed: '英短蓝猫',
    age: '1岁',
    birthday: '2022-10-20',
    gender: 'female',
    isNeutered: false,
    weight: 4.2,
    avatar: 'https://picsum.photos/200/200?random=51'
  }
];

const INITIAL_WEIGHT_DATA: HealthRecord[] = [
  { date: '2023-09-01', weight: 26.0 },
  { date: '2023-10-01', weight: 26.8 },
  { date: '2023-11-01', weight: 27.5 },
  { date: '2023-12-01', weight: 28.0 },
  { date: '2024-01-01', weight: 28.5 },
  { date: '2024-02-01', weight: 28.2 },
  { date: '2024-03-01', weight: 28.5 },
];

const INITIAL_VACCINES: VaccineRecord[] = [
  { id: 'v1', name: '狂犬疫苗', date: '2023-10-15', nextDueDate: '2024-10-15', isDone: true },
  { id: 'v2', name: '四联疫苗', date: '2023-11-01', nextDueDate: '2024-11-01', isDone: true },
  { id: 'v3', name: '体内驱虫', date: '2024-04-15', nextDueDate: '2024-05-15', isDone: false },
  { id: 'v4', name: '体外驱虫', date: '2024-04-15', nextDueDate: '2024-05-15', isDone: false },
  { id: 'v5', name: '年度体检', date: '2024-06-01', nextDueDate: '2024-06-01', isDone: false },
];

const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'r1',
    type: 'lab',
    title: '血常规化验单',
    date: '2023-12-10',
    hospital: '爱宠国际动物医院',
    description: '年度体检血常规检查',
    aiAnalysis: '根据化验单显示：\n1. 白细胞 (WBC) 18.5 略高于参考值 (6.0-17.0)，提示可能存在轻微炎症或应激反应。\n2. 红细胞 (RBC) 和 血红蛋白 (HGB) 处于正常范围，无贫血迹象。\n3. 血小板 (PLT) 正常。\n\n建议：结合狗狗近期的精神状态和食欲观察，如无其他异常（发热、呕吐），可一周后复查。',
    images: ['https://picsum.photos/400/300?random=100'],
    status: 'completed'
  },
  {
    id: 'r2',
    type: 'surgery',
    title: '绝育手术记录',
    date: '2023-08-05',
    hospital: '瑞派宠物医院',
    description: '常规公犬去势术，吸入麻醉，术程顺利。',
    aiAnalysis: '手术记录完整。术后恢复注意事项已存档。\n关键信息提取：\n- 麻醉方式：吸入麻醉\n- 出血量：少量\n- 术后医嘱：佩戴伊丽莎白圈7天，禁浴10天。',
    status: 'completed'
  }
];

const RECORD_TYPES = [
    { id: 'lab', label: '化验单', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'prescription', label: '处方单', color: 'bg-green-50 text-green-600 border-green-100' },
    { id: 'surgery', label: '手术记录', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'imaging', label: '影像(X光/B超)', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { id: 'other', label: '其他', color: 'bg-gray-50 text-gray-600 border-gray-100' },
];

const HealthView: React.FC<HealthViewProps> = ({ onToggleTabBar }) => {
  const [pet, setPet] = useState<PetProfile>(MOCK_PETS_LIST[0]);
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<PetProfile>(MOCK_PETS_LIST[0]);
  
  // Record Detail State
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);
  
  // Edit Record State
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [editingRecordForm, setEditingRecordForm] = useState<MedicalRecord | null>(null);

  // Weight Recording State
  const [weightData, setWeightData] = useState<HealthRecord[]>(INITIAL_WEIGHT_DATA);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [showWeightHistory, setShowWeightHistory] = useState(false); // New state for history view
  const [historyTimeRange, setHistoryTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');
  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: ''
  });

  // Health Task/Vaccine State
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(INITIAL_VACCINES);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [checkInTask, setCheckInTask] = useState<VaccineRecord | null>(null);
  const [checkInDate, setCheckInDate] = useState('');

  // Add Medical Record State
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState<{
    type: 'lab' | 'prescription' | 'surgery' | 'imaging' | 'other';
    title: string;
    date: string;
    hospital: string;
    description: string;
    images: string[];
  }>({
    type: 'lab',
    title: '',
    date: new Date().toISOString().split('T')[0],
    hospital: '',
    description: '',
    images: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordFileInputRef = useRef<HTMLInputElement>(null);
  const editRecordFileInputRef = useRef<HTMLInputElement>(null);

  // --- AI Analysis Simulation Effect ---
  useEffect(() => {
    if (selectedRecord && selectedRecord.status === 'processing') {
      const timer = setTimeout(() => {
        const analyzedText = "【AI 分析完成】\n根据您上传的单据，系统已自动提取关键信息：\n1. 检查项目确认无误。\n2. 相比历史记录，本次指标波动在正常范围内。\n建议：请继续遵医嘱用药，并留意宠物精神状态。";
        
        // Update list
        setMedicalRecords(prev => prev.map(r => 
          r.id === selectedRecord.id 
            ? { ...r, status: 'completed' as const, aiAnalysis: analyzedText } 
            : r
        ));

        // Update current view
        setSelectedRecord(prev => prev ? ({ ...prev, status: 'completed', aiAnalysis: analyzedText }) : null);

      }, 3000); // 3 seconds delay to simulate API call

      return () => clearTimeout(timer);
    }
  }, [selectedRecord]);

  const handleEditClick = () => {
    setEditForm({ ...pet });
    setIsEditing(true);
  };

  const handleSave = () => {
    setPet(editForm);
    setIsEditing(false);
  };

  const handleSwitchPet = (selectedPet: PetProfile) => {
    setPet(selectedPet);
    setIsPetDropdownOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Weight Logic ---
  const handleAddWeightClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other clicks
    
    // Auto-fill logic: Use the last recorded weight as default
    let defaultWeight = '';
    if (weightData.length > 0) {
        // Assuming weightData is sorted by date ascending, take the last one
        defaultWeight = weightData[weightData.length - 1].weight.toString();
    } else {
        // Fallback to current profile weight
        defaultWeight = pet.weight.toString();
    }

    setWeightForm({
      date: new Date().toISOString().split('T')[0],
      weight: defaultWeight
    });
    setIsAddingWeight(true);
  };

  const handleSaveWeight = () => {
    if (!weightForm.weight || isNaN(parseFloat(weightForm.weight))) {
      alert('请输入有效的体重数值');
      return;
    }

    const newVal = parseFloat(weightForm.weight);
    
    // Update Chart Data
    // We filter out any existing entry for the same date to allow "updates" for the same day
    const otherRecords = weightData.filter(r => r.date !== weightForm.date);
    const newRecord = { date: weightForm.date, weight: newVal };
    
    const updatedData = [...otherRecords, newRecord].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setWeightData(updatedData);

    // Update Current Weight if the new date is the latest (or same as today)
    const lastRecord = updatedData[updatedData.length - 1];
    if (lastRecord.date === weightForm.date) {
        setPet(prev => ({ ...prev, weight: newVal }));
    }

    setIsAddingWeight(false);
  };

  // --- Task/Vaccine Logic ---
  const handleTaskClick = (task: VaccineRecord) => {
    if (!task.isDone) {
      setCheckInTask(task);
      setCheckInDate(new Date().toISOString().split('T')[0]); // Default to today
    }
  };

  const handleSaveCheckIn = () => {
    if (checkInTask && checkInDate) {
      setVaccines(prev => prev.map(t => {
        if (t.id === checkInTask.id) {
          return {
            ...t,
            isDone: true,
            date: checkInDate // Update completion date
          };
        }
        return t;
      }));
      setCheckInTask(null);
    }
  };

  // --- Add Record Logic ---
  const handleAddRecordClick = () => {
    setNewRecordForm({
        type: 'lab',
        title: '',
        date: new Date().toISOString().split('T')[0],
        hospital: '',
        description: '',
        images: []
    });
    // Hide Tab Bar when opening
    if (onToggleTabBar) onToggleTabBar(false);
    setIsAddingRecord(true);
  };

  const closeAddRecord = () => {
    // Show Tab Bar when closing
    if (onToggleTabBar) onToggleTabBar(true);
    setIsAddingRecord(false);
  };

  const handleRecordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setNewRecordForm(prev => ({
                        ...prev,
                        images: [...prev.images, reader.result as string]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const handleRemoveRecordImage = (index: number) => {
      setNewRecordForm(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  const handleSaveRecord = () => {
      if (!newRecordForm.title) {
          alert('请至少填写标题');
          return;
      }
      const newRecord: MedicalRecord = {
          id: Date.now().toString(),
          ...newRecordForm,
          status: 'processing', // Default new records to processing for "AI Analysis" simulation
          aiAnalysis: '' // Empty initial analysis to trigger loading state
      };
      setMedicalRecords(prev => [newRecord, ...prev]);
      closeAddRecord();
  };

  // --- Edit Record Logic ---
  const handleEditRecordClick = () => {
      if (selectedRecord) {
          setEditingRecordForm(JSON.parse(JSON.stringify(selectedRecord)));
          setIsEditingRecord(true);
      }
  };

  const handleCancelEditRecord = () => {
      setIsEditingRecord(false);
      setEditingRecordForm(null);
  };

  const handleEditRecordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && editingRecordForm) {
          Array.from(files).forEach((file: File) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                  if (reader.result) {
                      setEditingRecordForm(prev => prev ? ({
                          ...prev,
                          images: [...(prev.images || []), reader.result as string]
                      }) : null);
                  }
              };
              reader.readAsDataURL(file);
          });
      }
  };

  const handleRemoveEditRecordImage = (index: number) => {
      if (editingRecordForm) {
          setEditingRecordForm(prev => prev ? ({
              ...prev,
              images: (prev.images || []).filter((_, i) => i !== index)
          }) : null);
      }
  };

  const handleSaveEditedRecord = () => {
      if (!editingRecordForm || !editingRecordForm.title) {
          alert('请至少填写标题');
          return;
      }
      
      // Update the main list
      setMedicalRecords(prev => prev.map(record => 
          record.id === editingRecordForm.id ? editingRecordForm : record
      ));
      
      // Update the currently viewed selected record
      setSelectedRecord(editingRecordForm);
      
      // Close edit mode
      setIsEditingRecord(false);
      setEditingRecordForm(null);
  };

  // --- RENDER: WEIGHT HISTORY VIEW ---
  if (showWeightHistory) {
    // 1. Sort data
    const sortedData = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 2. Filter by Time Range
    const now = new Date();
    const filteredData = sortedData.filter(item => {
        const itemDate = new Date(item.date);
        if (historyTimeRange === 'ALL') return true;
        
        const cutoff = new Date();
        if (historyTimeRange === '1M') cutoff.setMonth(now.getMonth() - 1);
        if (historyTimeRange === '3M') cutoff.setMonth(now.getMonth() - 3);
        if (historyTimeRange === '6M') cutoff.setMonth(now.getMonth() - 6);
        if (historyTimeRange === '1Y') cutoff.setFullYear(now.getFullYear() - 1);
        
        return itemDate >= cutoff;
    });

    // 3. Stats Calculation
    const currentWeight = filteredData.length > 0 ? filteredData[filteredData.length - 1].weight : 0;
    const weights = filteredData.map(d => d.weight);
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
    const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
    
    const startWeight = filteredData.length > 0 ? filteredData[0].weight : 0;
    const diff = filteredData.length > 0 ? currentWeight - startWeight : 0;

    return (
      <div className="h-full flex flex-col bg-background animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 pt-14 border-b border-gray-100 shrink-0 bg-white sticky top-0 z-30">
            <button onClick={() => setShowWeightHistory(false)} className="text-gray-600 p-2 -ml-2 hover:bg-gray-50 rounded-full transition">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold text-lg text-gray-900">体重趋势</h2>
            <button onClick={handleAddWeightClick} className="text-primary font-bold p-2 -mr-2 hover:bg-orange-50 rounded-full transition">
              <Plus size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {/* Stats Cards */}
             <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400 mb-1">当前 (kg)</span>
                    <span className="text-2xl font-bold text-gray-900">{currentWeight}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400 mb-1">最高 (kg)</span>
                    <span className="text-xl font-bold text-gray-900">{maxWeight}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-card flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400 mb-1">最低 (kg)</span>
                    <span className="text-xl font-bold text-gray-900">{minWeight}</span>
                </div>
             </div>

             {/* Main Chart Card */}
             <div className="bg-white rounded-3xl p-5 shadow-card min-h-[380px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">区间变化</p>
                        <div className={`flex items-center gap-1 text-lg font-bold ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-gray-700'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span>
                        </div>
                    </div>
                    {/* Time Range Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                        {['1M', '3M', '6M', 'ALL'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setHistoryTimeRange(range as any)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                    historyTimeRange === range 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {range === 'ALL' ? '全部' : range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[250px]">
                    {filteredData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF8853" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#FF8853" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}} 
                                    tickFormatter={(val) => {
                                        const d = new Date(val);
                                        return `${d.getMonth()+1}/${d.getDate()}`;
                                    }}
                                    dy={10}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    domain={['dataMin - 1', 'dataMax + 1']} 
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', fontSize: '12px'}}
                                    itemStyle={{color: '#FF8853', fontWeight: 'bold'}}
                                    labelStyle={{color: '#9CA3AF', marginBottom: '4px'}}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#FF8853" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorWeight)" 
                                    dot={{fill: '#fff', strokeWidth: 2, r: 4, stroke: '#FF8853'}}
                                    activeDot={{r: 6, fill: '#FF8853', stroke: '#fff', strokeWidth: 2}}
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <Ruler size={32} className="opacity-20 mb-2" />
                            <p className="text-xs">该时间段暂无数据</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
      </div>
    );
  }

  // --- RENDER: ADD RECORD VIEW (Full Page) ---
  if (isAddingRecord) {
      return (
        <div className="h-full flex flex-col bg-background animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 pt-14 border-b border-gray-100 shrink-0 bg-white sticky top-0 z-30">
              <button onClick={closeAddRecord} className="text-gray-600 p-2 -ml-2 hover:bg-gray-50 rounded-full transition">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-gray-900">添加病历</h2>
               <div className="w-10"></div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">检查类型</label>
                  <div className="flex flex-wrap gap-2">
                      {RECORD_TYPES.map(type => (
                          <button
                              key={type.id}
                              onClick={() => setNewRecordForm({...newRecordForm, type: type.id as any})}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                  newRecordForm.type === type.id 
                                  ? `${type.color} ring-1 ring-offset-1 ring-primary/20` 
                                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                              {type.label}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">标题</label>
                  <input 
                      type="text" 
                      placeholder="例如：血常规检查、绝育手术..."
                      value={newRecordForm.title}
                      onChange={(e) => setNewRecordForm({...newRecordForm, title: e.target.value})}
                      className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-bold"
                  />
              </div>

              {/* Date & Hospital */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">检查时间</label>
                      <input 
                          type="date" 
                          value={newRecordForm.date}
                          onChange={(e) => setNewRecordForm({...newRecordForm, date: e.target.value})}
                          className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">医院/地点</label>
                      <input 
                          type="text" 
                          placeholder="填写医院名称"
                          value={newRecordForm.hospital}
                          onChange={(e) => setNewRecordForm({...newRecordForm, hospital: e.target.value})}
                          className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                      />
                  </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">备注/医嘱</label>
                  <textarea 
                      placeholder="记录医生嘱咐的注意事项..."
                      value={newRecordForm.description}
                      onChange={(e) => setNewRecordForm({...newRecordForm, description: e.target.value})}
                      className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 min-h-[120px] resize-none"
                  />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">附件上传 (图片/PDF)</label>
                      <span className="text-[10px] text-gray-400">{newRecordForm.images.length} 个文件</span>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-2">
                      {newRecordForm.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group bg-white">
                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <button onClick={() => handleRemoveRecordImage(idx)} className="text-white p-1 hover:text-red-400">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>
                      ))}
                      
                      <div 
                          onClick={() => recordFileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-primary/50 hover:text-primary transition cursor-pointer bg-gray-50"
                      >
                          <Upload size={20} className="mb-1" />
                          <span className="text-[10px]">上传</span>
                      </div>
                   </div>
                   <input 
                      type="file" 
                      ref={recordFileInputRef} 
                      onChange={handleRecordFileChange} 
                      className="hidden" 
                      accept="image/*,application/pdf" 
                      multiple 
                   />
                   <p className="text-[10px] text-gray-400 ml-1">支持上传化验单图片、电子处方 PDF 等，AI 将自动分析内容。</p>
              </div>
            </div>
            
            {/* Footer Action */}
            <div className="p-4 bg-white border-t border-gray-50 shrink-0 pb-8 safe-area-bottom">
                <button 
                    onClick={handleSaveRecord}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                     <CheckCircle2 size={20} />
                    保存并分析
                </button>
            </div>
        </div>
      );
  }

  // --- RENDER: RECORD DETAIL VIEW ---
  if (selectedRecord) {
    // --- EDIT MODE ---
    if (isEditingRecord && editingRecordForm) {
        return (
            <div className="h-full flex flex-col bg-background animate-in slide-in-from-right duration-300">
                {/* Edit Header */}
                <div className="flex items-center justify-between px-4 pb-3 pt-14 border-b border-gray-100 shrink-0 bg-white sticky top-0 z-30">
                    <button onClick={handleCancelEditRecord} className="text-gray-600 p-2 -ml-2 hover:bg-gray-50 rounded-full transition">
                        <X size={24} />
                    </button>
                    <h2 className="font-bold text-lg text-gray-900">编辑病历</h2>
                    <button onClick={handleSaveEditedRecord} className="text-primary font-bold p-2 -mr-2 hover:bg-orange-50 rounded-full transition">
                        <Check size={24} />
                    </button>
                </div>

                {/* Edit Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Type Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">检查类型</label>
                        <div className="flex flex-wrap gap-2">
                            {RECORD_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setEditingRecordForm({...editingRecordForm, type: type.id as any})}
                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                        editingRecordForm.type === type.id 
                                        ? `${type.color} ring-1 ring-offset-1 ring-primary/20` 
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">标题</label>
                        <input 
                            type="text" 
                            value={editingRecordForm.title}
                            onChange={(e) => setEditingRecordForm({...editingRecordForm, title: e.target.value})}
                            className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-bold"
                        />
                    </div>

                    {/* Date & Hospital */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">检查时间</label>
                            <input 
                                type="date" 
                                value={editingRecordForm.date}
                                onChange={(e) => setEditingRecordForm({...editingRecordForm, date: e.target.value})}
                                className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">医院/地点</label>
                            <input 
                                type="text" 
                                placeholder="填写医院名称"
                                value={editingRecordForm.hospital}
                                onChange={(e) => setEditingRecordForm({...editingRecordForm, hospital: e.target.value})}
                                className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">备注/医嘱</label>
                        <textarea 
                            value={editingRecordForm.description}
                            onChange={(e) => setEditingRecordForm({...editingRecordForm, description: e.target.value})}
                            className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 min-h-[120px] resize-none"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">附件管理</label>
                            <span className="text-[10px] text-gray-400">{(editingRecordForm.images || []).length} 个文件</span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                            {(editingRecordForm.images || []).map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group bg-white">
                                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <button onClick={() => handleRemoveEditRecordImage(idx)} className="text-white p-1 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div 
                                onClick={() => editRecordFileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-primary/50 hover:text-primary transition cursor-pointer bg-gray-50"
                            >
                                <Plus size={20} className="mb-1" />
                                <span className="text-[10px]">添加</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={editRecordFileInputRef} 
                            onChange={handleEditRecordFileChange} 
                            className="hidden" 
                            accept="image/*,application/pdf" 
                            multiple 
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- NORMAL DETAIL MODE ---
    return (
      <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
        {/* Detail Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 h-14 flex items-center gap-3 border-b border-gray-100">
           <button 
             onClick={() => setSelectedRecord(null)}
             className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
           >
             <ChevronLeft size={24} />
           </button>
           <h1 className="font-bold text-lg text-gray-900 flex-1 text-center">病历详情</h1>
           <button 
             onClick={handleEditRecordClick}
             className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
           >
             <Pencil size={20} />
           </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedRecord.title}</h2>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium 
                    ${selectedRecord.type === 'lab' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {selectedRecord.type === 'lab' ? '化验报告' : 
                     selectedRecord.type === 'prescription' ? '处方单' :
                     selectedRecord.type === 'surgery' ? '手术记录' :
                     selectedRecord.type === 'imaging' ? '影像检查' : '其他记录'}
                  </span>
                </div>
                <div className={`p-2 rounded-full ${selectedRecord.type === 'lab' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  <FileText size={20} />
                </div>
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <Calendar size={16} className="text-gray-400" />
                   <span>{selectedRecord.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <Building2 size={16} className="text-gray-400" />
                   <span>{selectedRecord.hospital || '未记录医院'}</span>
                </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-gray-50">
               <p className="text-sm text-gray-700 leading-relaxed">{selectedRecord.description || '无详细描述'}</p>
             </div>
          </div>

          {/* AI Analysis Card */}
          {(selectedRecord.aiAnalysis || selectedRecord.status === 'processing') && (
            <div className={`rounded-2xl p-5 border transition-all duration-500 ${
                selectedRecord.status === 'processing' 
                ? 'bg-white border-gray-100 shadow-sm' 
                : 'bg-gradient-to-br from-white to-[#F0FFF4] shadow-soft border-secondary/10'
            }`}>
               <div className="flex items-center gap-2 mb-3">
                  {selectedRecord.status === 'processing' ? (
                     <Loader2 className="text-secondary animate-spin" size={18} />
                  ) : (
                     <Sparkles className="text-secondary" size={18} />
                  )}
                  <h3 className={`font-bold ${selectedRecord.status === 'processing' ? 'text-gray-500' : 'text-gray-900'}`}>
                      {selectedRecord.status === 'processing' ? 'AI 正在智能分析...' : 'AI 智能解读'}
                  </h3>
               </div>
               
               {selectedRecord.status === 'processing' ? (
                   <div className="space-y-3 py-2">
                       <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                       </div>
                       <div className="h-4 bg-gray-100 rounded w-full animate-pulse delay-75"></div>
                       <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse delay-150"></div>
                       <p className="text-xs text-gray-400 pt-2 animate-pulse">正在提取单据关键指标...</p>
                   </div>
               ) : (
                   <div className="animate-in fade-in duration-500">
                       <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {selectedRecord.aiAnalysis}
                       </div>
                       <div className="mt-3 flex items-center gap-1.5 text-xs text-secondary bg-secondary/5 p-2 rounded-lg">
                          <AlertCircle size={14} />
                          <span>解读结果仅供参考，请以线下医生诊断为准。</span>
                       </div>
                   </div>
               )}
            </div>
          )}

          {/* Attachments */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 px-1">原始单据</h3>
            {selectedRecord.images && selectedRecord.images.length > 0 ? (
               <div className="grid grid-cols-2 gap-3">
                  {selectedRecord.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Record" className="w-full h-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
                  ))}
               </div>
            ) : (
               <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                  暂无图片附件
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: TASK LIST VIEW ---
  if (showAllTasks) {
     return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 h-14 flex items-center gap-3 border-b border-gray-100">
                <button 
                    onClick={() => setShowAllTasks(false)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-bold text-lg text-gray-900 flex-1 text-center pr-8">所有健康提醒</h1>
            </div>
            
            <div className="p-4 space-y-3">
                 {vaccines.map(vac => (
                  <div 
                    key={vac.id} 
                    onClick={() => handleTaskClick(vac)}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-card transition-all
                        ${!vac.isDone ? 'active:scale-[0.99] cursor-pointer hover:shadow-md' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors 
                            ${vac.isDone ? 'border-gray-300 bg-gray-300' : 'border-secondary bg-secondary/10'}`}>
                                {vac.isDone && <Check size={12} className="text-white" />}
                                {!vac.isDone && <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>}
                       </div>
                       <div>
                         <p className={`text-base font-medium transition-all ${vac.isDone ? 'text-gray-400 line-through decoration-gray-400' : 'text-gray-900'}`}>{vac.name}</p>
                         <p className="text-xs text-gray-400 mt-0.5">{vac.isDone ? `已完成: ${vac.date}` : `截止: ${vac.nextDueDate}`}</p>
                       </div>
                    </div>
                    {!vac.isDone ? (
                        <button className="text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1.5 rounded-lg active:bg-secondary/20">打卡</button>
                    ) : (
                        <span className="text-xs text-gray-300 font-medium">已归档</span>
                    )}
                  </div>
                ))}
            </div>

             {/* Re-use Check-in Modal inside this view as well */}
             {checkInTask && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full h-auto rounded-t-[2rem] sm:rounded-2xl sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <button onClick={() => setCheckInTask(null)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                                <X size={22} />
                            </button>
                            <h2 className="font-bold text-lg text-gray-900">完成任务</h2>
                            <button onClick={handleSaveCheckIn} className="text-primary font-bold p-2 hover:bg-green-50 rounded-full transition">
                                <Check size={22} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-3">
                                    <Syringe size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{checkInTask.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">计划截止: {checkInTask.nextDueDate}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <Clock size={12} /> 实际完成时间
                                </label>
                                <input 
                                    type="date"
                                    value={checkInDate}
                                    onChange={e => setCheckInDate(e.target.value)}
                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                                />
                            </div>
                            <button 
                                onClick={handleSaveCheckIn}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
                            >
                                确认完成
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
     )
  }

  // --- RENDER: DASHBOARD VIEW (Default) ---
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative">
      
      {/* 
         Structure Explanation:
         1. Absolute White Background (z-0)
         2. Header Content (z-20)
         3. Stats Card (z-10)
      */}

      {/* Layer 1: Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[280px] bg-gradient-to-b from-orange-50/50 to-background rounded-b-[2.5rem] z-0 pointer-events-none" />

      {/* Layer 2: Header Content (High z-index for dropdown) */}
      <div className="relative z-20 px-6 pt-16 pb-6">
        <div className="flex items-center gap-5 relative">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-soft overflow-hidden flex-shrink-0 bg-white">
            <img src={pet.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          
          {/* Info Text & Dropdown */}
          <div className="flex-1 relative">
            <div className="relative inline-block">
                <button 
                  onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
                  className="flex items-center gap-2 group cursor-pointer outline-none select-none"
                >
                    <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                    <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-gray-600 transition-colors shadow-sm">
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isPetDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
                
                {/* Pet Switching Dropdown */}
                {isPetDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        <div className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">切换档案</div>
                        <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                            {MOCK_PETS_LIST.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleSwitchPet(p)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                                        p.id === pet.id 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-black/5" />
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-sm leading-none mb-0.5">{p.name}</span>
                                        <span className="text-[10px] opacity-70">{p.breed}</span>
                                    </div>
                                    {p.id === pet.id && <Check size={16} className="ml-auto" />}
                                </button>
                            ))}
                        </div>
                        <div className="h-px bg-gray-50 my-2"></div>
                        <button className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                            <Plus size={14} /> 添加新宠物
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${pet.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                    {pet.gender === 'male' ? '♂ 弟弟' : '♀ 妹妹'}
                </span>
                <span className="text-xs text-gray-600 bg-white/60 px-2 py-0.5 rounded-md border border-white/50">{pet.breed}</span>
                <span className="text-xs text-gray-500">{pet.age}</span>
            </div>
          </div>
          
          <button 
            onClick={handleEditClick}
            className="bg-white/60 p-2.5 rounded-full hover:bg-white transition text-gray-500 shadow-sm"
          >
             <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Layer 3: Body Content (z-10 to overlap bg, but stay under dropdown) */}
      <div className="relative z-10 px-4 mt-2 space-y-4">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-5 shadow-soft flex justify-between items-center text-center">
            <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1.5">体重(kg)</p>
                <p className="text-2xl font-bold text-gray-900">{pet.weight}</p>
            </div>
            <div className="w-px h-10 bg-gray-100"></div>
             <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1.5">下次疫苗</p>
                <p className="text-2xl font-bold text-gray-900">12<span className="text-xs font-normal text-gray-400 ml-1">天后</span></p>
            </div>
            <div className="w-px h-10 bg-gray-100"></div>
             <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1.5">健康分</p>
                <p className="text-2xl font-bold text-secondary">95</p>
            </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 
                onClick={() => setShowWeightHistory(true)}
                className="font-bold text-gray-900 flex items-center gap-2 text-base cursor-pointer group"
            >
              <div className="p-1.5 bg-accent/20 rounded-lg text-yellow-600 group-hover:bg-accent/30 transition-colors">
                 <Ruler size={16} />
              </div> 
              体重记录
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </h3>
            <button 
                onClick={handleAddWeightClick}
                className="text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-bold active:scale-95 transition hover:bg-primary/10"
            >
                + 记录
            </button>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#9CA3AF'}} 
                    tickFormatter={(val) => val.slice(5)} // Show MM-DD only
                    dy={10} 
                />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', fontSize: '12px'}}
                  cursor={{stroke: '#FF8853', strokeWidth: 1}}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#FF8853" // Use Primary Orange
                  strokeWidth={3} 
                  dot={{fill: '#fff', strokeWidth: 3, r: 4, stroke: '#FF8853'}}
                  activeDot={{r: 6, fill: '#FF8853', stroke: '#fff'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vaccine/Health Tasks */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
              <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                <Syringe size={16} /> 
              </div>
              健康提醒
            </h3>
            <button 
                onClick={() => setShowAllTasks(true)}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
                全部 {'>'}
            </button>
          </div>
          <div className="space-y-3">
            {vaccines.slice(0, 3).map(vac => (
              <div 
                key={vac.id} 
                onClick={() => handleTaskClick(vac)}
                className={`flex items-center justify-between p-4 bg-gray-50/50 rounded-xl transition-colors
                    ${!vac.isDone ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-offset-1 ${vac.isDone ? 'ring-gray-300 bg-gray-300' : 'ring-secondary bg-secondary'}`}></div>
                   <div>
                     <p className={`text-sm font-medium transition-all ${vac.isDone ? 'text-gray-400 line-through decoration-gray-400' : 'text-gray-900'}`}>{vac.name}</p>
                     <p className="text-xs text-gray-400 mt-0.5">{vac.isDone ? `已完成: ${vac.date}` : `截止: ${vac.nextDueDate}`}</p>
                   </div>
                </div>
                {!vac.isDone && <button className="text-xs bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg text-gray-600 active:bg-gray-50">打卡</button>}
              </div>
            ))}
          </div>
        </div>

        {/* Electronic Records */}
        <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
               <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500">
                <FileText size={16} /> 
              </div>
              电子病历
            </h3>
            <button 
                onClick={handleAddRecordClick}
                className="text-gray-400 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
            >
                <Plus size={24} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
              {medicalRecords.map(record => (
                <div 
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`p-4 rounded-xl border border-transparent transition-all cursor-pointer hover:shadow-md active:scale-95
                    ${record.type === 'lab' ? 'bg-[#F8F6FF] hover:border-purple-100' : 'bg-[#F0F7FF] hover:border-blue-100'}`}
                >
                   <p className={`text-sm font-bold mb-1 truncate ${record.type === 'lab' ? 'text-purple-900' : 'text-blue-900'}`}>{record.title}</p>
                   <p className={`text-xs ${record.type === 'lab' ? 'text-purple-600/70' : 'text-blue-600/70'}`}>{record.date}</p>
                   {record.status === 'completed' && record.aiAnalysis && (
                     <div className={`mt-3 flex items-center gap-1 text-[10px] px-2 py-1 rounded shadow-sm w-fit
                       ${record.type === 'lab' ? 'bg-white text-purple-600' : 'bg-white text-blue-600'}`}>
                        <Check size={10} /> AI已存档
                     </div>
                   )}
                   {record.status === 'processing' && (
                     <div className="mt-3 flex items-center gap-1 text-[10px] px-2 py-1 rounded shadow-sm w-fit bg-yellow-50 text-yellow-600">
                        <Clock size={10} /> 待解读
                     </div>
                   )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Overlay */}
      {isEditing && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full h-[90%] rounded-t-[2rem] sm:rounded-2xl sm:h-auto sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <button onClick={() => setIsEditing(false)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                <X size={22} />
              </button>
              <h2 className="font-bold text-lg text-gray-900">编辑宠物档案</h2>
              <button onClick={handleSave} className="text-primary font-bold p-2 hover:bg-green-50 rounded-full transition">
                <Check size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto h-[calc(100%-80px)] space-y-6">
              
              {/* Avatar Edit */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img src={editForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gray-900 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">昵称</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">品种</label>
                    <input 
                      type="text" 
                      value={editForm.breed} 
                      onChange={(e) => setEditForm({...editForm, breed: e.target.value})}
                      className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900"
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">生日</label>
                    <input 
                      type="date" 
                      value={editForm.birthday} 
                      onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                      className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">体重 (KG)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={editForm.weight} 
                      onChange={(e) => setEditForm({...editForm, weight: parseFloat(e.target.value)})}
                      className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">性别</label>
                    <div className="flex gap-2">
                        <button 
                        onClick={() => setEditForm({...editForm, gender: 'male'})}
                        className={`flex-1 p-3.5 rounded-xl border font-bold transition flex justify-center items-center gap-2 ${editForm.gender === 'male' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                        >
                        ♂
                        </button>
                        <button 
                        onClick={() => setEditForm({...editForm, gender: 'female'})}
                        className={`flex-1 p-3.5 rounded-xl border font-bold transition flex justify-center items-center gap-2 ${editForm.gender === 'female' ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                        >
                        ♀
                        </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-bold text-gray-700 ml-1">是否已绝育</span>
                  <div 
                    onClick={() => setEditForm({...editForm, isNeutered: !editForm.isNeutered})}
                    className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors cursor-pointer ${editForm.isNeutered ? 'bg-primary' : 'bg-gray-200'}`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${editForm.isNeutered ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Weight Record Modal Overlay */}
      {isAddingWeight && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full h-auto rounded-t-[2rem] sm:rounded-2xl sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
             <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <button onClick={() => setIsAddingWeight(false)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                <X size={22} />
              </button>
              <h2 className="font-bold text-lg text-gray-900">记录体重</h2>
              <button onClick={handleSaveWeight} className="text-primary font-bold p-2 hover:bg-green-50 rounded-full transition">
                <Check size={22} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
                 {/* Current Weight Display */}
                 <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-4xl font-bold text-primary flex items-end gap-1">
                        {weightForm.weight || '0.0'} 
                        <span className="text-base text-gray-400 font-medium pb-1.5">kg</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">请输入新体重</p>
                 </div>

                 <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                            <Clock size={12} /> 记录时间
                        </label>
                        <input 
                            type="date"
                            value={weightForm.date}
                            onChange={e => setWeightForm({...weightForm, date: e.target.value})}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                        />
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                            <Ruler size={12} /> 体重数值 (KG)
                        </label>
                        <input 
                            type="number"
                            step="0.01"
                            placeholder="0.0"
                            value={weightForm.weight}
                            onChange={e => setWeightForm({...weightForm, weight: e.target.value})}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium text-lg"
                        />
                     </div>
                 </div>

                 <button 
                    onClick={handleSaveWeight}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
                 >
                    保存记录
                 </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Check-in Modal Overlay (used by both dashboard and Full List View) */}
      {checkInTask && !showAllTasks && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full h-auto rounded-t-[2rem] sm:rounded-2xl sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <button onClick={() => setCheckInTask(null)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                        <X size={22} />
                    </button>
                    <h2 className="font-bold text-lg text-gray-900">完成任务</h2>
                    <button onClick={handleSaveCheckIn} className="text-primary font-bold p-2 hover:bg-green-50 rounded-full transition">
                        <Check size={22} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-3">
                            <Syringe size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{checkInTask.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">计划截止: {checkInTask.nextDueDate}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                            <Clock size={12} /> 实际完成时间
                        </label>
                        <input 
                            type="date"
                            value={checkInDate}
                            onChange={e => setCheckInDate(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium"
                        />
                    </div>
                    <button 
                        onClick={handleSaveCheckIn}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
                    >
                        确认完成
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HealthView;