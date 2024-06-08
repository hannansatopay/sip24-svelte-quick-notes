<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = ''; 

  let db;

  async function initializeDB() {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('metadata', { keyPath: 'pages' });
      },
    });
  }

  async function initialize() {
    await initializeDB();
    const savedPages = await db.get('metadata', 'pages');
    if (savedPages) {
      pages = savedPages.pages;
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.note || '';
    } else {
      addPage();
    }
  }

  onMount(() => {
    initialize();
  });

  async function saveNote() {
    const updation = pages[currentPageIndex];
    if (updation !== title) {
      await db.delete('notes', updation);
    }
    pages[currentPageIndex] = title;
    await db.put('notes', { title, note });
    await db.put('metadata', { pages });
  }

  function addPage() {
    pages.push('New Page');
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.note || '';
  }

  async function deleteNote() {
    const deletedNote = pages[currentPageIndex];
    pages.splice(currentPageIndex, 1);
    await db.delete('notes', deletedNote);
    if (pages.length === 0) {
      addPage();
    } else if (currentPageIndex >= pages.length) {
      selectPage(pages.length - 1);
    } else {
      selectPage(currentPageIndex);
    }
    await db.put('metadata', { pages });
    initialize();
  }
</script>

<aside class="fixed bg-black top-0 left-0 z-20 w-56 h-screen">
  <div class="bg-gray-900 border-r border-gray-500 h-full overflow-y-auto py-5 px-3 ">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li> 
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-[#efefef]' : 'text-white'} font-medium py-2 px-3 text-gray-900 rounded-lg">{page || "New Page"}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-white">+Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="bg-slate-900 ml-56 min-h-screen p-4">
  <div class="grid grid-cols-2 my-1 text-white items-center mb-2">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <div class="ml-auto">
      <button on:click={saveNote} class="font-semibold rounded-lg hover:bg-blue-400 hover:text-white px-5 py-2 bg-white text-black">Save</button>
      <button on:click={deleteNote} class="font-semibold rounded-lg bg-red-700 hover:text-white px-5 py-2 text-black">Delete</button>
    </div>
  </div>
  <hr/>
  <div class="flex flex-col space-y-4 mx-auto py-6">
    <textarea class="rounded-lg text-gray-900 bg-gray-100 border border-gray-300 p-2" bind:value={note}></textarea>
  </div>
</main>

<style>
  
</style>
