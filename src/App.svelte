<script lang="ts">
  import { onMount } from "svelte";
  import Dexie from "dexie";

  interface Note {
    id?: number;
    title: string;
    note: string;
  }
  const db = new Dexie("NotesDatabase");
  db.version(1).stores({
    notes: "++id,title,note",
  });

  let title = "";
  let note = "";

  const saveNote = () => {
    if (title.trim() !== "" && note.trim() !== "") {
      db.notes
        .add({ title: title, note: note })
        .then(() => {
          console.log("Note saved successfully!");
          title = "";
          note = "";
          getNotes();
        })
        .catch((error) => {
          console.error("Error saving note:", error);
        });
    } else {
      console.error("Title and note cannot be empty!");
    }
  };

  const deleteNote = (id: number) => {
    db.notes
      .delete(id)
      .then(() => {
        console.log("Note deleted successfully!");
        getNotes();
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  let notes: Note[] = [];

  const getNotes = () => {
    db.notes.toArray().then((result: Note[]) => {
      console.log(result);
      notes = result;
    });
  };

  onMount(() => {
    getNotes();
  });
</script>

<main>
  <input
    type="text"
    bind:value={title}
    placeholder="Add Title"
    class="block w-full bg-gray-200 border-gray-300 rounded-lg m-2 text-center"
  />
  <textarea
    bind:value={note}
    class="block w-full bg-gray-200 border-gray-300 rounded-lg m-2 text-center"
    placeholder="Start Typing here"
  ></textarea>
  <button
    on:click={saveNote}
    class="border-2 border-gray-50 bg-gray-500 hover:border-gray-300 px-4 py-2 m-2"
    >Save</button
  >
</main>
<div>
  <h3 class="text-center text-3xl font-thin">Your Notes Are</h3>
  {#each notes as note}
    <div class="note">
      <h2
        class="block w-full bg-gray-200 border-gray-300 rounded-lg m-2 text-center"
      >
        {note.title}
      </h2>
      <p
        class="block w-full bg-gray-200 border-gray-300 rounded-lg m-2 text-center"
      >
        {note.note}
      </p>
      <button
        on:click={() => deleteNote(note.id)}
        class="delete-button border-2 border-red-50 bg-red-500 hover:border-red-300 px-4 py-2 m-2"
        >Delete</button
      >
    </div>
  {/each}
</div>

<style>
</style>
