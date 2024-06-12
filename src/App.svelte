<script>
  import {onMount} from 'svelte';

let pages=[];
let currentPageIndex =0;
 let title='';
 let note='';

 onMount(() => {
  const savedPages = localStorage.getItem("pages");
  if (savedPages) {
    pages = JSON.parse(savedPages);/* JSON.parse Converts a String to an Array or object*/
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  } else{
addPage();
  }
 });

 function saveNote() {
  const storedPageName = pages[currentPageIndex];
  if(storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]= title;
  }
  pages[currentPageIndex]= title;
  // adding local Storage 
  localStorage.setItem( title, note);
  localStorage.setItem( "pages", JSON.stringify(pages));/*JSON.stringify Covert an Object or Array to A String*/
  
 }
 
function addPage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length -1 : 0);
}

function selectPage(index){
  currentPageIndex= index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen ">
  <div class="bg-light-gray over-flow-y-auto py-5 px-3 h-full border-r border-gray-200 ">
    <ul class="space-y-2">
      
        {#each pages as page, index}
        <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg ">{page}</button>
      </li>
        {/each}
        
      
      <li class="text-center"><button  on:click={addPage} class="font-medium"> + Add page</button></li>
    </ul>
  </div>
</aside>

<main class="padding-4 ml-60 h-auto">
  <div class="grid grid-cols-2 item-center mb-3">
<h1 class="text-3xl font-bold" contenteditable bind:textContent={title}> 
 
</h1>
<button class=" ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-size-small mt-3 hover:bg-gray-900" on:click={saveNote}> Save</button>
  </div>
  <hr/>
  
  <textarea class="block w-full mt-3 bg-gray-50 border-gray-30 rounded-lg padding-2.5 " bind:value={note}></textarea>
 
</main>

<style>
.bg-light-gray{
  background-color: #ebe1eb;
}
.bg-dark-gray{
  background-color: rgb(184, 184, 224);
}
</style>