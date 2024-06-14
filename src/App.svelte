<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {

    const savePages = localStorage.getItem("pages");
    if(savePages) {
      pages = JSON.parse(savePages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
    else{
      addPage();
    }
    //title = localStorage.getItem("title");
    //note = localStorage.getItem("note");
  });

  function deletePage() {
        const pageToDelete = pages[currentPageIndex];
        pages.splice(currentPageIndex, 1);
        localStorage.removeItem(pageToDelete);
        localStorage.setItem("pages", JSON.stringify(pages));
        if (pages.length === 0) {
            addPage();
        } else {
            selectPage(0); 
        }
    }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    //console.log(title, note);
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      
      <li class="text-center">
        <button class="font-medium" on:click={() => addPage()}>+ Add Page</button>
      </li>
      <!-- {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={() => add()}>+Add Page</button>
      </li> -->
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold border border-gray-500 rounded-lg" contenteditable bind:textContent={title}></h1>
    <button
    class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
    on:click={saveNote}>Save</button>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>DELETE</button>
  </div>
  <hr/>
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
  
</main>

<style>
   .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
