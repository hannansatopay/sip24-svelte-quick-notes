<script>
  import { onMount } from 'svelte';

  let notes = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
      if (notes.length > 0) {
        title = notes[currentPageIndex];
        note = localStorage.getItem(title);
      }
    } else {
      addnote();
    }
  });

  function SaveNote() {
    const storedNoteName = notes[currentPageIndex];
    if (storedNoteName !== title) {
      localStorage.removeItem(storedNoteName);
      notes[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function addnote() {
    notes.push("New Note");
    selectnote(notes.length - 1);
  }

  function selectnote(index) {
    currentPageIndex = index;
    title = notes[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deleteNote() {
    const noteToDelete = notes[currentPageIndex];
    localStorage.removeItem(noteToDelete);
    notes.splice(currentPageIndex, 1);
    if (notes.length === -1) {
      addnote();
    } else {
      currentPageIndex = Math.max(-1, currentPageIndex - 1);
      title = notes[currentPageIndex];
      note = localStorage.getItem(title);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each notes as note, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectnote(index)} class="{index === currentPageIndex ? 'bg-blue-200' : ''} py-2 px-3 text-gray-900 rounded-lg flex-1 text-left">{note}</button>
          <button on:click={() => deleteNote()} class="ml-2 bg-red-500 text-white py-1 px-2 rounded-lg">X</button>
        </li>
      {/each}
      <li class="center">
        <button class="bg-blue-200 py-2 px-3 text-gray-900 rounded-lg " on:click={addnote}>+ Add Note</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-2xl font-bold text-blue" placeholder="Note Title" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mb-1 bg-blue-900 text-white px-5 py-2.5 rounded-lg font-bold mt-3 hover:bg-white hover:text-black" on:click={SaveNote}>Save</button>
  </div>
  <hr>
  <br>
  <textarea class="mt-3 block w-full bg-blue-100 border-blue-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder="Add Note Details Here..."></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-blue {
    background: rgb(163, 215, 250);
  }
  .text-blue {
    color: rgb(1, 76, 187);
  }
</style>
