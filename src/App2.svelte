<script>

import { onMount } from 'svelte'

let title = '';
let note = '';

onMount(() => {
 title = localStorage.getItem('title');
  note = localStorage.getItem('note');
})

function saveFunction() {
  console.log(title, note);
  localStorage.setItem('title', title);
  localStorage.setItem('note', note);
}

</script>

<main>

<input class= 'rounded-lg block w-full bg-gray-500' bind:value={title} placeholder="add title" type='text'>
<textarea class = 'mt-3 block w-full bg-gray-500 rounded-lg' bind:value={note}></textarea>
<button on:click={saveFunction}>Save</button>

</main>

<style>

</style>