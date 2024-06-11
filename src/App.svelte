<script>

  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'Today is an excellent day!';

  let db;

  const request = indexedDB.open('notes', 1);

  request.onerror = function(event) {
    console.log("Database error: " + event.target.errorCode);
  };

  request.onsuccess = function(event) {
    db = event.target.result;
  };

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("note", { keyPath: "id", autoIncrement:true });
  };

  function saveNote() {
    const transaction = db.transaction(["note"], "readwrite");
    const objectStore = transaction.objectStore("note");
    
    const newNote = { title: title, note: note };
    const request = objectStore.add(newNote);

    request.onsuccess = function(event) {
      console.log("Note saved successfully");
    };

    request.onerror = function(event) {
      console.log("Error saving note");
    };
}

  function deleteNote() {
    const transaction = db.transaction(["note"], "readwrite");
    const objectStore = transaction.objectStore("note");
    
    const request = objectStore.clear();

    request.onsuccess = function(event) {
      console.log("Notes deleted successfully");
    };

    request.onerror = function(event) {
      console.log("Error deleting notes");
    };
  }

  function addPage() {
  pages.push("New Page");
  pages = pages;
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button class="bg-dark-gray py-2 px-3 text-grey-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
  <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
  </div>
  <hr/>
  <input class="block w-full bg-teal-50 border border-grey-300 rounded-lg text-grey-900 p-2.5" bind:value={title} type='text'>
  <textarea class="mt-3 block w-full bg-teal-50 border border-grey-300 rounded-lg text-grey-900 p-2.5" bind:value={note}></textarea>
  <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  <button class="ml-auto bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900" on:click={deleteNote}>Delete</button>
</main>

<style>
  .bg-light-blue{
  background-color: aqua;
  }
</style>