const DB_NAME = "NotesDB";
const DB_VERSION = 1;
const PAGES_STORE = "pages";

let db: IDBDatabase | null = null;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(PAGES_STORE, { keyPath: "title" });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      reject("Failed to open IndexedDB");
    };
  });
}

export function addPage(title: string, note: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PAGES_STORE], "readwrite");
    const store = transaction.objectStore(PAGES_STORE);
    const request = store.add({ title, note });

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to add page");
  });
}

export function getPage(
  title: string
): Promise<{ title: string; note: string } | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PAGES_STORE], "readonly");
    const store = transaction.objectStore(PAGES_STORE);
    const request = store.get(title);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to get page");
  });
}

export function getAllPages(): Promise<{ title: string; note: string }[]> {
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PAGES_STORE], "readonly");
    const store = transaction.objectStore(PAGES_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to get all pages");
  });
}

export function updatePage(title: string, note: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PAGES_STORE], "readwrite");
    const store = transaction.objectStore(PAGES_STORE);
    const request = store.put({ title, note });

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to update page");
  });
}

export function deletePage(title: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PAGES_STORE], "readwrite");
    const store = transaction.objectStore(PAGES_STORE);
    const request = store.delete(title);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to delete page");
  });
}