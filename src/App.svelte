<script>
 import { onMount } from 'svelte';
 import Dexie from 'dexie';

 class Database extends Dexie{
  notes;
  constructor() {
    super('Database');
    this.version(1).stores({
      notes: '++id, title, body'
    });
    this.notes = this.table('notes');
  }
 }
 const db = new Database();

let pages =  [];
let currentpageIndex = 0;
 let title = ''
 let note = ''

 onMount(async() => {
  pages = await db.notes.toArray();
  if (pages.length > 0){
    selectPage(0);
  } else {
    addPage();
  }
 });

 async function savenote() {
  const storedPageName = pages[currentpageIndex];
  if(storedPageName != title){
    await db.notes.delete(storedPageName.id);
    pages[currentpageIndex].title = title;
  }
  await db.notes.put({id: storedPageName.id, title, body:note});
  pages = await db.notes.toArray();
 }

 async function addPage() {
  const newPage = { title: 'New Page', body: '' };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
  selectPage(pages.length ? pages.length - 1 : 0);
 }

 function selectPage(index) {
  currentpageIndex = index;
  title = pages[currentpageIndex].title;
  note = pages[currentpageIndex].body;
 }

 async function deletePage() {
  const pagedelete = pages[currentpageIndex];
  await db.notes.delete(pagedelete.id);
  pages.splice(currentpageIndex, 1);
  if(pages.length == 0){
    addPage();
  }else{
      selectPage(currentpageIndex > 0 ? currentpageIndex - 1 : 0);
  }
  pages = await db.notes.toArray();
  alert('note deleted');
 }

 function clearNote() {
  note = '';
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="sidebar overflow-y-auto py-5 px-3 h-full border-r border-gray-800 text-xl">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentpageIndex ? 'sidebutton' : ''} px-3 py-2 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-right">
        <button on:click={addPage} class="adele mb-2.5">+ add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="newpagetitle text-3xl font-bold " contenteditable bind:textContent={title}></h1>

    <div class="ml-auto flex space-x-2">
      <button class="ml-auto bg-green-500 px-5 py-2.5 rounded-lg font-medium text-m mt-5 mb-5 hover:bg-green-300" on:click={savenote}>save</button>
      <button class="ml-auto bg-yellow-300 px-5 py-2.5 rounded-lg font-medium text-m mt-5 mb-5 hover:bg-yellow-100" on:click={clearNote}>clear</button>
    <button class="ml-auto bg-red-500 px-5 py-2.5 rounded-lg font-medium text-m mt-5 mb-5 hover:bg-red-300" on:click={deletePage}>delete</button>
  </div>

  </div>
  <textarea class="block w-full bg-gray-100 border border-gray-200 rounded-md text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>

</style>