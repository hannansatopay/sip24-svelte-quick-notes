<script>
  import { onMount } from 'svelte';

  let pages = [
    { id: 1, notes: [] },
    { id: 2, notes: [] },
    { id: 3, notes: [] }
  ];

  let activePage = pages[0]; // Start with the first page selected

  let title = '';
  let content = '';

  function addNote() {
    if (title === '' || content === '') {
      alert('Please fill in both fields');
      return;
    }

    activePage.notes = [...activePage.notes, { title, content }];
    title = '';
    content = '';
  }

  function deleteNote(pageIndex, noteIndex) {
    pages[pageIndex].notes = pages[pageIndex].notes.filter((_, i) => i !== noteIndex);
  }

  function addPage() {
    const newPageId = pages.length + 1;
    const newPage = { id: newPageId, notes: [] };
    pages = [...pages, newPage];
    activePage = newPage; // Switch to the newly added page
  }

  function deletePage(pageIndex) {
    if (pages.length === 1) {
      alert("You can't delete the last page.");
      return;
    }
    pages = pages.filter((_, i) => i !== pageIndex);
    activePage = pages[0]; // Switch active page to the first page after deletion
  }

  onMount(() => {
    // You can initialize some state here if needed
  });
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

  :global(body) {
    font-family: 'Inter', sans-serif;
    background: url('https://rare-gallery.com/uploads/posts/582428-night-sky-wallpaper.jpg') no-repeat center center fixed;
    background-size: cover;
    margin: 0;
    padding: 0;
    color: white;
  }
  .container {
    width: 80%;
    margin: auto;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }
  #main {
    margin-top: 20px;
    backdrop-filter: blur(10px);
  }
  #note-form {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  #note-title,
  #note-content {
    width: 45%;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    backdrop-filter: blur(10px);
  }
  #note-title::placeholder,
  #note-content::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  #note-title {
    height: 40px;
  }

.am {
  align-items: center;
  background-color: #fee6e3;
  border: 2px solid #111;
  border-radius: 8px;
  box-sizing: border-box;
  color: #111;
  cursor: pointer;
  display: flex;
  font-family: Inter,sans-serif;
  font-size: 16px;
  height: 48px;
  justify-content: center;
  line-height: 24px;
  max-width: 100%;
  padding: 0 25px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.am:after {
  background-color: #111;
  border-radius: 8px;
  content: "";
  display: block;
  height: 48px;
  left: 0;
  width: 100%;
  position: absolute;
  top: -2px;
  transform: translate(8px, 8px);
  transition: transform .2s ease-out;
  z-index: -1;
}

.am:hover:after {
  transform: translate(0, 0);
}

.am:active {
  background-color: #ffdeda;
  outline: 0;
}

.am:hover {
  outline: 0;
}

@media (min-width: 768px) {
  .am {
    padding: 0 40px;
  }
}
  .note {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    color: white;
  }
  .note h2 {
    margin-top: 0;
  }
  .delete-note {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(220, 53, 69, 0.6);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    backdrop-filter: blur(10px);
  }
  .delete-note:hover {
    background-color: rgba(200, 35, 51, 0.6);
  }
  .page-navigation {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .page-link {
    margin: 0 10px;
    padding: 5px 10px;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    cursor: pointer;
  }
  .page-link.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  .page-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .page-action {
    padding: 5px 10px;
    background-color: rgba(0, 123, 255, 0.6);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 10px;
    backdrop-filter: blur(10px);
  }
  .page-action:hover {
    background-color: rgba(0, 86, 179, 0.6);
  }
  .page-action.delete {
    background-color: rgba(220, 53, 69, 0.6);
  }
  .page-action.delete:hover {
    background-color: rgba(200, 35, 51, 0.6);
  }
  .am1 {
  cursor: pointer;
  position: relative;
  padding: 2px 8px;
  font-size: 14px;
  color: rgb(193, 163, 98);
  border: 2px solid rgb(193, 163, 98);
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.am1::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(193, 163, 98);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.am1:hover::before {
  scale: 3;
}

.am1:hover {
  color: #212121;
  scale: 1.1;
  box-shadow: 0 0px 20px rgba(193, 163, 98,0.4);
}

.am1:active {
  scale: 1;
}



</style>

<main>
  <div class="container">
    <div id="main">
      <div id="note-form">
        <input
          type="text"
          id="note-title"
          placeholder="Note Title"
          bind:value="{title}"
        />
        <textarea
          id="note-content"
          placeholder="Note Content"
          bind:value="{content}"
        ></textarea>
        <button class="am" on:click="{addNote}">Add Note</button>
      </div>
      <div id="notes">
        {#each activePage.notes as note, index}
          <div class="note">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button
              class="delete-note"
              on:click="{() => deleteNote(pages.indexOf(activePage), index)}"
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
      <div class="page-navigation">
        {#each pages as page}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="page-link {page === activePage ? 'active' : ''}"
            on:click="{() => activePage = page}"
          >
            Page {page.id}
          </div>
        {/each}
      </div>
      <div class="page-actions">
        <button class="am1" on:click="{addPage}">Add Page</button>
        {#if pages.length > 1}
          <button class="am1" on:click="{() => deletePage(pages.indexOf(activePage))}">Delete Page</button>
        {/if}
      </div>
    </div>
  </div>
</main>
