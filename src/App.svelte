 <script>
  import {onMount} from 'svelte';

  let title = 'New note';
  let note = 'Today is an excellent day!';

  onMount(() =>{
   title =  localStorage.getItem('title');
   note =  localStorage.getItem('note');
  })

  function saveNote() {
    localStorage.setItem('title',title);
    localStorage.setItem('note',note);
  }
</script>

<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} />
  <textarea class="mt-3 block w-full border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg mt-3" on:click={saveNote}>Save</button>
