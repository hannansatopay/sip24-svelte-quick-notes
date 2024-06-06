<script>
  import { onMount } from 'svelte';
  let currentPageID;
  let title;
  let note;
  let db;
  let getNoteCalled = false;
  let titles = [];

  onMount(() => {
    const request = indexedDB.open("notesDatabase", 1); // Increment version
    
    request.onupgradeneeded = (event) => {
      db = request.result;
      const objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
      console.log("Object store created");
    }

    request.onsuccess = () => {
      db = request.result;
      console.log("Db opened");
      getAllTitles();
    }

    
  })

  // Function to save a note
  function saveNote(){
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    let request;
    request = objectStore.put({ id: currentPageID, title: title, content: note });
        

    request.onsuccess = () => {
      console.log("Note saved successfully");
      title = '';
      note = '';
      getNote(currentPageID);
      getAllTitles();
    };
  }

  function getNote(id){
    currentPageID = id;
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const getItemRequest = objectStore.get(id);
    getItemRequest.onsuccess = (event) => {
      const item = event.target.result;
      if (item) {
        title = item.title;
        note = item.content;
      } else {
        console.log("Item not found");
      }
    };
  }

  function getAllTitles(){
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const getRequest = objectStore.getAll();

    getRequest.onsuccess = (event) => {
      titles = event.target.result;
      console.log(titles);

      //If the application is opened for the very first time, a new note automai=tically gets created!
      console.log("title Length: ", titles.length);
      if(titles.length === 0){
        addPage();
      }
      
      // This code only run once when the application is opened for the first time.
      if(!getNoteCalled){
        console.log("gettingCalled");
        getNote(event.target.result[0].id)
        currentPageID = event.target.result[0].id;
        console.log(currentPageID);
        getNoteCalled = true;
      }
    }
  }

  // Function to add a page.
  function addPage(){
    let newTitle = "Untitled";
    const transaction = db.transaction(["notes"], "readwrite");
    const ObjStore = transaction.objectStore("notes");
    const request = ObjStore.add({ title: newTitle, content: "" });

    request.onsuccess = (event) => {
      const newID = event.target.result;
      titles.push({id: newID, title: newTitle})
      titles = titles;
      getNote(newID);
      console.log(newID);
    }
  }

  // Function to delete a page
  function deletePage(id){
    console.log(currentPageID);
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");

    // If only 1 page is left, dont delete it, just erase its contents.
    if(titles.length == 1){
      title = "Untitled"
      note = "";
      saveNote();
    }
    
    else{
      objectStore.delete(id).onsuccess = (event) => {
        console.log("inside");
        titles = titles.filter(note => note.id != id);
        titles = titles;
        getNote(titles[0].id);
      }
    
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      <!-- {#each pages as page, index} -->
       {#each titles as t}
      <li>
        <button on:click={()=> getNote(t.id)} class="bg-dark-gray py-2 px-3 rounded-lg text-gray-900">{t.title || "Title"}</button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="ml-60 h-auto p-4">
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 bind:textContent={title} class="text-3xl font-bold" contenteditable>{title || "Title"}</h1>
    <div class="ml-auto">
      <button on:click={saveNote} class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900">Save</button>
    <button on:click={() => deletePage(currentPageID)} class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900">Delete</button>
    </div>
  </div>
  <hr/>
  <!--<input class="block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text" placeholder="Title">-->
  <textarea class="mt-3 block w-full b-gray-50 border-gray-300 p-2.5" bind:value={note} placeholder="Note"></textarea>
  
  
</main>

<style>
.bg-light-gray{
  background: #FBFBFB;
}

.bg-dark-gray{
  background: #EFEFEF;
}
</style>