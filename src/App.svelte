<script>
  import { onMount } from 'svelte';
  import { getAllNotes, getNoteTitle, saveNoteTitle, deleteNoteTitle } from './indexedDB';

  let notes = [];
  let currentNoteIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    const savedNotes = await getAllNotes();
    if (savedNotes.length > 0) {
      notes = savedNotes.map(n => n.title);
      await selectNote(0);
    } else {
      addNote();
    }
  });

  async function saveNote() {
    const storedNoteName = notes[currentNoteIndex];
    if (storedNoteName != title) {
      await deleteNoteTitle(storedNoteName);
      notes[currentNoteIndex] = title;
    }
    await saveNoteTitle({ title, note });
    notes[currentNoteIndex] = title;
    notes = [...notes];
  }

  async function addNote() {
    notes.push("New Note");
    await saveNoteTitle({ title: "New Note", note: "" });
    selectNote(notes.length - 1);
    
  }

  async function selectNote(index) {
    if (index >= 0 && index < notes.length) {
      currentNoteIndex = index;
      title = notes[currentNoteIndex];
      const savedNote = await getNoteTitle(title);
      note = savedNote ? savedNote.note : '';
    } else {
      currentNoteIndex = 0;
      title = '';
      note = '';
    }
  }

  async function deleteNote(index) {
    const noteTitle = notes[index];
    await deleteNoteTitle(noteTitle);
    notes.splice(index, 1);

    if (index === currentNoteIndex) {
      selectNote(notes.length ? Math.min(index, notes.length - 1) : -1);
    } else if (index < currentNoteIndex) {
      selectNote(currentNoteIndex - 1);
    }

    if (notes.length === 0) {
      addNote();
    }
  }
</script>

<div class="flex flex-col min-h-screen">
  <!-- Side Bar -->
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto px-3 py-5 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each notes as note, index}
        <li class="flex justify-between">
          <button class="{index == currentNoteIndex ? 'bg-blue-600 text-white' : ''} px-3 py-2 text-blue-900 rounded-lg" on:click={() => selectNote(index)}>{note}</button>
          <button class="text-sm font-bold text-red-500 hover:text-lg" on:click={() => deleteNote(index)}>X</button>
        </li>
        {/each}
        <li class="text-center">
          <button class="mt-3 font-bold hover:text-lg" on:click={addNote}>+ Add Note</button>
        </li>
      </ul>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="p-4 ml-60 h-auto">
    <h1 class="text-center m-10 text-6xl font-bold text-blue-800">Everyday Notes</h1>
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    </div>
    <hr/>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
    <div class="flex justify-end">
      <button class="mt-3 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-300 hover:text-black" on:click={saveNote}>Save</button>
    </div>
  </main>

  <!-- Footer Section -->
  <footer class="p-2 bg-gray-100 text-center mt-auto flex justify-center items-center space-x-2">
    <p class="text-blue-800 font-bold">Author: ILyas Sayyed</p>
    <span>|</span>
    <a href="https://www.linkedin.com/in/yourprofilemrporsche/" class="text-blue-600 hover:underline" target="_blank">LinkedIn</a>
    <span>|</span>
    <a href="https://github.com/MrPorsche/" class="text-blue-600 hover:underline" target="_blank">GitHub</a>
  </footer>
</div>