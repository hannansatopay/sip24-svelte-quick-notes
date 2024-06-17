<script>
  import { createEventDispatcher } from 'svelte';

  export let selectedNote;
  const dispatch = createEventDispatcher();

  let title = selectedNote.title || '';
  let content = selectedNote.content;

  function handleSave() {
    dispatch('update', { ...selectedNote, title, content });
  }

  function handleDelete() {
    dispatch('delete', { id: selectedNote.id });
  }
</script>

<style>
  .note {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .note input {
    width: 90%;
    border: none;
    background-color: transparent;
    font-size: 30px;
    font-weight: bold;
    padding: 10px;
    box-sizing: border-box;
    margin-left: 30px;
  }
  .note textarea {
    flex: 1;
    width: 90%;
    height: 100px;
    border: line;
    background-color: rgba(229, 222, 222, 0.973);
    resize: none;
    font-size: 20px;
    padding: 30px;
    margin-left: 30px;
    box-sizing: border-box;
    margin-top: 20px;
  }
  .note .save-btn,
  .note .delete-btn {
    margin-top: 5px;
    padding: 10px;
    border: none;
    cursor: pointer;
    width: 100px;
  }
  .note .save-btn {
    background-color: #007bff;
    color: white;
    margin-left: 40px;
  }
  .note .delete-btn {
    background-color: red;
    color: white;
    margin-left: 70px;
  }
  .buttons {
    display: flex;
    margin-top: 10px;
  }
</style>

<div class="note">
  <input type="text" bind:value={title} placeholder="Title" />
  <textarea bind:value={content} placeholder="Write your note here..."></textarea>
  <div class="buttons">
    <button class="save-btn" on:click={handleSave}>Save</button>
    <button class="delete-btn" on:click={handleDelete}>Delete</button>
  </div>
</div>
