<script>
import {onMount} from 'svelte'

 let pages=[];
 let currentPageIndex =0;
 let title = "";
 let note = "";
 let db;
 let dbRequest=indexedDB.open('NotesDB',1);

 dbRequest.onupgradeneeded = function(event) {
  db = event.target.result;
  let notes = db.createObjectStore('notes', {autoIncrement: true});
}
 dbRequest.onsuccess = function(event) {
  db = event.target.result;
}
 dbRequest.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

 onMount(()=>{
  const savedPages = localStorage.getItem("pages");
  if (savedPages){
    pages=JSON.parse(savedPages);
    title=pages[currentPageIndex];
    note=localStorage.getItem(title);
  }else{
    addPage();
  }
 })

 function selectPage(index){
  currentPageIndex=index;
  title=pages[currentPageIndex];
  note=localStorage.getItem(title);
 }

 function saveNote(){
  const storedPageName = pages[currentPageIndex];
  if (storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=title;
  }
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
 }

 function deleteNote() {
    const pageName = pages[currentPageIndex];
    localStorage.removeItem(pageName);
    pages.splice(currentPageIndex, 1);
    
    if (pages.length === 0) {
        addPage();
    } else {
        selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
    localStorage.setItem("pages", JSON.stringify(pages));
}

 function addPage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length - 1:0);
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index==currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-1 mt-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="ml-auto bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deleteNote}>Delete</button>

  </div>
  <hr/>
  <input class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} type="text" placeholder="Add Title">
</main>

<style>
.bg-light-gray{
  background: lightgray;
}
.bg-dark-gray{
  background: darkgray;
}
</style>