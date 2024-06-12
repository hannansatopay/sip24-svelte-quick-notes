<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let showConfirmation = false;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(currentPageIndex);
    } else {
      addPage();
    }
  });

  function saveNote() {
    if (!title.trim()) {
      showMessage("Title cannot be empty.");
      return;
    }

    localStorage.setItem(title, note);
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
      localStorage.setItem("pages", JSON.stringify(pages));
    }
    showMessage("Note saved successfully!");
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage(index) {
    showConfirmation = true;
  }

  function confirmDelete() {
    const pageTitle = pages[currentPageIndex];
    pages.splice(currentPageIndex, 1);
    localStorage.removeItem(pageTitle);
    localStorage.setItem("pages", JSON.stringify(pages));
    showConfirmation = false;
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(Math.min(currentPageIndex, pages.length - 1));
    }
    showMessage("Page deleted successfully!");
  }

  function cancelDelete() {
    showConfirmation = false;
  }

  function showMessage(message) {
    console.log(message);
  }
</script>

      <!-- Still reading carefully?? -->

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
  <div class="h-full flex flex-col justify-between">
    <div>
      <div class="bg-gray-800 p-4">
        <h2 class="text-white text-lg font-bold mb-4">Pages</h2>
        <ul class="space-y-2">
          {#each pages as page, index}
            <li class="flex items-center justify-between">
              <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-blue-600' : 'bg-indigo-600'} py-2 px-3 text-white rounded-lg flex-grow transition-colors duration-300 ease-in-out hover:bg-opacity-70">{page}</button>
              <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-800">X</button>
            </li>
          {/each}
        </ul>
      </div>
      <div class="bg-gray-700 p-4 text-center">
        <button on:click={addPage} class="font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Add page</button>
      </div>
    </div>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-gradient-to-b from-gray-800 to-gray-900">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-white" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-700" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={() => deletePage(currentPageIndex)}>Delete</button>
    </div>
  </div>
  <hr class="border-white" />
  <textarea class="mt-3 block w-full bg-gray-800 border border-gray-300 rounded-lg text-white p-2.5" bind:value={note}></textarea>
</main>

{#if showConfirmation}
  <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg">
      <p class="text-xl font-bold mb-3">Are you sure you want to delete this page?</p>
      <div class="flex justify-end">
        <button class="bg-red-600 text-white px-4 py-2 rounded-lg mr-3" on:click={confirmDelete}>Delete</button>
        <button class="bg-gray-700 text-white px-4 py-2 rounded-lg" on:click={cancelDelete}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  hr {
    border-color: rgba(255, 255, 255, 0.2);
  }
    /* IS SOMEONE ACTUALLY READING THIS? HUHHH!! */
  

  button.transition-colors:hover {
    transition: background-color 0.3s ease;
  }
</style>
