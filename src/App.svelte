<script>
    import{onMount}from'svelte';
    let pages=[];
    let currentPageIndex=0;
    let existingPageIndex=0;
  let title='';
  let note='';
  let handleDelete=(pages) =>{
    console.log(pages)
  }
  console.log()
  onMount(()=>{
    const savedPages=localStorage.getItem("pages");
  
  if (savedPages){
  pages=JSON.parse(savedPages);
  title=pages[currentPageIndex] ;
  note=localStorage.getItem(title);
  }else{
  addPage();
  }
  });
  function saveNote(){
    const storedPageName=pages[currentPageIndex]
    if(storedPageName!=title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex]=title;
    }
   
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
   }
   function Deletepage(){
    const storedPageName=pages[existingPageIndex]
    if(storedPageName ==title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex]=title;
    }}
  function addPage(){
    pages.push("New Page");
  selectPage(pages.length ? pages.length-1:0)
  }
  function selectPage(index){
    currentPageIndex=index;
    title=pages[currentPageIndex];
    note=localStorage.getItem(title);
  
  }
  
  
  </script>
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-z">
        {#each pages as page,index}
        <li>
         
          <button on:click={()=>selectPage(index)} class="{index==currentPageIndex ?'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
          {/each}
          <li class="text-centre"><button on:click={addPage} class="font-medium" >+Add page</button></li>
          <button class="ml-auto bg-blue-600 text-white px-5 py-2.5 round-lg font-medium rounded-lg text=sm mt-3 hover:bg-gray-900"on:click={()=>handleDelete(pages)}>Delete</button>
        </ul>
      </div>
   
  </aside>
  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-centre mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 round-lg font-medium rounded-lg text=sm mt-3 hover:bg-gray-900"on:click={saveNote}>Save</button>
      </div> 
      <hr/>
  <textarea class ="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
  </main>
  
  <style>
  .bg-light-gray{
    background:#FBFBFB;
  }
  .bg-dark-gray{
    background:#EFEFEF ;
  
  }
  </style>
