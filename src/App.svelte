<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Initialize Dexie database
  const db = new Dexie('NotesDatabase');
  db.version(1).stores({
    notes: '++id, title, content'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    await loadPages();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function loadPages() {
    pages = await db.notes.toArray();
  }

  async function saveNote() {
    if (pages[currentPageIndex]) {
      const currentNote = pages[currentPageIndex];
      await db.notes.update(currentNote.id, { title, content: note });
      pages[currentPageIndex] = { ...currentNote, title, content: note };
    } else {
      const id = await db.notes.add({ title, content: note });
      pages[currentPageIndex] = { id, title, content: note };
    }
  }

  async function addPage() {
    const id = await db.notes.add({ title: 'New Page', content: '' });
    pages.push({ id, title: 'New Page', content: '' });
    selectPage(pages.length - 1);
  }

  async function deletePage(index) {
    const page = pages[index];
    await db.notes.delete(page.id);
    pages.splice(index, 1);
    if (pages.length > 0) {
      if (index <= currentPageIndex && currentPageIndex > 0) {
        selectPage(currentPageIndex - 1);
      } else if (index < pages.length) {
        selectPage(index);
      } else {
        selectPage(0);
      }
    } else {
      addPage();
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    const page = pages[currentPageIndex];
    title = page.title;
    note = page.content;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow">{page.title}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
