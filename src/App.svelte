<script>
import {onMount} from 'svelte';

let title='New Note';
let note='Today is an excellent day!';
onMount (()=>{
 title = localStorage.getItem('title');
 note=localStorage.getItem('note');
});

function saveNote(){
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
}
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul>
      <li>
<button class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">Page Title</button>
      </li>
    </ul>
  </div>     
  
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1>   </h1>
  </div>
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={title} type='text'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>
.bg-light-gray {
  background: white;
}

.bg-dark-gray{
  background: gray;

}
</style>