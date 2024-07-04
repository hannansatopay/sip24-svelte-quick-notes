<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = " ";
  let note = " ";

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
    const storePageName = pages[currentPageIndex];
    if (storePageName != title) {
      localStorage.removeItem(storePageName);
      pages[currentPageIndex] = title;
    }

    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);

    if (pages.length === 0) {
      addPage();
    } else if (currentPageIndex >= pages.length) {
      selectPage(pages.length - 1);
    } else {
      selectPage(currentPageIndex);
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-400">
    <ul class="space-y-3">
      {#each JSON.stringify(pages) as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-black-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="bg-red-500 text-white px-2 py-1 rounded-lg ml-2">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium mt-4">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-4">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-6 py-3 rounded-lg font-medium text-sm mt-4 hover:bg-orange-500" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-pink-100 border border-black-300 rounded-lg text-black-900 p-2.5 font-medium" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #abf5a8;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
