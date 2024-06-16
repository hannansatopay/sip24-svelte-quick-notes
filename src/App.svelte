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
  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    if (pages.length > 0) {
      selectPage(index === 0 ? 0 : index - 1);
    } else {
      addPage();
      selectPage(0);
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function deleteCurrentPage() {
    deletePage(currentPageIndex);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-100 border-r border-gray-300">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={()=>deletePage(index)} class="ml-2 text-red-500">&times;</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-3xl font-bold flex-grow" contenteditable bind:textContent={title}></h1>
    <button class=" bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 ml-4 hover:bg-red-700" on:click={deleteCurrentPage}>Delete</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray {
  background: #FBFBFB;
}

.bg-dark-gray {
  background: #EFEFEF;
}
</style>