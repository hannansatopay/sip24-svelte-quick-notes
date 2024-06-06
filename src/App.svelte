<!--the script is where you add the business logic-->

<script>
  import { onMount } from 'svelte';
  // let name = "Tanvi Sontakke";

  let pages = []; // collecting items of diff pages
  let currentPageIndex = 0; // stores the index of the current page
  let title = '';
  let note = '';

  // lifecycle function
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    title = localStorage.getItem('title');
    note = localStorage.getItem('note'); 

    // if the pages exist
    if (savedPages) {
      pages = JSON.parse(savedPages); // string to an obj/array
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
    
    // if new user
    else {
      addPage();
    }
  });

  // function to add functionality to Save button
  // display to console
  function saveNote() {
    const storedPageName = pages[currentPageIndex];

    // to remove any redundancy
    if (storedPageName!=title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    // console.log(title, note);
    // localStorage.setItem('title', title); // 'title' here is the key, and title here is the variable (key, value pair)
    // localStorage.setItem('note', note);
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages)); // localStorage requires saving of data in string format, thus, JSON.stringify 
  }

  function addPage() {
    pages.push("New Page");
    //pages = pages; // for reactivity to work in Svelte, you need to have an = sign
    selectPage(pages.length ? pages.length-1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class = "space-y-2">
    {#each pages as page, index}
      <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} rounded-lg px-5 py-3 font-medium ">{page}</button>  
      </li>
    {/each}
      <li class = "text-center">
        <button class="mt-3 font-medium" on:click={addPage}>+Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<!--main is where you add the layout-->
<main class="p-4 ml-60 h-auto"> <!--p-4 is padding of 4 units-->
  
  <!-- <br>Hello! My name is Ed Sheeran.<br> adds a line break -->
  <!-- Hello! My name is {name}. use variables -->
  <!-- <h1>I'm a college student</h1> -->

  <!--notes app-->
  <div class = "grid grid-cols2 items-center mb-3">
    <h1 class = "font-bold" contenteditable bind:textContent={title}></h1> <!-- || here stand for default value-->
    <button class="ml-auto bg-gray-800 text-white rounded-lg px-5 py-2.5 mt-3 font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <input class = "block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 mt-3" bind:value={note} type='text' placeholder='add title'> <!--bind allows for a two way data binding; block is a class, that allows an element to strech to its full length. w-full is width full-->
  <!-- <textarea class  = "mt-3 block w-full bg-gray-50 border border-gray-500 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea> -->
  
</main>

<!--where you add the styling to elements-->
<!--tailwind css-->
<style>
/* h1 {
  color: red;
} */
.bg-light-gray {
  background:rgb(215, 210, 210);
}

.bg-dark-gray {
  background: #efefef;
}
</style>