import { VideoItem } from '../types';
import { StorageService } from './storageService';

const STORAGE_KEY = 'gracegather_videos';

export const VideoService = {
  getVideos: async (): Promise<VideoItem[]> => {
    return StorageService.load<VideoItem[]>(STORAGE_KEY, []);
  },

  addVideo: async (videoData: Omit<VideoItem, 'id' | 'date'>): Promise<VideoItem> => {
    const videos = await VideoService.getVideos();
    const newVideo: VideoItem = {
      ...videoData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    // Add to top
    const updatedVideos = [newVideo, ...videos];
    await StorageService.save(STORAGE_KEY, updatedVideos);
    return newVideo;
  },

  deleteVideo: async (id: string): Promise<void> => {
    const videos = await VideoService.getVideos();
    const updatedVideos = videos.filter(v => v.id !== id);
    await StorageService.save(STORAGE_KEY, updatedVideos);
  }
};