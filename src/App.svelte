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

<aside class="fixed top-0 left-0 z-40 w-60 h-screen" style="background-color: #FFC0CB; padding: 20px; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
        <h2 class="text-xl font-bold mb-3">Pages</h2>
        <ul>
            {#each pages as page, index}
                <li class="{currentPageIndex === index ? 'bg-pink-200' : ''} mb-2 flex items-center">
                    <button
                            class="py-2 px-3 rounded-lg w-full text-left"
                            on:click={() => selectPage(index)}>
                        {page}
                    </button>
                    {#if index !== 0}
                        <button class="text-red-600 ml-2" on:click={() => deleteNote()}>🗑️</button>
                    {/if}
                </li>
            {/each}
        </ul>
        <button class="bg-pink-500 py-2 px-3 text-white rounded-lg w-full mt-3" on:click={addPage}>Add Page</button>
    </div>
</aside>

<main class="p-6 ml-60 h-auto" style="background-color: #FCE4EC; border-radius: 15px; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);">
    <div class="grid grid-cols-2 items-center mb-3">
        <h1 class="text-3xl font-bold" contenteditable="true" bind:textContent={title} style="color: #FF69B4;"></h1>
        <button class="rounded-lg px-4 py-2 bg-gray-300 ml-auto" on:click={savenote} style="border: 2px solid #FF69B4; color: #FF69B4;">Save</button>
    </div>
    <hr class="mb-3">
    <textarea class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-3" bind:value={note} style="resize: none; min-height: 400px;"></textarea>
</main>

<style>
    .bg-light-gray {
        background: #FBFBFB;
    }
    .bg-dark-gray {
        background: #EFEFEF;
    }
    .bg-pink-200 {
        background: #FFB6C1;
    }
</style>
