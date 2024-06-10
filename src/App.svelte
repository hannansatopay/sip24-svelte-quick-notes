<script>

  import {onMount} from 'svelte';

  let pages = [];
  let currentPageIndex =0;
 let name = "Jack Ryan";
 let title ='';
 let note = 'Today, is an excellennt day';

 onMount(()=>{
  const savedPages = localStorage.getItem("pages");

  if(savedPages)
   {
pages = JSON.parse(savedPages);
title= pages[currentPageIndex];
note = localStorage.getItem(title);
   }else{
addPage();
   }

title = localStorage.getItem('title');
note = localStorage.getItem('note');


 })

 function saveNote(){
  const storedPageName = pages[currentPageIndex];
    if(storedPageName != title)
     {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
     }
  console.log(title,note);

  localStorage.setItem(title,note);
  localStorage.setItem(title,JSON.stringify(pages));
 }

 function addPage(){
  pages.push(title);
  selectPage(pages.length ? pages.length-1 : 0);
  pages=pages;
 }


 function selectPage(index){
  currentPageIndex=index;
  title = pages[currentPageIndex];
  note= localStorage.getItem(title);
 }


</script>


<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
   <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"> 
    <ul class="space-y-2">
      {#each  pages as page,index }
      <li >
       
        <button class=" {index == currentPageIndex ? "bg-dark-gray" : ""} px-3 text-gray-900 rounded-lg " on:click={()=>selectPage(index)}>{page || "New Page"}</button>
   
      </li>
      {/each }
     
      <li class="m-2 text-center">
        <button class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg font-medium " on:click={addPage}> +Add Page</button>
     </li>
    </ul>
   </div>
</aside>

<main class="p-4 ml-60 h-auto">
   <div class="grid grid-cols-2 items-center m-2">
    <h1 class="text-3xl font-bold " contenteditable bind:textContent={title}></h1>
   <button class="ml-auto bg-gray-800 px-5 py-2.5 text-white font-medium rounded-lg text-sm mt-3 hover:bg-gray-900"on:click={saveNote}>Save</button>
   </div>
   <hr/>

   
   <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
     <button class="bg-gray-800 px-5 py-2.5 text-white font-medium rounded-lg text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>
.bg-light-gray{
  background: #FBFBFB;
}

.bg-dark-gray{
  background: #EFEFEF;
}
</style>