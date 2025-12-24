export enum Tab {
  COMMUNITY = 'community',
  HEALTH = 'health',
  AI_DOCTOR = 'ai_doctor',
  PROFILE = 'profile',
}

export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  birthday: string; // Added field
  gender: 'male' | 'female';
  isNeutered: boolean;
  weight: number;
  avatar: string;
}

export interface HealthRecord {
  date: string;
  weight: number;
}

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  isDone: boolean;
}

export interface MedicalRecord {
  id: string;
  type: 'lab' | 'prescription' | 'surgery' | 'imaging' | 'other';
  title: string;
  date: string;
  hospital?: string;
  description: string;
  images?: string[];
  aiAnalysis?: string;
  status: 'processing' | 'completed';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64
  isRisk?: boolean; // If risk keywords detected
  timestamp: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number; // Added likes for comments
  replies?: Comment[]; // Added nested replies support
  replyToUser?: string; // Name of the user being replied to (for display)
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  image: string; // Cover image (backward compatibility)
  images?: string[]; // Multiple images support
  likes: number;
  tags: string[];
  // Social interactions
  isLiked?: boolean;
  isFavorite?: boolean;
  favorites?: number;
  isFollowing?: boolean;
  comments?: Comment[];
  createTime?: string;
}

export interface PetPhoto {
  id: string;
  url: string;
  uploadTime: string;
}

// New Interface for Pet Space Albums
export interface PetAlbum {
  id: string;
  title: string;
  cover: string;
  count: number;
  createdAt: string;
  photos: PetPhoto[]; // List of photo objects
}