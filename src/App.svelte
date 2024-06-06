<script>
  import {onMount} from 'svelte';
 let title='New Note';
 let note='Add ur note';

 onMount(()=>{
  title =localStorage.getItem('Title');
  note =localStorage.getItem('Note');
 });

 function savenote(){
  console.log(title,note);
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
 }
</script>
<aside class  ="fixed top-0 left-0  z-40 w-60 h-screen">
  <div class="bg-gray-100  h-full py-5 px-3 overflow-y-auto border-r border-gray-300">
    <ul>
      <li>
        <button class="bg-gray-400 py-2 px-2 rounded-lg hover:bg-gray-300 text-gray-900">{title|| "newpage"}</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="block p-2 bg-gray-900 text-white rounded-lg mt-3 px-6 py-3 hover:bg-gray-800 ml-auto" on:click={savenote}>Save </button>
  </div>
    <hr/>
  <textarea class="block mt-3 rounded-lg w-full border-gray-500 bg-gray-100" bind:value={note}></textarea>
  
</main>

<style>

</style>