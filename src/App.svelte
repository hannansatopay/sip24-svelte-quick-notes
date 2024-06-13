<script>
    import { onMount } from "svelte";

    let db;
    let pages = [];
    let currentPageIndex = 0;
    let title = "";
    let note = "";

    // Open or create IndexedDB database
    const request = indexedDB.open("notes_db", 1);

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.error);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadPagesFromDB();
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        // Create an object store for notes
        const notesStore = db.createObjectStore("notes", { keyPath: "title" });
    };

    function loadPagesFromDB() {
        const transaction = db.transaction(["notes"]);
        const noteStore = transaction.objectStore("notes");
        const request = noteStore.getAllKeys();

        request.onsuccess = function (event) {
            pages = event.target.result;
            if (pages.length === 0) {
                addPage();
            } else {
                selectPage(currentPageIndex);
            }
        };
    }

    function saveNote() {
        const transaction = db.transaction(["notes"], "readwrite");
        const noteStore = transaction.objectStore("notes");

        const storedPageName = pages[currentPageIndex];

        if (storedPageName !== title) {
            noteStore.delete(storedPageName);
        }

        const newNote = { title, content: note };
        noteStore.put(newNote);

        // Update pages list
        pages[currentPageIndex] = title;
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function addPage() {
        const transaction = db.transaction(["notes"], "readwrite");
        const noteStore = transaction.objectStore("notes");

        const newPage = { title: "New Page", content: "" };
        const request = noteStore.add(newPage);

        request.onsuccess = function () {
            pages.push(newPage.title);
            selectPage(pages.length - 1);
        };
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];

        const transaction = db.transaction(["notes"]);
        const noteStore = transaction.objectStore("notes");
        const request = noteStore.get(title);

        request.onsuccess = function (event) {
            const noteData = event.target.result;
            if (noteData) {
                note = noteData.content;
            } else {
                note = "";
            }
        };
    }

    function deletePage(index) {
        const pageName = pages[index];
        const transaction = db.transaction(["notes"], "readwrite");
        const noteStore = transaction.objectStore("notes");

        noteStore.delete(pageName);

        pages.splice(index, 1); // Remove the page from the array
        localStorage.setItem("pages", JSON.stringify(pages)); // Update pages list in localStorage

        if (currentPageIndex === index) {
            currentPageIndex = 0; // If the currently selected page is deleted, reset to the first page
        }
    }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div
        class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-100"
    >
        <ul class="space-y-2">
            {#each pages as page, index}
                <li>
                    <button
                        on:click={() => selectPage(index)}
                        class="{index == currentPageIndex
                            ? 'bg-dark-gray'
                            : ''} py-2 px-3 text-gray-900 rounded-lg"
                        >{page}</button
                    >
                    <button
                        on:click={() => deletePage(index)}
                        class="ml-2 py-2 px-3 text-red-600 rounded-lg"
                    >
                        Delete
                    </button>
                </li>
            {/each}
            <li class="text-center">
                <button on:click={addPage} class="font-medium"
                    >+ Add Page</button
                >
            </li>
        </ul>
    </div>
</aside>
<main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
        <h1
            class="text-3xl font-bold"
            contenteditable
            bind:textContent={title}
        ></h1>
        <button
            class=" ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
            on:click={saveNote}>Save</button
        >
    </div>
    <hr />

    <textarea
        class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5"
        bind:value={note}
    ></textarea>
</main>

<style>
    .bg-light-gray {
        background: #fbfbfb;
    }

    .bg-dark-gray {
        background: #efefef;
    }
</style>
