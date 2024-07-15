<script>
  import{onMount}from'svelte';
  // @ts-ignore
  import { openDB } from 'idb';

  let db;
  let pages=[];
  let currentPageIndex=0;
let title='';
let note='';

async function initDB(){
  db=await openDB('notesDB',1,{
    upgrade(db){
      db.createObjectStore('notes',{keyPath:'title'});
    },
  });
}
async function loadnotes(){
  const tx=db.transaction('notes','readonly');
  const store = tx.objectStore('notes');
  pages=await store.getAllkeys();
  if(pages.length>0){
    selectPage(0);
    
  } else {
    addPage();

  }
}
async function saveNote(){
  const tx=db.transaction('notes','readwrite');
  const store=tx.objectStore('notes');
  const storedPageName=pages[currentPageIndex];
  if(storedPageName !== title){
    await store.delete(storedPageName);
    pages[currentPageIndex]=title;
  }
  await store.put({title,note});
  pages=await store.getAllkeys();

}
async function deleteNote(){
  const tx= db.transaction('notes','readwrite');
const store=tx.objectStore('notes');
await store.delete(title);
pages.splice(currentPageIndex,1);
if(pages.length>0){
  selectPage(0);
  }else{
    addPage();
  }
}

 async function addPage(){
  pages.push("New Page");
selectPage( pages.length-1);
}

async function selectPage(index){
  currentPageIndex=index;
  title=pages[currentPageIndex];
  const tx=db.transaction('notes','readonly');
  const store=tx.objectStore('notes');
  const noteObj=await store.get(title);
  note=noteObj?noteObj.note:'';
  }

  onMount(async()=>{
    await initDB();
    await loadnotes();
  });
</script>

<aside class="fixed top-0 left-0 z-48 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
         <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-centre mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-600 text-white px-5 py-2.5 round-lg font-medium  rounded-lg text=sm mt-3 hover:bg-gray-900"on:click={saveNote}>Save</button>
    <button class="ml-auto bg-blue-600 text-white px-5 py-2.5 round-lg font-medium  rounded-lg text=sm mt-3 hover:bg-gray-900"on:click={deleteNote}>Delete</button>
  </div> 
  <hr/>
  <textarea class="mt-2.5 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
</main>

<style>
.bg-light-gray{
  background:#FBFBFB;
}
.bg-dark-gray{
  background:#EFEFEF ;

}
</style>