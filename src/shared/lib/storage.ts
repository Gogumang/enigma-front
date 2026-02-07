export const localStore = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

export const sessionStore = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  },

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  },
};

// 메모리 스토어 (대용량 데이터용 - sessionStorage 5MB 제한 우회)
const _memoryStore = new Map<string, unknown>();

export const memoryStore = {
  get<T>(key: string): T | null {
    return (_memoryStore.get(key) as T) ?? null;
  },

  set<T>(key: string, value: T): void {
    _memoryStore.set(key, value);
  },

  remove(key: string): void {
    _memoryStore.delete(key);
  },
};
