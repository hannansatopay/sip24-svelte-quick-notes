<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function initDB() {
    db = await openDB('NotesApp', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes');
        }
      },
    });
  }

  async function getItem(key) {
    return (await db.transaction('notes').objectStore('notes').get(key)) || '';
  }

  async function setItem(key, value) {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').put(value, key);
    await tx.done;
  }

  async function removeItem(key) {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').delete(key);
    await tx.done;
  }

  async function loadPages() {
    const storedPages = await getItem('pages');
    if (storedPages && storedPages.length > 0) {
      pages = storedPages;
      selectPage(0);
    }
  }

  onMount(async () => {
    await initDB();
    await loadPages();
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    await setItem(title, note);
    await setItem('pages', pages);
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await removeItem(storedPageName);
    pages.splice(currentPageIndex, 1);
    await setItem('pages', pages);

    if (pages.length > 0) {
      selectPage(Math.max(currentPageIndex - 1, 0));
    } else {
      addPage(); // Add a new page if no pages are left
    }
  }

  async function addPage() {
    pages.push('New Page');
    await setItem('pages', pages);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="col-span-2 text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
     
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
  <button class="mt-3 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700" on:click={deleteNote}>Delete</button>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #efefefb0;
  }
</style>
