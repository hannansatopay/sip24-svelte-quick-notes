<script>
  import { onMount } from 'svelte';
 
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
   if (savedPages){
    pages = JSON.parse(savedPages);
    title = pages(currentPageIndex);
    note = localStorage.getItem(title);
   }else{
    addPage();
   }
  });

  function saveNote(){
    const storedPageName = pages[currentPageIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
   localStorage.setItem(title, note);
   localStorage.setItem("pages",JSON.stringify(pages));
  }

  function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1:0)
  }

  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto px-3 py-5 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
      <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} px-3 py-2 text-gray-900 rounded-lg">{page}</button> 
    </li>
    {/each}
    <li class="text-center" ><button on:click={addPage} class="font-medium">+Add Page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 itnems-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-4 bg-blue-500 px-5 py-2 rounded-lg text-white font-medium text-sm hover:bg-blue-700" on:click={saveNote}>Save</button> 
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-blue-100 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray{
  background: #f1efef ;
}

.bg-dark-gray{
  background: #dcd8d8;
}
</style>