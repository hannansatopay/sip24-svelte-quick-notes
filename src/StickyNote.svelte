<script>
    export let note;
    export let onDelete;
  
    function handleDelete() {
      onDelete(note.id);
    }
  </script>
  
  <style>
    .sticky-note {
      background-color: #fffa65;
      padding: 1em;
      margin: 1em;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
      width: 200px;
    }
    .delete-button {
      background-color: #ff4d4d;
      border: none;
      color: white;
      padding: 0.5em;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  
  <div class="sticky-note">
    <p>{note.text}</p>
    <button class="delete-button" on:click={handleDelete}>Delete</button>
  </div>
  