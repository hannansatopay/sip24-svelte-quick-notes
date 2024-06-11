<script>
    export let note;
    export let onDelete;
  </script>
  
  <div class="note-item bg-slate-300">
    <h3>{note.title}</h3>
    <p>{note.content}</p>
    <button class="font-bold rounded-md bg-blue-500 w-20 text-gray "  on:click={() => onDelete(note.id)}>Delete</button>
  </div>
  
  <style>
    .note-item {
      border: 1px solid #ccc;
      padding: 1rem;
      margin: 0.5rem 0;
    }
  </style>
  