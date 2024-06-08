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
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.setItem(storedPageName, note);
    }
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function saveNote() {
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-50">
  <div class="bg-light-gray overflow-y-auto px-5 py-2.5 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button 
            on:click={() => selectPage(index)} 
            class ="px-5 py-2.5 rounded-lg text-gray-900 {index === currentPageIndex ? 'bg-dark-gray' : ''}">
            {page}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium hover:opacity-90 " on:click={addPage}>+ Add New Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <button 
      class="ml-auto bg-gray-800 text-white px-10 py-5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" 
      on:click={saveNote}>
      Save
    </button>
  </div>
  <hr>
  <textarea 
    class="mt-3 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: white;
  }
  .bg-dark-gray {
    background: green;
    opacity: 0.7;
    font-size: medium;
    font-style: italic;
    color: white;
  }
</style>
