<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'Its a wonderful day.';

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
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Note");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const deletedPage = pages.splice(index, 1)[0];
    localStorage.removeItem(deletedPage);
    localStorage.setItem('pages', JSON.stringify(pages));
    if (index === currentPageIndex) {
      currentPageIndex = pages.length ? 0 : -1;
      title = pages[currentPageIndex] || 'New Note';
      note = localStorage.getItem(title) || '';
    } 
    else if (index < currentPageIndex) {
      currentPageIndex--;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="border-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={() => deletePage(index)} class="text-red-500 ml-2">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
