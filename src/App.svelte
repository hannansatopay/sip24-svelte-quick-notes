<script>
 import { onMount } from 'svelte';

 let title = 'New Note';
 let note = 'Today is a good day';

 onMount(() => {
    title = localStorage.getItem('title');
    note = localStorage.getItem('note');
 });

 function saveNote() {
    localStorage.setItem('title', title);
    localStorage.setItem('note', note);
 }
</script>


<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul>
    <li>
      <button class="bg-dark-grey py-2 px-3 text-gray-900 rounded-lg">Page Title</button>
    </li>
  </ul>


</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <input class="block w-full p-2 mb-4 border border-gray-300 rounded" bind:value={title} />
  <textarea class="block w-full p-2 mb-4 border border-gray-300 rounded" bind:value={note} />
  <button class="bg-blue-500 text-white p-2 rounded" on:click={saveNote}>Save</button>
</main>

<style>
.bg-light-gray {
  background-color: #FBFBFB;
}

.bg-dark-grey {
  background-color: #EFEFEF;
}
</style>