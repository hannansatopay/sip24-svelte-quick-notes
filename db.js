export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NotesDatabase', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  
  export function getAllNotes(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  
  export function getNoteByTitle(db, title) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.get(title);
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  
  export function saveNoteToDB(db, note) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.put(note);
  
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  
  export function deleteNoteFromDB(db, title) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.delete(title);
  
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  