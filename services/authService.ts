import { User, UserRole, UserStatus } from "../types";
import { StorageService } from './storageService';

const SESSION_KEY = 'gracegather_auth_session';
const DB_KEY = 'gracegather_users_db';

interface StoredUser extends User {
  password: string;
  status: UserStatus;
  joinedAt: string;
}

// Initial Seed Data
const SEED_USERS: Record<string, StoredUser> = {
  admin: {
    username: 'admin',
    password: 'amen', 
    role: UserRole.ADMIN,
    name: 'Senior Pastor (Admin)',
    status: UserStatus.APPROVED,
    joinedAt: new Date().toISOString()
  },
  pastor: {
    username: 'pastor',
    password: 'amen',
    role: UserRole.PASTOR,
    name: 'Associate Pastor',
    status: UserStatus.APPROVED,
    joinedAt: new Date().toISOString()
  }
};

// Async helper to get users from storage (Local or Cloud)
const getUsers = async (): Promise<Record<string, StoredUser>> => {
  return StorageService.load(DB_KEY, SEED_USERS);
};

const saveUsers = async (users: Record<string, StoredUser>) => {
  await StorageService.save(DB_KEY, users);
};

export const AuthService = {
  login: async (username: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = await getUsers();
    const user = users[username.toLowerCase()];
    
    if (user && user.password === password) {
      if (user.status === UserStatus.PENDING) {
         throw new Error('Account pending approval from Super Admin.');
      }
      if (user.status === UserStatus.REJECTED) {
         throw new Error('Account has been disabled.');
      }

      const sessionUser: User = {
        username: user.username,
        role: user.role,
        name: user.name,
        status: user.status,
        token: `mock-jwt-${Date.now()}-${Math.random().toString(36).substr(2)}`
      };
      
      // Persist session (Local only for session)
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }

    throw new Error('Invalid credentials');
  },

  register: async (username: string, password: string, name: string, ministryCode: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple security check for creating pastor accounts
    if (ministryCode !== 'GRACE') {
      throw new Error('Invalid Ministry Code.');
    }

    const users = await getUsers();
    const normalizedUsername = username.toLowerCase();

    if (users[normalizedUsername]) {
      throw new Error('Username already taken.');
    }

    // Create new user with PENDING status
    const newUser: StoredUser = {
      username: normalizedUsername,
      password: password,
      role: UserRole.PASTOR,
      name: name,
      status: UserStatus.PENDING,
      joinedAt: new Date().toISOString()
    };

    // Save to "Database"
    users[normalizedUsername] = newUser;
    await saveUsers(users);

    // DO NOT Auto-login
    return; 
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
  },

  // Admin Methods
  getPendingUsers: async (): Promise<StoredUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await getUsers();
    return Object.values(users).filter(u => u.status === UserStatus.PENDING);
  },

  approveUser: async (username: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await getUsers();
    if (users[username.toLowerCase()]) {
        users[username.toLowerCase()].status = UserStatus.APPROVED;
        await saveUsers(users);
    }
  },

  rejectUser: async (username: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = await getUsers();
    if (users[username.toLowerCase()]) {
        users[username.toLowerCase()].status = UserStatus.REJECTED;
        await saveUsers(users);
    }
  }
};