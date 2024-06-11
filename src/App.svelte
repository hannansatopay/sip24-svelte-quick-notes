<script>
  import { onMount } from 'svelte';
  import db from './dexie';

  let pages = [];
  let filteredPages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let searchQuery = '';

  onMount(async () => {
    pages = await db.notes.toArray();
    filteredPages = pages;
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
    filterPages();
  }

  async function addPage() {
    const newPage = { title: 'New Page', content: '' };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    filterPages();
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = filteredPages[currentPageIndex].title;
    note = filteredPages[currentPageIndex].content;
  }

  async function deletePage() {
    const pageToDelete = filteredPages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages = pages.filter(page => page.id !== pageToDelete.id);
    filterPages();
    if (filteredPages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
    alert('Note deleted');
  }

  function clearNote() {
    note = '';
    alert('Note content cleared');
  }

  function filterPages() {
    filteredPages = pages.filter(page => page.title.toLowerCase().includes(searchQuery.toLowerCase()));
    currentPageIndex = 0;
  }

  function clearSearch() {
    searchQuery = '';
    filterPages();
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-900 text-gray-300">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-800">
    <div class="relative mb-4">
      <input type="text" placeholder="Search notes..." bind:value={searchQuery} on:input={filterPages} class="p-2 w-full rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
      {#if searchQuery}
        <button on:click={clearSearch} class="absolute right-2 top-2 text-gray-500 hover:text-gray-300">&times;</button>
      {/if}
    </div>
    <ul class="space-y-2">
      {#each filteredPages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-gray-800' : ''} py-2 px-3 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-gray-300">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-gray-800 text-gray-300">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-700 text-gray-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-600" on:click={saveNote}>Save</button>
      <button class="bg-blue-500 text-gray-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={clearNote}>Clear</button>
      <button class="bg-red-600 text-gray-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr class="border-gray-700"/>
  <textarea class="mt-3 block w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-300 p-2.5" bind:value={note}></textarea>
</main>

<style>
  ::selection {
    background-color: #4A90E2;
    color: white;
  }

  button:focus {
    outline: none;
  }
</style>
