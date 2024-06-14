<script>
  import { onMount } from 'svelte';
  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New Page";
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
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages = [...pages, "New Page"];
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage() {
    const pageTitle = pages[currentPageIndex];
    localStorage.removeItem(pageTitle);
    pages = pages.filter((_, i) => i !== currentPageIndex);
    if (pages.length === 0) {
      addPage();
    } else if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }
    selectPage(currentPageIndex);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-200 border-r border-gray-400">
  <div class="overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-gray-500 text-white' : 'text-gray-700'} px-3 py-2 rounded-lg flex-grow">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-gray-700 hover:text-gray-900">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-gray-100">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-gray-800" contenteditable bind:textContent={title}></h1>
  </div>
  <hr class="border-gray-300" />
  <textarea class="mt-3 block w-full bg-white border border-gray-300 rounded-lg text-gray-800 p-2.5" bind:value={note}></textarea>
  <div class="flex mt-4">
    <button class="bg-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mr-3 hover:bg-green-600" on:click={saveNote}>Save</button>
    <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700" on:click={deletePage}>Delete</button>
  </div>
</main>

<style>
  .bg-gray-100 {
    background-color: #f2f2f2;
  }
  .bg-gray-200 {
    background-color: #e5e7eb;
  }
  .bg-gray-300 {
    background-color: #cbd5e0;
  }
  .bg-gray-500 {
    background-color: #718096;
  }
  .bg-gray-700 {
    background-color: #4a5568;
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .text-gray-900 {
    color: #1a202c;
  }
  .border-gray-300 {
    border-color: #d2d6dc;
  }
  .border-gray-400 {
    border-color: #cbd5e0;
  }
  .hover:bg-green-600:hover {
    background-color: #2f855a;
  }
  .hover:bg-red-700:hover {
    background-color: #c53030;
  }
</style>
