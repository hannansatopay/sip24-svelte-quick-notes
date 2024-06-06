<script>
  import { openDB } from "idb";
  import { onMount } from "svelte";

  let db;
  let titles = [];
  let idx = 0;
  let title = "";
  let content = "";

  async function initDB() {
    db = await openDB("notesDB", 1, {
      upgrade(db) {
        db.createObjectStore("notes", { keyPath: "title" });
        db.createObjectStore("titles", { autoIncrement: true });
      },
    });
  }

  async function save() {
    const currTitle = titles[idx];
    if (currTitle != title) {
      await db.delete("notes", currTitle);
      titles[idx] = title;
    }
    await db.put("notes", { title, content });
    await db.put("titles", { id: idx, title });
  }

  async function remove() {
    const delTitle = titles[idx];
    await db.delete("notes", delTitle);
    titles.splice(idx, 1);
    if (titles.length > 0) {
      select(idx > 0 ? idx - 1 : 0);
    } else {
      add();
    }
    await db.put("titles", { id: 0, title: titles });
  }

  onMount(async () => {
    await initDB();
    const savedTitles = await db.getAll("titles");
    if (savedTitles.length > 0) {
      titles = savedTitles.map((t) => t.title);
      title = titles[idx] || "New Note";
      const noteData = await db.get("notes", title);
      content = noteData ? noteData.content : "";
    } else {
      add();
    }
  });

  function add() {
    titles.push("New Note");
    select(titles.length - 1);
  }

  async function select(i) {
    idx = i;
    title = titles[idx];
    const noteData = await db.get("notes", title);
    content = noteData ? noteData.content : "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-auto py-5 px-3 border-r h-full border-gray-500"
  >
    <ul class="space-y-3">
      {#each titles as t, i}
        <li>
          <button
            on:click={() => select(i)}
            class="{i == idx
              ? 'bg-dark-gray'
              : ''} py-2 px-3 h-full border-r border-gray-300 rounded-lg"
          >
            {t}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button class="p-3" on:click={add}>+ Add Note</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mt-2 mb-3">
    <h1
      class="text-3xl text-gray-600 font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <div class="ml-auto">
      <button
        class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-950"
        on:click={save}>Save</button
      >
      <button
        class="bg-red-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 ml-2 hover:bg-red-500"
        on:click={remove}>Delete</button
      >
    </div>
  </div>
  <hr />
  <textarea
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-950 mt-3"
    bind:value={content}
    placeholder="Write here"
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #cbc9c9;
  }
</style>
