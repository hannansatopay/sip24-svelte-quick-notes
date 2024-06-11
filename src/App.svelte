<script>
  import { onMount } from 'svelte';
  import { getAllNotes, addNote, updateNote, deleteNoteById } from './AppFeatures';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let currentNoteId = null;

  onMount(async () => {
    console.log('Mounting component...');
    await loadNotes();
  });

  async function loadNotes() {
    console.log('Loading notes...');
    const savedPages = await getAllNotes();
    if (savedPages.length) {
      pages = savedPages;
      currentPageIndex = 0;
      selectPage(currentPageIndex);
    } else {
      await addNewPage();
    }
  }

  async function saveNote() {
    console.log('Saving note:', { currentNoteId, title, note });
    if (currentNoteId !== null) {
      await updateNote(currentNoteId, title, note);
      pages = await getAllNotes();
    }
  }

  async function addNewPage() {
    console.log('Adding new page');
    const id = await addNote('New Page', '');
    pages = await getAllNotes();
    currentPageIndex = pages.length - 1;
    selectPage(currentPageIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedPage = pages[currentPageIndex];
    title = selectedPage.title;
    note = selectedPage.note;
    currentNoteId = selectedPage.id;
    console.log('Selected page:', selectedPage);
  }

  async function deletePage(index) {
    const idToDelete = pages[index].id;
    console.log('Deleting page:', idToDelete);
    await deleteNoteById(idToDelete);
    pages = await getAllNotes();

    if (pages.length === 0) {
      await addNewPage();
    } else {
      currentPageIndex = index === 0 ? 0 : index - 1;
      selectPage(currentPageIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray h-full overflow-y-auto py-5 px-3 border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} font-medium py-2 px-3 text-gray-900 border rounded-lg">{page.title}</button>

          <button on:click={() => deletePage(index)} class="text-red-500 py-1 px-2 ml-2 font-medium hover:bg-red-200 transition-colors duration-200 rounded-lg">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addNewPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>


<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-3 bg-gray-800 text-white px-5 py-2.5 rounded-lg border border-gray-300 font-thin font-serif hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <div class="border-t dark:border-neutral-500 border-gray-600 my-4 border-dotted"></div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 font-serif tracking-wide" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>