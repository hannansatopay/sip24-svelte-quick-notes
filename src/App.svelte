<script>
import { onMount } from "svelte";


 let pages = [];
 let currentPageIndex = 0;
 let title = "New Note";
 let note = "Express Yourself Here";

 onMount(()=>{
  const savedPages = localStorage.getItem("pages");
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex];
    note = localStorage.getItem(title)
  }else{
    addPage();
  }
  title = localStorage.getItem('title');
  note = localStorage.getItem('note');
 });

 function selectPage(index){
  currentPageIndex  = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }

  function saveNote(){
  pages[currentPageIndex] = title;
  localStorage.setItem('title', title);
  localStorage.setItem(title, note);
  localStorage.setItem('pages', JSON.stringify(pages)); // Local Storage requires saving of data in string form
  }

  function deleteNote() {
    localStorage.removeItem(title);
    pages.splice(currentPageIndex, 1);
    localStorage.setItem('pages', JSON.stringify(pages));
    pages = pages;
    if(currentPageIndex == 0) addPage();
    else{
      selectPage(currentPageIndex - 1);
    }
  }

  function addPage() {
    pages.push("New Page");
    pages = pages;
    selectPage(pages.length ? pages.length -1 : 0)
  }

  </script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="bg-yellow py-2 px-3 text-gray-900 rounded-lg">{page}</button>      
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium"> Add More </button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class = "grid-cols-2 items-center mb-3"> 
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title}</h1>
    <button class = "ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class = "ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deleteNote}>Delete</button>
  </div>
  <hr/>
  <textarea contenteditable bind:textContent={note} class = "mt-3 block w-full bg-gray-50 border border-gray-300">{note}</textarea>
</main>

<style>

</style>