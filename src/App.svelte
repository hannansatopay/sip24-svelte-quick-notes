  <script>
    import { onMount } from 'svelte';

    let pages = [];
    let selectedPage = pages[0];
    let title = '';
    let notes = '';
    let savedNotes = {};

    onMount(() => {
      const storedNotes = localStorage.getItem('savedNotes');
      if (storedNotes) {
        savedNotes = JSON.parse(storedNotes);
      }
    });

    function addPage() {
      const newPage = prompt("Enter new page name:");
      if (newPage && !pages.includes(newPage)) {
        pages = [...pages, newPage];
      }
    }

    function saveNote() {
      savedNotes = {
        ...savedNotes,
        [selectedPage]: { title, notes }
      };
      localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
      title = '';
      notes = '';
    }

    function selectPage(page) {
      selectedPage = page;
      if (savedNotes[page]) {
        title = savedNotes[page].title;
        notes = savedNotes[page].notes;
      } else {
        title = '';
        notes = '';
      }
    }

    function deleteNote() {
      delete savedNotes[selectedPage];
      localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
      title = '';
      notes = '';
    }
  </script>

  <style>
    .sidebar {
      background-color: #f0f4f8;
      padding: 20px;
      height: 100vh;
    }
    .page-button {
      display: block;
      padding: 10px;
      margin-bottom: 5px;
      text-align: left;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: bold;
    }
    .page-button.active {
      background-color: #d1e7ff;
    }
    .main-content {
      background-color: #e0e7ff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px;
      width: 50%;
    }
    .save-button, .delete-button {
      background-color: #1e40af;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      margin-right: 10px;
    }
    .save-button:hover, .delete-button:hover {
      background-color: #1c3aa9;
    }
    .title-input, .notes-textarea {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      margin-bottom: 10px;
    }
    .notes-textarea {
      background-color: #f3f4f6;
    }
  </style>

  <div class="flex">
    <div class="sidebar">
      {#each pages as page}
        <button 
          class="page-button {selectedPage === page ? 'active' : ''}" 
          on:click={() => selectPage(page)}
        >
          {page}
        </button>
      {/each}
      <button class="page-button" on:click={addPage}>+ Add page</button>
    </div>

    <main class="main-content">
      <h1 class="font-bold text-xl">{selectedPage}</h1>
      <input 
        class="title-input" 
        type="text" 
        placeholder="Enter your title" 
        bind:value={title}
      >
      <textarea 
        class="notes-textarea" 
        rows="10" 
        placeholder="Enter your notes" 
        bind:value={notes}
      ></textarea>
      <button class="save-button" on:click={saveNote}>Save</button>
      <button class="delete-button" on:click={deleteNote}>Delete</button>
    </main>
  </div>
