<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  
  const db = new Dexie('NotesDatabase');
  db.version(1).stores({
    pages: '++id,title,note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await db.pages.toArray();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      currentPageIndex = -1; 
    }
  });

  async function saveNote() {
    if (currentPageIndex === -1) {
      alert('Please add a page first.');
      return;
    }

    if (pages[currentPageIndex].title !== title || pages[currentPageIndex].note !== note) {
      await db.pages.update(pages[currentPageIndex].id, { title, note });
      pages = await db.pages.toArray();
    }
  }

  async function addPage() {
    const newPage = { title: `New Page ${pages.length + 1}`, note: '' };
    await db.pages.add(newPage);
    pages = await db.pages.toArray();
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function deletePage(index) {
    if (confirm(`Do you want to delete "${pages[index].title}"?`)) {
      await db.pages.delete(pages[index].id);
      pages.splice(index, 1);
      if (pages.length === 0) {
        currentPageIndex = -1;
        title = '';
        note = '';
      } else {
        if (currentPageIndex >= pages.length) {
          currentPageIndex = pages.length - 1;
        }
        selectPage(currentPageIndex);
      }
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg w-full text-left">
            {page.title}
          </button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500 border border-red-500 rounded-lg px-1">x</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  {#if currentPageIndex !== -1}
    <div class="grid grid-cols-2 items-center mb-3">
      <input type="text" class="text-3xl font-bold border-none focus:outline-none bg-transparent" bind:value={title} placeholder="Page Title" />
      <button class="ml-auto bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
    <hr>
    <textarea class="mt-3 w-full bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5" rows="10" bind:value={note} placeholder="Write your note here..."></textarea>
  {/if}
  {#if currentPageIndex === -1}
    <div class="grid grid-cols-1 items-center mb-3">
      <h1 class="text-3xl font-bold text-gray-500">No Page Selected</h1>
    </div>
  {/if}
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #e6e4e4;
  }
</style>

