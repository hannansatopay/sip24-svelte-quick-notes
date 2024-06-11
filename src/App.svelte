<script>
    import { onMount } from 'svelte';
    let pages = [];
    let currentPageIndex = 0;
    let title = "";
    let note = "";

    onMount(() => {
        const savedPages = localStorage.getItem("pages");
        if (savedPages) {
            pages = JSON.parse(savedPages);
            title = pages[currentPageIndex];
            note = localStorage.getItem(title);
        } else {
            addPage();
        }
        title = localStorage.getItem('title');
        note = localStorage.getItem('note');
    });

    function saveNote() {
        const storedPageName = pages[currentPageIndex];
        if (storedPageName != title) {
            localStorage.removeItem(storedPageName);
            pages[currentPageIndex] = title;
        }
        pages[currentPageIndex] = title;
        localStorage.setItem(title, note);
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function addPage() {
        pages.push("New Page");
        pages = pages;
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];
        note = localStorage.getItem(title);
    }

    function deletePage(index) {
        const pageToDelete = pages[index];
        localStorage.removeItem(pageToDelete);
        pages.splice(index, 1);
        if (index === currentPageIndex) {
            currentPageIndex = 0;
            if (pages.length > 0) {
                title = pages[currentPageIndex];
                note = localStorage.getItem(title);
            } else {
                addPage();
            }
        } else if (index < currentPageIndex) {
            currentPageIndex -= 1;
        }
        localStorage.setItem("pages", JSON.stringify(pages));
    }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="b-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
        <ul class="space-y-2">
            {#each pages as page, index}
            <li class="flex justify-between items-center">
                <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
                <button on:click={() => deletePage(index)} class="ml-2 text-red-600">Delete</button>
            </li>
            {/each}
            <li class="text-center">
                <button on:click={addPage} class="font-medium">+ Add Page</button>
            </li>
        </ul>
    </div>
</aside>

<main class='p-4 ml-60 h-auto'>
    <div class="grid grid-cols-2 items-center mb-3">
        <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
        <button class="bg-gray-900 ml-auto text-white px-5 py-2.5 font-medium text-sm hover:bg-gray-800 rounded-lg" on:click={saveNote}>SAVE</button>
    </div>
    <hr/>
    <textarea class='block w-full mt-3 mb-3 bg-gray-100 rounded-lg text-black border-black' bind:value={note}></textarea>
</main>

<style>
    .bg-dark-gray {
        background: rgb(219, 216, 238);
    }
</style>
