<script>
  import {onMount} from 'svelte';


  let name ="Sanskar Srivastavaaaa";
  let title = 'New Note';
  let note = 'today is an excellent day';

  onMount(()=>{
    title=localStorage.getItem('title');
    note=localStorage.getItem('note');
  }
);

   function saveNote(){
    console.log(title, note);
    localStorage.setItem('title', title);
    localStorage.setItem('note', note); 

   }
 
</script>

<input>
 <h1>Hello My name is {name}</h1> 
 <main class="p-5">
 <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2" bind:value={title} type="text" >
 <textarea class=" mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-5" bind:value={note}></textarea>
<button class="bg-green-600 text-white px-5 py-2 rounded-lg font-bold text-sm mt-3 hover:bg-green-900" on:click={saveNote}>save</button>
</main>

<style>
  

</style>