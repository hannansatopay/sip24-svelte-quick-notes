<script>
  import {onMount} from 'svelte';
  let pages=[]
  let currentPagesIndex=0;
  let title='Add Title';      
  let note='Today is an excellent day!';

  onMount(()=>{
    const savedPages=localStorage.getItem("pages");
    if (savedPages) {
      pages=JSON.parse(savedPages)
      title=pages[currentPagesIndex];
      note=localStorage.getItem(title);
    }
    else{
      addPage();
    }
    title=localStorage.getItem('title')
    note=localStorage.getItem('note')
  })
  function saveNote(){
    const storedPageName=pages[currentPagesIndex]
    if (storedPageName!=title) {
      localStorage.removeItem(storedPageName);
      pages[currentPagesIndex]=title;
    } 
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPage(){
    pages.push("New Pages");
    selectPage(pages.length?pages.length - 1:0);
  }

  function selectPage(index){
    currentPagesIndex=index;
    title=pages[currentPagesIndex];
    note=localStorage.getItem(title)
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    localStorage.removeItem(pageTitle);
    localStorage.setItem("pages", JSON.stringify(pages));

    if (pages.length > 0) {
      selectPage(index === 0 ? 0 : index - 1);
    } else {
      title = 'Add Title';
      note = '';
    }
  }
</script>

<!-- Adding Side Bar -->
 <aside class=" fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
    <ul class="space-y-2 ">
      <li class="grid grid-cols-2 gap-x-1 gap-2">  
        {#each pages as page, index}
          <button on:click={()=>selectPage(index)} class="{index==currentPagesIndex?'bg-gray-900 text-white':'bg-gray-200'} py-2 px-3 text-gray-900 rounded-lg font-medium w-48">{page}</button> 
          <button on:click={() => deletePage(index)} class="text-red-600 text-2xl w-6 hover:fill-red-800 ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        {/each}
      </li>
      <li class="text-center">
        <button class="font-bold" on:click={addPage}> + Add page</button>
      </li>
    </ul>
  </div>
 </aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="font-bold text-3xl m-2" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 border-gray-300 font-medium rounded-lg text-white px-5 py-2.5 text-sm mt-3 hover:bg-black" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <!-- <input class="block w-full bg-gray-100 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text"> -->
  <!-- whenever textarea value changes note value also change -->
  <textarea class="mt-3 block w-full bg-grey-100 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
 
  <!-- <h1>Hello, I am {name}.</h1> -->
</main>

<style>
  .bg-light-gray{
    background:#FBFBFB ;
  }
</style>