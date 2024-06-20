<script lang="ts">
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
      note = localStorage.getItem(title) || "";
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
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function addPage() {
    pages = [...pages, "New Page"];
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || "";
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages = pages.filter((_, i) => i !== index);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === 0 ? 0 : index - 1);
    }
    localStorage.setItem('pages', JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
      {#each pages as page, index}
        <div class="flex justify-between items-center">
          <li><button on:click={() => selectPage(index)}>{page}</button></li>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2 bg-red-500 text-white px-2 rounded-full pb-1 hover:bg-red-900">X</button>
        </div>
      {/each}
    </ul>
  </div> 
</aside>

<main class="p-4 ml-60 h-screen bg-gray-500">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #0b5775;
  }
  .bg-sideColor{
    background:#ac1d1d;
  }
</style>
