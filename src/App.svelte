<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    db = await openDB('notesApp', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes');
      },
    });

    const allPages = await db.getAll('pages');
    if (allPages.length > 0) {
      pages = allPages.map(page => page.title);
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', note, title);
    await db.put('pages', { id: currentPageIndex + 1, title });
  }

  async function addPage() {
    const newPage = { title: 'New Page' };
    const id = await db.add('pages', newPage);
    pages.push(newPage.title);
    selectPage(pages.length - 1);
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.delete('notes', pageToDelete);
    await db.delete('pages', index + 1);
    pages.splice(index, 1);

    if (index === currentPageIndex) {
      selectPage(pages.length ? 0 : -1);
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }
  }

  async function selectPage(index) {
    if (index >= 0) {
      currentPageIndex = index;
      title = pages[currentPageIndex];
      note = (await db.get('notes', title)) || "";
    } else {
      title = "";
      note = "";
      currentPageIndex = -1;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} bg-dark-gray py-2 px-3 text-gray-900 rounded-lg flex-grow">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-600">X</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <hr/>
  </div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder="Add Text"></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
