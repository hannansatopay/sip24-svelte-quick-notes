<script>
  import {onMount} from "svelte";
  let pages=[];
  let curentPageIndex = 0;
let title =" new note";
let note = "today is an excellent day";
onMount(() => {
  const savedPages = localStorage.getItem("pages");
if (savedPages){
  pages = JSON.parse(savedPages);
  title = pages[currentPageIndex];
  note = localStorage.getItem(title); 

}else {
  addpage();

}
});

function saveNote() {
  const storedpageName = pages[curentPageIndex]
  if(storedpageName != title)
  localStorage,removeItem(storedpageName);
}
{
pages[curentPageIndex] = title;
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(page));


}
funtion addpage(){
  pages.push("New Page");
  selectpage(pages.length ? pages.length - 1 : 0)
  
}
function selectpage(index){
  currentPageIndex = index;
  title = pages[curentPageIndex]
  note  = localStorage.getItem(title);
}
</script>
<aside class="fixed top-0 left-0
   z-0 w-0 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full boder-r border-gray-200">
  <ul class="space-y-2">
  <li>
      {#each pages as page, index}
      <button on:click={()=>selectpage} (index) class="{index == curentPageIndex ? "bg-dark-gray" :""}  py-2 px-3 text-gray-900 rounded-lg">{title || "New Page"}</button>
      {/each}
      
      </li>
      <li class="text-center"><button onclick={addpage} class="font medium">+Add page</li>
      </ul>
      </div>
      </aside>



<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
      <h1>Page Title</h1>
      <h1 class="text-3xl font-bold"contenteditable> bind:textcontext{title}</h1> 
      <button  class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded -lg font mrdium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>save</button>

  </div>
<input class="block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900p-2.5" bind:value={title} text">
<textarea class"mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</mainmain>


<style>
  .bg-light-gray {
      background: #FBFBFB;
  }



</style>