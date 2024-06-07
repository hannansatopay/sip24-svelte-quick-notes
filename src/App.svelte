<script>
  import { onMount } from 'svelte';

  let pages = ["Page 1"]; // Start with one page
  let currentPageIndex = 0;
  let title = "Page 1";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(currentPageIndex);
    } else {
      localStorage.setItem('pages', JSON.stringify(pages));
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function addPage() {
    const newPageTitle = `Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    selectPage(pages.length - 1);
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }
</script>

<aside class="fixed top-0 left-8 z-40 w-60 h-screen bg-light-gray overflow-y-auto py-5 px-3 border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class={`py-2 px-3 rounded-lg ${index === currentPageIndex ? 'bg-dark-gray text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
          {page}
        </button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={addPage} class="font-medium">+ Add page</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-64">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text" placeholder='Add title'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder='Add your note here'></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3" on:click={saveNote}>Save</button>
</main>

<style>
  .bg-light-gray { background-color: #f5f5f5; }
  .bg-dark-gray { background-color: #333; }
  .bg-gray-200 { background-color: #e5e5e5; }
  .text-gray-700 { color: #4a4a4a; }
</style>
