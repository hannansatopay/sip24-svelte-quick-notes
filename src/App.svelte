<script>
  import {onMount} from 'svelte';
 let title='New Note.';
 let note ='Today is Awesome..!';
 let visiblity='hidden';
 onMount(()=>{
    title=localStorage.getItem("title");
    note=localStorage.getItem("note");
 })
 function setValues(){
  visiblity='inline';
  console.log(title,note);
  localStorage.setItem('title',title);
  localStorage.setItem('note',note);
 }
 function hideDiv(){
  visiblity='hidden';
 }
</script>
<aside class="fixed left-0 top-0 z-40 w-60 h-screen ">
  <div class=" overflow-y-auto bg-light-gray h-full py-5 px-3 border-r-2 border-cyan-200 bg-slate-400">
    <ul class="space-y-2">
      <li>
        <button class=" bg-gray-200 py-2 px-3 text-gray-900 rounded-lg">{title || "New Note"}</button>
      </li>
      <li class=" text-center"><button class=" font-medium"> + Add Page </button></li>
    </ul>
  </div>
</aside>
<main class="   h-screen flex justify-center items-center bg-gradient-to-br from-red-600  to-slate-600 ">
<div class=" w-1/3 h-5/6 flex flex-col rounded-xl  p-5 border border-b-2 border-cyan-300 bg-transparent ml-60">
  <div class="grid grid-cols-2 items-center mt-3 py-2.5 px-5 ">
    <h1 class="font-bold text-4xl" contenteditable bind:textContent={title}></h1>
    <button on:click={setValues} class=" bg-slate-900 ml-auto  text-white  rounded-lg px-3 py-1 text-lg hover:bg-slate-800">Save</button>
  </div>
  <hr />
  <textarea on:click={hideDiv} class=" py-2.5 px-5 block w-full  rounded-lg mb-2 mt-7 text-lg border border-cyan-300 bg-gray-200 text-gray-900" bind:value={note} placeholder="Type here...."></textarea>
  <div class="w-full h-16 mt-10 text-center {visiblity}">
    <h1 class="mt-5 text-lg text-white">Note Saved Successfully...</h1>
  </div>
</div>
</main>

<style>
 .bg-light-gray{
  background-color: #fbfbfb;
 }
</style>