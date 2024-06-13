<script>
  import { onMount } from 'svelte';
  import StickyNote from './StickyNote.svelte';

  let pages = JSON.parse(localStorage.getItem('pages')) || [];
  let currentPage = { title: "Current Page", notes: [], id: 1 };
  let newNoteText = '';
  let nextPageId = pages.length ? Math.max(...pages.map(p => p.id)) + 1 : 2;

  // Load current page from localStorage or initialize if empty
  onMount(() => {
    const savedPage = JSON.parse(localStorage.getItem('currentPage'));
    if (savedPage) {
      currentPage = savedPage;
    }
  });

  function addNote() {
    if (newNoteText.trim() !== '') {
      currentPage.notes = [...currentPage.notes, { id: Date.now(), text: newNoteText }];
      newNoteText = '';
      saveCurrentPage();
    }
  }

  function deleteNote(id) {
    currentPage.notes = currentPage.notes.filter(note => note.id !== id);
    saveCurrentPage();
  }

  function createNewPage() {
    savePage(currentPage);
    currentPage = { title: `Page ${nextPageId}`, notes: [], id: nextPageId++ };
    saveCurrentPage();
  }

  function saveCurrentPage() {
    localStorage.setItem('currentPage', JSON.stringify(currentPage));
  }

  function savePage(page) {
    const existingPageIndex = pages.findIndex(p => p.id === page.id);
    if (existingPageIndex > -1) {
      pages[existingPageIndex] = page;
    } else {
      pages.push(page);
    }
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function loadPage(page) {
    saveCurrentPage();
    currentPage = page;
    saveCurrentPage();
  }

  function deletePage(id) {
    pages = pages.filter(page => page.id !== id);
    localStorage.setItem('pages', JSON.stringify(pages));
    if (currentPage.id === id) {
      currentPage = { title: "Current Page", notes: [], id: 1 };
      localStorage.removeItem('currentPage');
    }
  }

  $: localStorage.setItem('currentPage', JSON.stringify(currentPage));
</script>

<style>
  .container {
    padding: 2em;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }
  .header .title {
    font-size: 2em;
  }
  .header .title input {
    font-size: 1em;
    padding: 0.2em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .header .actions {
    display: flex;
    gap: 1em;
  }
  .new-note {
    display: flex;
    margin-bottom: 1em;
  }
  .new-note input {
    flex: 1;
    padding: 0.5em;
    font-size: 1em;
    margin-right: 1em;
  }
  .new-note button {
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
  }
  .notes {
    display: flex;
    flex-wrap: wrap;
  }
  .page-list {
    margin-top: 2em;
  }
  .page-list button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5em 0;
    padding: 0.5em;
    cursor: pointer;
  }
  .delete-page-button {
    background-color: #ff4d4d;
    border: none;
    color: white;
    padding: 0.3em;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

<div class="container">
  <div class="header">
    <div class="title">
      <input type="text" bind:value={currentPage.title} placeholder="Enter page title" />
    </div>
    <div class="actions">
      <button on:click={createNewPage}>New Page</button>
    </div>
  </div>
  <div class="new-note">
    <input
      type="text"
      bind:value={newNoteText}
      placeholder="Enter a new note"
      on:keydown={(e) => { if (e.key === 'Enter') addNote(); }}
    />
    <button on:click={addNote}>Save Note</button>
  </div>
  <div class="notes">
    {#each currentPage.notes as note (note.id)}
      <StickyNote {note} onDelete={deleteNote} />
    {/each}
  </div>
  <div class="page-list">
    <h3>Previous Pages</h3>
    {#each pages as page (page.id)}
      <div>
        <button on:click={() => loadPage(page)}>{page.title}</button>
        <button class="delete-page-button" on:click={() => deletePage(page.id)}>Delete</button>
      </div>
    {/each}
  </div>
</div>
