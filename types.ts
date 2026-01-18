import React from 'react';

export interface DailyChallenge {
  verse: string;
  reference: string;
  reflectionQuestion: string;
  actionItem: string;
  prayerFocus: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export enum AppRoute {
  HOME = '/',
  BIBLE = '/bible',
  CHALLENGE = '/daily-challenge',
  PRAYER_WALL = '/prayer-wall',
  PASTOR_PORTAL = '/pastor-portal',
  BRANDING = '/branding',
  VIDEOS = '/videos',
}

export interface PastorProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string; // URL
  specialty: string;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  summary: string;
  verses: BibleVerse[];
}

// Auth Types
export enum UserRole {
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
  token?: string; // Simulated session token
  status?: UserStatus;
  joinedAt?: string;
}

// Prayer Types
export interface PrayerRequest {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  prayerCount: number;
  isAnonymous: boolean;
}

// Schedule & Streaming Types
export type EventType = 'BROADCAST' | 'BIBLE_STUDY';

export interface StreamEvent {
  id: string;
  title: string;
  dateTime: string;
  description: string;
  isLive: boolean;
  type: EventType;
  host: string;
}

// Video Gallery Types
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string; // Embed URL
  postedBy: string;
  date: string;
}

// System Settings
export interface CloudSettings {
  enabled: boolean;
  provider: 'JSONBIN';
  apiKey: string;
  binId: string;
}