<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

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

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage() {
    const storedPageName = pages[currentPageIndex];
    localStorage.removeItem(storedPageName);
    pages.splice(currentPageIndex, 1);

    if (pages.length > 0) {
      selectPage(currentPageIndex === 0 ? 0 : currentPageIndex - 1);
    } else {
      addPage();
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <div>
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button 
            on:click={() => selectPage(index)} 
            class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            {page}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button 
          class="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200" 
          on:click={addPage}
        >
          + Add Page
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 
      class="text-2xl font-bold border-b border-gray-300 pb-1 mb-2 w-full" 
      contenteditable 
      bind:textContent={title}
    ></h1>
    <div class="ml-auto space-x-2">
      <button 
        class="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-800 transition-colors duration-200" 
        on:click={saveNote}
      >
        Save
      </button>
      <button 
        class="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-800 transition-colors duration-200" 
        on:click={deletePage}
      >
        Delete
      </button>
    </div>
  </div>
  <hr />
  <textarea 
    class="block w-full bg-gray-100 border border-gray-300 rounded-lg mb-3 p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
    bind:value={note}
  ></textarea>
</main>

<style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
  }

  .bg-light-gray {
    background: #f3f4f6;
  }

  .bg-dark-gray {
    background: #d1d5db;
  }

  .text-blue-600 {
    color: #2563eb;
  }

  .text-blue-800 {
    color: #1e40af;
  }

  .hover\:bg-gray-200:hover {
    background-color: #e5e7eb;
  }

  .hover\:text-blue-800:hover {
    color: #1e40af;
  }

  .hover\:bg-blue-800:hover {
    background-color: #1e40af;
  }

  .hover\:bg-red-800:hover {
    background-color: #991b1b;
  }

  .transition-colors {
    transition: background-color 0.2s, color 0.2s;
  }
</style>
