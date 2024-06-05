<script>
  import { onMount } from 'svelte';

  let title='New Notes';
  let note='A good day for cricket';

  onMount(() => {
    title = localStorage.getItem('title');
    note = localStorage.getItem('note')
  });

  function saveNote() {
    console.log(title,note);
    localStorage.setItem('title', title);
    localStorage.setItem('note', note);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-gray-500">
  <ul>
    <li>
      <button>Page Title</button>
    </li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <input class="block w-full bg-blue-100 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text">
  <textarea class="mt-3 block w-full bg-blue-500 border border-gray-300 rounded-lg text-white p-3"bind:value={note} ></textarea>
  <button class="mt-3 bg-blue-900 rounded-lg text-white text-small font-medium px-5 py-2.5 hover:bg-blue-500"on:click={saveNote}>Save</button>
</main>

<style>
  .bg-light-blue{
    background-color: rgb(82, 144, 239);
  }

</style>