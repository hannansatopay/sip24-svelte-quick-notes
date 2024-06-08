<script>
  import { onMount } from 'svelte';
 let title = 'New Note';
 let note = 'Today is a goood day';

 onMount(() => {
  title = localStorage.getItem('title');
  note = localStorage.getItem('note');
 });
 
 function saveNote() {
  console.log(title, note);
  localStorage.setItem('title', title);
  localStorage.setItem('note', note);
 }
</script>

<main class="p-4">
 <input class="block w-full bg-gray-50 border border-gray-300 rounder=1g text-gray-900 p-2.5" bind:value={title} type='text'>
 <textarea class="mt-3 block w-full bg-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
 <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:clicl={saveNote}>Save</button>

</main>

<style>

</style> 