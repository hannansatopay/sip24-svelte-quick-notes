<script>
import { onMount } from 'svelte';

let CurrentPageIndex = 0;
let pages = [];
  let content = '';   
 let name = '';

 onMount (() => {
  const savedPages = localStorage.getItem("pages");
  if (savedPages) {
    pages = JSON.parse(savedPages);
    content = pages[CurrentPageIndex];
    name = localStorage.getItem(content);
  } else {
    addPage();
  }

 });

function SaveNote() {
  const storedPageName = pages[CurrentPageIndex];
  if (storedPageName != content) {
    localStorage.removeItem(storedPageName);
    pages[CurrentPageIndex] = content;
  }
  pages[CurrentPageIndex] = content;
  localStorage.setItem(content, name);
  localStorage.setItem("pages", JSON.stringify(pages));
}
function addPage() {
  pages.push("New Page"); 
  selectPage(pages.length ? pages.length - 1 : 0);
}
 
 function selectPage(index) {
   CurrentPageIndex = index;
   content = pages[CurrentPageIndex];
   name = localStorage.getItem(content);
 }
</script>

<aside class=" bg-gray-300 px-2 h-screen fixed z-40 w-30" >
  <div class="overflow-y-auto h-full border-r px-2 py-4 bg-blue-200">
    <ul>  
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == CurrentPageIndex ? 'bg-blue-400' : ''} rounded-lg text-green-900">{page}</button>
      </li>
      {/each}
      <li class="text-centre"><button on:click={addPage} class="font-medium">+New Notes</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-40 h-auto">
  <div class="grid grid-cols-2 items-centre">
  <h2 class=" text-2xl font-bold" contenteditable bind:textContent={content}></h2>
  <button class=" ml-auto px-3 py-3 bg-yellow-200 text-white-700 rounded-lg font-medium hover:bg-Yellow-900 " on:click={SaveNote}>Save</button>
</div>
<textarea class="block bg-red-200 px-2 py-1 w-full text-blue-900 mt-2 mb-5 rounded-lg p-2 " bind:value={name}></textarea>
</main>

<style>

</style>