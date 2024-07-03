<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let Pages = [];
  let CurrentPageIndex = 0;

  let title = '';
  let note = '';
  let db;

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes');
      }
    });
  }

  onMount(async () => {
    await initDB();
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    Pages = await store.getAll();
    if (Pages.length > 0) {
      title = Pages[CurrentPageIndex].title;
      note = await db.get('notes', title);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const page = Pages[CurrentPageIndex];
    if (page.title !== title) {
      await db.delete('notes', page.title);
      page.title = title;
      await db.put('pages', page);
    }
    await db.put('notes', note, title);
  }

  async function addPage() {
    const newPage = { title: 'New Page' };
    const id = await db.add('pages', newPage);
    newPage.id = id;
    Pages.push(newPage);
    selectPage(Pages.length - 1);
  }

  async function selectPage(index) {
    CurrentPageIndex = index;
    title = Pages[index].title;
    note = await db.get('notes', title);
  }

  async function deletePage(index) {
    const pageToDelete = Pages[index];
    Pages.splice(index, 1);
    await db.delete('notes', pageToDelete.title);
    await db.delete('pages', pageToDelete.id);
    if (Pages.length === 0) {
      addPage();
    } else {
      selectPage(index > 0 ? index - 1 : 0);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-3">
      {#each Pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == CurrentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page.title}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="mt-auto bg-gray-800 text-white px-5 py-2.5 font-medium rounded-lg" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-pink-50 border border-black-300 rounded-lg text-black-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
