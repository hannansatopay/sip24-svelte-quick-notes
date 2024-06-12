<script>
  import {onMount} from 'svelte';
let title = 'New Note';
let note = 'Today will be awesome';
onMount(()=>{
title = localStorage.getItem('title');
note = localStorage.getItem('note');
});
function saveNote() {
  console.log(title);
  console.log(note);
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
}
</script>

<main class="p-4">
  <div >
    <input class="block w-full bg-gray-50 border border-gray-300 runded-lg text-gray-900 p-2.5 " bind:value={title} type = "text" placeholder = "Enter the title" width = 600px>
  </div>
  <div>
    <textarea class="block w-full mt-3 bg-gray-50 border border-gray-300 runded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </div>
  <div class ="btn">
    <button class="bg-blue-800 text-white px-2.5 py=2.5 rounded-lg font-medium text-sm mt-3 hover:bg-navy blue-700" on:click={saveNote}>SAVE</button>
  </div>
</main>

<style>
  .btn{
  position: relative;
  left:10px;
  top: 10px;
  }
</style>