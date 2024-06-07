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
      title = pages[currentPageIndex] || "New Page";
      note = localStorage.getItem(title);
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
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-black-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class={`${index == currentPageIndex ? "font-bold " : ""}py-2 px-3 text-gray-900 rounded-lg`}>{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-800">Delete</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">Add Page +</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button 
      class="ml-auto bg-gray-800 text-white px-5 py-3 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" 
      on:click={saveNote}
    >Save</button>
    <hr>
  </div>
  <textarea 
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-3" 
    bind:value={note}
  ></textarea>
</main>

<style>
  :global(*) {
    background-image: url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdyYWRpZW50fGVufDB8fDB8fHww');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
  }
</style>
