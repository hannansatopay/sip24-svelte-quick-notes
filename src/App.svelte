<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  // Initialize IndexedDB
  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });
  }

  // Load notes from IndexedDB
  async function loadNotes() {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    pages = await store.getAllKeys();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  // Save note to IndexedDB
  async function saveNote() {
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await store.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await store.put({ title, note });
    pages = await store.getAllKeys();
  }

  // Delete note from IndexedDB
  async function deleteNote() {
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    await store.delete(title);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  // Add a new page
  async function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  // Select a page
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const noteObj = await store.get(title);
    note = noteObj ? noteObj.note : '';
  }

  onMount(async () => {
    await initDB();
    await loadNotes();
  });
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'font-bold' : ''}">
            {page}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button on:click={saveNote} class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-700">Save</button>
    <button on:click={deleteNote} class="ml-auto bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-500">Delete</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
</style>
