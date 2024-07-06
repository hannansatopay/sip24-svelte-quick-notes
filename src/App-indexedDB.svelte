<script>
    import { onMount } from 'svelte';
  
    let pages = [];
    let currentPageIndex = 0;
    let title = '';
    let note = '';
    let db;
  
    onMount(() => {
      const request = indexedDB.open('notes', 1);
      request.onupgradeneeded = (event) => {
        db = event.target.result;
        const notesStore = db.createObjectStore('notes', { keyPath: 'title' });
        notesStore.createIndex('title', 'title', { unique: true });
      };
  
      request.onsuccess = (event) => {
        db = event.target.result;
        const transaction = db.transaction('notes', 'readonly');
        const notesStore = transaction.objectStore('notes');
        const getAllRequest = notesStore.getAll();
  
        getAllRequest.onsuccess = (event) => {
          pages = event.target.result.map((note) => note.title);
          if (pages.length === 0) {
            addPage();
          } else {
            selectPage(0);
          }
        };
      };
    });
  
    function saveNote() {
      const transaction = db.transaction('notes', 'readwrite');
      const notesStore = transaction.objectStore('notes');
      const request = notesStore.put({ title, note });
      request.onsuccess = (event) => {
        pages[currentPageIndex] = title;
        db.transaction('notes', 'readwrite').objectStore('notes').getAll().onsuccess = (event) => {
          pages = event.target.result.map((note) => note.title);
          localStorage.setItem('pages', JSON.stringify(pages));
        };
      };
    }
  
    function addPage() {
      pages.push('New Page');
      selectPage(pages.length ? pages.length - 1 : 0);
    }
  
    function selectPage(index) {
      currentPageIndex = index;
      title = pages[currentPageIndex];
      const transaction = db.transaction('notes', 'readonly');
      const notesStore = transaction.objectStore('notes');
      const getRequest = notesStore.get(title);
      getRequest.onsuccess = (event) => {
        note = event.target.result ? event.target.result.note : '';
      };
    }
  
    function deleteNote() {
      if (confirm(`Are you sure you want to delete the note "${title}"?`)) {
        const transaction = db.transaction('notes', 'readwrite');
        const notesStore = transaction.objectStore('notes');
        const request = notesStore.delete(title);
        request.onsuccess = (event) => {
          pages.splice(currentPageIndex, 1);
          if (pages.length === 0) {
            addPage();
          } else {
            selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
          }
          db.transaction('notes', 'readwrite').objectStore('notes').getAll().ons