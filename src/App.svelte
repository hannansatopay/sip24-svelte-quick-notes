<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function initDB() {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { autoIncrement: true });
      },
    });
  }

  onMount(async () => {
    await initDB();
    const savedPages = await db.getAllKeys('pages');
    if (savedPages.length > 0) {
      pages = savedPages;
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.note : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      await db.put('pages', title, currentPageIndex);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
  }

  async function addPage() {
    pages.push('New Page');
    await db.put('pages', 'New Page', pages.length - 1);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.note : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    await db.delete('pages', index);
    pages.forEach(async (page, idx) => {
      await db.put('pages', page, idx);
    });
    if (pages.length > 0) {
      selectPage(index === 0 ? 0 : index - 1);
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-cyan overflow-y-auto py-5 px-3 h-full border-r border-cyan-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-cyan' : ''} py-2 px-3 text-cyan-900 rounded-lg flex-1 text-left">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">
            Delete
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-cyan-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-cyan-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-cyan-50 border border-cyan-300 rounded-lg text-cyan-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-cyan {
    background: #ccf1fd;
  }
  .bg-dark-cyan {
    background: #8fd0db;
  }
</style>
