<script>
  import { onMount } from 'svelte';
  import { openDatabase, savePage, saveNote, getNotes, getPages, deletePage } from './db';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    const savedPages = await getPages();
    if (savedPages.length > 0) {
      pages = savedPages;
      title = pages[currentPageIndex]?.title || "New Page";
      const notes = await getNotes();
      note = notes.find(n => n.title === title)?.content || '';
    } else {
      addPage();
    }
  });

  async function savenote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) { // If the title has changed, update it
      await deletePage(storedPage.title);
      pages[currentPageIndex].title = title;
    }
    await savePage({ id: pages[currentPageIndex].id, title });
    await saveNote({ title, content: note });
  }

  async function addPage() {
    const newPage = { title: "New Page" };
    await savePage(newPage);
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    const notes = await getNotes();
    note = notes.find(n => n.title === title)?.content || '';
  }

  async function deletePageHandler() {
    if (pages.length > 0) {
      const pageToDelete = pages.splice(currentPageIndex, 1)[0];
      await deletePage(pageToDelete.title);
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      title = pages[currentPageIndex]?.title || '';
      const notes = await getNotes();
      note = notes.find(n => n.title === title)?.content || '';
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen shadow-lg">
  <div class="bg-sidebar overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-active-page' : ''} py-2 px-3 text-gray-200 rounded-lg hover:bg-hover-page transition duration-200">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-gray-200 hover:text-white transition duration-200"> + Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-main">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-gray-900 bg-main-heading p-2 rounded-lg shadow-inner" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto">
      <button class="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-600 shadow transition duration-200" on:click={deletePageHandler}>Delete</button>
      <button class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-700 shadow transition duration-200" on:click={savenote}>Save</button>
    </div>
  </div>
  <hr class="border-gray-300"/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded text-gray-900 p-3 shadow-inner focus:ring-2 focus:ring-blue-300 transition duration-200" bind:value={note}></textarea>
</main>

<style>
  :global(body) {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .bg-sidebar {
    background-color: #2c3e50;
  }

  .bg-main {
    background-color: #ecf0f1;
  }

  .bg-main-heading {
    background-color: #bdc3c7;
  }

  .bg-active-page {
    background-color: #34495e;
  }

  .hover\:bg-hover-page:hover {
    background-color: #3b5998;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;
  }

  textarea:focus {
    outline: none;
  }

  .shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .shadow-inner {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .transition {
    transition: all 0.2s ease-in-out;
  }
</style>
