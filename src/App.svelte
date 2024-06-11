<script>
let Title='New Note';
let note ='Today is an excellent day';

function saveNote() {
   console.log(Title,note);
}
</script> 

<main>
  
 <input bind:value={Title} type="text" placeholder="Add Title">
<textarea bind:value={note}></textarea>
<button on:click={saveNote}> save</button>
</main>
 




<style>
 
</style>