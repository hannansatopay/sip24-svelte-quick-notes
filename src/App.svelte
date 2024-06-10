<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem('pages');
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } 
    else {
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

  function deletePage(index) {
    const pageToDelete = pages[index];
    pages.splice(index, 1);
    localStorage.removeItem(pageToDelete);
    localStorage.setItem("pages", JSON.stringify(pages));
    if (pages.length === 0) {
      addPage();
    } else if (currentPageIndex === index) {
      selectPage(Math.max(0, currentPageIndex - 1));
    }
  }


  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class = "fixed top-0 left-0 z-40 w-60 h-screen">
  <div class = "bg-light-gray overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ?  'bg-dark-gray' : ''} px-2 py-3 rounded-lg hover:bg-white">{page}</button>  
          <button on:click={()=>deletePage(index)} class="{index == currentPageIndex ?  'bg-dark-gray' : ''} px-3 py-3 rounded-lg hover:bg-white">Delete</button>
      </li>
      {/each}
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-screen bg-orange-400 flex flex-col">
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 class="text-4xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex justify-end">
      <button on:click={addPage} class="font-medium ml-auto text-black px-5 py-2.5 rounded-lg font-medium text-m mt-3 mr-3 hover:bg-white">+ Add Page</button>
      <button on:click={saveNote} class="text-black px-5 py-2.5 rounded-lg font-medium text-m mt-3 hover:bg-white">Save</button>
    </div>
      </div>
  <hr/>

<textarea class="textarea mt-3 block w-full bg-gray-50 border-gray-900 rounded-lg text-black p-2.5" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray {
  background: #FBCEB1

}

.bg-dark-gray {
  background-color: orange;
}

hr {
  border-color: black;
}

.textarea {
  font-size: large;
  flex-grow: 1;
  resize: none;
  overflow: auto;
}
</style>

  