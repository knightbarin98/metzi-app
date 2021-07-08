import { Storage } from "@capacitor/storage";

export async function storageSet(key: string, value: any): Promise<void> {
  await Storage.set({
    key: key,
    value: JSON.stringify(value),
  });
}

export async function storageGet(key: string): Promise<any> {
  const item = await Storage.get({ key: key });
  return JSON.parse(item.value || 'null');
}

export async function storageRemove(key: string): Promise<void> {
  await Storage.remove({ key: key });
}
