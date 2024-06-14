<script>
  import {createEventDispatcher, onMount } from 'svelte';

  let pages= [];
  let currentPageIndex=0;
 let Title = ' ';
 let note = ' ';

 onMount(() => {
  const savedPages =localStorage.getItem("pages");
  if( savedPages) {
    pages=JSON.parse(savedPages);
  Title= pages[currentPageIndex];
  note=localStorage.getItem(Title);
 } else {
  addPage();
 }
 })
 function SaveNote () {
   const storedPageName = pages[currentPageIndex];
   pages[currentPageIndex]=Title;
   localStorage.setItem(Title ,note);
   localStorage.setItem("pages",JSON.stringify(pages));

 }

 function addPage()
 {
   pages.push("New Pages");
   selectPage( pages.length ? pages.length-1: 0);
 }
  function selectPage(index){
     currentPageIndex=index;
     title=pages[currentPageIndex];
     note =localStorage.getItem(title);
  }


</script>
<aside class="fixed top-0  left-0 z-40 wd-60 h-screen ">
  <div class=" bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2-">
    
         {#each pages as page, index}
         <li>
         <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-800 rounded-lg "> {page}</button>
         </li>
         {/each}
    
      <li class =" text-centre"> <button on:click={addPage} class=" font-medium "> +ADD PAGES</button></li>
      
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class=" grid gird-cols-2 item-centre mb-3">
    <h1 class="text-3xl font bold"contenteditable bind:textContent={Title}> { Title || "NEW PAGE "} </h1>
    <button class=" ml-auto bg-gray-800 text-white px-5 py =2.5 rounded-lg font medium text-sm mt 3 hover:bg-gray-900" on:click={SaveNote}>Save</button>
  </div>
  <hr/>
  
  
  <textarea  class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>

</main>

<style>
  .bg-light-gray{
     background: #fbfbfb;
    
     }
  
     .bg-dark-gray
     {
       background:#EFEFEF
     }
</style>