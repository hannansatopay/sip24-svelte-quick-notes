<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  let db;
  let pages = [];
  let currentpageindex = 0;
  let note = '';
  let title = '';

  function setupDatabase() {
    db = new Dexie('notesApp');
    db.version(1).stores({
      pages: 'title,note',
      meta: 'key,value'
    });
  }

  async function saveNote() {
    const storedPageName = pages[currentpageindex];
    if (storedPageName !== title) {
      await db.pages.delete(storedPageName);
      pages[currentpageindex] = title;
    }

    await db.pages.put({ title, note });
    await db.meta.put({ key: 'pages', value: pages });
  }

  async function loadPages() {
    const meta = await db.meta.get('pages');
    return meta ? meta.value : [];
  }

  async function loadNote() {
    const page = await db.pages.get(title);
    return page ? page.note : '';
  }

  onMount(async () => {
    setupDatabase();
    pages = await loadPages();

    if (pages.length > 0) {
      title = pages[currentpageindex];
      note = await loadNote();
    } else {
      addPage();
    }
  });

  function addPage() {
    pages.push('New Page');
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentpageindex = index;
    title = pages[currentpageindex];
    note = await loadNote();
  }

  async function deleteNote() {
    const storedPageName = pages[currentpageindex];
    await db.pages.delete(storedPageName);
    pages.splice(currentpageindex, 1);

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentpageindex > 0 ? currentpageindex - 1 : 0);
    }

    await db.meta.put({ key: 'pages', value: pages });
  }
</script>

<aside class="fixed top-0 left-0 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto ml-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentpageindex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-700" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>