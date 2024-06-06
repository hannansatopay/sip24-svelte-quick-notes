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
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center">
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} flex-grow py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-600">Delete</button>
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
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveCurrentNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<button on:click={deleteCurrentPage} class="fixed bottom-5 left-5 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700">
  Delete Current Page
</button>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
