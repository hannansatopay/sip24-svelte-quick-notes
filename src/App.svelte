
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


<aside class=" fixed top-0 left-0 z-40 w-60 h-screen ">
  <div class = "bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul>
      <li>
        <button class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">Page Title</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} />
  <textarea class="mt-3 block w-full border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg mt-3" on:click={saveNote}>Save</button>
