<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  $: currentPage = pages[currentPageIndex];

  async function initDB() {
    try {
      db = await openDB('notesDB', 1, {
        upgrade(db) {
          db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
          db.createObjectStore('notes');
        }
      });
      await loadPages();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  onMount(initDB);

  async function loadPages() {
    try {
      pages = await db.getAll('pages');
      if (pages.length > 0) {
        await selectPage(0);
      } else {
        await addPage();
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  }

  async function saveNote() {
    try {
      const page = pages[currentPageIndex];
      if (page.title !== title) {
        await db.delete('notes', page.title);
        page.title = title;
        await db.put('pages', page);
      }
      await db.put('notes', note, title);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  async function addPage() {
    try {
      const newPage = { title: 'New Page' };
      const id = await db.add('pages', newPage);
      newPage.id = id;
      pages = [...pages, newPage];
      await selectPage(pages.length - 1);
    } catch (error) {
      console.error('Error adding page:', error);
    }
  }

  async function selectPage(index) {
    try {
      currentPageIndex = index;
      title = pages[index].title;
      note = await db.get('notes', title) || '';
    } catch (error) {
      console.error('Error selecting page:', error);
    }
  }

  async function deletePage(index) {
    try {
      const pageToDelete = pages[index];
      pages = pages.filter((_, i) => i !== index);
      await db.delete('notes', pageToDelete.title);
      await db.delete('pages', pageToDelete.id);
      if (pages.length === 0) {
        await addPage();
      } else {
        await selectPage(index > 0 ? index - 1 : 0);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  }
</script>

<style>
  .flex {
    display: flex;
  }
  .h-screen {
    height: 100vh;
  }
  .bg-gray-100 {
    background-color: #f7fafc;
  }
  .w-64 {
    width: 16rem;
  }
  .bg-white {
    background-color: #fff;
  }
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .p-4 {
    padding: 1rem;
  }
  .space-y-2 > :not(:last-child) {
    margin-bottom: 0.5rem;
  }
  .p-2 {
    padding: 0.5rem;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
  }
  .duration-200 {
    transition-duration: 200ms;
  }
  .hover\:bg-gray-100:hover {
    background-color: #f7fafc;
  }
  .bg-blue-100 {
    background-color: #ebf8ff;
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .text-red-500 {
    color: #f56565;
  }
  .hover\:text-red-700:hover {
    color: #c53030;
  }
  .bg-green-500 {
    background-color: #48bb78;
  }
  .text-white {
    color: #fff;
  }
  .hover\:bg-green-600:hover {
    background-color: #38a169;
  }
  .text-3xl {
    font-size: 1.875rem;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .focus\:outline-none:focus {
    outline: none;
  }
  .focus\:border-b-2:focus {
    border-bottom-width: 2px;
  }
  .focus\:border-blue-500:focus {
    border-color: #4299e1;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .bg-blue-500 {
    background-color: #4299e1;
  }
  .hover\:bg-blue-600:hover {
    background-color: #3182ce;
  }
  .w-full {
    width: 100%;
  }
  .h-\[calc\(100vh-200px\)\] {
    height: calc(100vh - 200px);
  }
  .border {
    border-width: 1px;
  }
  .border-gray-300 {
    border-color: #e2e8f0;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .resize-none {
    resize: none;
  }
  .focus\:ring-2:focus {
    ring-width: 2px;
  }
  .focus\:ring-blue-500:focus {
    ring-color: #4299e1;
  }
</style>

<div class="flex h-screen bg-gray-100">
  <aside class="w-64 bg-white shadow-md">
    <div class="p-4">
      <ul class="space-y-2">
        {#each pages as page, index}
          <li class="flex items-center justify-between p-2 rounded-md transition-colors duration-200 {index === currentPageIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}">
            <button on:click={() => selectPage(index)} class="flex-grow text-left font-medium text-gray-700">
              {page.title}
            </button>
            <button on:click={() => deletePage(index)} class="text-red-500 hover:text-red-700">
              Delete
            </button>
          </li>
        {/each}
      </ul>
      <button on:click={addPage} class="w-full mt-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
        + Add Page
      </button>
    </div>
  </aside>
  <main class="flex-grow p-6">
    <div class="flex justify-between items-center mb-6">
      <h1
        contenteditable
        bind:textContent={title}
        class="text-3xl font-bold text-gray-800 focus:outline-none focus:border-b-2 focus:border-blue-500"
      ></h1>
      <button
        on:click={saveNote}
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Save
      </button>
    </div>
    <textarea
      bind:value={note}
      class="w-full h-[calc(100vh-200px)] p-4 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </main>
</div>
