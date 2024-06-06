<script>
  let title = 'New note';
  let note = 'Today is good day'

  function saveNote() {
    console.log(title,note);
  }
</script>

<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type = 'text'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg" on:click={saveNote}> Save </button>
</main>

<style>
h1 {
  color: red;
}
</style>