<script>
  import { onMount } from "svelte";

  let title = "";
  let note = "";
  let pages = [];
  let currentPage = 0;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPage];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPage];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPage] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages = [...pages, "New page"];
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPage = index;
    title = pages[currentPage];
    note = localStorage.getItem(title);
  }

  function deleteNote() {
    const pageToDelete = pages[currentPage];
    localStorage.removeItem(pageToDelete);
    pages.splice(currentPage, 1);
    pages = [...pages]; 
    localStorage.setItem("pages", JSON.stringify(pages));

    if (pages.length === 0) {
      addPage();
    } else {
      currentPage = Math.max(currentPage - 1, 0);
      selectPage(currentPage);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="bg-gray-100 py-2 px-3 rounded-lg">{page}</button
          >
        </li>
      {/each}

      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>
<main>
  <div class="p-8 ml-64 h-auto mr-16">
    <h1 class="font-medium text-3xl" contenteditable bind:textContent={title}>
      Simple Notes App
    </h1>

    <textarea
      bind:value={note}
      class="bg-gray-100 block w-full my-4 border border-gray-600 rounded-lg p-2.5"
      placeholder="Write in here"
    ></textarea>
    <div class="flex justify-end ">
      <button
        class="bg-green-500 text-white px-4 py-2 font-medium rounded-lg"
        on:click={saveNote}>Save</button>

      <button
        class="bg-red-700 text-white px-4 py-2 font-medium rounded-lg ml-4"
        on:click={deleteNote}>Delete</button>
    </div>
  </div>
</main>
