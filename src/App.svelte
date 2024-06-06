<script>
  import { onMount } from 'svelte';
  let currentPageID;
  let title;
  let note;
  let db;
  let getNoteCalled = false;
  let titles = [];

  onMount(() => {
    const request = indexedDB.open("notesDatabase", 1);
    request.onupgradeneeded = (event) => {
      db = request.result;
      db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    }
    request.onsuccess = () => {
      db = request.result;
      getAllTitles();
    }
  })

  function saveNote() {
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    objectStore.put({ id: currentPageID, title: title, content: note }).onsuccess = () => {
      title = '';
      note = '';
      getNote(currentPageID);
      getAllTitles();
    };
  }

  function getNote(id) {
    currentPageID = id;
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    objectStore.get(id).onsuccess = (event) => {
      const item = event.target.result;
      if (item) {
        title = item.title;
        note = item.content;
      }
    };
  }

  function getAllTitles() {
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    objectStore.getAll().onsuccess = (event) => {
      titles = event.target.result;
      if (titles.length === 0) {
        addPage();
      }
      if (!getNoteCalled) {
        getNote(titles[0].id);
        currentPageID = titles[0].id;
        getNoteCalled = true;
      }
    }
  }

  function addPage() {
    let newTitle = "Untitled";
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    objectStore.add({ title: newTitle, content: "" }).onsuccess = (event) => {
      const newID = event.target.result;
      titles.push({ id: newID, title: newTitle });
      getNote(newID);
    }
  }

  function deletePage(id) {
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    if (titles.length == 1) {
      title = "Untitled";
      note = "";
      saveNote();
    } else {
      objectStore.delete(id).onsuccess = () => {
        titles = titles.filter(note => note.id != id);
        getNote(titles[0].id);
      }
    }
  }
</script>

<aside class="sidebar">
  <img src="/logo.png" alt="Quick Notes Logo" class="logo">
  <div class="menu">
    {#each titles as t}
      <button on:click={()=> getNote(t.id)} class="menu-item">{t.title || "Title"}</button>
    {/each}
    <button on:click={addPage} class="add-page">+ Add Page</button>
  </div>
</aside>

<main class="main-content">
  <div class="toolbar">
    <h1 bind:textContent={title} class="title" contenteditable>{title || "Title"}</h1>
    <div>
      <button on:click={saveNote} class="button">Save</button>
      <button on:click={() => deletePage(currentPageID)} class="button">Delete</button>
    </div>
  </div>
  <textarea bind:value={note} class="note-area" placeholder="Note"></textarea>
</main>

<style>
  .sidebar {
    background: #2C3E50;
    color: #ECF0F1;
    width: 250px;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
  }

  .logo {
    width: 100%;
    margin-bottom: 20px;
  }

  .menu {
    display: flex;
    flex-direction: column;
  }

  .menu-item {
    background: #34495E;
    color: white;
    border: none;
    padding: 10px;
    margin-bottom: 5px;
    cursor: pointer;
    text-align: left;
  }

  .add-page {
    background: #16A085;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }

  .main-content {
    margin-left: 250px;
    padding: 20px;
  }

  .title {
    font-size: 24px;
    color: #34495E;
  }

  .button {
    background: #3498DB;
    color: white;
    border: none;
    padding: 10px 15px;
    margin-left: 10px;
    cursor: pointer;
  }

  .note-area {
    width: 100%;
    height: 70vh;
    border: 1px solid #BDC3C7;
    padding: 10px;
    box-sizing: border-box;
  }

  .toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
</style>
