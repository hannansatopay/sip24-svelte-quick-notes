<!-- Completed the basic task as guided by Hannan sir and added the deletion mechanism as well -->

<script>
import { onMount } from "svelte";
   
 let pages = [];
 let currentPageIndex = 0;
 let title = '';
 let note = '';

 onMount(() => {
  const savedPages = localStorage.getItem("pages");
  if (savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }else{
    addPage();
  }
 }
)

function SaveNote(){
  const storedPageName =  pages[currentPageIndex];
  if (storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
}

function deletePage(){
 const pageTitle = pages[currentPageIndex];
 localStorage.removeItem(pageTitle);
 pages.splice(currentPageIndex, 1);
 if (pages.length === 0){
   addPage();
 }else{
  //  currentPageIndex =  pages.length ? currentPageIndex -2 : currentPageIndex;
  //  selectPage();
  currentPageIndex = Math.max(0, Math.min(currentPageIndex, pages.length - 1));
  selectPage(currentPageIndex);
 }
 pages = [...pages];
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
          {#each pages as page, index }
          <li>
           <button on:click={()=> selectPage(index)} class=" {index == currentPageIndex ? 'bg-dark-gray' : '' } py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          </li>
          {/each}
         <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
<div class="grid grid-cols-2 items-center mb-3">
  <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1> 
 <ul class="ml-auto">
   <li>
     <button class=" bg-gray-800 text-white rounded-lg px-4 py-2 mt-3 font-medium text-sm hover:bg-gray-900" on:click={SaveNote}>Save</button>
     <button class=" bg-gray-800 text-white rounded-lg px-4 py-2 mt-3 font-medium text-sm hover:bg-gray-900" on:click={deletePage}>Delete</button>
  </li>
 </ul>
</div>
<hr/>
 <textarea class="p-4 mt-3 block w-full bg-gray-150 border border-gray-350 rounded-lg" bind:value={note}></textarea>

</main>

<style>
 .bg-light-gray{
  background: #FBFBFB;
 }
 .bg-dark-gray{
  background: #EFEFEF;
 }
</style>