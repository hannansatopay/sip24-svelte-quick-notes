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