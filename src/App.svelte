<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'Good day';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        title = pages[currentPageIndex];
        note = localStorage.getItem(title);
      }
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

  function deleteNote() {
    const noteToDelete = pages[currentPageIndex];
    localStorage.removeItem(noteToDelete);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      selectPage(0);
    } else {
      title = '';
      note = '';
      currentPageIndex = 0;
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function clearNotes() {
    pages.forEach(page => {
      localStorage.removeItem(page);
    });
    pages = [];
    title = '';
    note = '';
    currentPageIndex = 0;
    localStorage.removeItem("pages");
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-gray-500">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-blue' : ''} font-medium bg-blue-300 py-2 px-4 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold col-span-2" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-blue-900 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-blue-500" on:click={saveNote}>Save</button>
      <button class="bg-red-500 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-red-700" on:click={deleteNote}>Delete</button>
      <button class="bg-red-500 rounded-lg text-white text-small font-medium px-5 py-2 hover:bg-red-700"><button on:click={clearNotes}>Clear all Notes</button>
    </div>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-blue-500 border border-gray-300 rounded-lg text-white p-3" bind:value={note}></textarea>
</main>

<style>
  .bg-light-blue {
    background-color: rgb(82, 144, 239);
  }
  .bg-dark-blue {
    background-color: rgb(7, 35, 77);
  }
</style>
