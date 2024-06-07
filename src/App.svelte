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
    selectPage(pages.length - 1);
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
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(Math.min(index, pages.length - 1));
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-4 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center justify-between">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-gray' : ''} py-2 px-3 text-white rounded-lg">{page}</button>
        <button on:click={() => deletePage(index)} class="bg-red-500 text-white py-1 px-2 ml-2 rounded-lg">X</button>
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
    <button class="ml-auto bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium mt-3 hover:bg-gray-700 ml-5" on:click={saveNote}>Save</button>
  </div>

  <hr/>
  <input class="block w-full bg-gray-100 border border-gray-900 rounded-lg p-2.5 mt-5 ml-5 mr-5" bind:value={title} type="text" placeholder="Add title">
  <textarea class="block w-full bg-gray-100 border border-gray-900 rounded-lg p-2.5 mt-5 ml-5 mr-5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: rgb(177, 175, 175);
  }

  .bg-gray {
    background: gray;
  }
</style>