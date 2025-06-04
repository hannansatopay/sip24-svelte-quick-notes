<!-- #Made with 🍇 power -->

<script>
  import { onMount, onDestroy } from "svelte";
  let db = null;
  const dbName = "notes_db_v2";
  const storeName = "notes_store";
  const dbVersion = 2;
  let pages = [];
  let currentPageId = null;
  let title = "";
  let note = "";
  let isSidebarOpen = false;
  let dbStatus = "Initializing...";
  let dbOpenRequest = null;
  let noteCounter = 1;
  function openDatabase() {
    dbStatus = "Opening Database...";
    if (dbOpenRequest) {
      return;
    }
    if (!window.indexedDB) {
      dbStatus = "Error: IndexedDB not supported.";
      return;
    }
    dbOpenRequest = indexedDB.open(dbName, dbVersion);
    dbOpenRequest.onupgradeneeded = (event) => {
      dbStatus = "Setting up Database...";
      const request = event.target;
      if (!request || !request.result) {
        dbStatus = "Error: DB setup failed.";
        return;
      }
      const tempDb = request.result;
      if (!tempDb.objectStoreNames.contains(storeName)) {
        try {
          tempDb.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        } catch (error) {
          dbStatus = "Error: Failed to create store.";
        }
      }
    };
    dbOpenRequest.onsuccess = (event) => {
      dbStatus = "Database Ready.";
      const request = event.target;
      if (!request || !request.result) {
        dbStatus = "Error: Failed to get DB instance.";
        return;
      }
      db = request.result;
      dbOpenRequest = null;
      db.onerror = (errorEvent) => {
        const error = errorEvent.target?.error || "Unknown database error";
        if (!dbStatus.startsWith("Error:")) {
          dbStatus = `Error: ${error.name || "DB Issue"}`;
        }
      };
      db.onabort = (abortEvent) => {
        dbStatus = "DB Aborted";
      };
      db.onclose = () => {
        dbStatus = "DB Closed. Please Refresh.";
        db = null;
      };
      db.onversionchange = () => {
        if (db) {
          db.close();
          db = null;
          dbStatus = "DB Version Change. Please Refresh.";
        }
      };
      loadPages();
    };
    dbOpenRequest.onerror = (event) => {
      const request = event.target;
      const error = request?.error || "Unknown DB open error";
      dbStatus = `Error Opening DB: ${error.name || "Unknown"}`;
      dbOpenRequest = null;
    };
    dbOpenRequest.onblocked = () => {
      dbStatus = "DB Blocked";
      dbOpenRequest = null;
    };
  }
  onMount(() => {
    openDatabase();
    document.addEventListener("click", handleOutsideClick);
  });
  onDestroy(() => {
    document.removeEventListener("click", handleOutsideClick);
    if (db) {
      db.close();
      db = null;
    }
    if (dbOpenRequest) {
      dbOpenRequest.onsuccess = null;
      dbOpenRequest.onerror = null;
      dbOpenRequest.onupgradeneeded = null;
      dbOpenRequest.onblocked = null;
      dbOpenRequest = null;
    }
  });
  function handleOutsideClick(event) {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".sidebar-toggle");
    const targetNode = event.target;
    if (targetNode instanceof Node && isSidebarOpen && sidebar && toggle) {
      if (!sidebar.contains(targetNode) && !toggle.contains(targetNode)) {
        isSidebarOpen = false;
      }
    }
  }
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
  function getObjectStore(mode = "readonly") {
    if (!db) {
      dbStatus = "Error: DB Not Connected";
      return null;
    }
    if (!db.objectStoreNames.contains(storeName)) {
      dbStatus = "Error: Store Missing";
      return null;
    }
    try {
      const transaction = db.transaction(storeName, mode);
      return transaction.objectStore(storeName);
    } catch (error) {
      if (error.name === "InvalidStateError") {
        db = null;
        dbStatus = "DB Closed. Refresh Needed.";
      } else {
        dbStatus = `Error: Tx Failed (${error.name})`;
      }
      return null;
    }
  }
  function updateNoteCounter(loadedPages) {
    let maxNum = 0;
    const noteTitleRegex = /^(?:New|Untitled) Note (\d+)$/i;
    loadedPages.forEach((page) => {
      const match = page.title.match(noteTitleRegex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    noteCounter = maxNum + 1;
  }
  function loadPages() {
    const objectStore = getObjectStore("readonly");
    if (!objectStore) return;
    const request = objectStore.getAll();
    request.onerror = (event) => {
      const error = event.target?.error || "Unknown load error";
      dbStatus = `Error Loading: ${error.name || "Unknown"}`;
    };
    request.onsuccess = (event) => {
      const req = event.target;
      if (req) {
        pages = req.result || [];
        updateNoteCounter(pages);
        if (pages.length > 0) {
          const targetId = currentPageId;
          let indexToSelect = pages.findIndex((p) => p.id === targetId);
          if (indexToSelect === -1) {
            indexToSelect = 0;
          }
          selectPage(indexToSelect, true);
        } else {
          currentPageId = null;
          title = "";
          note = "";
          addPage();
        }
      } else {
        pages = [];
        currentPageId = null;
        title = "";
        note = "";
        dbStatus = "Error: Processing Failed";
      }
    };
  }
  function saveNote() {
    if (currentPageId === null) {
      dbStatus = "Error: No page selected";
      return;
    }
    const currentIndex = pages.findIndex((p) => p.id === currentPageId);
    if (currentIndex === -1) {
      dbStatus = "Error: Cannot find current page";
      return;
    }
    const objectStore = getObjectStore("readwrite");
    if (!objectStore) return;
    const editorTitle = title.trim();
    const finalTitle = editorTitle === "" ? `Untitled Note` : editorTitle;
    const noteData = { id: currentPageId, title: finalTitle, note: note };
    const request = objectStore.put(noteData);
    request.onsuccess = () => {
      pages[currentIndex] = { ...noteData };
      title = finalTitle;
      pages = [...pages];
      updateNoteCounter(pages);
    };
    request.onerror = (event) => {
      const error = event.target?.error || "Unknown save error (put)";
      dbStatus = `Error Saving: ${error.name || "Unknown"}`;
    };
    objectStore.transaction.onerror = (event) => {};
  }
  function addPage() {
    const objectStore = getObjectStore("readwrite");
    if (!objectStore) return;
    const newPageData = { title: `New Note ${noteCounter}`, note: "" };
    const request = objectStore.add(newPageData);
    request.onsuccess = (event) => {
      const generatedId = event.target.result;
      newPageData.id = generatedId;
      pages = [...pages, newPageData];
      noteCounter++;
      const newIndex = pages.length - 1;
      selectPage(newIndex, true);
    };
    request.onerror = (event) => {
      const error = event.target?.error || "Unknown add error";
      dbStatus = `Error Adding Page: ${error.name || "Unknown"}`;
    };
  }
  function selectPage(index, forceUpdate = false) {
    if (index < 0 || index >= pages.length) {
      if (pages.length > 0) {
        const firstPageId = pages[0]?.id;
        if (firstPageId !== null && currentPageId !== firstPageId) {
          selectPage(0, true);
        }
      } else {
        currentPageId = null;
        title = "";
        note = "";
      }
      return;
    }
    const selectedPageData = pages[index];
    if (!selectedPageData || typeof selectedPageData.id === "undefined") {
      currentPageId = null;
      title = "";
      note = "";
      loadPages();
      return;
    }
    if (selectedPageData.id === currentPageId && !forceUpdate) {
      if (isSidebarOpen && window.innerWidth <= 768) {
        isSidebarOpen = false;
      }
      return;
    }
    currentPageId = selectedPageData.id;
    title = selectedPageData.title;
    note = selectedPageData.note;
    if (isSidebarOpen && window.innerWidth <= 768) {
      isSidebarOpen = false;
    }
  }
  function deletePage(indexToDelete) {
    if (indexToDelete < 0 || indexToDelete >= pages.length) {
      return;
    }
    const pageToDelete = pages[indexToDelete];
    if (!pageToDelete || typeof pageToDelete.id === "undefined") {
      dbStatus = "Error: Cannot find page to delete";
      return;
    }
    const idToDelete = pageToDelete.id;
    const objectStore = getObjectStore("readwrite");
    if (!objectStore) return;
    const request = objectStore.delete(idToDelete);
    request.onsuccess = () => {
      const previousPageId = currentPageId;
      const oldPages = pages;
      pages = pages.filter((page) => page.id !== idToDelete);
      updateNoteCounter(pages);
      if (pages.length === 0) {
        currentPageId = null;
        title = "";
        note = "";
        addPage();
      } else {
        if (previousPageId === idToDelete) {
          const newIndexToSelect = Math.min(indexToDelete, pages.length - 1);
          selectPage(newIndexToSelect, true);
        } else {
          pages = [...pages];
        }
      }
    };
    request.onerror = (event) => {
      const error = event.target?.error || "Unknown delete error";
      dbStatus = `Error Deleting: ${error.name || "Unknown"}`;
    };
  }
  $: {
    if (currentPageId !== null) {
      const currentIndex = pages.findIndex((p) => p.id === currentPageId);
      if (currentIndex !== -1 && pages[currentIndex].title !== title) {
        pages[currentIndex].title = title;
        pages = [...pages];
      }
    }
  }
</script>

<div class="app-container">
  <button
    class="sidebar-toggle"
    on:click|stopPropagation={toggleSidebar}
    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
    aria-expanded={isSidebarOpen}
  >
    {isSidebarOpen ? "✕" : "☰"}
  </button>
  <aside class="sidebar {isSidebarOpen ? 'open' : ''}">
    <div class="sidebar-content">
      <ul class="pages-list">
        {#if dbStatus !== "Database Ready." && dbStatus !== "Initializing..."}
          <li class="status-message error">{dbStatus}</li>
        {/if}
        {#each pages as page, index (page.id)}
          <li class="page-item" class:active={page.id === currentPageId}>
            <button
              on:click={() => selectPage(index)}
              class="page-button"
              disabled={!db}
            >
              {page.title || "Untitled"}
            </button>
            <button
              on:click|stopPropagation={() => deletePage(index)}
              class="delete-button"
              aria-label={`Delete ${page.title || "Untitled"}`}
              disabled={!db}
            >
              🗑️
            </button>
          </li>
        {:else}
          {#if !db && (dbStatus === "Initializing..." || dbStatus === "Opening Database...")}
            <li class="no-pages-message">Loading database...</li>
          {:else if pages.length === 0 && db}
            <li class="no-pages-message">No pages yet.</li>
          {/if}
          {#if dbStatus.startsWith("Error")}
            <li class="status-message error">Error accessing notes.</li>
          {/if}
        {/each}
        <li class="add-page-item">
          <button on:click={addPage} class="add-page-button" disabled={!db}>
            + Add Page
          </button>
        </li>
      </ul>
    </div>
  </aside>
  <main class="main-content">
    {#if currentPageId !== null}
      {@const currentPageIndex = pages.findIndex((p) => p.id === currentPageId)}
      {#if currentPageIndex !== -1}
        <div class="note-header">
          <input
            bind:value={title}
            class="note-title"
            placeholder="Page Title"
            aria-label="Page Title"
            autocomplete="off"
            disabled={!db}
          />
          <button on:click={saveNote} class="save-button" disabled={!db}>
            Save
          </button>
        </div>
        <textarea
          bind:value={note}
          class="note-textarea"
          placeholder="Start writing your note..."
          aria-label="Note Content"
          disabled={!db}
        ></textarea>
      {:else}
        <div class="no-page-selected">
          <p class="error-message">Error: Selected page not found in list.</p>
          <p>Please try reloading or selecting another page.</p>
        </div>
      {/if}
    {:else}
      <div class="no-page-selected">
        {#if dbStatus === "Initializing..." || dbStatus === "Opening Database..."}
          <p>{dbStatus}</p>
        {:else if dbStatus.startsWith("Error") || dbStatus === "DB Blocked" || dbStatus === "DB Closed"}
          <p class="error-message">{dbStatus}</p>
          <p>
            Notes cannot be loaded or saved. Check browser settings or try
            refreshing.
          </p>
        {:else if pages.length === 0 && db}
          <p>No notes found. Create one!</p>
          <button
            on:click={addPage}
            class="add-page-button-main"
            disabled={!db}
          >
            + Add Page
          </button>
        {:else if pages.length > 0 && db}
          <p>Select a page from the sidebar to start editing.</p>
        {:else}
          <p>Loading notes application...</p>
        {/if}
      </div>
    {/if}
  </main>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap");
  :global(body) {
    margin: 0;
    font-family: "Pixelify Sans", sans-serif;
    background-image: url("https://github.com/nav9v/sip24-svelte-quick-notes/blob/nav9v/assets/bg.gif?raw=true");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    width: 100vw;
    overflow: hidden;
    color: #e0e0e0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .app-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    position: relative;
  }
  .sidebar-toggle {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1001;
    background-color: rgba(30, 30, 30, 0.8);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    line-height: 38px;
    text-align: center;
    backdrop-filter: blur(5px);
    transition: background-color 0.2s ease;
  }
  .sidebar-toggle:hover {
    background-color: rgba(50, 50, 50, 0.9);
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background-color: rgba(10, 10, 10, 0.85);
    border-right: 1px solid #444;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
  }
  .sidebar-content {
    padding: 20px 10px;
    flex-grow: 1;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .pages-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .status-message,
  .no-pages-message {
    padding: 10px 12px;
    color: #aaa;
    font-style: italic;
    font-size: 0.9em;
  }
  .status-message.error {
    color: #f87171;
    font-weight: bold;
  }
  .page-item {
    display: flex;
    padding: 0px 7px 0px 0px;
    gap: 5px;
    align-items: center;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    background-color: rgba(255, 255, 255, 0.05);
  }
  .page-item.active {
    background-color: rgba(181, 182, 184, 0.4);
  }
  .page-item:not(.active):hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  button {
    font-family: inherit;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: transparent;
    color: inherit;
    padding: 0;
    text-align: left;
    line-height: normal;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      opacity 0.2s ease;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .page-button,
  .delete-button,
  .add-page-button,
  .save-button,
  .add-page-button-main {
    padding: 8px 12px;
    border: 1px solid transparent;
    flex-shrink: 0;
    font-size: 15px;
  }
  .page-button {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
    color: #e0e0e0;
    text-align: left;
    padding: 10px 12px;
  }
  .page-item.active .page-button {
    color: #fff;
    font-weight: 500;
  }
  .delete-button {
    background-color: rgba(39, 36, 36, 0.548);
    color: #ffffff;
    padding: 15px;
    font-size: 16px;
    line-height: 1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    box-sizing: border-box;
    transition: background-color 0.2s ease;
  }
  .delete-button:hover:not(:disabled) {
    background-color: rgb(255, 0, 0);
  }
  .add-page-item {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #444;
  }
  .add-page-button {
    background-color:rgb(255, 77, 0);
    color: white;
    width: 100%;
    text-align: center;
    font-weight: 500;
  }
  .add-page-button:hover:not(:disabled) {
    background-color: rgb(255, 157, 0);
  }
  .main-content {
    margin-left: 240px;
    padding: 25px 30px;
    width: calc(100% - 240px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .note-header {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
    margin: 0 0 20px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .note-title {
    font-family: "Pixelify Sans", sans-serif;
    font-size: 28px;
    font-weight: 700;
    border: none;
    border-bottom: 2px solid rgba(137, 79, 79, 0.5);
    outline: none;
    color: #fffdfd;
    background-color: transparent;
    flex-grow: 1;
    resize: none;
    line-height: 1.3;
    padding: 8px 10px;
    transition: border-color 0.2s ease;
    min-width: 0;
  }
  .note-title::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 400;
  }
  .note-title:focus {
    border-bottom-color: rgba(187, 129, 129, 0.9);
  }
  .note-title:disabled {
    background-color: rgba(0, 0, 0, 0.2);
    border-bottom-color: rgba(100, 100, 100, 0.5);
  }
  .note-textarea {
    display: block;
    font-family: "Pixelify Sans", sans-serif;
    border-radius: 8px;
    border: 2px solid rgb(137, 79, 79);
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: rgb(230, 230, 230);
    width: 100%;
    flex-grow: 1;
    padding: 20px;
    font-size: 18px;
    resize: none;
    margin: 0 0 20px;
    box-sizing: border-box;
    line-height: 1.6;
    overflow-y: auto;
    min-height: 200px;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;
  }
  .note-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  .note-textarea:focus {
    outline: none;
    border-color: rgb(187, 129, 129);
    background-color: rgba(0, 0, 0, 0.5);
  }
  .note-textarea:disabled {
    background-color: rgba(0, 0, 0, 0.6);
    border-color: rgba(100, 100, 100, 0.7);
  }
  .save-button {
    background-color: #10b981;
    color: white;
    font-weight: 500;
    padding: 10px 20px;
  }
  .save-button:hover:not(:disabled) {
    background-color: #0e9f6e;
  }
  .no-page-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    gap: 20px;
    padding: 20px;
  }
  .no-page-selected p {
    font-size: 1.2em;
    margin: 0;
  }
  .no-page-selected .error-message {
    color: #f87171;
    font-weight: bold;
  }
  .add-page-button-main {
    display: inline-block;
    width: auto;
    background-color: rgba(37, 99, 235, 0.8);
    color: white;
    font-weight: 500;
    padding: 10px 20px;
    font-size: 15px;
    text-align: center;
  }
  .add-page-button-main:hover:not(:disabled) {
    background-color: rgba(29, 78, 216, 0.9);
  }
  @media screen and (max-width: 768px) {
    .sidebar-toggle {
      display: block;
    }
    .sidebar {
      transform: translateX(-100%);
      border-right: none;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3);
    }
    .sidebar.open {
      transform: translateX(0);
    }
    .sidebar-content {
      padding-top: 65px;
    }
    .main-content {
      margin-left: 0;
      width: 100%;
      padding: 70px 15px 20px 15px;
      position: relative;
      z-index: 1;
    }
    .note-header {
      margin: 0 0 15px;
    }
    .note-title {
      font-size: 24px;
      padding: 6px 8px;
    }
    .note-textarea {
      font-size: 16px;
      padding: 15px;
      min-height: 150px;
      margin-bottom: 15px;
    }
    .page-button,
    .delete-button,
    .add-page-button,
    .save-button,
    .add-page-button-main {
      padding: 8px 10px;
      font-size: 14px;
    }
    .save-button {
      padding: 8px 15px;
    }
    .delete-button {
      width: 26px;
      height: 26px;
      padding: 5px;
      font-size: 14px;
    }
    .page-button {
      padding: 8px 10px;
    }
    .add-page-button-main {
      padding: 8px 15px;
    }
  }
  @media screen and (max-width: 480px) {
    .sidebar {
      width: 220px;
    }
    .sidebar-content {
      padding-top: 65px;
      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 15px;
    }
    .main-content {
      padding: 65px 10px 15px 10px;
    }
    .note-header {
      gap: 10px;
      margin-bottom: 10px;
    }
    .note-title {
      font-size: 20px;
      padding: 5px 6px;
    }
    .page-button,
    .delete-button,
    .add-page-button,
    .save-button,
    .add-page-button-main {
      padding: 6px 8px;
      font-size: 13px;
    }
    .save-button {
      padding: 6px 12px;
    }
    .delete-button {
      width: 24px;
      height: 24px;
      padding: 4px;
      font-size: 13px;
    }
    .page-button {
      padding: 6px 8px;
    }
    .add-page-button-main {
      padding: 6px 12px;
    }
    .note-textarea {
      font-size: 15px;
      padding: 10px;
      line-height: 1.5;
      min-height: 120px;
      margin-bottom: 15px;
    }
  }
</style>
