<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Initialize Dexie and create the database schema
  const db = new Dexie('notesDB');
  db.version(1).stores({
    notes: '++id, title, content'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'Today is an Excellent Day';

  onMount(async () => {
    const savedPages = await db.notes.toArray();
    if (savedPages.length) {
      pages = savedPages;
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const currentNote = pages[currentPageIndex];
    if (currentNote.title !== title) {
      await db.notes.delete(currentNote.id);
      pages[currentPageIndex].title = title;
    }

    await db.notes.put({ id: currentNote.id, title, content: note });
    pages[currentPageIndex].content = note;
  }

  async function addPage() {
    const newPage = { title: 'New Page', content: '' };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }

  async function deletePage(index) {
    const id = pages[index].id;
    await db.notes.delete(id);
    pages.splice(index, 1);
    if (currentPageIndex === pages.length) {
      selectPage(currentPageIndex - 1);
    }
  }

  async function deleteAllPages() {
    await db.notes.clear();
    pages = [];
    currentPageIndex = 0;
    title = 'New Note';
    note = 'Today is an Excellent Day';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-64 h-full bg-gray-200 overflow-y-auto">
  <div class="py-5 px-4 h-full border-r border-gray-300">
    <ul class="space-y-3">
      {#each pages as page, index}
        <li>
          <button 
            on:click={() => selectPage(index)} 
            class="{index === currentPageIndex ? 'bg-gray-400 text-black' : 'text-black'} w-full py-2 px-4 text-left rounded-lg hover:bg-gray-300 transition duration-200">
            {page.title}
          </button>
          <button on:click={() => deletePage(index)} class="text-sm text-red-500 hover:text-red-700">Delete</button>
        </li>
      {/each}
      <li class="text-center mt-4">
        <button on:click={addPage} class="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition duration-200">+ Add page</button>
      </li>
      <li class="text-center mt-2">
        <button on:click={deleteAllPages} class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">Delete All Pages</button>
      </li>
    </ul>
  </div>
</aside>

<main class="ml-64 p-6 h-auto">
  <div class="grid grid-cols-3 items-center mb-6">
    <h1 class="text-3xl font-bold col-span-2" contenteditable bind:textContent={title}></h1>
    <button 
      class="bg-black text-white px-6 py-3 rounded-lg font-medium text-base hover:bg-gray-800 transition duration-200" 
      on:click={saveNote}>
      Save
    </button>
  </div>
  <hr class="mb-6"/>
  <textarea 
    class="block w-full bg-white border border-gray-300 rounded-lg text-black p-3" 
    rows="10"
    bind:value={note}></textarea>
</main>

<style>
  button:focus { outline: none; }
</style>
