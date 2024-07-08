<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';


  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      }
    });
  }

 
  async function fetchPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    pages = await store.getAll();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  
  async function fetchNoteByTitle(title) {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    return await store.get(title);
  }


  async function saveNote() {
    const tx = db.transaction(['notes', 'pages'], 'readwrite');
    const notesStore = tx.objectStore('notes');
    const pagesStore = tx.objectStore('pages');
    const storedPageName = pages[currentPageIndex].title;

    if (storedPageName !== title) {
      await notesStore.delete(storedPageName);
      pages[currentPageIndex].title = title;
      await pagesStore.put(pages[currentPageIndex]);
    }

    await notesStore.put({ title, note });
    await tx.done;
  }


  async function addPage() {
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    const id = await store.add({ title: 'New Page' });
    await tx.done;
    pages.push({ id, title: 'New Page' });
    selectPage(pages.length - 1);
  }


  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    const noteData = await fetchNoteByTitle(title);
    note = noteData ? noteData.note : '';
  }


  async function deletePage(index) {
    const pageToDelete = pages[index];
    const tx = db.transaction(['notes', 'pages'], 'readwrite');
    const notesStore = tx.objectStore('notes');
    const pagesStore = tx.objectStore('pages');

    await notesStore.delete(pageToDelete.title);
    await pagesStore.delete(pageToDelete.id);
    await tx.done;

    pages.splice(index, 1);
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  onMount(async () => {
    await initDB();
    await fetchPages();
  });
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-sidebar overflow-y-auto py-5 px-3 h-full border-r border-gray-200 shadow-lg">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center justify-between">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-selected-page' : 'bg-page'} py-2 px-3 text-white rounded-lg hover:bg-hover-page transition-all duration-300">{page.title}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-500 hover:text-red-700 transition-all duration-300">x</button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-white hover:text-gray-400 transition-all duration-300">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-black bg-white p-2 rounded-lg" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-primary transition-all duration-300" on:click={saveNote}>Save</button>
  </div>
  <hr class="border-gray-600"/>
  <textarea class="mt-3 block w-full bg-textarea border border-gray-600 rounded-lg text-white p-2.5" bind:value={note}></textarea>
</main>

<style>
  :root {
    --primary: #1F2937;
    --sidebar: #2D3748;
    --page: #4A5568;
    --selected-page: #1A202C;
    --hover-page: #718096;
    --textarea: #2D3748;
  }

  .bg-sidebar {
    background: var(--sidebar);
  }

  .bg-page {
    background: var(--page);
  }

  .bg-selected-page {
    background: var(--selected-page);
  }

 

  .bg-primary {
    background: var(--primary);
  }

  .bg-textarea {
    background: var(--textarea);
  }
</style>
