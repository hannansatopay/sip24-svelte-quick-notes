<script>
    import { onMount } from 'svelte';

    let title = 'new note';
    let note = 'today is an excellent day';
    let pages = [];
    let currentPageIndex = 0;
    let db;

    onMount(() => {
        // Open or create the IndexedDB database
        const request = indexedDB.open('notes_db', 1);

        request.onerror = function(event) {
            console.error('Database error: ', event.target.errorCode);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            loadPagesFromDB();
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            const objectStore = db.createObjectStore('notes', { keyPath: 'title' });
            objectStore.transaction.oncomplete = function() {
                loadPagesFromDB();
            };
        };
    });

    function loadPagesFromDB() {
        const transaction = db.transaction(['notes'], 'readonly');
        const objectStore = transaction.objectStore('notes');
        const pagesRequest = objectStore.getAllKeys();

        pagesRequest.onsuccess = function(event) {
            pages = event.target.result;
            if (pages.length === 0) {
                pages.push('new note');
            }
            selectPage(0);
        };
    }

    function savenote() {
        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.put({ title, note });

        request.onsuccess = function(event) {
            console.log('Note saved successfully');
        };

        request.onerror = function(event) {
            console.error('Error saving note: ', event.target.errorCode);
        };

        // Update pages list if necessary
        if (!pages.includes(title)) {
            pages.push(title);
        }
    }

    function deleteNote() {
        if (currentPageIndex === 0) {
            console.log('Cannot delete the default note');
            return;
        }

        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.delete(title);

        request.onsuccess = function(event) {
            console.log('Note deleted successfully');
            pages.splice(currentPageIndex, 1);
            if (currentPageIndex >= pages.length) {
                currentPageIndex--;
            }
            selectPage(currentPageIndex);
        };

        request.onerror = function(event) {
            console.error('Error deleting note: ', event.target.errorCode);
        };
    }

    function addPage() {
        const newTitle = `new page ${pages.length + 1}`;
        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.add({ title: newTitle, note: '' });

        request.onsuccess = function(event) {
            console.log('New page added successfully');
            pages.push(newTitle);
            currentPageIndex = pages.length - 1;
            selectPage(currentPageIndex);
        };

        request.onerror = function(event) {
            console.error('Error adding new page: ', event.target.errorCode);
        };
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];
        const transaction = db.transaction(['notes'], 'readonly');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.get(title);

        request.onsuccess = function(event) {
            note = event.target.result ? event.target.result.note : '';
        };

        request.onerror = function(event) {
            console.error('Error retrieving note: ', event.target.errorCode);
        };
    }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-pink-100 shadow-md p-4">
    <div class="bg-white rounded-lg p-4">
        <h2 class="text-xl font-bold mb-4">Pages</h2>
        <ul>
            {#each pages as page, index}
                <li class="{currentPageIndex === index ? 'bg-pink-200' : ''} mb-2 rounded-lg">
                    <button class="py-2 px-3 w-full text-left" on:click={() => selectPage(index)}>{page}</button>
                    {#if index !== 0}
                        <button class="text-red-600 ml-2" on:click={() => deleteNote()}>🗑️</button>
                    {/if}
                </li>
            {/each}
        </ul>
        <button class="bg-pink-500 py-2 px-3 text-white rounded-lg w-full mt-3" on:click={addPage}>Add Page</button>
    </div>
</aside>

<main class="ml-60 p-6">
    <div class="mb-6">
        <input class="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full" type="text" bind:value={title}>
        <button class="bg-pink-500 text-white rounded-lg px-4 py-2 ml-2" on:click={savenote}>Save</button>
    </div>
    <textarea class="bg-white border border-gray-300 rounded-lg px-3 py-2 w-full" bind:value={note}></textarea>
</main>

<style>
    body {
        font-family: 'Roboto', sans-serif;
    }

    .bg-pink-100 {
        background-color: #FCE4EC;
    }

    .bg-pink-200 {
        background-color: #FFB6C1;
    }

    .shadow-md {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
