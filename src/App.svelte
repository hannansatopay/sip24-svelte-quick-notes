<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'index' });
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.note || '';
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
    await db.put('pages', { index: currentPageIndex, title });
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.note || '';
  }

  async function deletePage() {
    if (currentPageIndex < 0 || currentPageIndex >= pages.length) return; // Ensure valid index

    const pageToDelete = pages[currentPageIndex];
    pages.splice(currentPageIndex, 1);
    await db.delete('notes', pageToDelete);
    await db.delete('pages', currentPageIndex);

    if (pages.length === 0) {
      title = '';
      note = '';
    } else {
      const newIndex = currentPageIndex >= pages.length ? pages.length - 1 : currentPageIndex;
      selectPage(newIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-400">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''}  px-3 py-2 text-gray-900 rounded-lg">{page}</button> 
        </li>
      {/each}
      <li class='text-center'>
        <button on:click={addPage} class='font-medium'> +Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
  </div>
  <div class="grid-cols-2 items-center mb-3">
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button on:click={deletePage} class='ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900'>Delete</button>
  </div>
  <hr>
  
  <textarea class="mt-3 block w-full bg-gray-200 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: lightgray;
  }
  .bg-dark-gray {
    background: darkgray;
  }
</style>
