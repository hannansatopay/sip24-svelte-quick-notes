<script>
 let title = '';
 let note = '';

 function saveNote() {
  console.log(title, note);
 }
</script>

<main>
  <input bind:value={title} type="text" placeholder="Add title"
  <textarea bind:value={note}><</textarea>
</main>

<style>

</style>