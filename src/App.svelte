<script>
  import { onMount } from "svelte";
  import { openDB } from "idb";

  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;
  let db;

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });
  }

  onMount(async () => {
    await initDB();
    const storedPages = await db.getAllKeys('notes');
    if (storedPages.length > 0) {
      pages = storedPages;
      await selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storePageName = pages[currentPageIndex];
    if (storePageName !== title) {
      await db.delete('notes', storePageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
    pages = [...pages];
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const page = await db.get('notes', pages[currentPageIndex]);
    title = page ? page.title : '';
    note = page ? page.note : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === 0 ? 0 : index - 1);
    }
    pages = [...pages];
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-64 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} bg-light-gray py-2 px-3 text-gray-900 rounded-lg flex-grow">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-600 font-bold hover:text-red-900">✕</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-gray-700">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-64 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-4 hover:bg-gray-900 ml-auto" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="block w-full mt-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #dcdcdc;
  }
  aside ul {
    padding-left: 0;
  }
  aside li {
    list-style: none;
  }
  aside button {
    width: 100%;
  }
</style>