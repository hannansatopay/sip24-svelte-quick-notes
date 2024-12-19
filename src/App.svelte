<script>
    import { db } from "./db";
    import { liveQuery } from "dexie";

    // @ts-ignore
    $: notes = liveQuery(() => db.notes.toArray());

    let title, note;
    let selectedNote = null;

    const addNote = () => {
        // @ts-ignore
        return db.notes.add({ title, note });
    };

    const deleteNote = (id) => {
        // @ts-ignore
        return db.notes.delete(id);
    };

    function selectNote(note) {
        selectedNote = note;
    }

    function editNote() {
        title = selectedNote.title;
        note = selectedNote.note;
    }

    $: handleSubmit = () => {
        if (selectedNote) {
            // @ts-ignore
            db.notes.update(selectedNote.id, { title, note });
            selectedNote = null;
        } else {
            if (title && note) {
                addNote();
                title = "";
                note = "";
            } else {
                alert("Please add a title and note");
            }
        }
    };
</script>

<main class="p-4 h-auto">
    <section>
        <h1 class="text-black text-3xl font-bold">SvelteScribe</h1><br>
        <div class="grid grid-cols-2 items-center mb-3">
            <input
                class="text-black text-3xl font-bold border rounded-lg border-black p-2.5"
                bind:value={title}
                placeholder="Title"
            >
            <button
                on:click={handleSubmit}
                class="ml-auto px-5 py-2.5 bg-gray-800 border border-gray-300 rounded-lg p-1 text-white hover:bg-gray-900 text-sm"
                >Save</button
            >
        </div>
        <hr />
        <textarea
            class="block w-full mt-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 p-2.5"
            bind:value={note}
            placeholder="Note"
        ></textarea>
    </section>
    <section>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {#if $notes}
                {#each $notes as note}
                    <div
                        class="bg-slate-100 rounded-lg p-4 flex flex-col gap-x-4 gap-y-2"
                    >
                        <h1 class="text-2xl">{note.title}</h1>
                        <p class="text-md">{note.note}</p>
                        {#if selectedNote !== note}
                            <button
                                class="ml-auto px-5 py-2.5 bg-gray-800 border border-gray-300 rounded-lg p-1 text-white hover:bg-gray-900 text-sm"
                                on:click={() => {
                                    selectNote(note);
                                    editNote();
                                }}>Edit</button
                            >
                            <button
                                on:click={() => deleteNote(note.id)}
                                class="ml-auto px-5 py-2.5 bg-gray-800 border border-gray-300 rounded-lg p-1 text-white hover:bg-gray-900 text-sm"
                                >Delete</button
                            >
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </section>
</main>