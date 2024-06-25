<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  const db = new Dexie('notesDB');
  db.version(1).stores({
    pages: 'title',
    notes: 'title, note'
  });

  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      const noteData = await db.notes.get(title);
      note = noteData ? noteData.note : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.pages.delete(storedPageName);
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, note: note || '' });
    await db.pages.put({ title });
  }

  function addPage() {
    pages.push('New Page');
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.notes.get(title);
    note = noteData ? noteData.note : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    await db.pages.delete(pageTitle);
    await db.notes.delete(pageTitle);
    if (currentPageIndex >= index && currentPageIndex > 0) {
      currentPageIndex--;
    }
    if (pages.length > 0) {
      title = pages[currentPageIndex];
      const noteData = await db.notes.get(title);
      note = noteData ? noteData.note : '';
    } else {
      title = '';
      note = '';
      addPage();
    }
  }
</script>

<main class="flex h-screen bg-gray-100">
  <aside class="fixed top-0 left-0 z-40 w-60 h-full bg-light-gray">
    <div class="overflow-y-auto py-5 px-8 h-full border-r border-gray-900">
      <h2 class="text-gray-900 text-lg font-bold mb-4">My Notes</h2>
      <ul class="space-y-2">
        {#each pages as page, index}
          <li>
            <button 
              on:click={() => selectPage(index)} 
              class="{index == currentPageIndex ? 'bg-dark-gray' : ''} w-full rounded-lg py-2 px-3 text-gray-900 hover:bg-dark-gray transition">
              {page}
            </button>
          </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium text-gray-900 hover:underline">+ Add Page</button>
        </li>
      </ul>
    </div>
  </aside>

  <div class="ml-60 p-8 w-full">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold bg-gray-200 p-2 rounded-lg w-3/4" contenteditable bind:textContent={title}></h1>
      <div class="flex space-x-2">
        <button on:click={saveNote} class="w-24 border border-gray-50 bg-green-600 rounded-lg text-white font-medium hover:bg-green-400 px-5 py-2.5 transition">Save</button>
        <button on:click={() => deletePage(currentPageIndex)} class="w-24 border border-gray-50 bg-red-600 rounded-lg text-white font-medium hover:bg-red-400 px-4 py-2.5 transition">Delete</button>
      </div>
    </div>
    <hr class="mb-4" />
    <textarea bind:value={note} class="w-full h-96 border bg-gray-50 border-gray-300 text-gray-900 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
  </div>
</main>

<style>
  .bg-light-gray {
    background-color: rgb(240, 240, 240);
  }
  .bg-dark-gray {
    background-color: rgb(219, 219, 219);
  }
</style>
