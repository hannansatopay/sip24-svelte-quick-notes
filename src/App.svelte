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
        db.createObjectStore('pages', { autoIncrement: true, keyPath: 'id' });
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
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

    await db.put('notes', { title, content: note });

    if (storedPageName !== title) {
      const pageIndex = await db.getAllKeys('pages').then(keys => keys.findIndex(key => key === storedPageName));
      await db.delete('pages', pageIndex);
    }

    await db.put('pages', { id: currentPageIndex, title });

    pages = [...pages];
  }

  async function addPage() {
    const newTitle = "New Page";
    await db.put('pages', { id: pages.length, title: newTitle });
    pages = [...pages, newTitle];
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.content || '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    pages.splice(index, 1);
    await db.delete('notes', pageToDelete);

    const keys = await db.getAllKeys('pages');
    const keyToDelete = keys[index];
    await db.delete('pages', keyToDelete);

    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = Math.max(0, index - 1);
      selectPage(currentPageIndex);
    }

    pages = [...pages];
  }
</script>

<!-- Add a header for NoteHub -->
<header class="header">
  <h1>NoteHub</h1>
</header>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="relative">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-5 px-3 text-gray-900 rounded-lg w-full text-left">{page}</button>
          <button on:click={() => deletePage(index)} class="delete-button absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">Delete</button>
        </li>
      {/each}
      <li class="text-center mt-4">
        <button on:click={addPage} class="add-page-button">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-primary-dark" on:click={saveNote}>Save</button>
  </div>
  <hr class="border-primary" />
  <textarea class="note-textarea mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <img src="bg.jpg" alt="Image" class="bottom-right-image" />
</main>


<style>
  body {
    font-family: 'Audry', sans-serif;
    background-color: #f7f9fc;
    color: #333;
  }

  .header {
    padding: 20px;
    background-color: #5c6bc0;
    color: white;
    text-align: center;
    border-bottom: 3px solid #3949ab;
  }

  .header h1 {
    font-size: 2.5rem;
    margin: 0;
  }

  .bg-light-gray {
    background: linear-gradient(145deg, #f3f4f6, #e2e6ea);
  }

  .bg-dark-gray {
    background: #3949ab;
    color: white;
  }

  .delete-button {
    background-color: #e53935;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .delete-button:hover {
    background-color: #d32f2f;
  }

  .add-page-button {
    background-color: #5c6bc0;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
  }

  .add-page-button:hover {
    background-color: #3949ab;
  }

  aside {
    background-image: url('bg.jpg'); /* Use a URL to a nice background image */
    background-size: cover;
    background-position: center;
    border-right: 3px solid #3949ab;
  }

  main {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .note-textarea {
    resize: none;
    min-height: 300px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .bg-primary {
    background-color: #5c6bc0;
  }

  .bg-primary-dark {
    background-color: #3949ab;
  }

  .border-primary {
    border-color: #5c6bc0;
  }

  /* Image at bottom right */
  .bottom-right-image {
    position: fixed;
    bottom: 5px;
    right: 10px;
    width: 300px; /* Adjust size as needed */
    height: 400px; /* Adjust size as needed */
    z-index: 100; /* Ensure it is above other content */
    pointer-events: none; /* Make sure it does not block other content */
  }
</style>
