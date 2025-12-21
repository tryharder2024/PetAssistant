import React, { useState, useRef, useEffect } from 'react';
import { Heart, Search, X, Image as ImageIcon, Check, ChevronLeft, ChevronRight, Plus, Camera, Trash2, CheckCircle2, MessageCircle, Share2, Star, Send, MoreHorizontal } from 'lucide-react';
import { CommunityPost, Comment } from '../types';

const MOCK_COMMENTS: Comment[] = [
    { 
        id: 'c1', 
        author: '爱狗大队长', 
        avatar: 'https://picsum.photos/100/100?random=20', 
        content: '这也太可爱了吧！我也想养一只。', 
        time: '10分钟前', 
        likes: 12,
        replies: [
            {
                id: 'c1-r1',
                author: '豆豆妈',
                avatar: 'https://picsum.photos/100/100?random=1',
                content: '养金毛很费精力的，不过确实很暖心~',
                time: '5分钟前',
                likes: 2,
                replyToUser: '爱狗大队长'
            }
        ]
    },
    { 
        id: 'c2', 
        author: '宠物营养师Lisa', 
        avatar: 'https://picsum.photos/100/100?random=21', 
        content: '换牙期要注意补钙哦，可以多给点磨牙棒。', 
        time: '1小时前', 
        likes: 5,
        replies: []
    },
];

const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: '豆豆妈',
    avatar: 'https://picsum.photos/100/100?random=1',
    title: '金毛三个月大，开始换牙啦！🦷',
    content: '最近总是乱咬东西，买了磨牙棒它也不爱吃，专门啃拖鞋！各位家长有没有什么好办法呀？在线等挺急的😂',
    image: 'https://picsum.photos/400/500?random=10',
    images: [
        'https://picsum.photos/400/500?random=10',
        'https://picsum.photos/400/500?random=101',
        'https://picsum.photos/400/500?random=102'
    ],
    likes: 124,
    tags: ['#金毛', '#新手养狗', '#换牙期'],
    isLiked: false,
    isFollowing: false,
    comments: MOCK_COMMENTS,
    createTime: '2小时前'
  },
  {
    id: '2',
    author: '加菲猫阿肥',
    avatar: 'https://picsum.photos/100/100?random=2',
    title: '生病求助：猫咪不吃饭',
    content: '精神有点萎靡，是不是着凉了？已经一天没吃东西了，只是喝了一点点水。鼻子干干的。',
    image: 'https://picsum.photos/400/300?random=11',
    images: ['https://picsum.photos/400/300?random=11'],
    likes: 45,
    tags: ['#生病求助', '#猫咪健康'],
    isLiked: false,
    isFollowing: true,
    comments: [],
    createTime: '5小时前'
  },
  {
    id: '3',
    author: '柯基小短腿',
    avatar: 'https://picsum.photos/100/100?random=3',
    title: '周末去公园撒欢',
    content: '天气真好，带狗子出来晒太阳，跑得累趴下了哈哈。',
    image: 'https://picsum.photos/400/600?random=12',
    images: ['https://picsum.photos/400/600?random=12', 'https://picsum.photos/400/600?random=121'],
    likes: 231,
    tags: ['#柯基', '#遛狗'],
    isLiked: true,
    isFollowing: false,
    comments: [],
    createTime: '1天前'
  },
  {
    id: '4',
    author: '布偶Queen',
    avatar: 'https://picsum.photos/100/100?random=4',
    title: '新买的猫爬架',
    content: '主子很喜欢，安装了半小时，值了！推荐给大家，稳固性不错。',
    image: 'https://picsum.photos/400/400?random=13',
    images: ['https://picsum.photos/400/400?random=13'],
    likes: 89,
    tags: ['#布偶猫', '#好物分享'],
    isLiked: false,
    isFollowing: false,
    comments: [],
    createTime: '2天前'
  }
];

const SUGGESTED_TAGS = ['#新手养狗', '#猫咪日常', '#生病求助', '#好物分享', '#晒晒萌宠', '#汪星人', '#喵星人'];
const CURRENT_USER_AVATAR = 'https://picsum.photos/200/200?random=user';

const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'推荐' | '关注'>('推荐');
  
  // Comment & Reply State
  const [commentInput, setCommentInput] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string; rootId: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Publish Form State
  const [newPost, setNewPost] = useState<{
    title: string; 
    content: string; 
    images: string[]; 
    coverIndex: number;
    tags: string[];
  }>({
    title: '',
    content: '',
    images: [],
    coverIndex: 0,
    tags: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process multiple files
      const newImages: string[] = [];
      let processedCount = 0;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newImages.push(reader.result as string);
          }
          processedCount++;
          if (processedCount === files.length) {
            setNewPost(prev => ({ 
                ...prev, 
                images: [...prev.images, ...newImages] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewPost(prev => {
        const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);
        let newCoverIndex = prev.coverIndex;
        
        // Adjust cover index if necessary
        if (indexToRemove === prev.coverIndex) {
            newCoverIndex = 0;
        } else if (indexToRemove < prev.coverIndex) {
            newCoverIndex = prev.coverIndex - 1;
        }

        return {
            ...prev,
            images: updatedImages,
            coverIndex: updatedImages.length === 0 ? 0 : newCoverIndex
        };
    });
  };

  const toggleTag = (tag: string) => {
    if (newPost.tags.includes(tag)) {
      setNewPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    } else {
      if (newPost.tags.length < 3) {
        setNewPost(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
    }
  };

  const handlePublish = () => {
    if (!newPost.title || !newPost.content) {
      alert('请填写标题和正文');
      return;
    }

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: '铲屎官_小王', 
      avatar: 'https://picsum.photos/200/200?random=user',
      title: newPost.title,
      content: newPost.content,
      // Use the selected cover image
      image: newPost.images.length > 0 
        ? newPost.images[newPost.coverIndex] 
        : `https://picsum.photos/400/400?random=${Date.now()}`, 
      images: newPost.images,
      likes: 0,
      tags: newPost.tags.length > 0 ? newPost.tags : ['#日常'],
      isLiked: false,
      isFollowing: false,
      comments: [],
      createTime: '刚刚'
    };

    setPosts(prev => [post, ...prev]);
    setIsPublishing(false);
    // Reset form
    setNewPost({ title: '', content: '', images: [], coverIndex: 0, tags: [] });
  };

  // --- Filter Logic ---
  const filteredPosts = posts.filter(post => {
      // 1. Tab Filter
      if (activeTab === '关注' && !post.isFollowing) {
          return false;
      }

      // 2. Search Query Filter
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
              post.title.toLowerCase().includes(query) ||
              post.content.toLowerCase().includes(query) ||
              post.author.toLowerCase().includes(query) ||
              post.tags.some(tag => tag.toLowerCase().includes(query))
          );
      }

      return true;
  });

  const handleTopBarClick = (item: string) => {
      if (item === '推荐' || item === '关注') {
          setActiveTab(item as '推荐' | '关注');
          setSearchQuery(''); // Clear search when switching tabs
      } else {
          // Hashtags
          setSearchQuery(item);
          setActiveTab('推荐'); // Search usually implies searching everything
      }
  };

  // --- Detail View Handlers ---
  
  // Reset carousel & reply state when post changes
  useEffect(() => {
      if (selectedPost) {
          setCurrentImageIndex(0);
          setReplyTarget(null);
          setCommentInput('');
      }
  }, [selectedPost]);

  const handleScrollCarousel = () => {
      if (carouselRef.current) {
          const scrollLeft = carouselRef.current.scrollLeft;
          const width = carouselRef.current.clientWidth;
          const index = Math.round(scrollLeft / width);
          setCurrentImageIndex(index);
      }
  };
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const handleLike = () => {
      if (!selectedPost) return;
      const isCurrentlyLiked = selectedPost.isLiked;
      const newLikeCount = isCurrentlyLiked ? selectedPost.likes - 1 : selectedPost.likes + 1;

      // Update local selected post
      setSelectedPost({
          ...selectedPost,
          isLiked: !isCurrentlyLiked,
          likes: newLikeCount
      });

      // Update main list
      setPosts(prev => prev.map(p => 
          p.id === selectedPost.id 
            ? { ...p, isLiked: !isCurrentlyLiked, likes: newLikeCount } 
            : p
      ));
  };

  const handleFollow = () => {
      if (!selectedPost) return;
      const newFollowState = !selectedPost.isFollowing;

      setSelectedPost({ ...selectedPost, isFollowing: newFollowState });
      setPosts(prev => prev.map(p => 
          p.id === selectedPost.id ? { ...p, isFollowing: newFollowState } : p
      ));
  };

  const initReply = (commentId: string, authorName: string, rootId: string) => {
      setReplyTarget({ id: commentId, name: authorName, rootId });
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendComment = () => {
      if (!selectedPost || !commentInput.trim()) return;
      
      const newComment: Comment = {
          id: Date.now().toString(),
          author: '铲屎官_小王',
          avatar: CURRENT_USER_AVATAR,
          content: commentInput,
          time: '刚刚',
          likes: 0,
          replies: []
      };

      let updatedComments: Comment[] = [];

      if (replyTarget) {
          // This is a reply to an existing comment
          newComment.replyToUser = replyTarget.name;
          
          updatedComments = selectedPost.comments?.map(comment => {
              if (comment.id === replyTarget.rootId) {
                  return {
                      ...comment,
                      replies: [...(comment.replies || []), newComment]
                  };
              }
              return comment;
          }) || [];
      } else {
          // This is a new root comment
          updatedComments = [newComment, ...(selectedPost.comments || [])];
      }
      
      setSelectedPost({ ...selectedPost, comments: updatedComments });
      setPosts(prev => prev.map(p => 
          p.id === selectedPost.id ? { ...p, comments: updatedComments } : p
      ));
      
      setCommentInput('');
      setReplyTarget(null);
  };

  // ---------------- RENDER: DETAIL VIEW ----------------
  if (selectedPost) {
      // Fallback for posts without 'images' array (legacy data support)
      const postImages = selectedPost.images && selectedPost.images.length > 0 
                         ? selectedPost.images 
                         : [selectedPost.image];

      return (
        <div className="absolute inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right duration-300">
            {/* Navbar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 h-12 shrink-0">
                <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-2 -ml-2 text-stone-600 hover:bg-orange-50 rounded-full transition"
                >
                    <ChevronLeft size={24} />
                </button>
                
                {/* Author Info */}
                <div className="flex items-center gap-2">
                    <img src={selectedPost.avatar} alt={selectedPost.author} className="w-8 h-8 rounded-full border border-gray-100 object-cover" />
                    <span className="font-bold text-sm text-stone-800 max-w-[100px] truncate">{selectedPost.author}</span>
                    <button 
                        onClick={handleFollow}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                            selectedPost.isFollowing 
                            ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                            : 'bg-primary text-white shadow-sm shadow-primary/30'
                        }`}
                    >
                        {selectedPost.isFollowing ? '已关注' : '关注'}
                    </button>
                </div>

                <button className="p-2 -mr-2 text-stone-600 hover:bg-orange-50 rounded-full">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
                {/* Image Carousel */}
                <div className="relative w-full aspect-[4/5] sm:aspect-square bg-stone-100 group">
                    <div 
                        ref={carouselRef}
                        onScroll={handleScrollCarousel}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
                        style={{ WebkitOverflowScrolling: 'touch' }} 
                    >
                        {postImages.map((img, idx) => (
                            <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Navigation Arrows (Visible on Desktop/Hover) */}
                    {postImages.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); scrollLeft(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); scrollRight(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                    
                    {/* Index Indicator */}
                    {postImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {currentImageIndex + 1}/{postImages.length}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-4 py-5 bg-white rounded-b-3xl shadow-sm mb-2">
                    <h1 className="text-xl font-bold text-stone-800 mb-3 leading-snug">{selectedPost.title}</h1>
                    <p className="text-[15px] text-stone-700 leading-relaxed mb-4 whitespace-pre-wrap">{selectedPost.content}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPost.tags.map(tag => (
                            <span key={tag} className="text-[13px] text-primary/80 font-medium bg-primary/5 px-2 py-0.5 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>{selectedPost.createTime} 发布于 上海</span>
                        <span>未经作者授权，禁止转载</span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="px-4 pb-10">
                    <div className="h-px bg-stone-100 w-full mb-6"></div>
                    <h3 className="font-bold text-stone-800 mb-5 text-sm">
                        共 {selectedPost.comments?.length || 0} 条评论
                    </h3>
                    
                    <div className="space-y-6">
                        {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                                    <MessageCircle size={24} className="opacity-20" />
                                </div>
                                <p className="text-xs">暂无评论，快来抢沙发~</p>
                            </div>
                        ) : (
                            selectedPost.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full shrink-0 object-cover border border-white shadow-sm" />
                                    <div className="flex-1 border-b border-stone-100 pb-4">
                                        {/* Root Comment Header */}
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-bold text-stone-600">{comment.author}</span>
                                                {comment.author === selectedPost.author && (
                                                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-md font-bold transform scale-90 origin-left">作者</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-stone-400">
                                                <Heart size={12} />
                                                <span className="text-[10px]">{comment.likes || 0}</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-stone-800 leading-normal mb-2" onClick={() => initReply(comment.id, comment.author, comment.id)}>
                                            {comment.content}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-stone-400 mb-3">
                                            <span>{comment.time}</span>
                                            <button 
                                                onClick={() => initReply(comment.id, comment.author, comment.id)}
                                                className="font-medium text-stone-500 hover:text-stone-900"
                                            >
                                                回复
                                            </button>
                                        </div>

                                        {/* Replies (Nested) */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="bg-white/60 rounded-lg p-3 space-y-3">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="flex gap-2">
                                                        <img src={reply.avatar} alt={reply.author} className="w-6 h-6 rounded-full shrink-0 object-cover" />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-1 mb-0.5">
                                                                <span className="text-xs font-bold text-stone-500">{reply.author}</span>
                                                                {reply.replyToUser && (
                                                                    <>
                                                                        <span className="text-[10px] text-stone-400">回复</span>
                                                                        <span className="text-xs font-bold text-stone-500">{reply.replyToUser}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <p 
                                                                className="text-xs text-stone-800 leading-normal mb-1"
                                                                onClick={() => initReply(reply.id, reply.author, comment.id)}
                                                            >
                                                                {reply.content}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-[10px] text-stone-400">
                                                                <span>{reply.time}</span>
                                                                <button 
                                                                    onClick={() => initReply(reply.id, reply.author, comment.id)}
                                                                    className="font-medium text-stone-500 hover:text-stone-900"
                                                                >
                                                                    回复
                                                                </button>
                                                                <div className="flex items-center gap-0.5 ml-auto">
                                                                    <Heart size={10} /> {reply.likes || 0}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Interaction Bar */}
            <div className="bg-white border-t border-stone-100 px-3 py-2 safe-area-bottom flex flex-col gap-2 shrink-0 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                {replyTarget && (
                    <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg animate-in slide-in-from-bottom-2">
                        <span>回复 <span className="font-bold text-stone-800">@{replyTarget.name}</span> :</span>
                        <button onClick={() => setReplyTarget(null)} className="p-1 hover:bg-stone-200 rounded-full">
                            <X size={14} />
                        </button>
                    </div>
                )}
                
                <div className="flex items-center gap-3 h-12">
                     {/* Avatar */}
                     <img src={CURRENT_USER_AVATAR} alt="Me" className="w-8 h-8 rounded-full border border-stone-200 shrink-0" />

                     {/* Input */}
                    <div className="flex-1 bg-stone-100 rounded-full flex items-center px-4 py-2 transition-all focus-within:ring-1 focus-within:ring-primary/30 focus-within:bg-white h-9">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder={replyTarget ? `回复 @${replyTarget.name}` : "说点什么..."}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            className="bg-transparent border-none outline-none text-sm w-full text-stone-700 placeholder-stone-400 leading-none"
                        />
                    </div>
                    
                    {commentInput.trim() ? (
                        <button 
                            onClick={handleSendComment}
                            className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-primary/30 animate-in zoom-in duration-200 shrink-0"
                        >
                            发送
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 text-stone-600 shrink-0">
                            {/* Like */}
                            <button 
                                onClick={handleLike}
                                className="flex items-center gap-1 active:scale-90 transition-transform"
                            >
                                <Heart 
                                    size={22} 
                                    className={`transition-colors ${selectedPost.isLiked ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} 
                                />
                                <span className="text-sm font-medium text-stone-500">{selectedPost.likes || '0'}</span>
                            </button>

                            {/* Favorite */}
                            <button className="flex items-center gap-1 active:scale-90 transition-transform">
                                <Star size={22} className="text-stone-600 hover:text-yellow-400 transition-colors" />
                                <span className="text-sm font-medium text-stone-500">1</span>
                            </button>

                            {/* Comment */}
                            <button className="flex items-center gap-1 active:scale-90 transition-transform">
                                <MessageCircle size={22} className="text-stone-600 hover:text-primary transition-colors" />
                                <span className="text-sm font-medium text-stone-500">{selectedPost.comments?.length || '0'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  }

  // ---------------- RENDER: FEED VIEW ----------------
  return (
    <div className="h-full relative bg-background">
      {/* Scrollable Content Container */}
      <div className="h-full overflow-y-auto no-scrollbar pb-24">
        {/* Header with Search */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 pt-14 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Search size={18} className="text-stone-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === '关注' ? "搜索关注的人..." : "搜索话题、宠友..."}
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-stone-700 placeholder-stone-400"
              />
              {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                  </button>
              )}
            </div>
            <button 
              onClick={() => setIsPublishing(true)}
              className="text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded-full active:opacity-60 transition-opacity"
            >
              发布
            </button>
          </div>
          
          {/* Horizontal Tabs & Tags Scroll */}
          <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
            {['推荐', '关注', '#新手养狗', '#生病求助', '#晒晒萌宠', '#猫咪日常'].map((tag, idx) => {
              // Determine if this item is currently active (tab or tag search)
              const isActive = 
                (tag === '推荐' && activeTab === '推荐' && !searchQuery) ||
                (tag === '关注' && activeTab === '关注' && !searchQuery) ||
                (searchQuery === tag);

              return (
                <button 
                  key={idx} 
                  onClick={() => handleTopBarClick(tag)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm ${
                      isActive
                      ? 'bg-primary text-white shadow-primary/30' 
                      : 'bg-white text-stone-600 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Waterfall Layout (Masonry simulation with 2 columns) */}
        {filteredPosts.length > 0 ? (
            <div className="p-3 grid grid-cols-2 gap-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
                {filteredPosts.filter((_, i) => i % 2 === 0).map(post => (
                <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
                {filteredPosts.filter((_, i) => i % 2 !== 0).map(post => (
                <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
            </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-stone-400">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                    {activeTab === '关注' ? <Share2 size={24} className="opacity-20" /> : <Search size={24} className="opacity-20" />}
                </div>
                <p className="text-xs">
                    {activeTab === '关注' && !searchQuery ? '你还没有关注任何人' : '未找到相关内容'}
                </p>
                {activeTab === '关注' && !searchQuery && (
                    <button onClick={() => setActiveTab('推荐')} className="mt-4 text-primary text-sm font-bold">去推荐看看</button>
                )}
            </div>
        )}
      </div>

      {/* Publish Modal Overlay */}
      {isPublishing && (
        <div className="absolute inset-0 z-50 bg-background animate-in slide-in-from-bottom duration-300 flex flex-col">
           {/* Header */}
           <div className="px-4 h-14 flex items-center justify-between border-b border-stone-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
              <button 
                onClick={() => setIsPublishing(false)}
                className="p-2 -ml-2 text-stone-600 hover:bg-stone-50 rounded-full"
              >
                <X size={24} />
              </button>
              <span className="font-bold text-lg text-stone-900">发布动态</span>
              <button 
                onClick={handlePublish}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  newPost.title && newPost.content 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-stone-100 text-stone-400'
                }`}
              >
                发布
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-5">
              
              {/* Image Section */}
              <div className="mb-6">
                 {newPost.images.length === 0 ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center bg-white text-stone-400 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                        <div className="bg-orange-50 p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                             <ImageIcon size={32} className="text-primary/50 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-medium">添加照片/视频</span>
                    </div>
                 ) : (
                    <div>
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h3 className="text-sm font-bold text-stone-900">选择封面</h3>
                            <span className="text-xs text-stone-400">点击图片设为封面</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {newPost.images.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setNewPost(prev => ({ ...prev, coverIndex: idx }))}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 group shadow-sm
                                        ${newPost.coverIndex === idx ? 'ring-2 ring-primary ring-offset-2 scale-100' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                    
                                    {/* Cover Badge */}
                                    {newPost.coverIndex === idx && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <div className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                                                封面
                                            </div>
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* Small Add Button */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-stone-200 flex flex-col items-center justify-center bg-white text-stone-400 cursor-pointer hover:bg-stone-50 transition-colors shadow-sm"
                            >
                                <Plus size={24} />
                            </div>
                        </div>
                    </div>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
              </div>

              {/* Title Input */}
              <div className="mb-4">
                 <input 
                   type="text" 
                   placeholder="填写标题会有更多赞哦~" 
                   value={newPost.title}
                   onChange={e => setNewPost({...newPost, title: e.target.value})}
                   className="w-full text-lg font-bold placeholder-stone-300 border-b border-stone-100 pb-3 outline-none bg-transparent focus:border-stone-300 transition-colors"
                 />
              </div>

              {/* Description Input (Styled Box) */}
              <div className="relative mb-8 group">
                 <textarea 
                   placeholder="分享这一刻的萌宠趣事..." 
                   value={newPost.content}
                   onChange={e => setNewPost({...newPost, content: e.target.value})}
                   className="w-full h-40 p-4 bg-white rounded-2xl text-base text-stone-700 placeholder-stone-400 outline-none resize-none leading-relaxed transition-all shadow-sm focus:ring-2 focus:ring-primary/10"
                 />
                 {/* Character Count */}
                 <div className="absolute bottom-3 right-3 text-xs text-stone-300">
                    {newPost.content.length}/500
                 </div>
              </div>

              {/* Tags Selection */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                  添加话题 
                  <span className="text-xs font-normal text-stone-400">({newPost.tags.length}/3)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                   {SUGGESTED_TAGS.map(tag => (
                     <button
                       key={tag}
                       onClick={() => toggleTag(tag)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm ${
                         newPost.tags.includes(tag) 
                         ? 'bg-primary/10 border-primary text-primary' 
                         : 'bg-white border-transparent text-stone-500 hover:border-stone-200'
                       }`}
                     >
                       {tag}
                     </button>
                   ))}
                   <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-400 flex items-center gap-1 border border-transparent hover:bg-stone-200 transition-colors">
                      <Plus size={14} /> 自定义
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const PostCard: React.FC<{ post: CommunityPost, onClick?: () => void }> = ({ post, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl overflow-hidden shadow-card break-inside-avoid hover:shadow-soft transition-all duration-300 cursor-pointer active:scale-[0.98]"
  >
    <div className="relative">
        <img src={post.image} alt={post.title} className="w-full object-cover min-h-[140px]" />
        {/* Multi-image indicator for card */}
        {post.images && post.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md text-white backdrop-blur-sm">
                <ImageIcon size={12} />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-stone-800 text-sm mb-1 line-clamp-2 leading-relaxed">{post.title}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {post.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full border border-stone-100" />
          <span className="text-xs text-stone-500 truncate max-w-[60px]">{post.author}</span>
        </div>
        <div className="flex items-center gap-1 text-stone-400 group">
          <Heart size={14} className={post.isLiked ? "fill-red-500 text-red-500" : "group-hover:text-red-500 transition-colors"} />
          <span className="text-xs">{post.likes}</span>
        </div>
      </div>
    </div>
  </div>
);

export default CommunityView;