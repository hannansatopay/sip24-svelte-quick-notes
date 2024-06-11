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
      note = localStorage.getItem(title) || '';
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

  function deletePage(index) {
    const pageTitle = pages[index];
    localStorage.removeItem(pageTitle);
    pages.splice(index, 1);
    localStorage.setItem("pages", JSON.stringify(pages));
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === 0 ? 0 : index - 1);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200 shadow-md">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center justify-between">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray text-white' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow text-left hover:bg-gray-200 transition duration-300">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-800 delete-button transition duration-300">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-blue-600 hover:text-blue-800 transition duration-300">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <!-- svelte-ignore a11y-missing-content -->
    <h1 class="text-3xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300" contenteditable bind:innerText={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900 transition duration-300" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300" rows="20" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #f7f7f7;
  }
  .bg-dark-gray {
    background: #4a5568;
  }
  .delete-button {
    font-weight: bold;
  }
  h1[contenteditable] {
    padding: 0.5rem;
  }
  aside button {
    transition: background-color 0.3s ease;
  }
  textarea {
    font-family: 'Roboto', sans-serif;
  }
</style>
