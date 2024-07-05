<script>
  let notes = JSON.parse(localStorage.getItem('notes')) || {};
  let noteTitles = Object.keys(notes);
  let selectedNote = null;
  let title = '';
  let content = '';

  function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    noteTitles = Object.keys(notes);
  }

  function fetchNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || {};
    noteTitles = Object.keys(notes);
  }

  function saveNote() {
    if (selectedNote) {
      notes[selectedNote.title] = content;
    } else {
      notes[title] = content;
    }
    saveToLocalStorage();
    fetchNotes();
    clearForm();
  }

  function deleteNote() {
    delete notes[selectedNote.title];
    saveToLocalStorage();
    fetchNotes();
    clearForm();
  }

  function selectNote(noteTitle) {
    selectedNote = { title: noteTitle, content: notes[noteTitle] };
    title = noteTitle;
    content = notes[noteTitle];
  }

  function clearForm() {
    selectedNote = null;
    title = '';
    content = '';
  }

  fetchNotes();
</script>

<main class="min-h-screen bg-gray-100 flex">
  <aside class="w-1/4 bg-gray-200 p-4 border-r border-gray-300">
    <h2 class="text-2xl font-bold mb-4">Yash Notes</h2>
    <ul class="space-y-2">
      {#each noteTitles as noteTitle}
        <li
          class="cursor-pointer p-2 rounded {selectedNote && selectedNote.title === noteTitle ? 'bg-blue-200' : 'hover:bg-gray-300'}"
          on:click={() => selectNote(noteTitle)}
        >
          <span class="font-semibold">{noteTitle}</span>
        </li>
      {/each}
    </ul>
    <button
      on:click={clearForm}
      class="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
    >
      New Note
    </button>
  </aside>

  <section class="flex-1 p-4">
    <div class="mb-4">
      <input
        type="text"
        bind:value={title}
        placeholder="Title"
        class="w-full p-2 border border-gray-300 rounded mb-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    <textarea
      bind:value={content}
      placeholder="Content"
      class="w-full p-2 border border-gray-300 rounded mb-2 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    ></textarea>
    <div class="flex space-x-4">
      <button
        on:click={saveNote}
        class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        {selectedNote ? 'Update Note' : 'Save Note'}
      </button>
      {#if selectedNote}
        <button
          on:click={deleteNote}
          class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
        >
          Delete Note
        </button>
      {/if}
    </div>
  </section>
</main>

<style>
  input[type="text"], textarea {
    transition: all 0.3s;
  }
</style>
