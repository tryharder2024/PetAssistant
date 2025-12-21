import React, { useState, useRef } from 'react';
import { Settings, Bookmark, FileText, ChevronRight, PawPrint, LogOut, Wallet, X, Check, Camera, ChevronLeft, Plus, Trash2, Ruler, Calendar, MessageSquare, Heart, MessageCircle, Crown, Zap, ShieldCheck, Gem, Star, Footprints, Clock, Eye, Activity, Bell, Lock, Smartphone, Moon, Info, HelpCircle, Users, UserCheck, UserPlus, Smartphone as PhoneIcon, Key, History, Download, FileCheck } from 'lucide-react';
import { PetProfile, CommunityPost } from '../types';

// --- Types & Enums ---
type ViewMode = 
  | 'main' 
  | 'pets' 
  | 'posts' 
  | 'favorites' 
  | 'history' 
  | 'benefits' 
  | 'footprints' 
  | 'following' 
  | 'settings'
  // Settings Sub-views
  | 'settings_security'
  | 'settings_change_phone'
  | 'settings_change_password'
  | 'settings_login_history'
  | 'settings_about'
  | 'settings_agreement'
  | 'settings_privacy';

// --- Mock Data ---

const INITIAL_PETS: PetProfile[] = [
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

const MOCK_MY_POSTS: CommunityPost[] = [
  {
    id: 'mp1',
    author: '铲屎官_小王',
    avatar: 'https://picsum.photos/200/200?random=user',
    title: '我家狗狗第一次游泳，太搞笑了！',
    content: '本来以为它是游泳健将，结果...',
    image: 'https://picsum.photos/400/300?random=88',
    likes: 52,
    tags: ['#金毛', '#游泳']
  },
  {
    id: 'mp2',
    author: '铲屎官_小王',
    avatar: 'https://picsum.photos/200/200?random=user',
    title: '自制宠物零食：鸡胸肉干',
    content: '没有任何添加剂，健康又美味。',
    image: 'https://picsum.photos/400/300?random=89',
    likes: 128,
    tags: ['#自制零食', '#养宠经验']
  }
];

const MOCK_FAVORITES: CommunityPost[] = [
  {
    id: 'f1',
    author: '专业兽医老张',
    avatar: 'https://picsum.photos/100/100?random=doc',
    title: '干货：狗狗疫苗接种全攻略',
    content: '新手养狗必看，建议收藏！',
    image: 'https://picsum.photos/400/300?random=90',
    likes: 890,
    tags: ['#科普', '#疫苗']
  }
];

const MOCK_HISTORY = [
  { id: 'h1', date: '2024-03-10', title: '狗狗呕吐咨询', summary: '建议禁食禁水观察12小时...', status: '已结束' },
  { id: 'h2', date: '2024-02-15', title: '猫咪绝育术后护理', summary: '注意佩戴伊丽莎白圈，保持伤口干燥...', status: '已结束' },
  { id: 'h3', date: '2024-01-20', title: '皮肤病用药咨询', summary: '可能是真菌感染，建议使用...', status: '已结束' },
];

const MOCK_FOOTPRINTS = [
  { 
    id: 'fp1', 
    title: '金毛三个月大，开始换牙啦！🦷', 
    author: '豆豆妈',
    image: 'https://picsum.photos/400/500?random=10',
    time: '14:30', 
    date: '今天',
  },
  { 
    id: 'fp2', 
    title: '生病求助：猫咪不吃饭', 
    author: '加菲猫阿肥',
    image: 'https://picsum.photos/400/300?random=11',
    time: '10:15', 
    date: '今天',
  },
  { 
    id: 'fp3', 
    title: '周末去公园撒欢', 
    author: '柯基小短腿',
    image: 'https://picsum.photos/400/600?random=12',
    time: '20:45', 
    date: '昨天',
  },
  { 
    id: 'fp4', 
    title: '新买的猫爬架', 
    author: '布偶Queen',
    image: 'https://picsum.photos/400/400?random=13',
    time: '18:20', 
    date: '昨天',
  },
  { 
    id: 'fp5', 
    title: '新手养狗避坑指南', 
    author: '专业兽医老张',
    image: 'https://picsum.photos/400/300?random=90',
    time: '12:45', 
    date: '2024-03-08',
  }
];

const MOCK_FOLLOWING_USERS = [
  {
    id: 'u1',
    name: '专业兽医老张',
    avatar: 'https://picsum.photos/100/100?random=doc',
    bio: '从业15年，专注犬猫外科与营养学。',
    isFollowing: true
  },
  {
    id: 'u2',
    name: '豆豆妈',
    avatar: 'https://picsum.photos/100/100?random=1',
    bio: '金毛豆豆的日常，分享快乐。',
    isFollowing: true
  },
  {
    id: 'u3',
    name: '宠物营养师Lisa',
    avatar: 'https://picsum.photos/100/100?random=21',
    bio: '科学喂养，让毛孩子更健康。',
    isFollowing: true
  },
  {
    id: 'u4',
    name: '加菲猫阿肥',
    avatar: 'https://picsum.photos/100/100?random=2',
    bio: '一只爱睡觉的加菲猫。',
    isFollowing: true
  }
];

const MEMBERSHIP_PLANS = [
    {
        id: 'free',
        name: '普通用户',
        price: '免费',
        period: '永久',
        color: 'bg-gray-100 text-gray-600',
        features: ['基础宠物档案 (1只)', '社区发帖互动', 'AI 问诊 (每日3次)', '基础疫苗提醒']
    },
    {
        id: 'vip',
        name: 'VIP 会员',
        price: '¥ 19.9',
        period: '/ 月',
        color: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
        features: ['宠物档案无限制', 'AI 问诊无限次', '化验单 AI 解读', '病历云端永久存储', '专属身份标识']
    },
    {
        id: 'gold',
        name: '黄金会员',
        price: '¥ 199',
        period: '/ 年',
        recommend: true,
        color: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white',
        features: ['包含 VIP 所有权益', '线下医院挂号 9 折', '每月赠送驱虫药券', '24h 极速响应', '专属一对一客服']
    }
];

const DEFAULT_NEW_PET: PetProfile = {
  id: '',
  name: '',
  breed: '',
  age: '',
  birthday: '',
  gender: 'male',
  isNeutered: false,
  weight: 0,
  avatar: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png'
};

const ProfileView: React.FC = () => {
  // --- Main State ---
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  
  const [user, setUser] = useState({
    name: '铲屎官_小王',
    id: '89757',
    phone: '138****8888',
    vipLevel: '普通用户', // Start with basic
    avatar: 'https://picsum.photos/200/200?random=user',
  });

  // --- Settings State ---
  const [settings, setSettings] = useState({
    pushEnabled: true,
    darkMode: false,
    dataSaver: false,
  });

  // --- Edit Profile State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  
  // --- Pet Data State ---
  const [myPets, setMyPets] = useState<PetProfile[]>(INITIAL_PETS);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [newPetForm, setNewPetForm] = useState<PetProfile>(DEFAULT_NEW_PET);

  // --- Following List State ---
  const [followingUsers, setFollowingUsers] = useState(MOCK_FOLLOWING_USERS);

  // --- Settings Forms State ---
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', code: '' });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const petAvatarInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers: Navigation ---
  const handleBack = () => {
    if (viewMode === 'settings') {
      setViewMode('main');
    } else if (viewMode.startsWith('settings_')) {
      if (['settings_change_password', 'settings_login_history'].includes(viewMode)) {
        setViewMode('settings_security');
      } else {
        setViewMode('settings');
      }
    } else {
      setViewMode('main');
    }
  };

  // --- Handlers: Profile Edit ---
  const handleEditClick = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
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

  // --- Handlers: Pet Management ---
  const handleDeletePet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这只宠物吗？数据将无法恢复。')) {
      setMyPets(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddPetClick = () => {
    setNewPetForm({ ...DEFAULT_NEW_PET, id: Date.now().toString() });
    setIsAddingPet(true);
  };

  const handleSaveNewPet = () => {
    if (!newPetForm.name || !newPetForm.breed) {
      alert('请填写宠物昵称和品种');
      return;
    }
    const finalPetData = {
        ...newPetForm,
        age: newPetForm.age || '未知'
    };
    setMyPets(prev => [...prev, finalPetData]);
    setIsAddingPet(false);
  };

  const handlePetAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPetForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers: Following ---
  const handleToggleFollow = (id: string) => {
      setFollowingUsers(prev => prev.map(u => {
          if (u.id === id) {
              return { ...u, isFollowing: !u.isFollowing };
          }
          return u;
      }));
  };

  const handleUpgrade = (planName: string) => {
      if (planName === user.vipLevel) return;
      
      const confirmMsg = planName === '普通用户' 
        ? '确定要降级为普通用户吗？' 
        : `确认支付并升级为 ${planName} 吗？`;
      
      if (window.confirm(confirmMsg)) {
          setUser(prev => ({ ...prev, vipLevel: planName }));
          alert(`恭喜！您已成功变更为 ${planName}`);
          setViewMode('main');
      }
  };
  
  // --- Handlers: Settings Logic ---
  const handleClearCache = () => {
      if (window.confirm('确定要清除缓存吗？这将释放本地存储空间，但可能需要重新加载部分图片。')) {
          setTimeout(() => {
              alert('缓存清理成功！释放了 24.5MB 空间。');
          }, 500);
      }
  };

  const handleSendCode = () => {
    if (!phoneForm.phone) {
        alert("请输入手机号");
        return;
    }
    setIsCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
        setCountdown(prev => {
            if (prev <= 1) {
                clearInterval(timer);
                setIsCodeSent(false);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    alert(`验证码已发送: 1234`);
  };

  const handleSavePhone = () => {
      if (phoneForm.code !== '1234') {
          alert('验证码错误 (测试码: 1234)');
          return;
      }
      setUser(prev => ({...prev, phone: phoneForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}));
      alert('手机号修改成功');
      setPhoneForm({phone: '', code: ''});
      setViewMode('settings_security');
  };

  const handleSavePassword = () => {
      if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
          alert('请填写完整信息');
          return;
      }
      if (passwordForm.new !== passwordForm.confirm) {
          alert('两次输入的新密码不一致');
          return;
      }
      alert('密码修改成功，请重新登录');
      setPasswordForm({old: '', new: '', confirm: ''});
      setViewMode('settings_security');
  };

  const handleLogout = () => {
      if(window.confirm("确定要退出登录吗？")) {
          alert("已退出登录");
          // Logic to clear token or reset app state would go here
      }
  };

  // --- Helper: Render Header for Sub-views ---
  const renderHeader = (title: string, actionButton?: React.ReactNode) => (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-gray-900">{title}</h1>
        </div>
        {actionButton}
    </div>
  );

  // ---------------- RENDER: SUB-VIEWS ----------------

  // 1. My Pets View
  if (viewMode === 'pets') {
    return (
      <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
        {renderHeader('我的宠物', 
            <button onClick={handleAddPetClick} className="text-primary p-2 hover:bg-orange-50 rounded-full transition-colors">
                <Plus size={24} />
            </button>
        )}
        <div className="p-4 space-y-4">
            {myPets.length === 0 ? (
                <EmptyState icon={PawPrint} text="还没有添加宠物哦" actionText="点击添加" onAction={handleAddPetClick} />
            ) : (
                myPets.map(pet => (
                    <div key={pet.id} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 relative overflow-hidden group">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-100 overflow-hidden shrink-0">
                            <img src={pet.avatar} alt={pet.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-gray-900 truncate">{pet.name}</h3>
                                {pet.gender === 'male' ? (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold">♂ 弟弟</span>
                                ) : (
                                    <span className="text-[10px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded-md font-bold">♀ 妹妹</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{pet.breed} · {pet.age}</p>
                            <div className="flex gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${pet.isNeutered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {pet.isNeutered ? '已绝育' : '未绝育'}
                                </span>
                            </div>
                        </div>
                        <button onClick={(e) => handleDeletePet(pet.id, e)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))
            )}
        </div>
        {/* Add Pet Modal (Only rendered when needed) */}
        {isAddingPet && (
             <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white w-full h-[90%] rounded-t-[2rem] sm:rounded-2xl sm:h-auto sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <button onClick={() => setIsAddingPet(false)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                            <X size={22} />
                        </button>
                        <h2 className="font-bold text-lg text-gray-900">添加新宠物</h2>
                        <button onClick={handleSaveNewPet} className="text-primary font-bold p-2 hover:bg-orange-50 rounded-full transition">
                            <Check size={22} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto h-[calc(100%-80px)] space-y-5">
                         {/* Avatar Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={() => petAvatarInputRef.current?.click()}>
                                <img src={newPetForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-gray-50" />
                                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <Camera className="text-white" size={24} />
                                </div>
                                <input type="file" ref={petAvatarInputRef} onChange={handlePetAvatarChange} className="hidden" accept="image/*" />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">上传头像</p>
                        </div>
                        {/* Simple Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">昵称</label>
                                <input type="text" placeholder="例如：旺财" value={newPetForm.name} onChange={e => setNewPetForm({...newPetForm, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">品种</label><input type="text" placeholder="例如：金毛" value={newPetForm.breed} onChange={e => setNewPetForm({...newPetForm, breed: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900" /></div>
                                <div><label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">年龄/生日</label><input type="text" placeholder="例如：2岁" value={newPetForm.age} onChange={e => setNewPetForm({...newPetForm, age: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900" /></div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div><label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">体重 (KG)</label><input type="number" value={newPetForm.weight || ''} onChange={e => setNewPetForm({...newPetForm, weight: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition text-gray-900" /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">性别</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setNewPetForm({...newPetForm, gender: 'male'})} className={`flex-1 p-3.5 rounded-xl border font-bold transition flex justify-center items-center gap-2 ${newPetForm.gender === 'male' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}>♂</button>
                                        <button onClick={() => setNewPetForm({...newPetForm, gender: 'female'})} className={`flex-1 p-3.5 rounded-xl border font-bold transition flex justify-center items-center gap-2 ${newPetForm.gender === 'female' ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}>♀</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="font-bold text-gray-700 ml-1">是否已绝育</span>
                                <div onClick={() => setNewPetForm({...newPetForm, isNeutered: !newPetForm.isNeutered})} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors cursor-pointer ${newPetForm.isNeutered ? 'bg-primary' : 'bg-gray-200'}`}><div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${newPetForm.isNeutered ? 'translate-x-6' : 'translate-x-0'}`} /></div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}
      </div>
    );
  }

  // 2. My Posts View
  if (viewMode === 'posts') {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('我的发布')}
            <div className="p-4 space-y-3">
                {MOCK_MY_POSTS.map(post => (
                    <PostListItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
  }

  // 3. Favorites View
  if (viewMode === 'favorites') {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('我的收藏')}
            <div className="p-4 space-y-3">
                {MOCK_FAVORITES.map(post => (
                    <PostListItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
  }

  // 4. History View
  if (viewMode === 'history') {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('咨询记录')}
            <div className="p-4 space-y-3">
                {MOCK_HISTORY.map(record => (
                    <div key={record.id} className="bg-white p-4 rounded-xl shadow-card flex items-start gap-4 active:scale-[0.99] transition-transform">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <MessageSquare size={20} className="text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 truncate pr-2">{record.title}</h3>
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{record.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{record.summary}</p>
                            <div className="mt-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span className="text-[10px] text-gray-400">{record.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  // 5. Benefits View (Membership)
  if (viewMode === 'benefits') {
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('我的权益')}
            <div className="p-4 space-y-6">
                
                {/* Current Status Card */}
                <div className="w-full bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs mb-1">当前身份</p>
                            <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                                user.vipLevel === '黄金会员' ? 'text-yellow-400' : 
                                user.vipLevel === 'VIP 会员' ? 'text-blue-400' : 'text-white'
                            }`}>
                                {user.vipLevel}
                                {user.vipLevel === '黄金会员' && <Crown size={20} fill="currentColor" />}
                            </h2>
                            <p className="text-xs text-gray-500 mt-2">
                                {user.vipLevel === '普通用户' ? '升级享受更多权益' : '有效期至 2024-12-31'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Gem className="text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Plans */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="text-primary" size={18} fill="currentColor" /> 选择会员套餐
                    </h3>
                    <div className="space-y-4">
                        {MEMBERSHIP_PLANS.map(plan => (
                            <div key={plan.id} className={`rounded-2xl p-5 border-2 transition-all relative overflow-hidden ${
                                user.vipLevel === plan.name 
                                ? 'bg-white border-primary shadow-lg scale-[1.02]' 
                                : 'bg-white border-transparent shadow-card hover:border-gray-200'
                            }`}>
                                {plan.recommend && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                        推荐
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-lg text-gray-900">{plan.name}</h4>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-xs text-gray-400">{plan.period}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check size={14} className="text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleUpgrade(plan.name)}
                                    disabled={user.vipLevel === plan.name}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                        user.vipLevel === plan.name
                                        ? 'bg-gray-100 text-gray-400 cursor-default'
                                        : plan.id === 'gold' 
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-200 active:scale-95'
                                            : plan.id === 'vip'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95'
                                                : 'bg-gray-900 text-white active:scale-95'
                                    }`}
                                >
                                    {user.vipLevel === plan.name ? '当前套餐' : '立即升级'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 text-xs text-gray-400 leading-relaxed shadow-sm">
                   <p className="font-bold mb-1 flex items-center gap-1"><ShieldCheck size={12} /> 会员权益说明</p>
                   1. 会员权益在支付成功后立即生效。<br/>
                   2. 极速问诊服务由 AI + 人工助理提供技术支持。<br/>
                   3. 如有任何支付问题，请联系客服。
                </div>

            </div>
        </div>
      );
  }

  // 6. My Footprints View
  if (viewMode === 'footprints') {
      const groupedFootprints = MOCK_FOOTPRINTS.reduce((acc, curr) => {
          (acc[curr.date] = acc[curr.date] || []).push(curr);
          return acc;
      }, {} as Record<string, typeof MOCK_FOOTPRINTS>);

      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('我的足迹')}
            <div className="p-6">
                {Object.entries(groupedFootprints).map(([date, items], groupIdx) => (
                    <div key={date} className="mb-8 last:mb-0 relative">
                        {/* Timeline Line */}
                        <div className="absolute top-8 left-[7px] bottom-[-32px] w-0.5 bg-gray-200 last:bottom-0" style={{ display: groupIdx === Object.keys(groupedFootprints).length - 1 ? 'none' : 'block' }}></div>
                        
                        <h3 className="font-bold text-gray-900 text-lg mb-4 ml-6">{date}</h3>
                        
                        <div className="space-y-6 pl-2">
                            {items.map((item, idx) => {
                                return (
                                    <div key={item.id} className="relative flex gap-4">
                                         {/* Timeline Dot */}
                                        <div className="absolute left-[-9px] top-1.5 z-10 w-4 h-4 rounded-full bg-primary border-4 border-background shrink-0"></div>
                                        
                                        {/* Content Card */}
                                        <div className="flex-1 bg-white p-3 rounded-xl shadow-card flex gap-3 active:scale-[0.99] transition-transform">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{item.title}</h4>
                                                    <div className="flex items-center gap-1.5 mt-2">
                                                        <img src={`https://ui-avatars.com/api/?name=${item.author}&background=random`} alt={item.author} className="w-4 h-4 rounded-full" />
                                                        <span className="text-xs text-gray-500 truncate">{item.author}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-300 flex items-center gap-1 mt-1">
                                                    <Clock size={10} /> {item.time} 浏览
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  // 7. My Following View
  if (viewMode === 'following') {
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('我的关注')}
            <div className="p-4 space-y-3">
                {followingUsers.length === 0 ? (
                     <EmptyState icon={Users} text="还没有关注任何人哦" />
                ) : (
                    followingUsers.map(u => (
                        <div key={u.id} className="bg-white p-4 rounded-xl shadow-card flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border border-gray-100 object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm">{u.name}</h3>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{u.bio}</p>
                            </div>
                            <button 
                                onClick={() => handleToggleFollow(u.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${
                                    u.isFollowing 
                                    ? 'bg-gray-50 text-gray-500 border-gray-200' 
                                    : 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                                }`}
                            >
                                {u.isFollowing ? (
                                    <>
                                        <UserCheck size={14} /> 已关注
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14} /> 关注
                                    </>
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      );
  }

  // ---------------- SETTINGS SUB-VIEWS ----------------

  // 8.1 Settings -> Account Security Menu
  if (viewMode === 'settings_security') {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('账号安全中心')}
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-card">
                     {/* Removed Phone Change from here as it's now in main settings */}
                     <SettingsItem 
                        icon={Key} 
                        label="修改登录密码" 
                        onClick={() => setViewMode('settings_change_password')}
                     />
                     <SettingsItem 
                        icon={History} 
                        label="登录设备管理" 
                        value="iPhone 13 Pro"
                        onClick={() => setViewMode('settings_login_history')}
                     />
                </div>
                <p className="text-xs text-gray-400 px-2">若发现异常登录，请及时修改密码。</p>
            </div>
        </div>
    );
  }

  // 8.2 Settings -> Change Phone
  if (viewMode === 'settings_change_phone') {
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('修改手机号')}
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1.5 ml-1 block">新手机号</label>
                        <input 
                            type="tel" 
                            placeholder="请输入新手机号"
                            value={phoneForm.phone}
                            onChange={(e) => setPhoneForm({...phoneForm, phone: e.target.value})}
                            className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1.5 ml-1 block">验证码</label>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                placeholder="输入验证码"
                                value={phoneForm.code}
                                onChange={(e) => setPhoneForm({...phoneForm, code: e.target.value})}
                                className="flex-1 p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium" 
                            />
                            <button 
                                onClick={handleSendCode}
                                disabled={isCodeSent}
                                className={`w-32 rounded-xl font-bold text-sm transition-all ${
                                    isCodeSent ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-lg shadow-primary/30 active:scale-95'
                                }`}
                            >
                                {isCodeSent ? `${countdown}s` : '获取验证码'}
                            </button>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleSavePhone}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
                >
                    确认修改
                </button>
            </div>
        </div>
      );
  }

  // 8.3 Settings -> Change Password
  if (viewMode === 'settings_change_password') {
    return (
      <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
          {renderHeader('修改密码')}
          <div className="p-6 space-y-6">
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-gray-400 mb-1.5 ml-1 block">旧密码</label>
                      <input 
                          type="password" 
                          placeholder="请输入当前密码"
                          value={passwordForm.old}
                          onChange={(e) => setPasswordForm({...passwordForm, old: e.target.value})}
                          className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium" 
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-400 mb-1.5 ml-1 block">新密码</label>
                      <input 
                          type="password" 
                          placeholder="8-16位，包含字母和数字"
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                          className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium" 
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-400 mb-1.5 ml-1 block">确认新密码</label>
                      <input 
                          type="password" 
                          placeholder="再次输入新密码"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                          className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition text-gray-900 font-medium" 
                      />
                  </div>
              </div>
              <button 
                  onClick={handleSavePassword}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
              >
                  确认修改
              </button>
              <div className="text-center">
                  <button className="text-xs text-gray-400 hover:text-gray-600">忘记旧密码？</button>
              </div>
          </div>
      </div>
    );
  }

  // 8.4 Settings -> Login History
  if (viewMode === 'settings_login_history') {
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('登录记录')}
            <div className="p-4 space-y-3">
                <div className="bg-white p-4 rounded-xl shadow-card flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                             <Smartphone size={16} className="text-gray-600" />
                             <span className="font-bold text-gray-900">iPhone 13 Pro (本机)</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">上海 · 刚刚</p>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold">在线</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-card flex items-center justify-between opacity-70">
                    <div>
                        <div className="flex items-center gap-2">
                             <Smartphone size={16} className="text-gray-600" />
                             <span className="font-bold text-gray-900">iPad Air 5</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">北京 · 2024-03-01 10:23</p>
                    </div>
                    <button className="text-xs text-red-500 font-bold px-2 py-0.5 border border-red-200 rounded">下线</button>
                </div>
            </div>
        </div>
      );
  }

  // 8.5 Settings -> About Us
  if (viewMode === 'settings_about') {
    return (
      <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
          {renderHeader('关于我们')}
          <div className="flex flex-col items-center pt-10 pb-6 px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-orange-400 rounded-3xl shadow-xl flex items-center justify-center mb-4 text-white">
                  <PawPrint size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">宠医助手</h2>
              <p className="text-sm text-gray-400 mt-1">Version 1.0.0</p>
          </div>
          <div className="px-4 space-y-4">
               <div className="bg-white rounded-xl overflow-hidden shadow-card">
                   <SettingsItem label="功能介绍" icon={Star} />
                   <SettingsItem label="检查更新" icon={Download} value="已是最新版" />
                   <SettingsItem label="给个好评" icon={Heart} />
               </div>
               <div className="text-center text-xs text-gray-300 leading-relaxed pt-10">
                   <p>Copyright © 2024 PetDoctor Inc.</p>
                   <p>All Rights Reserved.</p>
               </div>
          </div>
      </div>
    );
  }

  // 8.6 Settings -> Agreements / Privacy (Simple Text Views)
  if (viewMode === 'settings_agreement' || viewMode === 'settings_privacy') {
      const isPrivacy = viewMode === 'settings_privacy';
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader(isPrivacy ? '隐私政策' : '用户协议')}
            <div className="p-6 text-sm text-gray-600 leading-7 space-y-4 text-justify">
                <h3 className="font-bold text-gray-900 text-lg">{isPrivacy ? '隐私保护指引' : '服务使用协议'}</h3>
                <p>
                   {isPrivacy 
                    ? '感谢您使用宠医助手。我们非常重视您的个人信息保护。本指引将详细说明我们在您使用服务时如何收集、使用、存储和保护您的个人信息。主要包括：1. 我们收集的信息类型（如设备信息、上传的病历图片等）；2. 信息的用途（仅用于AI分析和提供服务）；3. 信息安全保护措施。'
                    : '欢迎使用宠医助手APP。本协议是您与平台之间关于使用本服务所订立的协议。使用本服务即表示您已阅读并同意本协议的所有条款。请注意：1. 本平台提供的AI咨询建议仅供参考，不作为最终医疗诊断依据；2. 用户需对上传内容的真实性负责；3. 禁止利用本平台传播违法违规信息。'
                   }
                </p>
                <p>
                    {isPrivacy
                    ? '我们会采用符合业界标准的安全防护措施，包括建立合理的制度规范、安全技术来防止您的个人信息遭到未经授权的访问使用、修改,避免数据的损坏或丢失。'
                    : '若您不同意本协议的任何条款，请立即停止使用本服务。平台保留在法律允许范围内对本协议进行解释和修改的权利。'
                    }
                </p>
                <p className="text-xs text-gray-400 mt-8">最后更新日期：2024年1月1日</p>
            </div>
        </div>
      );
  }

  // 8. Settings Main View
  if (viewMode === 'settings') {
      return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative animate-in slide-in-from-right duration-300">
            {renderHeader('设置')}
            <div className="p-4 space-y-4">
                {/* Account Security */}
                <div className="bg-white rounded-xl overflow-hidden shadow-card">
                     <SettingsItem 
                        icon={Smartphone} 
                        label="手机号" 
                        value={user.phone} 
                        onClick={() => setViewMode('settings_change_phone')}
                     />
                     <SettingsItem 
                        icon={ShieldCheck} 
                        label="账号安全中心" 
                        onClick={() => setViewMode('settings_security')}
                     />
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-xl overflow-hidden shadow-card">
                     <SettingsItem 
                        icon={Bell} 
                        label="消息通知" 
                        toggle={{
                            checked: settings.pushEnabled,
                            onChange: () => setSettings(s => ({...s, pushEnabled: !s.pushEnabled}))
                        }}
                     />
                     <SettingsItem 
                        icon={Moon} 
                        label="深色模式" 
                         toggle={{
                            checked: settings.darkMode,
                            onChange: () => setSettings(s => ({...s, darkMode: !s.darkMode}))
                        }}
                     />
                      <SettingsItem 
                        icon={Zap} 
                        label="省流模式" 
                         toggle={{
                            checked: settings.dataSaver,
                            onChange: () => setSettings(s => ({...s, dataSaver: !s.dataSaver}))
                        }}
                     />
                     <SettingsItem 
                        icon={Trash2} 
                        label="清除缓存" 
                        value="24.5 MB"
                        onClick={handleClearCache}
                     />
                </div>

                 {/* About & Help */}
                <div className="bg-white rounded-xl overflow-hidden shadow-card">
                     <SettingsItem 
                        icon={FileCheck} 
                        label="用户协议" 
                        onClick={() => setViewMode('settings_agreement')}
                     />
                     <SettingsItem 
                        icon={Lock} 
                        label="隐私政策" 
                        onClick={() => setViewMode('settings_privacy')}
                     />
                     <SettingsItem 
                        icon={Info} 
                        label="关于我们" 
                        value="v1.0.0"
                        onClick={() => setViewMode('settings_about')}
                     />
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="w-full bg-white text-red-500 font-bold py-3.5 rounded-xl shadow-card active:bg-gray-50 mt-4"
                >
                    退出登录
                </button>
            </div>
        </div>
      );
  }

  // ---------------- RENDER: MAIN PROFILE VIEW ----------------
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-background pb-24 relative">
      {/* User Header */}
      <div className="bg-gradient-to-b from-orange-50/50 to-white/50 p-6 pt-16 pb-8 mb-3 shadow-sm border-b border-white/50">
        <div className="flex items-center gap-4">
          {/* Avatar with Edit Trigger */}
          <div className="relative group cursor-pointer" onClick={handleEditClick}>
             <img 
               src={user.avatar} 
               alt="User" 
               className="w-16 h-16 rounded-full border-4 border-white shadow-soft object-cover" 
             />
             <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera size={20} className="text-white drop-shadow-md" />
             </div>
             <div className="absolute bottom-0 right-0 bg-primary w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Settings size={10} className="text-white" />
             </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
                 <p className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded border border-white">ID: {user.id}</p>
                 <span className={`text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                     user.vipLevel === '黄金会员' ? 'bg-yellow-50 text-yellow-600' :
                     user.vipLevel === 'VIP 会员' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                 }`}>
                     {user.vipLevel === '黄金会员' && <Crown size={10} fill="currentColor" />}
                     {user.vipLevel}
                 </span>
            </div>
          </div>
          <button onClick={handleEditClick} className="text-gray-300 hover:text-gray-500 transition">
             <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Stats Row - Clickable */}
        <div className="flex justify-around mt-8">
          <button onClick={() => setViewMode('posts')} className="text-center group cursor-pointer active:scale-95 transition-transform flex-1">
            <span className="block text-xl font-bold text-gray-900 group-hover:text-primary transition">{MOCK_MY_POSTS.length}</span>
            <span className="text-xs text-gray-400 mt-1 block">我的发布</span>
          </button>
          <div className="w-px h-10 bg-gray-200/50"></div>
          <button onClick={() => setViewMode('favorites')} className="text-center group cursor-pointer active:scale-95 transition-transform flex-1">
            <span className="block text-xl font-bold text-gray-900 group-hover:text-primary transition">{MOCK_FAVORITES.length}</span>
            <span className="text-xs text-gray-400 mt-1 block">我的收藏</span>
          </button>
          <div className="w-px h-10 bg-gray-200/50"></div>
          {/* Note: Top stat remains "Consultation History" as it's a specific count, but clicking it goes to the history detail view */}
          <button onClick={() => setViewMode('history')} className="text-center group cursor-pointer active:scale-95 transition-transform flex-1">
            <span className="block text-xl font-bold text-gray-900 group-hover:text-primary transition">{MOCK_HISTORY.length}</span>
            <span className="text-xs text-gray-400 mt-1 block">咨询记录</span>
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-3">
         {/* Group 1 */}
         <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            <MenuItem 
                icon={PawPrint} 
                label="我的宠物" 
                value={`${myPets.length}只`} 
                onClick={() => setViewMode('pets')} 
            />
            <MenuItem 
                icon={Crown} 
                label="我的权益" 
                value={user.vipLevel !== '普通用户' ? user.vipLevel : ''}
                className={user.vipLevel === '黄金会员' ? 'text-yellow-600' : 'text-gray-700'}
                onClick={() => setViewMode('benefits')} 
            />
            {/* UPDATED: Replaced 'My Footprints' with 'My Following'? No, 'My Footprints' is still there. Replaced 'My Wallet' */}
            <MenuItem 
                icon={Footprints} 
                label="我的足迹" 
                onClick={() => setViewMode('footprints')} 
            />
            <MenuItem 
                icon={Users} 
                label="我的关注" 
                value={`${followingUsers.length}人`}
                onClick={() => setViewMode('following')} 
            />
         </div>

         {/* Group 2 */}
         <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            <MenuItem icon={Settings} label="设置" onClick={() => setViewMode('settings')} />
            <MenuItem icon={LogOut} label="退出登录" className="text-red-500" hideArrow onClick={handleLogout} />
         </div>
      </div>
      
      <p className="text-center text-xs text-gray-300 mt-8">Version 1.0.0</p>

      {/* Edit Profile Modal Overlay */}
      {isEditing && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full h-auto rounded-t-[2rem] sm:rounded-2xl sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <button onClick={() => setIsEditing(false)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition">
                <X size={22} />
              </button>
              <h2 className="font-bold text-lg text-gray-900">编辑个人资料</h2>
              <button onClick={handleSaveProfile} className="text-primary font-bold p-2 hover:bg-orange-50 rounded-full transition">
                <Check size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Avatar Edit */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img src={editForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gray-900 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition active:scale-95"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </div>
                <p className="text-xs text-gray-400 mt-3">点击更换头像</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">昵称</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900"
                    placeholder="请输入昵称"
                  />
                </div>
                
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">用户 ID (不可修改)</label>
                  <div className="w-full p-4 bg-gray-100 rounded-xl text-gray-500 font-mono text-sm">
                    {editForm.id}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 text-center">
                <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---

const MenuItem: React.FC<{ 
    icon: any, 
    label: string, 
    value?: string, 
    className?: string, 
    hideArrow?: boolean, 
    onClick?: () => void
}> = ({ 
  icon: Icon, label, value, className = 'text-gray-700', hideArrow = false, onClick 
}) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 active:bg-gray-100 transition-colors"
  >
    <div className="flex items-center gap-3.5">
      <div className={`p-2 rounded-lg ${className === 'text-red-500' ? 'bg-red-50' : 'bg-background'}`}>
         <Icon size={20} className={className === 'text-red-500' ? 'text-red-500' : 'text-gray-500'} />
      </div>
      <span className={`text-[15px] font-medium ${className}`}>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-gray-400 font-medium">{value}</span>}
      {!hideArrow && <ChevronRight size={18} className="text-gray-300" />}
    </div>
  </button>
);

const SettingsItem: React.FC<{ 
    icon?: any, 
    label: string, 
    value?: string, 
    onClick?: () => void,
    toggle?: { checked: boolean; onChange: () => void }
}> = ({ 
  icon: Icon, label, value, onClick, toggle
}) => (
  <div 
    onClick={!toggle ? onClick : undefined}
    className={`w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-none transition-colors ${onClick && !toggle ? 'hover:bg-gray-50 active:bg-gray-100 cursor-pointer' : ''}`}
  >
    <div className="flex items-center gap-3.5">
      {Icon && (
          <div className="p-2 rounded-lg bg-background text-gray-600">
            <Icon size={20} />
          </div>
      )}
      <span className="text-[15px] font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-gray-400 font-medium">{value}</span>}
      {toggle ? (
         <div 
            onClick={toggle.onChange}
            className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors cursor-pointer ${toggle.checked ? 'bg-primary' : 'bg-gray-200'}`}
         >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${toggle.checked ? 'translate-x-5' : 'translate-x-0'}`} />
         </div>
      ) : (
         <ChevronRight size={18} className="text-gray-300" />
      )}
    </div>
  </div>
);

const PostListItem: React.FC<{ post: CommunityPost }> = ({ post }) => (
    <div className="flex bg-white rounded-xl p-3 gap-3 shadow-card active:scale-[0.99] transition-transform">
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
            <img src={post.image} alt="post" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{post.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{post.content}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
                 <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                 </div>
                 <div className="flex items-center gap-1 text-gray-400">
                    <Heart size={12} fill={post.likes > 100 ? '#ef4444' : 'none'} className={post.likes > 100 ? 'text-red-500' : 'text-gray-400'} />
                    <span className="text-[10px]">{post.likes}</span>
                 </div>
            </div>
        </div>
    </div>
);

const EmptyState: React.FC<{ icon: any, text: string, actionText?: string, onAction?: () => void }> = ({ icon: Icon, text, actionText, onAction }) => (
    <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Icon size={40} className="opacity-20" />
        </div>
        <p>{text}</p>
        {actionText && <button onClick={onAction} className="mt-4 text-primary text-sm font-bold">{actionText}</button>}
    </div>
);

export default ProfileView;