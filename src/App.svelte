<script>
  import {onMount} from 'svelte'
  let pages=[];
  let currentPageIndex=0;
 let title='';
 let note='';
 onMount(()=>{
  const savedPages=localStorage.getItem('pages')

  if(savedPages){
    pages=JSON.parse(savedPages);
    title=pages[currentPageIndex]||"New Page";
    note=localStorage.getItem(title);
  }else{
    addPage();
  }
 });
 function saveNote(){
  const storedPageName=pages[currentPageIndex];
  if(storedPageName!=title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=title;
  }
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
 }
 function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length-1 : 0)
 }
 function selectPage(index){
  currentPageIndex=index;
  title=pages[currentPageIndex];
  note=localStorage.getItem(title);
 }
 function deleteNote(){
  const storedPageName=pages[currentPageIndex];
  localStorage.removeItem(storedPageName);
  pages.splice(currentPageIndex,1);
  if (pages.length === 0) {
      addPage();
  } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
  }
  localStorage.setItem("pages", JSON.stringify(pages));
 }
</script>

<aside class="fixed top-0 left-0 z-3 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page, index(index)}
      <li>
        <button class="{index==currentPageIndex? 'bg-dark-gray' : ""} px-3 py-2 text-gray-900 rounded-lg" on:click={()=>{selectPage(index)}}>{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button on:click={saveNote} class="ml-auto bg-gray-800 rounded-lg py-2.5 px-5 text-white font-medium text-sm hover:bg-gray-900">Save</button>
  </div>
  <hr/><textarea class="my-4 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button on:click={deleteNote} class="ml-auto bg-red-800 rounded-lg py-2.5 px-5 text-white font-medium text-sm hover:bg-red-900">Delete Page</button>

</main>

<style>
  .bg-light-gray{
    background-color: #fbfbfb;
  }
  .bg-dark-gray{
    background-color: #efefef;
  }
</style>