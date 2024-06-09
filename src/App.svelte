<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;  
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      }
    });

    const allNotes = await db.getAll('notes');
    pages = allNotes.map(note => note.title);

    if (pages.length) {
      title = pages[currentPageIndex];
      note = await db.get('notes', title);
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
    await db.put('notes', { title, note });
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.note : '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    pages.splice(index, 1);
    await db.delete('notes', pageToDelete);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === pages.length ? index - 1 : index);
    }
  }
</script>

<main>
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-grey-200">
      <ul class="space-y-2">
        {#each pages as page, index}
          <li class="flex items-center justify-between">
            <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow text-left">
              {page}
            </button>
            <button on:click={() => deletePage(index)} class="ml-2 text-red-600">Delete</button>
          </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium">+ Add page</button>
        </li>
      </ul>
    </div>
  </aside>

  <section class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable="true" on:input={(e) => title = e.target.textContent}>
        {title}
      </h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>
        Save
      </button>
    </div>
    <hr/>
    <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </section>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
  .text-left {
    text-align: left;
  }
</style>
