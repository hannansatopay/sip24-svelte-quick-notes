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
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
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
    const tx = db.transaction('pages');
    const store = tx.objectStore('pages');
    const allPages = await store.getAll();
    pages = allPages.map(page => page.title);
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  async function savePages() {
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    await store.clear();
    for (const page of pages) {
      await store.put({ title: page });
    }
    await tx.done;
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
    await savePages();
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await removeItem(storedPageName);
    pages.splice(currentPageIndex, 1);
    await savePages();

    if (pages.length > 0) {
      selectPage(Math.max(currentPageIndex - 1, 0));
    } else {
      addPage(); // Add a new page if no pages are left
    }
  }

  async function addPage() {
    pages.push('New Page');
    await savePages();
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await getItem(title) || '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-sidebar-bg text-white">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-active-page' : 'bg-page'} py-2 px-3 w-full text-left rounded-lg hover:bg-hover-page transition duration-200">{page}</button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="bg-add-page py-2 px-3 w-full text-white rounded-lg hover:bg-hover-add-page transition duration-200">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-main-bg text-main-text">
  <div class="mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
  </div>
  <hr class="border-main-border"/>
  <textarea class="mt-3 block w-full bg-textarea-bg border border-textarea-border rounded-lg text-textarea-text p-2.5" bind:value={note}></textarea>
  <div class="flex justify-center mt-3 space-x-2">
    <button class="bg-save-button text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-hover-save-button transition duration-200" on:click={saveNote}>Save</button>
    <button class="bg-delete-button text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-hover-delete-button transition duration-200" on:click={deleteNote}>Delete</button>
  </div>
</main>

<style>
  /* General styles */
  body {
    font-family: 'Arial', sans-serif;
  }

  /* Sidebar styles */
  .bg-sidebar-bg {
    background: #2C3E50;
  }

  .bg-page {
    background: #34495E;
  }

  .bg-active-page {
    background: #1ABC9C;
  }

  .hover\:bg-hover-page:hover {
    background: #16A085;
  }

  .bg-add-page {
    background: #2980B9;
  }

  .hover\:bg-hover-add-page:hover {
    background: #3498DB;
  }

  /* Main content styles */
  .bg-main-bg {
    background: #ECF0F1;
  }

  .text-main-text {
    color: #2C3E50;
  }

  .border-main-border {
    border-color: #BDC3C7;
  }

  /* Textarea styles */
  .bg-textarea-bg {
    background: #FFFFFF;
  }

  .border-textarea-border {
    border-color: #BDC3C7;
  }

  .text-textarea-text {
    color: #2C3E50;
  }

  /* Button styles */
  .bg-save-button {
    background: #27AE60;
  }

  .hover\:bg-hover-save-button:hover {
    background: #2ECC71;
  }

  .bg-delete-button {
    background: #C0392B;
  }

  .hover\:bg-hover-delete-button:hover {
    background: #E74C3C;
  }
</style>
