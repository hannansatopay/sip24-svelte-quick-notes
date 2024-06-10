<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function initDB() {
    db = await openDB('note-app', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { autoIncrement: true });
        }
      }
    });
  }

  async function loadPages() {
    const allPages = await db.getAll('pages');
    pages = allPages.map(page => page.title);
    if (pages.length > 0) {
      await selectPage(0);
    } else {
      await addPage();
    }
  }

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
      await db.put('pages', { id: currentPageIndex, title });
    }
    await db.put('notes', { title, content: note });
  }

  async function addPage() {
    const newPageTitle = 'New Page';
    pages.push(newPageTitle);
    await db.add('pages', { title: newPageTitle });
    await selectPage(pages.length - 1);
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.delete('notes', storedPageName);
    pages.splice(currentPageIndex, 1);
    await db.delete('pages', currentPageIndex);

    if (pages.length > 0) {
      await selectPage(Math.max(0, currentPageIndex - 1));
    } else {
      await addPage();
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.get('notes', title);
    note = noteData ? noteData.content : '';
  }

  onMount(async () => {
    await initDB();
    await loadPages();
  });
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as Page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} px-12 py-2 text-gray-900 rounded-lg">
            {Page}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium"> +Add Page </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto">
      <button class='bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900' on:click={saveNote}> Save </button>
      <button class='bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900 ml-2' on:click={deleteNote}> Delete </button>
    </div>
    <hr/>
  </div>
  <textarea class='mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5' bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: wheat;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>