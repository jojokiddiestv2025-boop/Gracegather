import { StreamEvent } from '../types';

const STORAGE_KEY = 'gracegather_schedule';

export const ScheduleService = {
  getEvents: (): StreamEvent[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    const events = data ? JSON.parse(data) : [];
    // Sort by date ascending
    return events.sort((a: StreamEvent, b: StreamEvent) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
  },

  addEvent: (title: string, dateTime: string, description: string): StreamEvent => {
    const events = ScheduleService.getEvents();
    const newEvent: StreamEvent = {
      id: Date.now().toString(),
      title,
      dateTime,
      description,
      isLive: false
    };
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  },

  deleteEvent: (id: string): void => {
    const events = ScheduleService.getEvents().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  setLiveStatus: (id: string, isLive: boolean): void => {
    let events = ScheduleService.getEvents();
    events = events.map(e => ({
      ...e,
      isLive: e.id === id ? isLive : false // Ensure only one is live at a time
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  getLiveEvent: (): StreamEvent | undefined => {
    return ScheduleService.getEvents().find(e => e.isLive);
  }
};