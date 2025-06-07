const appKey = "sky-social";
const modifiedKey = (key: string) => `${appKey}-${key}`;

export enum StorageKeyType {
  Token = "Token",
  RefreshToken = "RefreshToken",
  ExpiryTime = "ExpiryTime",
}

export const setStorage = (key: StorageKeyType, value: string): void => {
  localStorage.setItem(modifiedKey(key), value);
};

export const removeStorage = (key: StorageKeyType): void => {
  localStorage.removeItem(modifiedKey(key));
};

export const getStorage = (key: StorageKeyType): string | null => {
  return localStorage.getItem(modifiedKey(key));
};

export const cleanAllStorage = () => {
  localStorage.removeItem(modifiedKey(StorageKeyType.Token));
  localStorage.removeItem(modifiedKey(StorageKeyType.RefreshToken));
  localStorage.removeItem(modifiedKey(StorageKeyType.ExpiryTime));
};
