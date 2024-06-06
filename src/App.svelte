<script>
  import { onMount } from 'svelte';
  import { openDatabase, getAllNotes, getNoteByTitle, saveNoteToDB, deleteNoteFromDB } from './utils/db';

  let db;
  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;

  onMount(async () => {
    db = await openDatabase();
    const notes = await getAllNotes(db);

    if (notes.length > 0) {
      pages = notes.map(n => n.title);
      title = pages[currentPageIndex];
      note = notes[currentPageIndex].content;
    } else {
      addPages();
    }
  });

  async function saveNote() {
    const currentNote = { title, content: note };
    await saveNoteToDB(db, currentNote);
    pages[currentPageIndex] = title;
  }

  function addPages() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const currentNote = await getNoteByTitle(db, title);
    note = currentNote ? currentNote.content : '';
  }

  async function deletePage(index) {
    if (pages.length > 1) {
      const pageTitle = pages[index];
      await deleteNoteFromDB(db, pageTitle);
      pages.splice(index, 1);

      if (currentPageIndex === index) {
        selectPage(index === 0 ? 0 : index - 1);
      } else if (currentPageIndex > index) {
        currentPageIndex--;
      }

      title = pages[currentPageIndex];
      const currentNote = await getNoteByTitle(db, title);
      note = currentNote ? currentNote.content : '';
    } else {
      alert("You must have at least one page.");
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class=" bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center justify-between">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow break-all">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPages} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex items-center gap-2 mb-3">
    <h1 class="text-3xl font-bold flex-1 p-2 break-all" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea bind:value={note} class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>