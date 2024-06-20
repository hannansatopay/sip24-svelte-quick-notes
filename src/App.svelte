<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { autoIncrement: true });
        }
      }
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    if (pages[currentPageIndex] !== title) {
      await db.delete('notes', pages[currentPageIndex]);
      pages[currentPageIndex] = title;
    }

    await db.put('notes', { title, note });
    await db.put('pages', { title });

    const savedPages = await db.getAll('pages');
    pages = savedPages.map(page => page.title);
  }

  function addPage() {
    pages.push("new page");
    selectPage(pages.length - 1);
  }

  async function deleteNote() {
    await db.delete('notes', title);
    await db.delete('pages', currentPageIndex + 1);

    const savedPages = await db.getAll('pages');
    pages = savedPages.map(page => page.title);
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.get('notes', title);
    note = noteData ? noteData.note : '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900" on:click={saveNote}>Save</button>
    <button class="ml-auto bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900" on:click={deleteNote}>Delete</button>
  </div>

  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 mt-3" bind:value={title} type="text" placeholder="add title">
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg" bind:value={note} placeholder="add note"></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #FBFBFB;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>

