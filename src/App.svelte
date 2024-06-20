<script>
import { onMount } from 'svelte';
let pages=[];
let curentPage=0;
 let title='Page title helo';
 let note='what a lovely day';

 onMount(() => {
const savedpages=localStorage.getItem("pages");
if(savedpages){
pages=JSON.parse(savedpages);
title=pages[curentPage];
note=localStorage.getItem(title);
}
else{
newPage();
}

 });
function savenote(){
  const storedname =pages[curentPage];
  if(storedname != title){
    localStorage.removeItem(storedname);
    pages[curentPage]=title;
  }
pages[curentPage]=title;
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
}

function newPage(){
  pages.push("New Page");
  selectpage(pages.length ? pages.length-1 : 0);
}

function selectpage(index){
curentPage=index;
title=pages[curentPage];
note=localStorage.getItem(title);
}

function deleteNote(){
  const pagedelete =pages[curentPage];
  localStorage.removeItem(pagedelete);
  pages.splice(curentPage ,1);
  if(pages.length == 0){
    newPage();
  }
  else{
    selectpage(curentPage >0 ? curentPage-1 : 0);
  }
  localStorage.setItem("pages",JSON.stringify(pages));
  alert(`The Note titled "${pagedelete}" has been deleted`);


}
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-900">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
        <button on:click={()=>selectpage(index)} class="{index==curentPage ? 'bg-dark-gray' :'' } py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={newPage}>+Add Page </button></li>
    </ul>
  </div>

</aside>


<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold"contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space -5">
    <button class="ml-auto mr-5 bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold text-lg mt-3 hover:bg-gray-900" on:click={deleteNote}>Delete </button>
    <button class="ml-auto bg-green-500 text-white px-5 py-2.5 rounded-lg font-bold text-lg mt-3 hover:bg-green-900" on:click={savenote}>Save </button>
  </div></div>
<hr/>
<textarea class=" mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} ></textarea>

</main>

<style>
.bg-light-gray{
  background: #FBFBFB;
}
.bg-dark-gray{
  background: #EFEFEF;
}
</style>