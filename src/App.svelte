<script lang="ts">
  import { onMount } from 'svelte';

  let pages: { id: number, title: string, note: string }[] = [];
  let currentpageIndex = 0;
  let title = '';
  let note = '';

  let db: IDBDatabase;

  onMount(() => {
    const request = window.indexedDB.open('notes_db', 1);

    request.onerror = function(event: any) {
      console.error('Database error: ' + event.target.error);
    };

    request.onsuccess = function(event: any) {
      db = event.target.result;
      loadPages();
    };

    request.onupgradeneeded = function(event: any) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('title', 'title', { unique: false });
      objectStore.createIndex('note', 'note', { unique: false });
    };
  });

  function loadPages() {
    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.getAll();

    request.onsuccess = function(event: any) {
      pages = event.target.result;
      if (pages.length > 0) {
        selectPage(0); // Select the first page
      }
    };
  }

  function saveNotes() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const storedPage = pages.find(page => page.id === currentpageIndex);

    if (storedPage) {
      // Check if either the title or note content has changed
      if (storedPage.title !== title || storedPage.note !== note) {
        storedPage.title = title;
        storedPage.note = note;
        objectStore.put(storedPage, storedPage.id); // Update the existing note
        updateSidebarTitle(storedPage.id, title); // Update sidebar title
      }
    } else {
      const newPage = { title, note };
      const request = objectStore.add(newPage);

      request.onsuccess = function(event: any) {
        loadPages();
        currentpageIndex = event.target.result; // Update the current page index
        updateSidebar(); // Update sidebar when a new page is added
      };
    }
  }

  function deletePage() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const deleteRequest = objectStore.delete(currentpageIndex);

    deleteRequest.onsuccess = function(event: any) {
      loadPages();
      if (pages.length === 0) {
        title = '';
        note = '';
      } else {
        selectPage(0); // Select the first page after deletion
        updateSidebar(); // Update sidebar when a page is deleted
      }
    };

    deleteRequest.onerror = function(event: any) {
      console.error('Error deleting page: ' + event.target.error);
    };
  }

  function addPage() {
    const newPage = { title: "New Page", note: "" };
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.add(newPage);

    request.onsuccess = function(event: any) {
        loadPages();
        currentpageIndex = event.target.result; // Update the current page index
        updateSidebar(); // Update sidebar when a new page is added
    };
  }

  function selectPage(index: number) {
    currentpageIndex = index;
    title = pages[currentpageIndex].title;
    note = pages[currentpageIndex].note;
  }


  // Function to update sidebar title dynamically
  function updateSidebarTitle(pageId: number, newTitle: string) {
    const pageButton = document.getElementById(`pageButton_${pageId}`);
    if (pageButton) {
      pageButton.textContent = newTitle;
    }
  }

  // Function to update sidebar with new page
  function updateSidebar() {
    const sidebar = document.querySelector('.sidebar ul');
    if (sidebar) {
      const newPageIndex = pages.length - 1;
      const newPage = pages[newPageIndex];
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.id = `pageButton_${newPage.id}`;
      button.textContent = newPage.title;
      button.addEventListener('click', () => selectPage(newPageIndex));
      li.appendChild(button);
      sidebar.appendChild(li);
    }
  }
</script>

<aside class="fixed top-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-3">
      {#each pages as page, index}
        <li>
          <button id={"pageButton_" + page.id} on:click={() => selectPage(index)} class="{index === currentpageIndex ? 'bg-lighter-gray': 'bg-dark-gray'} py-2 px-3 text-gray-900 rounded-lg py-3 mb-1">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNotes}>Save</button>
    <button class="bg-red-600 text-white px-5 py-2.5 ml-2 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray {
  background: #FBFBFB;
}
.bg-dark-gray {
  background: #EFEFEF;
}
.bg-lighter-gray {
  background: #F3F3F3;
}
</style>
