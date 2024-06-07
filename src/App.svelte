<script lang="ts">
    import { onMount } from 'svelte';
    let pages = JSON.parse(localStorage.getItem("pages")) || [];
    let currentPageIndex = 0;
    let title = 'New Note';
    let note = '';

    onMount(() => {
        loadPageData();
    });

    function loadPageData() {
        if (pages.length > 0) {
            title = pages[currentPageIndex];
            note = localStorage.getItem(title) || 'New Note';
        }
    }

    function saveNote() {
        const storedPage = pages[currentPageIndex];
        if (storedPage !== title) {
            localStorage.removeItem(storedPage);
            pages[currentPageIndex] = title;
        }
        localStorage.setItem(title, note);
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function addPage() {
        const newPageTitle = "New Note" + (pages.length + 1);
        pages.push(newPageTitle);
        selectPage(pages.length - 1);
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];
        note = localStorage.getItem(title) || '';
    }

    function deleteNote() {
        const pageToDelete = pages[currentPageIndex];
        localStorage.removeItem(pageToDelete);
        pages.splice(currentPageIndex, 1);
        if (currentPageIndex >= pages.length && currentPageIndex !== 0) {
            currentPageIndex--;
        }
        if (pages.length > 0) {
            loadPageData();
        } else {
            title = 'New Note';
            note = '';
        }
        localStorage.setItem("pages", JSON.stringify(pages));
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
