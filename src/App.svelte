<script>
  import { onMount, onDestroy } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let pinned = false;

  let db; // IndexedDB instance

  // Initialize IndexedDB
  onMount(async () => {
    db = await initDatabase();
    await loadPages();
  });

  onDestroy(() => {
    db.close(); // Close the database connection on component destruction
  });

  async function initDatabase() {
    const dbName = 'notes_db';
    const dbVersion = 1;
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onerror = (event) => {
        reject('IndexedDB error: ' + event.target.errorCode);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      };
    });

    return db;
  }

  async function loadPages() {
    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.openCursor();

    pages = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        pages.push({ id: cursor.value.id, title: cursor.value.title, note: cursor.value.note, pinned: cursor.value.pinned });
        cursor.continue();
      } else {
        if (pages.length === 0) {
          addPage(); // If no pages found, add a default page
        } else {
          selectPage(currentPageIndex); // Select the current page
        }
      }
    };
  }

  function saveNote() {
    const storedPage = pages[currentPageIndex];

    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    storedPage.title = title;
    storedPage.note = note;
    storedPage.pinned = pinned;

    const request = objectStore.put(storedPage);

    request.onsuccess = () => {
      console.log('Note saved successfully');
    };

    request.onerror = (event) => {
      console.error('Error saving note:', event.target.error);
    };
  }

  function addPage() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const newPage = {
      title: 'New Page',
      note: '',
      pinned: false
    };

    const request = objectStore.add(newPage);

    request.onsuccess = (event) => {
      pages.push({ id: event.target.result, title: newPage.title, note: newPage.note, pinned: newPage.pinned });
      selectPage(pages.length - 1);
    };

    request.onerror = (event) => {
      console.error('Error adding new page:', event.target.error);
    };
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const request = objectStore.delete(pageToDelete.id);

    request.onsuccess = () => {
      pages.splice(index, 1);
      if (currentPageIndex >= pages.length) {
        selectPage(pages.length - 1);
      } else {
        selectPage(currentPageIndex); // Refresh current page after deletion
      }
    };

    request.onerror = (event) => {
      console.error('Error deleting page:', event.target.error);
    };
  }

  function pinPage(index) {
    pages[index].pinned = !pages[index].pinned;
    saveNote();
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
    pinned = pages[currentPageIndex].pinned;
  }
</script>

<style>
  .bg-dark {
    background-color: #121212; /* Dark background */
  }

  .text-electric-blue {
    color: #00c6ff; /* Electrifying blue text */
  }

  .bg-electric-blue {
    background-color: #00c6ff; /* Electrifying blue background */
  }

  .bg-electric-blue:hover {
    background-color: #0099e0; /* Darker shade on hover */
  }

  .text-electric-blue:hover {
    color: #0077b3; /* Darker shade on hover */
  }

  .sidebar-button {
    padding: 0.5rem 0.75rem;
    color: #d1d5db;
    border-radius: 0.375rem;
    transition: background-color 0.3s;
  }

  .sidebar-button:hover {
    background-color: #00c6ff;
    color: #121212;
  }

  .active {
    background-color: #00c6ff;
    color: #121212;
  }

  main {
    background: linear-gradient(to bottom, #1e3c72, #2a5298); /* Eye-catching gradient background */
    height: 100vh;
  }

  .app-title {
    font-family: 'Arial', sans-serif;
    font-size: 3rem;
    color: #fff;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    text-align: center;
  }

  .textarea {
    height: calc(100vh - 150px);
  }
</style>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-dark">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button
            on:click={() => selectPage(index)}
            class="sidebar-button {index === currentPageIndex ? 'active' : ''}"
          >
            {page.title}
          </button>
          <button
            on:click={() => pinPage(index)}
            class="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            {page.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            on:click={() => deletePage(index)}
            class="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-bold text-electric-blue">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60">
  <div class="app-title">Ayaan Notes App</div>
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-electric-blue" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-3 bg-electric-blue text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-electric-blue hover:text-electric-blue" on:click={saveNote}>
      Save
    </button>
  </div>
  <hr />
  <textarea
    class="mt-3 block w-full bg-gray-800 border border-gray-300 rounded-lg text-gray-300 p-2.5 textarea"
    bind:value={note}
  ></textarea>
</main>
