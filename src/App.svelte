<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(0); // Select the first page
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("Note Title");
    selectPage(pages.length - 1); // Select the newly added page
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete); // Remove note data from localStorage
    pages.splice(index, 1); // Remove the page from the pages array
    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      selectPage(currentPageIndex);
    }
    localStorage.setItem("pages", JSON.stringify(pages)); // Update pages in localStorage
  }

  function updatePageTitle(index, newTitle) {
    pages[index] = newTitle;
    if (index === currentPageIndex) {
      title = newTitle;
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <div class="flex-grow">
            <div 
              contenteditable
              class="page-button {index === currentPageIndex ? 'current-page' : ''} py-2 px-3 text-gray-900 rounded-lg cursor-pointer"
              on:click={() => selectPage(index)}
              on:blur={(e) => updatePageTitle(index, e.target.textContent)}
              on:keydown={(e) => e.key === 'Enter' && e.preventDefault()}
            >{page}</div>
          </div>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">&#x2715;</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold w-full h-10 leading-10" contenteditable on:blur={(e) => title = e.target.textContent}>
      {title || "Note Title"}
    </h1>
    <div class="flex justify-end">
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={() => deletePage(currentPageIndex)}>Delete</button>
      <button class="bg-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 ml-3 hover:bg-green-900" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" placeholder="Add your note here" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }

  .contenteditable {
    outline: none;
  }

  .placeholder-title::before {
    content: attr(placeholder);
    color: #aaa;
  }

  textarea {
    outline: none;
  }

  textarea::placeholder {
    color: #aaa;
  }

  .page-button {
    transition: background-color 0.3s ease;
  }

  .current-page {
    background-color: #d0d0d0; /* Darker gray for the selected page button */
  }
</style>
