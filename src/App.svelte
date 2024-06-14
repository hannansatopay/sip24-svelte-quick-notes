<script>
  import { onMount } from 'svelte';
  import { getAllNotes, addNote, updateNote, deleteNoteById } from './indexedDB';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let noteId = null;

  onMount(async () => {
    const savedPages = await getAllNotes();
    if (savedPages.length > 0) {
      pages = savedPages;
      selectPage(0);
    } else {
      await addPage();
    }
  });

  async function saveNote() {
    const currentNote = pages[currentPageIndex];
    if (currentNote.title !== title) {
      await deleteNoteById(currentNote.id);
      pages[currentPageIndex] = { title, note };
    } else {
      pages[currentPageIndex].note = note;
    }
    await updateNote({
      id: currentNote.id,
      title,
      note
    });
  }

  async function addPage() {
    const newNote = { title: 'New page', note: '' };
    const id = await addNote(newNote);
    newNote.id = id;
    pages.push(newNote);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
    noteId = pages[currentPageIndex].id;
  }

  async function deletePage(index) {
    if (pages.length > 1) { 
    const pageToDelete = pages[currentPageIndex];
    pages.splice(currentPageIndex, 1); 
    localStorage.removeItem(pageToDelete); 
    localStorage.setItem("pages", JSON.stringify(pages)); 
    if (currentPageIndex >= pages.length) {
      selectPage(pages.length - 1); 
    } else {
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
  }
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-green overflow-y-auto py-5 px-3 h-full border-r border-green-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-green' : ''} py-2 px-3 text-green-900 rounded-lg">{page.title}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      <li class="text-center"><button on:click={deletePage} class="font-medium">- Delete page</button></li>
    </ul>
  </div>
</aside>

<main class="bg-main p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-green-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-green {
    background: #D8EFD3;
  }

  .bg-dark-green {
    background: #95D2B3;
  }

  .bg-main{
    background: #F1F8E8;
  }
</style>
