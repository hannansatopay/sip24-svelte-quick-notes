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
    if (storedPageName !== title) {
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
    note = localStorage.getItem(title);
  }

  function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    localStorage.removeItem(pageToDelete);
    pages.splice(currentPageIndex, 1);

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex === pages.length ? currentPageIndex - 1 : currentPageIndex);
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function duplicatePage() {
    const newTitle = `${title} (Copy)`;
    let counter = 1;
    let uniqueTitle = newTitle;

    while (pages.includes(uniqueTitle)) {
      uniqueTitle = `${newTitle} ${counter++}`;
    }

    pages.push(uniqueTitle);
    localStorage.setItem(uniqueTitle, note);
    localStorage.setItem("pages", JSON.stringify(pages));
    selectPage(pages.length - 1);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex space-x-2 ml-auto col-span-2 justify-end">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-yellow-500 text-white px-5 py-2.5 rounded-lg font medium text-sm" on:click={duplicatePage}>Duplicate</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm " on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }

  .bg-red-600 {
    background: #f87171;
  }

  .bg-yellow-500 {
    background: #f59e0b;
  }

</style>