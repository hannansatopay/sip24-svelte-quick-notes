<script>
  import {onMount} from 'svelte'
  
  let title = '';
  let note = '';

  onMount(()=>{
    title = localStorage.getItem('title')
    note = localStorage.getItem('note')
  })

  function saveNote(){
    console.log(title, note);
    localStorage.setItem('title', title)
    localStorage.setItem('note', note)
  }
</script>

<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5" bind:value={title} type="text" placeholder="Title">
  <textarea class="mt-4 block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5" bind:value={note} name="note" placeholder="Take a note..."></textarea>
  <button class="mt-4 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>

</style>