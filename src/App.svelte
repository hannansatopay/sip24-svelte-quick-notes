<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageIndex = 0;
  let currentTitle = "";
  let currentNote = "";

  let db;

  onMount(() => {
    initDB().then(() => {
      loadPages();
    });
  });

  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("NotesApp", 1);

      request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("pages")) {
          db.createObjectStore("pages", { keyPath: "id", autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "title" });
        }
      };

      request.onsuccess = function(event) {
        db = event.target.result;
        resolve();
      };

      request.onerror = function(event) {
        console.error("Database error:", event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  }

  function loadPages() {
    const transaction = db.transaction("pages", "readonly");
    const store = transaction.objectStore("pages");
    const request = store.getAll();

    request.onsuccess = function(event) {
      pages = event.target.result.map(page => page.title);
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage();
      }
    };

    request.onerror = function(event) {
      console.error("Error loading pages:", event.target.errorCode);
    };
  }

  function handleSaveClick() {
    const transaction = db.transaction(["pages", "notes"], "readwrite");
    const pageStore = transaction.objectStore("pages");
    const noteStore = transaction.objectStore("notes");

    const oldTitle = pages[currentPageIndex];
    if (oldTitle !== currentTitle) {
      const deleteRequest = noteStore.delete(oldTitle);
      deleteRequest.onsuccess = function() {
        pages[currentPageIndex] = currentTitle;
        pageStore.put({ id: currentPageIndex + 1, title: currentTitle });
        noteStore.put({ title: currentTitle, content: currentNote });
      };

      deleteRequest.onerror = function(event) {
        console.error("Error deleting old note:", event.target.errorCode);
      };
    } else {
      pageStore.put({ id: currentPageIndex + 1, title: currentTitle });
      noteStore.put({ title: currentTitle, content: currentNote });
    }
  }

  function addPage() {
    const newPageTitle = "New Page " + (pages.length + 1);
    const transaction = db.transaction("pages", "readwrite");
    const store = transaction.objectStore("pages");
    const request = store.add({ title: newPageTitle });

    request.onsuccess = function(event) {
      pages = [...pages, newPageTitle];
      selectPage(pages.length - 1);
    };

    request.onerror = function(event) {
      console.error("Error adding page:", event.target.errorCode);
    };
  }

  function selectPage(index) {
    currentPageIndex = index;
    currentTitle = pages[currentPageIndex];
    const transaction = db.transaction("notes", "readonly");
    const store = transaction.objectStore("notes");
    const request = store.get(currentTitle);

    request.onsuccess = function(event) {
      currentNote = event.target.result ? event.target.result.content : "";
    };

    request.onerror = function(event) {
      console.error("Error loading note:", event.target.errorCode);
    };
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    const transaction = db.transaction(["pages", "notes"], "readwrite");
    const pageStore = transaction.objectStore("pages");
    const noteStore = transaction.objectStore("notes");

    const deleteNoteRequest = noteStore.delete(pageTitle);
    deleteNoteRequest.onsuccess = function() {
      pages = pages.filter((_, i) => i !== index);
      const deletePageRequest = pageStore.delete(index + 1);

      deletePageRequest.onsuccess = function() {
        if (pages.length === 0) {
          addPage();
        } else {
          selectPage(Math.min(index, pages.length - 1));
        }
      };

      deletePageRequest.onerror = function(event) {
        console.error("Error deleting page:", event.target.errorCode);
      };
    };

    deleteNoteRequest.onerror = function(event) {
      console.error("Error deleting note:", event.target.errorCode);
    };
  }
</script>
<div class="app-container">
  <aside class="sidebar">
    <div class="sidebar-content">
      <ul class="sidebar-list">
        {#each pages as page, index}
          <li class="sidebar-item">
            <button
              on:click={() => selectPage(index)}
              class="sidebar-button {index === currentPageIndex ? 'bg-dark-grey' : ''}"
            >
              {page}
            </button>
            <button
              on:click={() => deletePage(index)}
              class="delete-button"
              title="Delete page"
            >
              ×
            </button>
          </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      </ul>
    </div>
  </aside>
  <main class="main-content">
    <div class="header">
      <input
        type="text"
        bind:value={currentTitle}
        class="title-input"
        placeholder="Page Title"
      />
      <button class="save-button" on:click={handleSaveClick}>Save Note</button>
    </div>
    <textarea
      class="textarea"
      placeholder="Write your notes here..."
      bind:value={currentNote}
    ></textarea>
  </main>
</div>
<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #F0F0F0;
  }
  .app-container {
    display: flex;
    height: 100vh;
  }
  .sidebar {
    width: 250px;
    background: #FFFFFF;
    border-right: 1px solid #E0E0E0;
    overflow-y: auto;
  }
  .sidebar-content {
    padding: 20px;
  }
  .sidebar-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .sidebar-button {
    background: #F5F5F5;
    padding: 10px 15px;
    border-radius: 8px;
    width: 100%;
    text-align: left;
    border: 1px solid #E0E0E0;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    margin-bottom: 0;
  }
  .sidebar-button:hover {
    background-color: #E0E0E0;
  }
  .bg-dark-grey {
    background-color: #4c73f4;
    color: white;
  }
  .delete-button {
    background-color: #E53E3E;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }
  .delete-button:hover {
    background-color: #C53030;
  }
  .main-content {
    flex-grow: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .title-input {
    font-size: 24px;
    font-weight: bold;
    border: none;
    background: transparent;
    outline: none;
    width: 70%;
  }
  .save-button {
    background-color: #4c73f4;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .save-button:hover {
    background-color: #2D3748;
  }
  .textarea {
    width: 100%;
    height: calc(100vh - 150px);
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 15px;
    font-size: 16px;
    resize: none;
    flex-grow: 1;
  }
  .text-center {
    text-align: center;
  }
  .font-medium {
    font-weight: 500;
  }
</style>