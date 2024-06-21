<script lang="ts">
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Import Table type using type-only import
  import type { Table } from 'dexie';

  // Define the structure of a Page
  interface Page {
    id?: number;
    title: string;
    note: string;
  }

  // Extend Dexie to include the schema
  class MyDatabase extends Dexie {
    pages!: Table<Page, number>; // Use ! to assert non-null

    constructor() {
      super('myDatabase');
      this.version(1).stores({
        pages: '++id, title, note'
      });
      this.pages = this.table('pages'); // Initialize pages table
    }
  }

  // Create an instance of the database
  const db = new MyDatabase();

  let pages: Page[] = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function loadPages() {
    pages = await db.pages.toArray();
    if (pages.length === 0) {
      await addPage();
    } else {
      selectPage(0);
    }
  }

  onMount(loadPages);

  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    currentPage.title = title;
    currentPage.note = note;
    await db.pages.put(currentPage);
    pages[currentPageIndex] = currentPage;
  }

  async function addPage() {
    const newPage: Page = { title: "New Page", note: "" };
    const newPageId = await db.pages.add(newPage);
    newPage.id = newPageId;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function deletePage() {
    if (pages.length > 1) {
      await db.pages.delete(pages[currentPageIndex].id);
      pages.splice(currentPageIndex, 1);
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      if (pages.length > 0) {
        selectPage(currentPageIndex);
      } else {
        await addPage(); // Ensure at least one page exists
      }
    } else {
      alert("At least one page must be present.");
    }
  }

  function selectPage(index: number) {
    if (pages.length > 0) {
      currentPageIndex = index;
      const selectedPage = pages[currentPageIndex];
      title = selectedPage.title;
      note = selectedPage.note;
    } else {
      title = '';
      note = '';
    }
  }
</script>

<aside class="fixed top-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index (page.id)}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold col-span-2" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex gap-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-600" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
