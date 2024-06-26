<!-- #Made with 🍇 power -->

<script>
  import { onMount } from 'svelte';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  const dbName = 'notes_db';
  const storeName = 'notes_store';

  onMount(() => {
    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = function() {
      db = openRequest.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'title' });
      }
    };

    openRequest.onsuccess = function() {
      db = openRequest.result;
      loadPages();
    };
  });

  function loadPages() {
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = function() {
      pages = request.result;
      if (pages.length > 0) {
        selectPage(currentPageIndex);
      } else {
        addPage();
      }
    };
  }

  function saveNote() {
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const storedPage = pages[currentPageIndex];
    if (storedPage && storedPage.title !== title) {
      objectStore.delete(storedPage.title);
    }

    const noteData = { title, note };
    objectStore.put(noteData).onsuccess = function() {
      loadPages();
    };
  }

  function addPage() {
    const newTitle = `New Page ${pages.length + 1}`;
    title = newTitle;
    note = '';
    pages.push({ title, note });
    currentPageIndex = pages.length - 1;
    saveNote();
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  function deletePage(index) {
    if (pages.length === 1) {
      alert('Cannot delete the only page.');
      return;
    }

    const deletedPage = pages.splice(index, 1)[0];
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    objectStore.delete(deletedPage.title).onsuccess = function() {
      if (index === currentPageIndex) {
        currentPageIndex = Math.max(0, index - 1);
      }
      loadPages();
    };
  }

  function deleteNote() {
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const deleteRequest = objectStore.delete(title);

    deleteRequest.onsuccess = function() {
      pages.splice(currentPageIndex, 1);
      if (pages.length > 0) {
        selectPage(Math.max(0, currentPageIndex - 1));
      } else {
        addPage();
      }
    };
  }
</script>

<div class="app-container">
  <aside class="sidebar">
    <div class="sidebar-content">
      <ul class="pages-list">
        {#each pages as page, index}
        <li class="page-item">
          <button on:click={() => selectPage(index)} class="page-button {index === currentPageIndex ? 'active' : ''}">
            {index === currentPageIndex ? title : page.title}
          </button>
          <button on:click={() => deletePage(index)} class="delete-button">🗑️</button>
        </li>
        {/each}
        <li class="add-page-item">
          <button on:click={addPage} class="add-page-button">+ Add Page</button>
        </li>
      </ul>
    </div>
  </aside>
  <main class="main-content">
    <div class="note-header">
      <input bind:value={title} class="note-title" placeholder="Page Title" />
      <button on:click={saveNote} class="save-button">Save</button>
    </div>
    <hr/>
    <textarea bind:value={note} class="note-textarea"></textarea>
    <button on:click={deleteNote} class="delete-note-button">Delete Note</button>
  </main>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');


  :global(body) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3em;
    height: 100vh;
    margin: 0;
    width: 100vw;
    font-family: 'Pixelify Sans', sans-serif;
    background-image: url('assets/bg.gif');
    background-size: cover;
    background-position: center;
    overflow: hidden;
    
  }

  .app-container {
    display: flex;
    min-height: 100vh;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    border-right: 1px solid #545454;
    overflow-y: auto;
    
  }

  .sidebar-content {
    padding: 20px;
  }

  .pages-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
  }

  .page-item {
    margin-bottom: 10px;
  }

  .page-button, .delete-button, .add-page-button, .save-button, .delete-note-button {
    display: inline-block;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    font-family: 'Pixelify Sans', sans-serif;
    transition: background-color 0.3s;
    
  }

  .page-button:hover {
    background-color: #7c83a1;
  }

  .page-button.active {
    background-color: #9ca3af;
    color: white;
  }

  .delete-button {
    background-color: #f87171;
    color: white;
    margin-left: 10px;
  }

  .delete-button:hover {
    background-color: #d9534f;
  }

  .add-page-button {
    background-color: #2563eb;
    color: white;
    width: 100%;
  }

  .add-page-button:hover {
    background-color: #1d4ed8;
  }

  .main-content {
    margin-left: 240px;
    padding: 30px;
  }

  .note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 2px solid rgb(137, 79, 79);
  backdrop-filter: blur(20px);
  width: 100%;
  height: 90px;
  font-family: inherit;
  padding: 20px;
  margin: 0 0 20px;
  font-size: 32px;
  }

  .note-title {
    font-size: 26px;
    font-weight: bold;
    border: none;
    outline: none;
    color: #fffdfd;
    background-color:  transparent;
    width: auto;
    resize: none;
  }

  .note-textarea {
    display: block;
    font-family: 'Pixelify Sans', sans-serif;
    border-radius: 15px;
    border: 2px solid rgb(137, 79, 79);
    background-color: transparent;
    backdrop-filter: blur(20px);
    color: rgb(255, 255, 255);
    width: 29em;
    height: 10em;
    padding: 20px;
    font-size: 26px;
    resize: auto;
    margin: 0 0 20px;

  }

  .note-textarea::placeholder {
    color: rgb(255, 255, 255);
  }

  .note-textarea:focus {
    outline: none;
  }

  .save-button, .delete-note-button {
    background-color: #10b981;
    color: white;
  }

  .save-button:hover, .delete-note-button:hover {
    background-color: #0e9f6e;
  }

  .delete-note-button {
    background-color: #ef4444;
  }

  .delete-note-button:hover {
    background-color: #d32f2f;
  }
</style>

