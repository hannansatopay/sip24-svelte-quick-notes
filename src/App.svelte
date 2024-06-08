<script>
  /*var
  const 
  let*/
  import { onMount } from "svelte";
  let title = "New Note";
  let note = "Today is an awesome day!";

  onMount(() => {
    title = localStorage.getItem("title") || title;
    note = localStorage.getItem("note") || note;
  });
  function savenote() {
    console.log(title);
    console.log(note);
    localStorage.setItem("title", title);
    localStorage.setItem("note", note);
  }
</script>

<main>
  <!-- <h1>Hello World, I am {title}</h1> -->
  <input
    class="block w-full bg-gray50 border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={title}
    type="text"
  />
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
  <button
    class=" bg-gray-800 text-white px-5 py-2.5 rounded-lg fount-medium text-sm mt-3 hover:bg-gray-900"
    on:click={savenote}>Submit</button
  >
</main>

<style>
  /* h1 {
    color: red;
  } */
</style>
