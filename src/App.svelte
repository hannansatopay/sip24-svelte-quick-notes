<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(async () => {
    // Open IndexedDB database
    db = await openDB();
    // Retrieve pages from the database
    pages = await getAllPages();
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex);
    }
  });

  async function openDB() {
    return await idb.openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'title' });
      }
    });
  }

  async function getAllPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    return await store.getAll();
  }

  async function savePage(page) {
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    await store.put(page);
    await tx.done;
  }

  async function deletePage(page) {
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    await store.delete(page.title);
    await tx.done;
  }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      deletePage({ title: storedPageName });
      pages[currentPageIndex] = title;
    }
    savePage({ title, note });
  }

  function addPage() {
    const newTitle = `New Page ${pages.length + 1}`;
    pages.push(newTitle);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    const page = await store.get(title);
    note = page ? page.note : '';
  }

  async function deleteNote() {
    if (confirm("Are you sure you want to delete this note?")) {
      await deletePage({ title });
      pages.splice(currentPageIndex, 1);
      if (pages.length === 0) {
        addPage();
      } else {
        selectPage(currentPageIndex >= pages.length ? pages.length - 1 : currentPageIndex);
      }
    }
  }
</script>

<main>
  <!-- MAIN CONTENT -->
</main>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <!-- MAIN CONTENT -->
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
