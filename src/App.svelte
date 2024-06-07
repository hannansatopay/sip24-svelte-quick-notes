<script>
  import { onMount } from 'svelte';
  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;

  const saveFunc = () => {
    pages[currentPageIndex] = title;
    localStorage.setItem('pages', JSON.stringify(pages));
    localStorage.setItem(title, note);
  };

  onMount(() => {
    const savedPages = localStorage.getItem('pages');
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(0);
    } else {
      addPage();
    }
  });

  function addPage() {
    const newPageTitle = `New Page ${pages.length + 1}`;
    pages = [...pages, newPageTitle];
    selectPage(pages.length - 1);
  }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {}
    pages[currentPageIndex] = title;
    localStorage.setItem('pages', JSON.stringify(pages));
    localStorage.setItem(title, note);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    localStorage.removeItem(pageTitle);
    pages = pages.filter((_, i) => i !== index);
    localStorage.setItem('pages', JSON.stringify(pages));

    if (pages.length === 0) {
      addPage();
    } else if (index === currentPageIndex) {
      selectPage(Math.min(index, pages.length - 1));
    } else if (index < currentPageIndex) {
      selectPage(currentPageIndex - 1);
    }
  }
</script>

<div class="flex h-screen bg-gray-100">
  <aside class="w-64 bg-white shadow-md">
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Pages</h2>
      <ul class="space-y-1">
        {#each pages as page, index}
          <li>
            <button
              on:click={() => selectPage(index)}
              class="w-full flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors"
              class:bg-indigo-100={currentPageIndex === index}
              class:text-indigo-700={currentPageIndex === index}
            >
              <span class="truncate">{page}</span>
              <button
                on:click|stopPropagation={() => deletePage(index)}
                class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </button>
          </li>
        {/each}
      </ul>
      <button on:click={addPage} class="w-full mt-4 bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors">
        + Add Page
      </button>
    </div>
  </aside>

  <main class="flex-1 p-8">
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="flex items-center mb-6">
        <input 
          type="text" 
          bind:value={title} 
          placeholder="Page Title"
          class="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none flex-grow"
        />
        <button on:click={saveFunc} class="ml-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors">
          Save
        </button>
      </div>
      <textarea 
        bind:value={note}
        placeholder="Start typing your notes here..."
        class="w-full h-64 p-4 text-gray-700 bg-gray-50 rounded border border-gray-200 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
      ></textarea>
    </div>
  </main>
</div>