<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      },
    });

    const allNotes = await db.getAll('notes');
    pages = allNotes.map(note => note.title);

    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      const oldNote = await db.getFromIndex('notes', 'title', storedPageName);
      if (oldNote) {
        await db.delete('notes', oldNote.id);
      }
    }

    const existingNote = await db.getFromIndex('notes', 'title', title);
    if (existingNote) {
      existingNote.content = note;
      await db.put('notes', existingNote);
    } else {
      await db.add('notes', { title, content: note });
    }

    pages[currentPageIndex] = title;
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    const noteToDelete = await db.getFromIndex('notes', 'title', storedPageName);
    if (noteToDelete) {
      await db.delete('notes', noteToDelete.id);
    }

    pages.splice(currentPageIndex, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }

  function addPage() {
    pages.push("New Note");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.getFromIndex('notes', 'title', title);
    note = noteData ? noteData.content : "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
          <button on:click={() => { currentPageIndex = index; deleteNote(); }} class="text-red-500 ml-2">Delete</button>
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
    <div class="ml-auto flex gap-2">
      <button type="button" class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr/>
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
