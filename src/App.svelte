<script>
import {onMount} from 'svelte';

let Title='New Note';
let note ='Today is an excellent day!';

onMount(() => {
Title=  localStorage.getItem('Title');
note= localStorage.getItem('note');
});
function saveNote() {
   localStorage.setItem('Title',Title);
   localStorage.setItem('note',note);
}
</script> 

<main class="p-4">
  
 <input class="black w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={Title} type="text">
<textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
<button class="bg-gray-800 text-white px-5 py2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}> save</button>
</main>
 




<style>
 
</style>