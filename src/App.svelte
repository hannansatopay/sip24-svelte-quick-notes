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
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'index' });
      }
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(p => p.title);
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

  async function addPage() {
    pages.push("New Page");
    await db.put('pages', { index: pages.length - 1, title: "New Page" });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.note || '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.delete('notes', pageToDelete);
    pages.splice(index, 1);

    // Update the remaining pages' indices in IndexedDB
    for (let i = 0; i < pages.length; i++) {
      await db.put('pages', { index: i, title: pages[i] });
    }

    // Update the pages in IndexedDB to remove the deleted page
    await db.delete('pages', pages.length);

    if (pages.length === 0) {
      addPage();
    } else {
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      selectPage(currentPageIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? ' bg-dark-gray' : ''} px-3 text-gray-900 rounded-lg flex-1">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-500 px-2 ml-2">Delete</button>
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
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>


