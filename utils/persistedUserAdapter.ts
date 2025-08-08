import {
    UserPersistedValues,
    UserPersistentOverrideAdapter,
    UserPersistentStorage,
} from '@statsig/js-user-persisted-storage';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

class MMKVUserPersistedStorage implements UserPersistentStorage {
  private mmkv = new MMKV({ id: 'statsig-user-persisted-storage' });

  delete(key: string, experiment: string): void {
    const data = JSON.parse(this.mmkv.getString(key) ?? '{}');
    delete data[experiment];
    this.mmkv.set(key, JSON.stringify(data));
  }

  load(key: string): UserPersistedValues {
    return JSON.parse(this.mmkv.getString(key) ?? '{}');
  }

  save(key: string, experiment: string, data: string): void {
    const values = JSON.parse(this.mmkv.getString(key) ?? '{}');
    values[experiment] = JSON.parse(data);
    this.mmkv.set(key, JSON.stringify(values));
  }

  loadAsync(key: string): Promise<UserPersistedValues> {
    return Promise.resolve(this.load(key));
  }
}

class LocalStorageUserPersistedStorage implements UserPersistentStorage {
  delete(key: string, experiment: string): void {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    delete data[experiment];
    localStorage.setItem(key, JSON.stringify(data));
  }

  load(key: string): UserPersistedValues {
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  }

  save(key: string, experiment: string, data: string): void {
    const values = JSON.parse(localStorage.getItem(key) ?? '{}');
    values[experiment] = JSON.parse(data);
    localStorage.setItem(key, JSON.stringify(values));
  }

  loadAsync(key: string): Promise<UserPersistedValues> {
    return Promise.resolve(this.load(key));
  }
}

let adapter: UserPersistentOverrideAdapter | null = null;

export function getUserPersistentOverrideAdapter(): UserPersistentOverrideAdapter {
  if (adapter) {
    return adapter;
  }
  
  // Use localStorage for web, MMKV for native platforms
  const storage = Platform.OS === 'web' 
    ? new LocalStorageUserPersistedStorage()
    : new MMKVUserPersistedStorage();
    
  adapter = new UserPersistentOverrideAdapter(storage);
  return adapter;
}


