<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Initialize Dexie and create a database schema
  const db = new Dexie('notesDatabase');
  db.version(1).stores({
    notes: '++id,title,note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  // Load all notes from the database on component mount
  onMount(async () => {
    try {
      const savedPages = await db.notes.toArray();
      if (savedPages.length > 0) {
        pages = savedPages;
        selectPage(0);
      } else {
        await addPage();
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  });

  async function saveNote() {
    try {
      const currentNote = pages[currentPageIndex];
      if (currentNote.title !== title || currentNote.note !== note) {
        await db.notes.update(currentNote.id, { title, note });
        pages[currentPageIndex] = { ...currentNote, title, note };
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }

  async function addPage() {
    try {
      const id = await db.notes.add({ title: 'New Page', note: '' });
      const newPage = { id, title: 'New Page', note: '' };
      pages = [...pages, newPage];
      selectPage(pages.length - 1);
    } catch (error) {
      console.error('Failed to add page:', error);
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex]?.title || '';
    note = pages[currentPageIndex]?.note || '';
  }

  async function deleteNote() {
    try {
      const noteId = pages[currentPageIndex].id;
      await db.notes.delete(noteId);
      pages = pages.filter((_, idx) => idx !== currentPageIndex);

      if (pages.length === 0) {
        await addPage();
      } else {
        currentPageIndex = Math.max(currentPageIndex - 1, 0);
        selectPage(currentPageIndex);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={addPage} class="font-medium">+Add Page</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3"> 
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex ml-auto space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deleteNote}>Delete</button>
    </div>
  </div> 
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #f8f8f8;
  }
  .bg-dark-gray {
    background: #fefefe;
  }
</style>
