<script>
  import {onMount} from 'svelte';
  let title = 'New Note';
  let note = 'Today is an excellent day';

  onMount(() => {
    title = localStorage.getItem('title');
    note = localStorage.getitem('note');
    if (title) title = title;
    if (note) note = note;
  })

  function SaveNote() {
    localStorage.setItem('title', title);
    localStorage.setItem('note', note);

  }

  function deleteNote() {
    localStorage.removeItem('title');
    localStorage.removeItem('note');
    title = '';
    note = '';
  }
</script>

<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text' placeholder='Add Title'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={SaveNote}>save</button>
  <button
  class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700 ml-2" on:click={deleteNote}>Delete</button>
</main>

<style>
  
</style>