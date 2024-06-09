<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'Good day';
  let search = '';

  onMount(async () => {
    // Open the IndexedDB database
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        // Create an object store named 'notes'
        db.createObjectStore('notes');
      }
    });

    // Load pages from IndexedDB
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const savedPages = await store.get('pages');

    if (savedPages) {
      pages = savedPages;
      if (pages.length > 0) {
        title = pages[currentPageIndex];
        note = await store.get(title);
      }
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.transaction('notes', 'readwrite').objectStore('notes').delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.transaction('notes', 'readwrite').objectStore('notes').put(note, title);
    await db.transaction('notes', 'readwrite').objectStore('notes').put(pages, 'pages');
  }

  async function addPage() {
    pages.push("New Note");
    await selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.transaction('notes').objectStore('notes').get(title);
    note = noteData || '';
  }

  async function deleteNote() {
    const noteToDelete = pages[currentPageIndex];
    await db.transaction('notes', 'readwrite').objectStore('notes').delete(noteToDelete);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      await selectPage(0);
    } else {
      title = '';
      note = '';
      currentPageIndex = 0;
    }
    await db.transaction('notes', 'readwrite').objectStore('notes').put(pages, 'pages');
  }

  async function clearNotes() {
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');

    pages.forEach(async page => {
      await store.delete(page);
    });

    pages = [];
    title = '';
    note = '';
    currentPageIndex = 0;

    await store.delete('pages');
  }
</script>

<nav class="bg-blue-900 text-white py-3 px-6 flex items-center w-full z-50" style="z-index:100;">
  <img src="/notes.png" alt="App Icon" class="h-8 w-8 mr-2">
  <h1 class="text-2xl font-bold">Quick Notes</h1>
  <input class="flex-grow p-2 rounded-lg ml-10 text-black" type="text" placeholder="Search notes" bind:value={search}>
</nav>


<aside class="fixed top-15 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue flex flex-col overflow-y-auto py-5 px-5 h-full border-r border-gray-500">
    <ul class="space-y-2 flex-grow">
      {#each pages as page, index (page)}
        {#if page.includes(search)}
          <li>
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-blue' : ''} font-medium bg-blue-300 py-2 px-4 rounded-lg">{page}</button>
          </li>
        {/if}
      {/each}
      <li class="text-center text-white"><button on:click={addPage} class="font-medium">+ Add Note</button></li>
    </ul>
    <div class="mt-500 pt-2" style="position: absolute; top: 500px;">
      <button class="bg-red-500 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-red-700 w-full" on:click={clearNotes}>Delete all Notes</button>
    </div>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold col-span-2" contenteditable bind:textContent={title}></h1>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-blue-500 border border-gray-300 rounded-lg text-white p-300" style="height: 200px;" bind:value={note}></textarea>
  <div class="ml-auto flex space-x-2">
    <button class="bg-blue-900 mt-5 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-blue-500" on:click={saveNote}>Save</button>
    <button class="bg-red-500 mt-5 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-red-700" on:click={deleteNote}>Delete</button>
  </div>

  
<img id="homeImage" src="home.jpg" alt="Home">
</main>


<style>
  main {
  position: relative;
  }
  .bg-light-blue {
    background-color:#5dbf7e;
  }
  .bg-dark-blue {
    background-color: rgb(105, 219, 192);
  }
  #homeImage {
  position: absolute;
  right: 0;
  height: 230px;
  width: 500px;
}

</style>

