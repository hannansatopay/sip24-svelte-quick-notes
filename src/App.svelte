<script>
    import '@fontsource/poppins'
    import Nav from './components/Nav.svelte';
    import Card from './components/Card.svelte';

    let notes = [];
    fetch('/notes.json')
        .then((response) => response.json())
        .then((data) => {
            notes = data.notes;
        });
</script>

<main class="dark:bg-[#09090B] h-screen w-screen dark:text-white">
    <Nav />

    <div id="notes" class="flex flex-col justify-center gap-10 p-8">
        {#each notes as note}
            <Card 
                date={note.date}
                title={note.title} 
                words={note.words}
            />
        {/each}
    </div>

</main>

<style>
    main{
        font-family: 'Poppins', sans-serif;
    }
</style>