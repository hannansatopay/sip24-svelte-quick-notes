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
      title = pages[currentPageIndex] || 'New Page';
      note = localStorage.getItem(title) || '';
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    const newPageTitle = "New Page";
    pages.push(newPageTitle);
    selectPage(pages.length - 1);
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    if (index <= currentPageIndex && currentPageIndex > 0) {
      currentPageIndex -= 1;
    }
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex);
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 py-2 px-3 text-red-600 hover:bg-red-200 rounded-lg">Delete</button>
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
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-600" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #cec0c0;
  }
</style>
