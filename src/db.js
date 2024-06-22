// db.js
export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NotesDatabase', 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
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
  
  export function savePage(page) {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pages'], 'readwrite');
        const store = transaction.objectStore('pages');
        store.put(page);
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    });
  }
  
  export function saveNote(note) {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        store.put(note);
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    });
  }
  
  export function getNotes() {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
      });
    });
  }
  
  export function getPages() {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pages'], 'readonly');
        const store = transaction.objectStore('pages');
        const request = store.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
      });
    });
  }
  
  export function deletePage(title) {
    return openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pages', 'notes'], 'readwrite');
        const pagesStore = transaction.objectStore('pages');
        const notesStore = transaction.objectStore('notes');
        const deletePageRequest = pagesStore.delete(title);
        const deleteNoteRequest = notesStore.delete(title);
        deletePageRequest.onsuccess = () => {
          deleteNoteRequest.onsuccess = () => resolve();
        };
        transaction.onerror = (event) => reject(event.target.error);
      });
    });
  }
  