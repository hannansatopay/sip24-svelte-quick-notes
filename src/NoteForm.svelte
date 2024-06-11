<script>
    import { db } from './db';
  
    let title = '';
    let content = '';
  
    const handleSubmit = async () => {
      if (title && content) {
        await db.addNote({
          title,
          content
        });
        title = '';
        content = '';
      }
    };
  </script>
  
  <div class="note-form ">
    <label class="text-lg font-semibold" for="title">Title</label>
    <input class="rounded-lg" id="title" type="text" placeholder="Title" bind:value={title} />
    
    <label class="text-lg font-semibold" for="content">Note</label>
    <textarea class="rounded-lg" id="content" placeholder="Note" bind:value={content}></textarea>
    
    <button class="font-bold text-lg" on:click={handleSubmit}>Add Note</button>
  </div>
  
  <style>
    .note-form {
      max-width: 600px;
      margin: 1rem auto;
      display: flex;
      flex-direction: column;
    }
  
    .note-form input,
    .note-form textarea {
      margin: 0.5rem 0;
      padding: 0.5rem;
      font-size: 1rem;
    }
  </style>
  