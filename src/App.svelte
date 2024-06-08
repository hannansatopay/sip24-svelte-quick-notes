<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let Title_Value = "";
  let Text_Value = "";
  let pages = [];
  let Current_Page_Index = 0;

  async function initDB() {
    db = await openDB('PagesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('content');
      }
    });
  }

  onMount(async () => {
    await initDB();
    await loadPages();
  });

  async function loadPages() {
    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      SelectPageIndex(0);
    } else {
      AddPage();
    }
  }

  async function SaveDetails() {
    const storedPageName = pages[Current_Page_Index];
    if (storedPageName !== Title_Value) {
      await db.delete('content', storedPageName);
      pages[Current_Page_Index] = Title_Value;
      await db.put('pages', { id: Current_Page_Index + 1, title: Title_Value });
    }
    await db.put('content', Text_Value, Title_Value);
  }

  async function AddPage() {
    const newPageTitle = `New Blank Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    await db.put('pages', { title: newPageTitle });
    SelectPageIndex(pages.length - 1);
  }

  async function SelectPageIndex(index) {
    Current_Page_Index = index;
    Title_Value = pages[Current_Page_Index];
    Text_Value = await db.get('content', Title_Value);
  }

  async function DeletePage() {
    const pageToDelete = pages[Current_Page_Index];
    pages.splice(Current_Page_Index, 1);
    await db.delete('content', pageToDelete);
    await db.clear('pages');
    await Promise.all(pages.map(async (page, index) => {
      await db.put('pages', { id: index + 1, title: page });
    }));

    if (pages.length > 0) {
      SelectPageIndex(Math.max(0, Current_Page_Index - 1));
    } else {
      Title_Value = "";
      Text_Value = "";
      Current_Page_Index = 0;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-400 overflow-y-auto py-5 px-2.5 border-r border-gray-700">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button on:click={() => SelectPageIndex(index)} class="{index === Current_Page_Index ? 'bg-gray-200' : ''} text-gray-700 rounded-lg px-3 py-3">{page}</button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={AddPage} class="font-medium">+Add Page</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-2xl font-semibold" contenteditable bind:textContent={Title_Value}>{Title_Value || "Blank Title"}</h1>
    <button on:click={SaveDetails} class="bg-gray-600 border border-gray-600 text-white px-5 py-2.5 rounded-lg mt-4 hover:bg-gray-50 hover:text-black ml-auto">Save</button>
    <button on:click={DeletePage} class="bg-gray-600 border border-gray-600 text-white px-5 py-2.5 rounded-lg mt-4 hover:bg-gray-50 hover:text-black ml-auto">Delete Page</button>
  </div>
  <textarea bind:value={Text_Value} class="block w-full bg-gray-300 border border-gray-700 rounded-lg text-gray-900 p-2.5 mt-4"></textarea>
</main>

<style>
</style>
