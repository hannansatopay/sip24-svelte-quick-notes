<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  let db; 

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'name' });
      },
    });

    const storedPages = await db.getAll('pages');
    if (storedPages.length > 0) {
      pages = storedPages.map(page => page.name);
      title = pages[currentPageIndex];
      note = await db.get('notes', title).then(note => note ? note.content : '');
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPagename = pages[currentPageIndex];
    if (storedPagename != title) {
      await db.delete('notes', storedPagename);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, content: note });
    await db.put('pages', { name: title });
  }

  async function addPage() {
    const newTitle = 'NEWPAGE';
    pages.push(newTitle);
    await db.put('pages', { name: newTitle });
    selectPage(pages.length - 1);
  }

  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.delete('notes', pageToDelete);
    await db.delete('pages', pageToDelete);
    pages.splice(currentPageIndex, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await db.get('notes', title).then(note => note ? note.content : '');
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto w-20 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="ml-2 w-20 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
  </div>
  <hr/>
  <textarea bind:value={note} class="block w-full mt-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5"></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>
