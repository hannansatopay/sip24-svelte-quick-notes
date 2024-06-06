<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageindex = 0;
  let title = '';
  let content = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        title = pages[currentPageindex];
        content = localStorage.getItem(title);
      }
    } else {
      addpage();
    }
  });

  function savenote() {
    const storedPageName = pages[currentPageindex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageindex] = title;
    }
    localStorage.setItem(title, content);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addpage() {
    pages.push("New Page");
    selectpage(pages.length ? pages.length - 1 : 0);
  }

  function selectpage(index) {
    currentPageindex = index;
    title = pages[currentPageindex];
    content = localStorage.getItem(title);
  }
  //Deletion of the page - Pradnya Sabannavar
  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    
    if (currentPageindex === index) {
      if (pages.length > 0) {
        currentPageindex = index > 0 ? index - 1 : 0;
        selectpage(currentPageindex);
      } else {
        title = '';
        content = '';
        currentPageindex = 0;
      }
    } else if (currentPageindex > index) {
      currentPageindex--;
    }
    
    localStorage.setItem('pages', JSON.stringify(pages));
  }

</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-50 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectpage(index)} class="{index == currentPageindex ? 'bg-slight-yellow' : ''} py-2 px-3 text-orange-900 rounded-lg flex-grow">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-600 ml-2">&times;</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addpage} class="font-medium">+ Add New Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-4 bg-yellow-100 px-4 py-2 font-medium text-sm rounded-lg hover:bg-yellow-200" on:click={savenote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-4 block w-full bg-pink-50 border border-pink-300 rounded-lg text-pink-900 p-2.5" bind:value={content}></textarea>
</main>

<style>
  .bg-slight-yellow {
    background: #ffebd8;
  }
</style>
