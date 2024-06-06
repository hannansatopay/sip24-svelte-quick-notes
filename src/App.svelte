<script>
  import { onMount } from "svelte";

  let notes = [];
  let currentNoteIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
      title = notes[currentNoteIndex];
      note = localStorage.getItem(title);
    } else {
      addNote();
    }
  });

  function saveNote(){
    const storedNoteName = notes[currentNoteIndex];
    if (storedNoteName != title) {
      localStorage.removeItem(storedNoteName);
      notes[currentNoteIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages",JSON.stringify(notes));
  }

  function addNote() {
    notes.push("New Note");
    selectNote(notes.length  ? notes.length -1 : 0);
  }

  function selectNote(index) {
    currentNoteIndex = index;
    title = notes[currentNoteIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto px-3 py-5 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each notes as note, index}
        <li>
          <button class="{index == currentNoteIndex ? 'bg-blue-600 text-white' : ''} text-blue-900 px-3 py-2 rounded-lg" on:click={()=>selectNote(index)}>{note}</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="mt-3 font-bold hover:text-lg" on:click={addNote}>+ Add Notes</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <h1 class="text-center m-10 text-6xl font-bold text-blue-800">Everyday Notes</h1>
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-blue-600" contenteditable bind:textContent={title}></h1>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <div class="flex justify-end">
    <button class="mt-3 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-300 hover:text-black" on:click={saveNote}>Save</button>
  </div>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
</style>