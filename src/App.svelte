<script>
  let title = 'Add Title';
  let note = '';

  function addNote() {
    console.log(title, note);
  }

</script>

<main class = "p-4">
  <input class = "block w-full rounded-lg mb-3 border border-gray-900 text-gray-900" bind:value = {title} type="text" placeholder = {title}>
  <textarea class = "block w-full rounded-lg border border-gray-900 text-gray-900" bind:value = {note}></textarea>
  <button class="mx-auto mt-3 bg-gray-300 hover:bg-gray-600 px-3 py-1 rounded-lg" on:click = {addNote}>Save</button>
</main>

<style>

</style>