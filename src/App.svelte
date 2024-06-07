<script>
 
</script>

<main class="p-4">
  <!-- Hello World , I am {name} -->
  <!-- <h1>This is Heading 1</h1>
  <h2>This is Heading 2</h2>
  <h3>This is Heading 3</h3>
  <h6>This is Heading 6</h6> -->

  <input class="block w-full bg-grey border border-grey-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm mt-3 hover:bg-gray-600" on:click={saveNote}>Save</button>
</main>

<style>
/* h1{
  color:aquamarine;
}
h2{
  color:aqua;
}
h6{
  color:red;
} */

</style>