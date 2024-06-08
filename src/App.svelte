<script>

    import {onMount} from 'svelte';
    import {openDB} from 'idb';

    let pages = [];
    let currentPageIndex = 0;
    let title = '';
    let note = '';

    let db;

    async function initDB(){
      db = await openDB('noteDB', 1, {
      upgrade(db){
        db.createObjectStore('pages', {keyPath: 'id', autoIncrement: true});
        db.createObjectStore('notes');
      },
    });
    }

    async function loadPage(){
      pages = await db.getAll('pages');
      if(pages.length > 0){
        title = pages[currentPageIndex].title;
        note = (await db.get('notes', title)) || '';
      }
      else{
        addPage();
      }
    }
  
    onMount(async() => {
      await initDB();
      await loadPage();
    });
  
    async function saveNote(){
      const storedPage = pages[currentPageIndex];
      if(storedPage.title != title){
        await db.delete('notes', storedPage.title);
        storedPage.title = title;
        await db.put('pages', storedPage);
      }

      await db.put('notes', note, title);
      pages[currentPageIndex].title = title;
      updatePageInDB();
    }
  
    async function deleteNote(){
      const storedPage = pages[currentPageIndex];
      await db.delete('notes', storedPage.title);
      await db.delete('pages', storedPage.id);
      pages.splice(currentPageIndex, 1);

      if(pages.length > 0){
        if(currentPageIndex >= pages.length){
          currentPageIndex = pages.length -1;
        }
        title = pages[currentPageIndex].title;
        note = (await db.get('notes', title)) || '';
      }
      else{
        addPage();
        return;
      }

      location.reload();
  
      updatePageInDB();
  
    }
  
    async function addPage(){
      let newPageTitle;
      let counter = 1;
  
      do{
        newPageTitle = `New Page ${counter}`;
        counter++;
      }while(pages.find(page => page.title === newPageTitle));
  
      const newPage = {title: newPageTitle};
      const id = await db.add('pages', newPage);
      newPage.id = id;
      pages.push(newPage);
      selectPage(pages.length - 1);
      updatePageInDB();
    }

    function updatePageInDB(){
      pages.forEach(page => db.put('pages', page));
    }
  
    async function selectPage(index){
      currentPageIndex = index;
      title = pages[currentPageIndex].title;
      note = await db.get('notes', title);
    }
  </script>
  
  <aside class="fixed top-0 right-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index (page.id)}
          <li>
              <button on:click={() => selectPage(index)} class="w-32 {index == currentPageIndex ? 'bg-dark-gray' : 'bg-light-gray'} py-2 px-3 text-gray-900 rounded-lg" >{page.title}</button>
          </li>
        {/each}
        <li class="text-center"> <button on:click={addPage} class="w-32 px-5 py-2.5 bg-blue-400 font-medium">+ Add Page</button></li>
      </ul>
    </div>
  </aside>
  
  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-4XL font-bold mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" contenteditable bind:textContent={title}></h1>
      <button class="w-32 ml-auto bg-green-800 text-white px-5 py-2.5  rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <h1></h1>
      <button class="w-32 ml-auto bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deleteNote}>Delete</button>
    </div>
    <hr/>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </main>
  
  <style>
    .bg-light-gray{
      background: #FBFBFB;
    }
  
    .bg-dark-gray{
      background: #EFEFEF;
    }
  
  </style>