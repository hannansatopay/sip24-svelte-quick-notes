<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function initDB() {
    db = await openDB('NotesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { autoIncrement: true, keyPath: 'id' });
      }
    });
  }

  onMount(async () => {
    await initDB();
    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      currentPageIndex = 0;
      title = pages[currentPageIndex];
      const storedNote = await db.get('notes', title);
      note = storedNote ? storedNote.note : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
    await db.put('pages', { id: currentPageIndex, title });
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const storedNote = await db.get('notes', title);
    note = storedNote ? storedNote.note : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);

    if (pages.length === 0) {
      addPage();
    } else if (index === currentPageIndex) {
      selectPage(index > 0 ? index - 1 : 0);
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }

    await db.clear('pages');
    pages.forEach(async (title, i) => {
      await db.put('pages', { id: i, title });
    });
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-500">x</button>
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
