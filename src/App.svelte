<script>
let title= '';
let note ='';

function saveNote(){
console.log(title,note);
localStorage.setItem("title",title);
localStorage.setItem("note",note);
}
</script>

<main class="p-4">
 <input class="block w=full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text" placeholder="Add your title here">
 <textarea class="block w-full mt-3 bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
 <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>

</style>