<script>
  import {onMount} from 'svelte'
  import {Dexie} from 'dexie';

  // Database name and store name constants
  const DB_NAME = 'notepad';
  const STORE_NAME = 'pages';

  // Initialize a Dexie database instance
  const db = new Dexie(DB_NAME);

  // Define the schema for the page objects
  db.version(1).stores({
    pages: '&id, title, note',
  });

  // State variables
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  async function loadPages() {
    pages = await db.table(STORE_NAME).toArray(); // Get all pages from the store
  }

  async function savePage(title, note) {
    // Create a new page object
    const page = { id: Date.now(), title, note };

    // Add the page to the store
    await db.table(STORE_NAME).add(page);

    // Update the local state (optional)
    pages.push(page);
  }

  async function deletePage(index) {
    const pageToDelete = pages[index]; // Get the page object to be deleted

    // Delete the page from the store
    await db.table(STORE_NAME).delete(pageToDelete.id);

    // Update the local state
    pages.splice(index, 1);
  }

  async function addPage() {
    const newPage = { id: Date.now(), title: 'New Page', note: '' };
    await db.table(STORE_NAME).add(newPage);
    pages.push(newPage);
    currentPageIndex = pages.length - 1;
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const page = await db.table(STORE_NAME).get(pages[index].id);
    title = page.title;
    note = page.note;
  }

  // Call loadPages on mount
  onMount(loadPages);
//   <!-- <script>
//   import { onMount } from 'svelte';
//   import { writable } from 'svelte/store';

//   let pages = [];
//   let currentPageIndex = 0;
//   let title = '';
//   let note = '';

//   onMount(() => {
//     const savedPages = localStorage.getItem("pages");
//     if (savedPages) {
//       pages = JSON.parse(savedPages);
//       title = pages[currentPageIndex];
//       note = localStorage.getItem(title);
//     } else {
//       addPage();
//     }
//   });

//   function saveNote() {
//     const storedPageName = pages[currentPageIndex];
//     if (storedPageName != title) {
//       localStorage.removeItem(storedPageName);
//       pages[currentPageIndex] = title;
//     }
//     localStorage.setItem(title, note);
//     localStorage.setItem("pages", JSON.stringify(pages));
//   }

//   function addPage() {
//     pages.push("New Page");
//     selectPage(pages.length ? pages.length - 1 : 0);
//   }

//   function selectPage(index) {
//     currentPageIndex = index;
//     title = pages[currentPageIndex];
//     note = localStorage.getItem(title);
//   }
//   const notes = writable(JSON.parse(localStorage.getItem('pages')) || []);

//   function deletePage(index){
//     notes.update(n => {
//     n.splice(index, 1); // Remove page from array

//     // Remove corresponding note from local storage
//     const titleToDelete = pages[index];
//     localStorage.removeItem(titleToDelete);

//     return n;
//   }); -->
//   }
// </script>

<side class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 w-[70%]  text-gray-900 rounded-lg">{page}</button>
        <button class=" bg-red" on:click={()=>deletePage(index)}>&#10006;</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
  </ul>
</div>
</side>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-slate-800 hover:bg-slate-600 text-white px-5 py-2 rounded-lg font-medium text-sm mt-3 " on:click={saveNote}>Save</button>
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
