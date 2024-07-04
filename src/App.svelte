<script>
  import { onMount } from 'svelte';

  let title = 'New Note';
  let note = 'Today is an excellent day!';
  let pages = JSON.parse(localStorage.getItem('pages')) || ['New Page'];
  let currentPageIndex = 0;

  onMount(() => {
    selectPage(0);
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem('pages', JSON.stringify(pages));
    console.log('Note saved:', { title, note });
  }


  
  function addPage() {
    pages.push('New Page');
    selectPage(pages.length - 1);
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    localStorage.setItem('pages', JSON.stringify(pages));
    if (pages.length === 0) {
      pages.push('New Page');
    }
    selectPage(index > 0 ? index - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <input
    class="block w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    type="text"
    bind:value={title}
    placeholder="Title"
  />
  <textarea
    class="mt-3 block w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    bind:value={note}
    placeholder="Write your note here..."
  ></textarea>
  <button
    class="bg-gray-800 text-white px-5 py-2.5 mt-3 rounded-lg font-medium transition duration-300 transform hover:scale-105"
    on:click={saveNote}
  >
    Save Note
  </button>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
  main {
    max-width: 600px;
    margin: 0 auto;
  }
  input,
  textarea {
    font-size: 1rem;
  }
</style>
