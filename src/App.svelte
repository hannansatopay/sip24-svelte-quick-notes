 <script>
  import { onMount} from 'svelte';
let name='anuja';
let note='hi';
let pages=[];
let currentPageIndex=0;

onMount (() => {
  const savedPages=localStorage.getItem("pages");
if (savedPages){
  pages=JSON.parse(savedPage);
  name=pages[currentPageIndex] ;
  note-localStorage.getItem(name)

}else{
  addPage();

}
}
);

function saveNote(){
  const storagePageName=  pages[currentPageIndex];
  if( storagePageName!=name)
  {
    localStorage.removeItem( storagePageName);
    pages[currentPageIndex]=name;
  }
 
  localStorage.setItem(name,note);
  localStorage.setItem("pages",JSON.stringify(pages));
 }
 function addPage()
 {
  pages.push("new page");
 selectPage(pages.length ? pages.length-1:0)

 }
 function selectPage(index){
  currentPageIndex=index;
  name=pages[currentPageIndex];
  note=localStorage.getItem(name);
 }
 function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }
    selectPage(currentPageIndex);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script >
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray-800 overflow-y-auto py-10 px-5 h-full border-r border-gray-800">
    <ul class="space-y-z">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index==currentPageIndex ? 'bg-gray-300':''} py-2 px-3 text-gray-900 rounded-lg border border-gray-700">{page}</button>
      </li>
      {/each }
      <li class="text-center"><button on:click={addPage} class="font-bold  ">add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  
 <div class="grid grid-cols-2 items-center mb-3">
  <h1 class="text-gray-800 font-bold " contenteditable bind:textContent={name} > </h1>
  <button class= " ml-auto bg-gray-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-800" on:click={saveNote}>save</button>
 </div>
 <hr/> 
 
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-30 rounded-lg text-gray-900" bind:value={note}></textarea> 
  
</main>
 
<style>
.bg-dark-gray{
  background: white;
}
</style>