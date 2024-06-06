<script>
  import { onMount } from "svelte";

  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
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
    pages.push("New Page");
    seletePages(pages.length ? pages.length - 1 : 0);
  }

  function seletePages(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deleteNote(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);

    if (index === currentPageIndex) {
      currentPageIndex = pages.length ? 0 : -1;
      if (currentPageIndex !== -1) {
        title = pages[currentPageIndex];
        note = localStorage.getItem(title);
      } else {
        title = "";
        note = "";
      }
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 w-60 z-40 h-screen">
  <div
    class="bg-gray-300 px-3 py-7 h-full overflow-y-auto border-r border-slate-500"
  >
    <ul class="space-y-4">
      {#each pages as page, index}
        <li class="space-x-2">
          <button
            class="{index === currentPageIndex
              ? 'bg-slate-700 text-slate-100'
              : 'border border-slate-700 text-black'}  py-2 px-3 rounded-lg"
            on:click={() => seletePages(index)}>{page}</button
          >

          <button
            on:click={() => deleteNote(index)}
            class="rounded-md px-3 py-1 bg-red-600 text-white font-semibold"
            >X</button
          >
        </li>
      {/each}

      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <h1 class="text-center text-3xl font-bold my-3">Note App</h1>
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-xl" contenteditable bind:textContent={title}></h1>
    <button
      class="ml-auto mt-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:border-gray-700"
      on:click={saveNote}>Save</button
    >
  </div>

  <hr />

  <textarea
    class=" mt-2 block w-full focus:outline-none bg-gray-100 border border-gray-100 rounded-lg p-3"
    bind:value={note}
  ></textarea>
</main>

<style>
</style>
