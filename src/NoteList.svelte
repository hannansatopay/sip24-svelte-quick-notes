<script>
    import { onMount } from 'svelte';
    import { db } from './db';
    import NoteItem from './NoteItem.svelte';
  
    let notes = [];
  
    onMount(async () => {
      notes = await db.getNotes();
    });
  
    const handleDelete = async (id) => {
      await db.deleteNote(id);
      notes = await db.getNotes();
    };
  </script>
  
  <div class="note-list rounded-lg">
    {#each notes as note (note.id)}
      <NoteItem {note} onDelete={handleDelete} />
    {/each}
  </div>
  
  <style>
    .note-list {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
  