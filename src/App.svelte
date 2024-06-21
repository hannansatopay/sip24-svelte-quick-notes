<script>
 
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });

    const savedPages = await db.getAllKeys('notes');
    if (savedPages.length > 0) {
      pages = savedPages;
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.note : '';
    } else {
      addpage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
    pages[currentPageIndex] = title;
  }

  function addpage() {
    pages.push("NewPage");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.note : '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.delete('notes', pageToDelete);
    pages.splice(index, 1);
    if (pages.length === 0) {
      addpage();
    } else {
      selectPage(index === pages.length ? index - 1 : index);
    }
  }

</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray border-r border-gray-200 overflow-y-auto py-5 px-3 h-full text-medium">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} rounded-lg py-2 px-3 text-gray-900 flex-grow">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2">
          <svg class="w-6 h-6 text-red-600 hover:text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-1 12H6L5 7m5-3h4m-4"></path>
          </svg>
        </button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addpage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto block bg-gray-800 text-white rounded-lg px-5 py-2.5 mt-3 text-medium text-sm hover:bg-gray-900 cursor-pointer" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="block mt-3 w-full bg-gray-50 rounded-lg p-2.5 border border-gray-300 text-gray-900" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray {
  background-color: #90d6e9;
}
.bg-dark-gray {
  background: #EFEFEF;
}
svg {
  cursor: pointer;
}
</style>