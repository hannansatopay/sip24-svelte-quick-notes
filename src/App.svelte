<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });

    const savedPages = await db.getAllKeys('notes');
    if (savedPages.length) {
      pages = savedPages;
      selectPage(0);
    } else {
      addPage();
    }
  }

  onMount(initDB);

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
  }

  async function addPage() {
    const newTitle = 'New Page';
    pages.push(newTitle);
    await db.put('notes', { title: newTitle, note: '' });
    selectPage(pages.length - 1);
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (pages.length > 0) {
      selectPage(index === 0 ? 0 : index - 1);
    } else {
      addPage();
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const pageData = await db.get('notes', pages[currentPageIndex]);
    title = pageData.title;
    note = pageData.note;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-1">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 px-2">X</button>
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
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
