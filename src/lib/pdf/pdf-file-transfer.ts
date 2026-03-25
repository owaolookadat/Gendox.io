const DB_NAME = "gendox-pdf-transfer";
const STORE_NAME = "files";
const KEY = "pending";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeTransferFile(file: File): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(
      { blob: file, name: file.name, type: file.type, lastModified: file.lastModified },
      KEY
    );
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function retrieveTransferFile(): Promise<File | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY);
      getReq.onsuccess = () => {
        const data = getReq.result;
        store.delete(KEY); // one-time read
        db.close();
        if (!data) { resolve(null); return; }
        const file = new File([data.blob], data.name, { type: data.type, lastModified: data.lastModified });
        resolve(file);
      };
      getReq.onerror = () => { db.close(); resolve(null); };
    });
  } catch {
    return null; // fails silently in private browsing
  }
}

export async function clearTransferFile(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(KEY);
    tx.oncomplete = () => db.close();
  } catch {
    // ignore
  }
}
