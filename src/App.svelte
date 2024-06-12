<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('QuickNotesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      },
    });
    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    if (pages[currentPageIndex] !== title) {
      await db.delete('notes', pages[currentPageIndex]);
      pages[currentPageIndex] = title;
      await db.put('pages', { id: currentPageIndex + 1, title });
    }
    await db.put('notes', { title, note });
  }

  async function addPage() {
    const newTitle = `New Page ${pages.length + 1}`;
    pages.push(newTitle);
    await db.add('pages', { title: newTitle });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const storedNote = await db.get('notes', title);
    note = storedNote ? storedNote.note : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    const allPages = await db.getAll('pages');
    const pageToDelete = allPages.find(page => page.title === pageTitle);
    if (pageToDelete) {
      await db.delete('pages', pageToDelete.id);
    }
    pages.splice(index, 1);
    if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }
    if (pages.length > 0) {
      selectPage(currentPageIndex);
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center justify-between">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow text-left">{page}</button>
        <button on:click={() => deletePage(index)} class="text-red-500 ml-2">✕</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <input type="text" bind:value={title} class="text-3xl font-bold bg-transparent border-none focus:ring-0 w-full" placeholder="Untitled Note" />
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder="Write your note here..."></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  input[type="text"] {
    outline: none;
    box-shadow: none;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus {
    border-bottom-color: #4A90E2;
  }

  input[type="text"]::placeholder {
    color: #9CA3AF; /* Tailwind's gray-400 */
  }

  textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
</style>
