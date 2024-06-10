<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentpageindex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentpageindex];
      note = localStorage.getItem(title);
    } else {
      addpage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentpageindex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentpageindex] = title;
    }

    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addpage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentpageindex = index;
    title = pages[currentpageindex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const storedPageName = pages[index];
    let newPages = pages.slice(0, index);
    let newPages2 = pages.slice(index + 1, pages.length);
    pages = newPages.concat(newPages2);
    localStorage.setItem("pages", JSON.stringify(pages));
    localStorage.removeItem(storedPageName);
    if (index === currentpageindex) {
      currentpageindex = 0;
      if (pages.length > 0) {
        selectPage(currentpageindex);
      } else {
        title = '';
        note = '';
      }
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen shadow-lg">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="relative flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index == currentpageindex ? 'bg-dark-gray text-white' : 'bg-white text-gray-900'} py-2 px-3 rounded-lg flex-grow transition-all duration-300 ease-in-out shadow">{page}</button>
          <button class="delete-button" on:click={() => deletePage(index)} aria-label="Delete Page {page}">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addpage} class="font-medium bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 ease-in-out">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-6 ml-60 h-auto bg-gray-100">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-600 transition-all duration-300 ease-in-out" on:click={saveNote}>Save</button>
  </div>
  <hr class="border-gray-300"/>
  <textarea class="mt-3 block w-full bg-white border border-gray-300 rounded-lg text-gray-900 p-2.5 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #F8F9FA;
  }

  .bg-dark-gray {
    background: #343A40;
  }

  .delete-button {
    display: inline-block;
    padding: 8px 12px;
    margin-left: 10px;
    font-size: 14px;
    color: white;
    background-color: #E3342F;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .delete-button:hover {
    background-color: #CC1F1A;
  }

  .shadow {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .shadow-inner {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
</style>
