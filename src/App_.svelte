<script>
    import { onMount } from "svelte";
    let title = "";
    let note = "";
    let pages = [];
    let currentPageIndex = 0;

    onMount(async () => {
        const savedPages = localStorage.getItem("pages");
        if (savedPages) {
            pages = JSON.parse(savedPages);
            title = pages(currentPageIndex);
            note = localStorage.getItem(title);
        } else {
            addPage();
        }
    });

    function saveNote() {
        const storedPageName = pages[currentPageIndex];
        if (storedPageName != title) {
            localStorage.removeItem(storedPageName);
            pages[currentPageIndex] = title;
        }
        localStorage.setItem(title, note);
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function addPage() {
        pages.push("New page");
        selectPage(pages.length ? pages.length - 1 : 0);
    }

    function deletePage() {
        localStorage.removeItem(pages[currentPageIndex]);
        const index = pages.indexOf(pages[currentPageIndex]);
        if (index > -1) {
            pages.splice(index, 1);
        }
        pages = pages;
        localStorage.setItem("pages", JSON.stringify(pages));
    }

    function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];
        note = localStorage.getItem(title);
    }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div
        class="bg-light-grey overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
    >
        <ul class="space-y-2">
            {#each pages as page, index}
                <li>
                    <button
                        on:click={() => selectPage(index)}
                        class="{index == currentPageIndex
                            ? 'bg-dark-grey'
                            : ''} py-2 px-3 text-gray-900 rounded-lg"
                        >{page}</button
                    >
                </li>
            {/each}
            <li class="text-center">
                <button
                    class="font-medium bg-gray-50 rounded-lg px-5 py-2"
                    on:click={addPage}>+ Add page</button
                >
            </li>
            <li class="text-center">
                <button
                    class="font-medium bg-gray-50 rounded-lg px-5 py-2"
                    on:click={deletePage}>Delete page</button
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
            class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
            on:click={saveNote}>Save</button
        >
    </div>
    <hr />
    <textarea
        class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
        bind:value={note}
    ></textarea>
</main>

<style>
    .bg-light-grey {
        background: rgb(220, 218, 218);
    }
    .bg-dark-grey {
        background: rgb(169, 169, 169);
    }
</style>
