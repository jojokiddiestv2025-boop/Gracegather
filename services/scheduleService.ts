import { StreamEvent, EventType } from '../types';

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

  getEventById: (id: string): StreamEvent | undefined => {
    return ScheduleService.getEvents().find(e => e.id === id);
  },

  addEvent: (title: string, dateTime: string, description: string, type: EventType = 'BROADCAST', host: string = 'Sanctuary'): StreamEvent => {
    const events = ScheduleService.getEvents();
    const newEvent: StreamEvent = {
      id: Date.now().toString(),
      title,
      dateTime,
      description,
      isLive: false,
      type,
      host
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
      isLive: e.id === id ? isLive : e.isLive // Allow multiple simultaneous streams if different IDs
    }));
    // If the ID is 'manual-override', we don't update storage, this is just for the local component state usually, 
    // but here we want to persist the live status of specific events.
    if (id !== 'manual-override') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  },

  getLiveEvent: (): StreamEvent | undefined => {
    return ScheduleService.getEvents().find(e => e.isLive);
  }
};