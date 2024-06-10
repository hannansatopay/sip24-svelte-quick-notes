<script>
let title =" new note";
let note = "today is an excellent day";

function saveNote() {
    console.log(title, note);
}
  </script>

<main>
  <input bind:value={title} type="text" placeholder="Add title">
  <textarea bind:value={note}></textarea>
  <button on:click={saveNote}>save</button>
</main>

<style>
  

</style>