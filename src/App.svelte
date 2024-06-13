<script>
  import { onMount } from "svelte";
  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  onMount(async () => {
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
    pages.push("New page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function deletePage() {
    localStorage.removeItem(pages[currentPageIndex]);
    const index = pages.indexOf(pages[currentPageIndex]);
    if (index > -1) {
      pages.splice(index, 1);
    }
    pages = pages;
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-64 h-screen bg-light-grey overflow-y-auto py-5 px-3 border-r border-gray-200 shadow-lg">
  <div class="space-y-2">
    {#each pages as page, index}
      <button
        on:click={() => selectPage(index)}
        class="w-full text-left py-2 px-3 rounded-lg transition-colors duration-200 
          {index == currentPageIndex ? 'bg-dark-grey text-white shadow-md' : 'hover:bg-gray-300 text-gray-900'}"
      >
        {page}
      </button>
    {/each}
    <div class="text-center mt-4 space-y-2">
      <button
        class="w-full font-medium bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 rounded-lg px-5 py-2 transition-colors duration-200 shadow-md"
        on:click={addPage}
      >
        + Add page
      </button>
      <button
        class="w-full font-medium bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 rounded-lg px-5 py-2 transition-colors duration-200 shadow-md"
        on:click={deletePage}
      >
        Delete page
      </button>
    </div>
  </div>
</aside>

<main class="p-8 ml-64">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-4xl font-bold text-gray-900" contenteditable bind:textContent={title}></h1>
    <button
      class="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 hover:from-green-500 hover:to-green-700 shadow-md"
      on:click={saveNote}
    >
      Save
    </button>
  </div>
  <hr class="mb-4 border-gray-300" />
  <textarea
    class="w-full h-96 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-4 resize-none shadow-inner"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-grey {
    background: #f3f4f6;
  }
  .bg-dark-grey {
    background: #04306e;
  }
</style>
