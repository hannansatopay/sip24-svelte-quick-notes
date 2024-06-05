

<script>
  import { onMount } from "svelte";

  
 let title = 'Note Title';
 let note = 'Write note here...';
 onMount(() => {
     title = localStorage.getItem('title');
     note = localStorage.getItem('note');
  })


 function savingNote(){
  console.log(title);
  console.log(note);
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
 }
</script>
 <aside class="fixed h-screen w-60 top-0 left-0 z-40">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul>
      <li>
        <button class="bg-dark-gray border border-gray-300 py-2 px-3 text-gray-900 rounded-lg">{title || "New Page"}</button>
      </li>
    </ul>
  </div>
 </aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 class="text-3xl font-bold">{title || "New Page"}</h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={savingNote}>Save</button>
  </div>
  <hr/>
  <!-- <input class="mt-3 block w-full bg-gray-50 border border-gray-300  rounded-lg text-gray-900  p-2.5" bind:value={title} type="text" placeholder=""> -->
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg tet-gray-900 p-2.5" bind:value={note} name="textarea" id="note"></textarea>
  <!-- <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={savingNote}>Save</button> -->
</main>

<style>
  .bg-light-gray{
    background: #FBFBFB;
  }
  .bg-dark-gray{
    background: #EFEFEF;
  }
</style>