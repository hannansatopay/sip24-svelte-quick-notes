<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';
  

  let title = '';
  let note = '';
  let pages = [];
  let currentPage = 0;
  let db;
  let message = '';
  let locationAndTime = '';
  let darkMode = false;
  let currentLocation = '';
  let currentTime = '';

  onMount(async () => {
    db = await openDB('NotesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes');
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPage];
      note = await db.get('notes', title) || '';
    } else {
      addPage();
    }

    if (localStorage.getItem('darkMode') === 'true') {
      darkMode = true;
      document.documentElement.classList.add('dark');
    }

    getLocationAndTime();
  });

  async function saveNote() {
    try {
      const page = { id: currentPage + 1, title };
      await db.put('pages', page);
      await db.put('notes', note, title);
      pages[currentPage] = title;
      message = 'Note saved successfully';
      setTimeout(() => message = '', 3000);
    } catch (error) {
      message = 'Error saving note';
    }
  }

  async function addPage() {
    try {
      const newPage = { id: pages.length + 1, title: "New Page" };
      await db.add('pages', newPage);
      pages.push(newPage.title);
      currentPage = pages.length - 1;
      title = newPage.title;
      note = '';
      message = 'Page added successfully';
      setTimeout(() => message = '', 3000);
    } catch (error) {
      message = 'Error adding page';
    }
  }

  async function selectPage(index) {
    try {
      currentPage = index;
      title = pages[currentPage];
      note = await db.get('notes', title) || '';
      message = 'Page selected';
      setTimeout(() => message = '', 3000);
    } catch (error) {
      message = 'Error selecting page';
    }
  }

  async function deletePage(index) {
    try {
      const pageTitle = pages[index];
      pages.splice(index, 1);
      await db.delete('notes', pageTitle);
      const allPages = await db.getAll('pages');
      const pageId = allPages.find(page => page.title === pageTitle).id;
      await db.delete('pages', pageId);

      if (currentPage >= pages.length) {
        currentPage = pages.length - 1;
      }
      if (pages.length === 0) {
        addPage();
      } else {
        selectPage(currentPage);
      }
      message = 'Page deleted successfully';
      setTimeout(() => message = '', 3000);
    } catch (error) {
      message = 'Error deleting page';
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  async function getLocationAndTime() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const responseLocation = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const locationData = await responseLocation.json();
      currentLocation = locationData.display_name;
      const responseTime = await fetch(`https://worldtimeapi.org/api/timezone/Etc/GMT`);
      const timeData = await responseTime.json();
      currentTime = new Date(timeData.utc_datetime).toLocaleTimeString();
      locationAndTime = `Location: ${currentLocation}, Time: ${currentTime}`;
    } catch (error) {
      locationAndTime = 'Error fetching location and time';
    }
    setTimeout(getLocationAndTime, 1000);
  }

  let animateBackground = true;

  function toggleBackgroundAnimation() {
    animateBackground = !animateBackground;
    const animatedBackground = document.querySelector('.animated-background');
    if (animateBackground) {
      animatedBackground.classList.add('animated-background');
    } else {
      animatedBackground.classList.remove('animated-background');
    }
  }

  async function setReminder() {
    try {
      const response = await fetch('http://localhost:5000/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'recipient-email@example.com',
          subject: 'Reminder',
          text: 'This is a reminder message from your Svelte app.',
        }),
      });

      const result = await response.json();
      message = result.message;
      setTimeout(() => message = '', 3000);
    } catch (error) {
      message = 'Error sending reminder';
      setTimeout(() => message = '', 3000);
    }
  }

</script>

<aside class="sidebar">
  <div class="animated-background"></div>
  
  <div class="flex flex-col gap-4 p-5 text-white">
    <div class="flex flex-col gap-4">
      {#each pages as page, index}
        <div class="flex items-center justify-between transition duration-300 ease-in-out">
          <button 
            on:click={() => selectPage(index)} 
            class="flex items-center justify-center w-full px-3 py-2 transition duration-300 ease-in-out rounded-lg hover:bg-gray-500 {currentPage === index ? 'bg-blue-600' : 'bg-gray-600'}"
          >
            {page}
          </button>
          {#if currentPage === index}
            <button 
              on:click={() => deletePage(index)} 
              class="w-8 h-8 ml-2 transition duration-300 ease-in-out bg-red-600 rounded-full hover:bg-red-500"
            >
              X
            </button>
          {/if}
        </div>
      {/each}
      <button 
        on:click={addPage} 
        class="py-3 transition duration-300 ease-in-out bg-green-600 rounded-lg hover:bg-green-500"
      >
        + Add Page
      </button>
    </div>
  </div>

</aside>

<main class="main-content">
  <div class="flex flex-col items-center justify-start w-full gap-4 p-5 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 dark:bg-gray-800">
    <div class="flex items-center justify-between w-full">
      <h1 
        contenteditable="true" 
        bind:innerText={title} 
        class="text-2xl font-semibold text-gray-800 transition duration-300 ease-in-out border-b-2 border-gray-300 focus:border-blue-500 dark:text-gray-200"
      >
        {title || "New Page"}
      </h1>
      <span>
        <button 
          class="px-4 py-2 font-medium text-white transition duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-500" 
          on:click={saveNote}
        >
          Save
        </button>
      </span>
    </div>
    <textarea 
      placeholder="Add Note" 
      class="w-full h-64 p-2 transition duration-300 ease-in-out border-2 border-gray-300 rounded-md focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
      bind:value={note}
    ></textarea>
    <div class="flex justify-between w-full mt-4 items-center">
      <button 
        class="px-4 py-2 font-medium text-white transition duration-300 ease-in-out bg-gray-600 rounded-md hover:bg-gray-500"
        on:click={toggleDarkMode}
      >
        {#if darkMode}
          🌞
        {:else}
          🌙
        {/if}
      </button>
      <div class="flex flex-col items-end">
        <div class="text-gray-800 dark:text-gray-200">Time: {currentTime}</div>
        <div class="text-gray-800 dark:text-gray-200">Location: {currentLocation}</div>
      </div>
    </div>
  </div>
  {#if message}
    <div class="mt-4 p-2 bg-blue-100 border border-blue-500 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-200">
      {message}
    </div>
  {/if}
</main>

<style>
  :global(.dark) {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity)); /* Tailwind's bg-gray-800 */
    color: rgba(209, 213, 219, var(--tw-text-opacity)); /* Tailwind's text-gray-200 */
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 256px;
    height: 100%;
    background-color: #2d3748; /* Tailwind's bg-gray-800 */
    z-index: 50;
    padding: 20px;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
  }

  .main-content {
    margin-left: 256px;
    padding: 20px;
    min-height: 100vh;
    transition: margin-left 0.3s ease-in-out;
  }

  @media (max-width: 640px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: fixed;
      top: 0;
      left: 0;
    }

    .main-content {
      margin-left: 0;
      padding-top: 80px; /* Adjust padding to avoid overlap */
    }
  }

  textarea {
    min-height: 200px;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 256px;
    height: 100%;
    background-color: #2d3748; /* Tailwind's bg-gray-800 */
    z-index: 50;
    padding: 20px;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
  }

  /* Animated background */
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #BF5AF2, #FF9500, #FF2D55, #5856D6);
    background-size: 400% 100%;
    animation: gradientAnimation 10s ease infinite;
    z-index: -1; /* Ensure it's behind other content */
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Toggle Button Style */
  .toggle-button {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: #FF3B30; /* Red color when animation is on */
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  .toggle-button:hover {
    background-color: #FF453A; /* Darker red color on hover */
  }

</style>
