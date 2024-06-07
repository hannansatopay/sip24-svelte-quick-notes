<script>
 document.addEventListener("DOMContentLoaded", function () {
    const addPageButton = document.getElementById("add-page");
    const pageList = document.getElementById("page-list");
    const pageTitleInput = document.getElementById("page-title");
    const noteContent = document.getElementById("note-content");
    const saveNoteButton = document.getElementById("save-note");

    let pages = [];
    let currentPageIndex = -1;

    function loadPagesFromLocalStorage() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            pages.push({ title: key, content: value });
        }
    }

    function savePagesToLocalStorage() {
        localStorage.clear();
        pages.forEach(page => {
            localStorage.setItem(page.title, page.content);
        });
    }

    function renderPageList() {
        pageList.innerHTML = "";
        pages.forEach((page, index) => {
            const li = document.createElement("li");
            li.textContent = page.title;
            li.className = 'page-item';
            if (index === currentPageIndex) {
                li.classList.add("active");
            }
            li.addEventListener("click", () => selectPage(index));
            pageList.appendChild(li);
        });
    }

    function selectPage(index) {
        currentPageIndex = index;
        pageTitleInput.value = pages[index].title;
        noteContent.value = pages[index].content;
        renderPageList();
    }

    addPageButton.addEventListener("click", () => {
        const newPageTitle = `New Page ${pages.length + 1}`;
        const newPage = {
            title: newPageTitle,
            content: ""
        };
        pages.push(newPage);
        currentPageIndex = pages.length - 1;
        savePagesToLocalStorage();
        renderPageList();
        selectPage(currentPageIndex);
    });

    saveNoteButton.addEventListener("click", () => {
        if (currentPageIndex !== -1) {
            pages[currentPageIndex].title = pageTitleInput.value;
            pages[currentPageIndex].content = noteContent.value;
            savePagesToLocalStorage();
            renderPageList();
        }
    });

    loadPagesFromLocalStorage();
    renderPageList();
    if (pages.length > 0) {
        selectPage(0);
    } else {
        addPageButton.click(); // Automatically create and select the first page if none exist
    }
});



</script>
<style>body {
  font-family: Arial, sans-serif;
  margin: 0;
  display: flex;
  height: 100vh;
}

.container {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 250px;
  background-color: #f0f0f0;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.add-page-btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-page-btn:hover {
  background-color: #45a049;
}

.page-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.page-item:hover, .page-item.active {
  background-color: #f9f9f9;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

#page-title {
  font-size: 24px;
  margin-bottom: 20px;
  padding: 10px;
}

#note-content {
  flex: 1;
  font-size: 16px;
  padding: 10px;
  margin-bottom: 20px;
}

#save-note {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
  border-radius: 5px;
  transition: background-color 0.3s;
}

#save-note:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .container {
      flex-direction: column;
  }

  .sidebar {
      width: 100%;
      padding: 10px;
  }

  .content {
      padding: 10px;
  }
}
</style>
<main> 
  <div class="container">
  <div class="sidebar">
      <button id="add-page" class="add-page-btn">+ Add page</button>
      <ul id="page-list">
      </ul>
  </div>
  <div class="content">
      <input type="text" id="page-title" placeholder="Page Title">
      <textarea id="note-content" placeholder="Write your note here..."></textarea>
      <button id="save-note">Save</button>
  </div>
</div></main>