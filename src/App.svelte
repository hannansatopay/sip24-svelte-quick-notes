<script>
  import { onMount } from 'svelte';
  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;
  let isSidebarOpen = true; // For mobile responsiveness

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
    saveNote(); // Auto-save when switching pages
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    if (!confirm(`Are you sure you want to delete "${pageTitle}"?`)) return;
    
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

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<div class="flex h-screen bg-gray-100">
  <!-- Mobile menu button -->
  <button 
    class="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
    on:click={toggleSidebar}
  >
    {isSidebarOpen ? '✕' : '☰'}
  </button>

  <!-- Sidebar -->
  <aside class:hidden={!isSidebarOpen} class="md:block md:relative md:w-64 bg-white shadow-lg">
    <div class="p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">My Notes</h2>
      <ul class="space-y-2">
        {#each pages as page, index}
          <li class="flex items-center bg-gray-100 rounded-md p-2 hover:bg-gray-200 transition-colors">
            <button
              on:click={() => selectPage(index)}
              class="flex-grow text-left text-gray-700 font-medium"
              class:text-blue-600={currentPageIndex === index}
            >
              {page}
            </button>
            <button
              on:click|stopPropagation={() => deletePage(index)}
              class="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Delete page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            </button>
          </li>
        {/each}
        <li class="mt-4">
          <button 
            on:click={addPage} 
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add Page
          </button>
        </li>
      </ul>
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-grow p-6 md:p-10">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center mb-6">
        <input 
          type="text"
          bind:value={title}
          placeholder="Page Title"
          class="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none flex-grow mr-4"
        />
        <button 
          on:click={saveFunc}
          class="bg-green-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
        >
          Save
        </button>
      </div>
      <textarea 
        bind:value={note} 
        placeholder="Your notes here..."
        class="w-full h-[calc(100vh-200px)] bg-white border border-gray-300 rounded-md text-gray-700 p-4 focus:border-blue-500 outline-none resize-none"
      ></textarea>
    </div>
  </main>
</div>

<style>
  
</style>