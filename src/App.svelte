<script>
  import{onMount} from 'svelte'
 let title ='New node';
 let note ='Today is an excellient day!';


 onMount(()  =>{
  title = localStorage.getItem('title'); 
  note = localStorage.getItem('note'); 
 });

 function saveNote(){
 localStorage.setIteam('title', title);
 localStorage.setIteam('note', note);
  }
</script>

<aside class ="fixed-\ top-0 left-0 z-40 w-60 h-screen"> 
  <div class ="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"> 
    <ul>
      <li>
        Hello
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
 <input  class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={title} type='text'>
 <textarea class=" mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
 <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>
  

</style>