<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = 'Page Title';
  let note = '';

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
      }
    });

    const savedPages = await db.getAllKeys('notes');
    if (savedPages.length > 0) {
      pages = savedPages;
      title = pages[currentPageIndex];
      const storedNote = await db.get('notes', title);
      note = storedNote ? storedNote.note : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, note });
  }

  function updateTitle(event) {
    title = event.target.innerText;
  }

  async function addPage() {
    const newPageTitle = `Page ${pages.length + 1}`;
    await db.put('notes', { title: newPageTitle, note: '' });
    pages.push(newPageTitle);
    currentPageIndex = pages.length - 1;
    
    // Reset note to default empty value
    note = '';
  }

  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.delete('notes', pageToDelete);
    pages.splice(currentPageIndex, 1);
    if (currentPageIndex >= pages.length) {
      currentPageIndex = Math.max(0, pages.length - 1);
    }
    title = pages[currentPageIndex];
    const storedNote = await db.get('notes', title);
    note = storedNote ? storedNote.note : '';
    
    // Reset note to default empty value
    note = '';
  }

  async function setCurrentPage(index) {
    currentPageIndex = index;
    title = pages[index];
    note = '';
    const storedNote = await db.get('notes', title);
    note = storedNote ? storedNote.note : '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-200 p-4">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button 
          class:bg-gray-400={index === currentPageIndex} 
          class:bg-gray-300={index !== currentPageIndex} 
          class="py-2 px-4 text-gray-900 rounded-lg w-full text-left"
          on:click={() => setCurrentPage(index)}>
          {page}
        </button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={addPage} class="font-medium">+ Add Page</button>
    </li>
  </ul>
</aside>

<main class="ml-60 p-4">
  <div class="flex justify-between items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable on:input={updateTitle}>{title}</h1>
    <button
      class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900"
      on:click={saveNote}
    >
      Save
    </button>
    <button
      class="ml-3 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700"
      on:click={deletePage}
    >
      Delete
    </button>
  </div>
  <hr/>
  <textarea
    class="mt-3 block w-full bg-yellow-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
    placeholder="Add note"
  ></textarea>
</main>
