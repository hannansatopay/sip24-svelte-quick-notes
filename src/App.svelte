<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      }
    });

    const savedPages = await db.getAllKeys('notes');
    pages = savedPages.map(String); // Ensure all keys are strings
    if (pages.length > 0) {
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.content || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title: String(title), content: String(note) });
    pages = (await db.getAllKeys('notes')).map(String); // Ensure all keys are strings
  }

  async function addPage() {
    title = 'New Note';
    note = '';
    pages.push(title);
    currentPageIndex = pages.length - 1;
    await db.put('notes', { title: String(title), content: String(note) });
    pages = (await db.getAllKeys('notes')).map(String); // Ensure all keys are strings
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.content || '';
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.delete('notes', storedPageName);
    pages = pages.filter((_, i) => i !== currentPageIndex);
    currentPageIndex = pages.length > 0 ? 0 : -1;
    if (currentPageIndex >= 0) {
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.content || '';
    } else {
      title = '';
      note = '';
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-black overflow-y-auto py-5 px-3 border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-gray-700 text-white' : 'bg-black text-gray-400'} py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors">{page}</button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={addPage} class="font-medium text-gray-400 hover:text-gray-200 transition-colors">+ Add Note</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-60 h-auto bg-white text-black">
  <div class="text-center py-4 mb-6">
    <h1 class="text-4xl font-bold">Quick Notes</h1>
  </div>
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="col-span-2 text-3xl font-bold text-black" contenteditable bind:textContent={title}></h1>
    <div class="flex justify-end space-x-2">
      <button class="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3" on:click={deleteNote}>Delete</button>
      <button class="bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr class="border-gray-300"/>
  <textarea class="mt-3 block w-full bg-white border border-gray-300 rounded-lg text-black p-2.5" bind:value={note}></textarea>
</main>

<style>
body {
  background: #FFFFFF;
  margin: 0;
  font-family: Arial, sans-serif;
}

.bg-black {
  background: #000000;
}

.text-white {
  color: #FFFFFF;
}

.bg-white {
  background: #FFFFFF;
}

.text-black {
  color: #000000;
}

.text-gray-400 {
  color: #B0B0B0;
}

.text-gray-200 {
  color: #E0E0E0;
}

.bg-gray-700 {
  background: #404040;
}

.bg-gray-600 {
  background: #606060;
}

.border-gray-200 {
  border-color: #E0E0E0;
}

.border-gray-300 {
  border-color: #D1D1D1;
}

.hover\:bg-gray-600:hover {
  background: #606060;
}

.hover\:text-gray-200:hover {
  color: #E0E0E0;
}
</style>
