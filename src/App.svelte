<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }else{
      addPage();

    }
  });

  function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function savenote(){
    const storedPageNmae = pages[currentPageIndex];
    if(storedPageNmae != title){
      localStorage.removeItem(storedPageNmae);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage() {
    const storedPageName = pages[currentPageIndex];
    localStorage.removeItem(storedPageName);
    pages.splice(currentPageIndex, 1);

    if (pages.length > 0) {
      selectPage(currentPageIndex === 0 ? 0 : currentPageIndex - 1);
    } else {
      addPage();
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
 
</script>

<aside class ="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class = "bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
         <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : "" } py-2 px-3 text-gray-900 rounded-lg" >{page}</button>
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto space-x-2">
      <button class="px-2.5 py-2.5 bg-gray-700 rounded-lg text-white hover:bg-gray-900" on:click={savenote}>Save</button>
      <button class="px-2.5 py-2.5 bg-red-700 rounded-lg text-white hover:bg-red-900" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr />
  <textarea class="block w-full bg-gray-100 border border-gray rounded-lg mb-3" bind:value={note}></textarea>
</main>


<style>
  .bg-light-gray{
    background: #FBFBFB83;
  }
  .bg-dark-gray{
    background: #efefef;
  }

</style>