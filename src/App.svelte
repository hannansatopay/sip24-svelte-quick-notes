<script>
 

  import { onMount } from 'svelte';
  import { openDB } from 'idb'; 

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
 
  async function loadPages() {
    const db = await openDB('noteDB', 1, {
      upgrade(db) {
        const store = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      }
    });

    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');

    let cursorRequest = store.openCursor();
    pages = [];
    while (cursorRequest) {
      let cursor = await cursorRequest;
      if (!cursor) break;
      pages.push(cursor.value);
      cursorRequest = await cursor.continue(); 
    }

    await tx.done;
  }

  onMount(async () => {
    await loadPages();
    selectPage(0); // Select the first page
  });

  async function saveNote() {
    const db = await openDB('noteDB', 1);
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');

    pages[currentPageIndex].title = title;
    pages[currentPageIndex].note = note;
    await store.put(pages[currentPageIndex]);

    console.log('Note saved successfully');
  }

  async function deletePage(index) {
    const db = await openDB('noteDB', 1);
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');

    await store.delete(pages[index].id);
    pages.splice(index, 1);

    if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }

    console.log('Page deleted successfully');
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function addPage() {
    const db = await openDB('noteDB', 1);
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');

    const newPage = { title: 'New Page', note: '' };
    const id = await store.add(newPage);

    await loadPages(); // Reload pages after adding a new page
    selectPage(pages.findIndex(page => page.id === id)); // Select the newly added page
    console.log('Page added successfully');
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-200 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="space-y-2 space-x-2">
        <button class="{index === currentPageIndex ? 'bg-gray-600' : 'bg-gray-400'} text-white py-2 px-3 rounded-lg hover:bg-slate-500" on:click={() => selectPage(index)}>{index + 1 + ". " + page.title || "New Page"}</button>
        <button class="bg-red-600 rounded-md py-2 px-3 w-4 hover:bg-red-700" on:click={() => deletePage(index)}>Del</button>
      </li>
      {/each}
      <li class="text-center">
        <button class="font-medium bg-blue-500 text-white px-5 py-2 rounded-lg w-auto hover:bg-blue-600" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable="true" bind:textContent={title}>{title || "New Page"}</h1>
    <button class="bg-red-200 px-5 py-2.5 rounded-2xl w-auto hover:bg-red-300" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class=" mt-3 block w-full bg-gray-50 border border-gray-300 rounded-md text-gray-900 p-2.5 selection:bg-green-400 selection:text-black" bind:value={note}></textarea>
</main>

<style>

</style>
