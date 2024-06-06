<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }


  //Additional task to delete the note
  //To delete the note - 1. Select the Note to be deleted.
  //                     2. Clack on the Delete button.
  //An alert box will be popped up after deleting a Note.

  function deleteNote() {
    const pageToDelete = pages[currentPageIndex];
    localStorage.removeItem(pageToDelete);
    pages.splice(currentPageIndex, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
    localStorage.setItem("pages", JSON.stringify(pages));
    alert(`The Note with the title '${pageToDelete}' has been deleted.`);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each} 
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-4">
      <button class="bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-4 hover:bg-red-800" on:click={deleteNote}>Delete</button>
      <button class="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-4 hover:bg-blue-800" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr />
  <textarea class="mt-4 block w-full bg-blue-50 border-blue-300 rounded-lg text-gray-900 p-2.5 hover:bg-blue-100" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    --tw-bg-opacity: 1;
    background-color: rgb(235 245 255 / var(--tw-bg-opacity));
  }

  .bg-dark-gray {
    background: #93b8f8;
  }
</style>
