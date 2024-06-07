<script>
let title= '';
let note ='';

function saveNote(){
console.log(title,note)
}
</script>

<main>
 <input bind:value={title} type="text" placeholder="Add Title">
 <textarea bind:value={note}></textarea>
 <button on:click={saveNote}>Save</button>
</main>

<style>

</style>