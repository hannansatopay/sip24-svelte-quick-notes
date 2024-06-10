<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';
  
  let pages = [];
  let currentPageIndex = 0; 
  let title = "";
  let note = "";
  
  let db;
  
  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pages')) {
          const pagesStore = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
          pagesStore.createIndex('title', 'title', { unique: true });
        }
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
      }
    });
    await loadPages();
  });
  
  async function loadPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    pages = await store.getAll();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }
  
  async function saveNote() {
    const txPages = db.transaction('pages', 'readwrite');
    const storePages = txPages.objectStore('pages');
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await storePages.put({ id: storedPage.id, title });
      pages[currentPageIndex].title = title;
    }
    await db.put('notes', { title, note });
    await txPages.done;
  }
  
  async function addPage() {
    const txPages = db.transaction('pages', 'readwrite');
    const storePages = txPages.objectStore('pages');
    const id = await storePages.add({ title: 'New Page' });
    pages.push({ id, title: 'New Page' });
    selectPage(pages.length - 1);
    await txPages.done;
  }
  
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = (await db.get('notes', title))?.note || '';
  }
  
  async function deletePage(index) {
    const pageTitle = pages[index].title;
    await db.delete('notes', pageTitle);
    await db.delete('pages', pages[index].id);
    pages.splice(index, 1);
    
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === 0 ? 0 : index - 1);
    }
  }
  </script>
  
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul>
        {#each pages as page, index}
          <li class="flex items-center justify-between">
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
            <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-800">Delete</button>
          </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
      </ul>
    </div>
  </aside>
  
  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </main>
  
  <style>
  .bg-light-gray {
    background: white;
  }
  
  .bg-dark-gray {
    background: lightgray;
  }
  </style>
  