<script>
 let name = "Sahil Yadav"
 let title = ""
 let note = ""

 function saveNote(){
  localStorage.setItem("title",title);
  localStorage.setItem("note",note);
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-grey overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul>
      <li>
        <button class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">Page title</button>
      </li>
    </ul>
  </div>

</aside>
<main class="p-4 ml-60 h-auto">
  <!-- we can use javascript like this  -->
 <!-- <h1>Hello my name is {name}</h1>  -->
  <!-- bind is two way linking   -->

  <div>
    <h1>Page Title</h1>
<button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>

    
  </div>

<input class="block w-full bg-gray-50 border border-gray-300 rounded-lg  text-gray-900 p-2.5" bind:value={title} type="text" placeholder="Add title">
<textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg  text-gray-900 p-2.5" bind:value={note} placeholder="add description"></textarea>
</main>

<style>
/* h1{
  color: rebeccapurple;
} */


</style>