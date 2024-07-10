<script>
  import { onMount } from "svelte";
  import db from "./database"; // Import dexie database form db.js

  let pages = []; 
  let currentPageIndex = 0; 
  let title = ""; 
  let note = ""; 

  // Function to run when the component is mounted
  onMount(async () => {
    // @ts-ignore
    pages = await db.notes.toArray(); // load all the page from db
    if (pages.length > 0) {
      selectPage(0); // first page will be selected if no page exiest
    } else {
      addPage(); // Add new page if no page exited in the first palace 
    }
  });

  // To dave current note 
  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
  }

  // For adding new pages
  async function addPage() {
    const newPage = { title: "New Page", content: "" };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1); // Select the newly added page
  }

  // Function to select a page by index
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }

  // Function to delete the current page
  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages = pages.filter((page) => page.id !== pageToDelete.id);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }

</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
      {#each pages as page, index}
        <div class="flex justify-between items-center">
          <li><button on:click={() => selectPage(index)}>{page.title}</button></li>
          <button on:click={() => deletePage()} class="text-red-500 ml-2 bg-red-500 text-white px-2 rounded-full pb-1 hover:bg-red-900">X</button>
        </div>
      {/each}
    </ul>
  </div> 
</aside>

<main class="p-4 ml-60 h-screen bg-gray-500">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #0b5775;
  }
  .bg-sideColor{
    background:#ac1d1d;
  }
</style>
