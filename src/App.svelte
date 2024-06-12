<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Define a custom Dexie class
  class NotesDB extends Dexie {
    notes;
    pages;

    constructor() {
      super('notesDB');
      this.version(1).stores({
        notes: 'title, content',
        pages: '++id, title'
      });
      this.notes = this.table('notes');
      this.pages = this.table('pages');
    }
  }

  let db = new NotesDB();
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      note = (await db.notes.get(title))?.content || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, content: note });
    if (!pages.includes(title)) {
      await db.pages.add({ title });
    }
  }

  async function addPage() {
    const newPageTitle = `New Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    await db.pages.add({ title: newPageTitle });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.notes.get(title))?.content || '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    await db.notes.delete(pageTitle);
    await db.pages.where("title").equals(pageTitle).delete();
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(Math.max(0, index - 1));
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow text-left">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-600">&times;</button>
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
  <hr/>
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
