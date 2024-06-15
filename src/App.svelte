<script lang="ts">
  import { onMount } from 'svelte';

  let pages = []; // Initialize as an array
  let currentpageindex = 0;
  let title = 'New Note';
  let note = 'Today is an excellent day';

  onMount(() => {
    const savedPages = localStorage.getItem('pages');
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentpageindex] || "new page";
      note = localStorage.getItem(title) || '';
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentpageindex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentpageindex] = title;
    }
    
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New page");
    selectPage(pages.length - 1);
    saveNote();
  }

  function deletePage(index) {
    const deletedPage = pages.splice(index, 1)[0];
    localStorage.removeItem(deletedPage);
    if (index === currentpageindex) {
      if (pages.length === 0) {
        addPage();
      } else {
        currentpageindex = index > 0 ? index - 1 : 0;
        selectPage(currentpageindex);
      }
    } else if (index < currentpageindex) {
      currentpageindex--;
    }
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function selectPage(index) {
    currentpageindex = index;
    title = pages[currentpageindex];
    note = localStorage.getItem(title) || '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button on:click={() => selectPage(index)} class="{index === currentpageindex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-1">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-800">X</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
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

  .text-red-600 {
    color: #DC2626;
  }

  .hover\:text-red-800:hover {
    color: #9B2C2C;
  }
</style>
