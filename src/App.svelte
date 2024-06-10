<script>
  import { onMount } from 'svelte';
  import { getNotes, getNoteByTitle, saveNote, deleteNoteByTitle } from './db.js';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await getNotes();
    if (pages.length > 0) {
      currentPageIndex = 0;
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].note;
    } else {
      addPage();
    }
  });

  async function saveCurrentNote() {
    const storedPageName = pages[currentPageIndex].title;
    if (storedPageName !== title) {
      await deleteNoteByTitle(storedPageName);
      pages[currentPageIndex].title = title;
    }
    pages[currentPageIndex].note = note;
    await saveNote({
      title: title,
      note: note
    });
  }

  function addPage() {
    pages.push({ title: 'New Page', note: '' });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedNote = pages[currentPageIndex];
    title = selectedNote.title;
    note = selectedNote.note;
  }

  async function deletePage(index) {
    if (index === 0) {
      addPage();
    }
    const pageTitle = pages[index].title;
    await deleteNoteByTitle(pageTitle);
    pages.splice(index, 1);

    if (pages.length === 0) {
      addPage();
    } else {
      if (index === currentPageIndex) {
        currentPageIndex = Math.max(index - 1, 0);
      }
      selectPage(currentPageIndex);
    }
  }

  function deleteCurrentPage() {
    deletePage(currentPageIndex);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-beige overflow-y-auto py-5 px-3 h-full border-r border-beige-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center">
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-beige' : ''} flex-grow py-2 px-3 text-purple-900 rounded-lg text-left">{page.title}</button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-purple-800 hover:text-purple-600">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="text-6xl text-purple-900"><h1><strong>Notes</strong><br><br></h1></div>
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button on:click={deleteCurrentPage} class="bg-purple-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-purple-800">
        Delete
      </button>
      <button class="bg-purple-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-purple-900  height" on:click={saveCurrentNote}>
        Save
      </button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-beige-50 border border-beige-300 rounded-lg text-purple-900 p-2.5 s-XsEmFtvddWTw" bind:value={note}></textarea>
</main>

<style>
  .bg-light-beige {
    background: #c4a4e5a2;
  }

  .bg-dark-beige {
    background: #fdf1b5;
  }

  .bg-beige-50 {
    background: #FAF0E6;
  }

  .border-beige-200 {
    border-color: #E6E6FA;
  }

  .text-purple-900 {
    color: #4B0082;
  }


  .bg-purple-800 {
    background: #800080;
  }

  .bg-purple-900 {
    background: #4B0082;
  }


  .border-beige-300 {
    border-color: #D8BFD8;
  }

  .hover\:text-purple-600:hover {
    color: #9370DB;
  }
</style>
