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
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deleteNote() {
    const pageToDelete = pages[currentPageIndex];
    localStorage.removeItem(pageToDelete);
    pages.splice(currentPageIndex, 1);

    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0;
      title = pages[currentPageIndex];
      note = localStorage.getItem(title) || '';
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-blue-200 rounded-lg">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-blue' : ''} py-2 px-3 text-blue-970 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-blue-900">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold text-blue-800" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex gap-2">
      <button class="bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-blue-50 border border-blue-300 rounded-lg text-blue-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-blue {
    background: #D9E9FA;
  }
  .bg-dark-blue {
    background: #A7C7E7;
  }
</style>
