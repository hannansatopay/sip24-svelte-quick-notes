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
    note = localStorage.getItem(title);
  }
</script>

<div class="flex h-screen">
  <aside class="bg-blue-900 w-60 p-4 overflow-y-auto">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-blue-800' : 'bg-blue-700'} py-2 px-3 text-white rounded-lg w-full">{page}</button>
      </li>
      {/each}
      <li><button on:click={addPage} class="bg-blue-600 text-white py-2 px-4 rounded-lg w-full">+ Add page</button></li>
    </ul>
  </aside>

  <main class="flex-1 p-4">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-4" contenteditable bind:textContent={title}></h1>
      <button class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mr-3 hover:bg-blue-700" on:click={saveNote}>Save</button>
    </div>
    <hr class="mb-6"/>
    <textarea class="block w-full bg-blue-100 border border-blue-300 rounded-lg text-blue-800 p-2.5" rows="10" bind:value={note}></textarea>
  </main>
</div>

<style>
  
</style>
