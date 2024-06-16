<script>
    import { onMount } from 'svelte';
    import { openDB } from 'idb';

    let db;
    let pages = [];
    let currentPageIndex = 0;
    let title = '';
    let note = '';

    onMount(async () => {
        db = await openDB('notes-db', 1, {
            upgrade(db) {
                db.createObjectStore('notes', { keyPath: 'title' });
                db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
            },
        });
        
        const savedPages = await db.getAll('pages');
        if (savedPages.length > 0) {
            pages = savedPages.map(page => page.title);
            title = pages[currentPageIndex];
            const savedNote = await db.get('notes', title);
            note = savedNote ? savedNote.note : '';
        } else {
            addPage();
        }
    });

    async function saveNote() {
        const storedPageName = pages[currentPageIndex];
        if (storedPageName != title) {
            await db.delete('notes', storedPageName);
            pages[currentPageIndex] = title;
        }
        await db.put('notes', { title, note });
        await db.put('pages', { id: currentPageIndex + 1, title });
    }

    async function addPage() {
        const newPageTitle = 'New Page';
        pages.push(newPageTitle);
        await db.put('pages', { id: pages.length, title: newPageTitle });
        selectPage(pages.length - 1);
    }

    async function selectPage(index) {
        currentPageIndex = index;
        title = pages[currentPageIndex];
        const savedNote = await db.get('notes', title);
        note = savedNote ? savedNote.note : '';
    }

    async function deleteNote() {
        const storedPageName = pages[currentPageIndex];
        await db.delete('notes', storedPageName);
        await db.delete('pages', currentPageIndex + 1);
        pages.splice(currentPageIndex, 1);
        if (pages.length > 0) {
            selectPage(currentPageIndex === 0 ? 0 : currentPageIndex - 1);
        } else {
            addPage();
        }
    }
    
</script>

<aside class="fixed top-0 left-0 z-40 w-80 h-screen">
  <div class="bg-light-green overflow-y-auto py-5 px-3 h-full border-r border-light-green-500">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-green-200' : ''} font-bold bg-green-100 px-5 py-2 rounded-lg text-sm">{page} </button>
        </li>
      {/each}  
      <li class="text-center">
        <button on:click={addPage} class="font-bold bg-yellow-100 px-5 py-2 rounded-lg text-sm mt-5 hover:bg-yellow-300"> + Add Page </button>
      </li>
    </ul>  
  </div>  
</aside>  

<main class="p-8 ml-80 h-auto">

  <div class="grid grid-cols-1 item-center mb-4">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
  </div>

  <textarea class="mt-3 mb-3 block w-full bg-green-50 border-green-600 rounded-lg p-2.5" bind:value={note} ></textarea>
  <button class="font-bold ml-auto bg-green-500 text-white px-5 py-2 rounded-lg text-sm nt-3 hover:bg-green-800" on:click={saveNote}>Save </button>
  <button class="font-bold ml-auto bg-red-500 text-white px-5 py-2 rounded-lg text-sm nt-3 hover:bg-red-800" on:click={deleteNote}>Delete </button>
</main>

<style>

 .bg-light-green {
    background-color: #82E0AA;
 }

</style>
