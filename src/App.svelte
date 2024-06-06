<script>
  import {onMount} from 'svelte';
 let title='hello';
 let note='hii';

onMount(() => {
title=localStorage.getItem('title');
note=localStorage.getItem('note');
});
function savenote(){
  console.log(title,note);
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
}
</script>

<main class="p-4">

 <input class="block w-full bg-gray=50 border border-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text'>
 <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
 <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font font-medium text-sm mt-3 hover:bg-gray-900"on:click={savenote}>save</button>
</main>

<style>

</style>