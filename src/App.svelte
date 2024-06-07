<script>
  import { onMount } from 'svelte';

  let Page = [];
  let currentpageIndex = 0;
  let title = 'New Note';
  let note = 'Today is an excellent day';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      Page = JSON.parse(savedPages);
      title = Page[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = Page[currentpageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      Page[currentpageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(Page));
  }

  function addPage() {
    Page.push("New Page");
    selectPage(Page.length ? Page.length - 1 : 0);
  }

  function selectPage(index) {
    currentpageIndex = index;
    title = Page[currentpageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageToDelete = Page[index];
    localStorage.removeItem(pageToDelete);
    Page.splice(index, 1);
    if (index === currentpageIndex) {
      currentpageIndex = Page.length ? 0 : -1;
    }
    if (Page.length) {
      title = Page[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      title = 'New Note';
      note = 'Today is an excellent day';
    }
    localStorage.setItem("pages", JSON.stringify(Page));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each Page as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentpageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #fbfbfb;
  }
  .bg-dark-gray {
    background-color: #efefef;
  }
</style>
