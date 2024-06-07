<script lang="ts">
    import { onMount } from 'svelte';

    let pages = [];
    let currentPageIndex = 0;
    let title = 'New Note';
    let note = '';

    let db;

    onMount(() => {
        openDB();
    });

    function openDB() {
        const dbName = "NotesDB";
        const request = window.indexedDB.open(dbName, 1);

        request.onerror = function(event) {
            console.error("Error opening database:", request.error);
        };

        request.onsuccess = function(event) {
            db = request.result;
            loadPageData();
        };

        request.onupgradeneeded = function(event) {
            db = request.result;
            if (!db.objectStoreNames.contains("notes")) {
                const objectStore = db.createObjectStore("notes", { keyPath: "title" });
            }
        };
    }

    //To refresh the notes list
    function loadPageData() {
        const transaction = db.transaction(["notes"], "readonly");
        const objectStore = transaction.objectStore("notes");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const result = request.result;
            pages = result.map(note => note.title);
            if (pages.length > 0) {
                selectPage(currentPageIndex);
            }
        };

        request.onerror = function(event) {
            console.error("Error loading notes:", request.error);
        };
    }

    //to save the note and refreshes
    function saveNote() {
        const transaction = db.transaction(["notes"], "readwrite");
        const objectStore = transaction.objectStore("notes");
        const request = objectStore.put({ title, note });

        request.onsuccess = function(event) {
            console.log("Note saved successfully");
            loadPageData(); // Update the pages list after saving the note
        };

        request.onerror = function(event) {
            console.error("Error saving note:", request.error);
        };
    }

    //adds new note page
    function addPage() {
        const newPageTitle = "New Note" + (pages.length + 1);
        pages.push(newPageTitle);
        selectPage(pages.length - 1);
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];

        const transaction = db.transaction(["notes"], "readonly");
        const objectStore = transaction.objectStore("notes");
        const request = objectStore.get(title);

        request.onsuccess = function(event) {
            const result = request.result;
            if (result) {
                note = result.note;
            } else {
                note = '';
            }
        };

        request.onerror = function(event) {
            console.error("Error loading note:", request.error);
        };
    }

    //deletes note and refreshes
    function deleteNote() {
        const transaction = db.transaction(["notes"], "readwrite");
        const objectStore = transaction.objectStore("notes");
        const request = objectStore.delete(title);

        request.onsuccess = function(event) {
            const index = pages.indexOf(title);
            if (index !== -1) {
                pages.splice(index, 1);
                if (currentPageIndex >= pages.length && currentPageIndex !== 0) {
                    currentPageIndex--;
                }
                if (pages.length > 0) {
                    selectPage(currentPageIndex);
                } else {
                    title = 'New Note';
                    note = '';
                }
            }
            loadPageData(); // Update the pages list after deleting the note
        };

        request.onerror = function(event) {
            console.error("Error deleting note:", request.error);
        };
    }
</script>

<aside class="fixed top-0 left-0 z-50 w-60 h-screen">
    <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-blue-500">
        <ul class="space-y-1">
            {#each pages as page, index}
            <li class="text-center">
                <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-blue-500' : 'bg-blue-800'} text-white px-10 py-2.5 font-medium rounded-lg p-2.5">
                    {page}
                </button>
            </li>
            {/each}

            <li class="text-center">
                <button class="font-medium text-bold px-5 py-2 border border-blue-800 rounded-lg" on:click={addPage}>+ Add Page</button>
            </li>
        </ul>
    </div>
</aside>

<main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
        <h1 class="text-blue font-bold text-3xl"> Notes App</h1>
    </div>
    <hr/>
    <h1 class="mt-3 text-blue font-bold text-1xl bg-blue-50 border border-gray-300 rounded-lg text-bl-900 p-2.5" contenteditable bind:textContent={title}></h1>
    <textarea class="mt-3 block w-full bg-blue-50 border border-gray-300 rounded-lg text-bl-900 p-2.5" bind:value={note} placeholder='Description' style="height:200px"></textarea>
    <button class="ml-3 mt-3 bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-small hover:bg-blue-500" on:click={saveNote}>Save</button>
    <button class="ml-3 mt-3 bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium text-small hover:bg-red-800" on:click={deleteNote}>Delete</button>
</main>

<style>
    .bg-light-blue {
        background: #b1dbff;
    }
</style>
