<script>
  import { onMount } from 'svelte';
  
 let pages=[];
 let CurrentPageIndex=0;
 let name = 'Syed';
 let title='Title';
 let note='Hello';

 onMount(() => {
  const savedPages= localStorage.getItem("pages");
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[CurrentPageIndex];
    note = localStorage.getItem(title);
  }else{
    addPage();
  }
 })

 function saveNote() {
  const storedPageName = pages[CurrentPageIndex];
  if (storedPageName != title)
  {
    localStorage.removeItem(storedPageName);
    pages[CurrentPageIndex]=title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
 }

 function addPage() {
  pages.push("New Page");
  selectPage(pages.length ? pages.length-1 : 0);
 }

 function selectPage(index){
  CurrentPageIndex=index;
  title=pages[CurrentPageIndex];
  note=localStorage.getItem(title);
 }

</script>

<aside class="fixed top-0 left-0 z-40 w-40 h-screen">
<div class="bg-red-300 overflow-y-auto py-5 px-3 h-full border-r border-black">
  <ul class="space-y-2">
      {#each pages as page,index}
      <li>
      <button on:click={()=>selectPage(index)} class="{index == CurrentPageIndex ? 'bg-colour1': 'bg-colour2'} px-1 py-1 rounded-lg text-large">{page}</button>
      </li>
      {/each}
    <li class="text-center">
      <button class="font-medium" on:click={addPage}>+Add Page</button>
    </li>
  </ul>
</div>
</aside>

<main class="p-2 ml-40 h-auto">
  <div class="mb-2 grid grid-cols-2 item centre">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-red-800 text-white px-2 py-2 rounded-lg font-medium text-small hover:bg-red-500" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <h1 class="mt-2 mb-2">My name is Mubina {name}</h1>
  <textarea class="mb-2 block w-full bg-red-300 border border-black-1000 round-lg text-blue-950 p-4" bind:value={note}></textarea>
</main>

<style>
  h1{
    color: rgb(0, 0, 0);
  }
  .bg-colour1 {
    background-color:antiquewhite;
  }
  .bg-colour2 {
    background-color: rgb(255, 127, 127);
  }

</style>