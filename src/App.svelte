<script>
  import { onMount } from "svelte";

  let page = [];
  let title = '';
  let note = '';
  let currentIndex = 0;
  onMount(() => {
  const savedPages = localStorage.getItem("pages");
    if(savedPages){
      page = JSON.parse(savedPages);
      title = page[currentIndex] || "New Page";
      note = localStorage.getItem(title);
    }else{
      addNote();
    }
});
  const deletePage = () => {
    localStorage.removeItem(title);
    page = page.filter(t => t != title);
    localStorage.setItem("pages", JSON.stringify(page));
    if (currentIndex > 0){
      currentIndex -= 1;
    }
  }
  const saveNote = () => {
    const storedPageName = page[currentIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      page[currentIndex] = title;
    }
    page[currentIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages" , JSON.stringify(page));
  }
  const addNote = () => {
    page.push("New Page");
    page = page;
    currentIndex = page ? page.length - 1 : 0;
    title = page[currentIndex];
    note = "";
  }
  const setCurrent = (indexNew) => {
    currentIndex = indexNew;
    title = page[currentIndex];
    note = localStorage.getItem(title);
  }
</script>

<main>
    <h1 class="w-full h-12 border-b-4 border-red-800 bg-red-100 text-center  text-4xl font-bold font">To Do App</h1>
    <section class="flex border-b-4 border-red-800" >
      <div class="basis-3/12 h-screen border-r-4 border-red-700 bg-red-400 ">
        <ul class="space-y-2 pt-3">
            {#each page as pages, index}
            <button class="w-11/12 border-4 mx-auto block rounded-xl cursor-pointer  { currentIndex == index ? "bg-red-600" : "bg-red-200" } hover:bg-red-300 py-2 h-full text-xl border-red-800 font-bold m-auto text-center " on:click={() => {setCurrent(index)}}>{pages || "New Page"}</button>
            {/each}
          <button class="w-11/12 block border-4 rounded-xl mx-auto cursor-pointer bg-red-200 hover:bg-red-300 py-2 h-full text-xl border-red-800 font-bold m-auto text-center " on:click={addNote} >+ Add Note</button>
        </ul>
      </div>
      <div class="basis-9/12 h-screen bg-red-200 ">
          <section class="flex mx-4 border-b-2 border-red-900 py-2 px-3 justify-between items-center">
            <div class="basis-7/12 focus:outline-none px-2 text-2xl font-bold" bind:textContent={title} contenteditable>
              {title ? title :  "New Page"}
            </div>
            <div class="basis-4/12 flex justify-end items-center" >
                <button class="inline-block px-6 text-xl font-bold rounded-xl border-4 active:bg-red-400 border-red-700 py-1 bg-red-100"on:click = {deletePage} >Delete</button>
                <button class="ml-2 px-6 text-xl font-bold rounded-xl border-4 active:bg-green-400 border-green-700 py-1 bg-green-100" on:click = {saveNote} >Save</button>
            </div>
          </section>
          <textarea name="note" rows="7" class=" border-red-900 my-2  bg-red-100 p-2 block mx-auto w-11/12 border-2" bind:value={note} id="note"></textarea>
      </div>
    </section>
</main>

<style>
  
</style>