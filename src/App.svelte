<script>
  import { onMount } from 'svelte';

  let title = 'Title';
  let note = '';

  onMount = () => {
    note = localStorage.getItem('note');
    title = localStorage.getItem('title');
  }

  function saveNote() {
    localStorage.setItem('note', note);
    localStorage.setItem('title', title);
  }

</script>

<aside class = "fixed left-0 top-0 z-40 w-64 h-screen">
  <div class = "overflow-y-auto bg-gray-300 h-full border-r px-4 py-4">
    <ul class = "">
      <il class = "text-3xl font-bold">
        NOTES
      </il>
    </ul>
  </div>
</aside>

<main class="flex flex-col ml-64 px-4 py-4 h-screen">
  <div class = "border-b border-gray-300 grid grid-cols-2 items-center mb-1">
    <h1 class = "font-bold text-3xl" contenteditable>{title || "New Page"}</h1>
    <button class="mb-3 ml-auto text-white bg-gray-500 hover:bg-gray-700 px-3 py-1 rounded-lg" on:click={saveNote}>SAVE</button>
  </div>
  <textarea class="w-full mt-3 block rounded-lg border border-gray-900 text-gray-900" bind:value={note}></textarea>
</main>

<style>

</style>