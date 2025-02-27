// Store songs in localStorage with content
function getSongs(category) {
    const storedSongs = localStorage.getItem(`${category}Songs`)
    return storedSongs ? JSON.parse(storedSongs) : []
  }
  
  function saveSongs(category, songs) {
    localStorage.setItem(`${category}Songs`, JSON.stringify(songs))
  }
  
  // Initialize the page with songs
  function initializePage(category, defaultSongs) {
    let songs = getSongs(category)
  
    if (songs.length === 0) {
      songs = defaultSongs.map((song) => ({
        ...song,
        content: "Default content for " + song.title,
      }))
      saveSongs(category, songs)
    }
  
    renderSongs(category, songs)
    setupEventListeners(category)
  }
  
  // Render songs in the collection
  function renderSongs(category, songs) {
    const collection = document.getElementById(`${category}-collection`)
  
    const existingSongCards = collection.querySelectorAll(".song-card:not(.add-card):not(.blank-card)")
    existingSongCards.forEach((card) => card.remove())
  
    songs.forEach((song) => {
      const songCard = document.createElement("div")
      songCard.className = "song-card"
      songCard.innerHTML = `
              <div class="card-content">
                  <h3 class="song-title">${song.title}</h3>
                  <p class="song-subtitle">Tap to view</p>
              </div>
          `
      songCard.addEventListener("click", () => viewSong(category, song))
      collection.appendChild(songCard)
    })
  }
  
  // View song details
  function viewSong(category, song) {
    const modal = document.createElement("div")
    modal.className = "modal song-view-modal"
    modal.innerHTML = `
          <div class="modal-content glass">
              <h3>${song.title}</h3>
              <div class="song-content">${song.content || "No content available"}</div>
              <div class="modal-actions">
                  <button class="edit-btn" onclick="editSong('${category}', ${song.id})">Edit</button>
                  <button class="delete-btn" onclick="deleteSong('${category}', ${song.id})">Delete</button>
                  <button class="cancel-btn" onclick="closeModal(this)">Close</button>
              </div>
          </div>
      `
    document.body.appendChild(modal)
    modal.style.display = "flex"
  }
  
  // Edit song
  function editSong(category, songId) {
    const songs = getSongs(category)
    const song = songs.find((s) => s.id === songId)
    if (!song) return
  
    closeAllModals()
  
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.innerHTML = `
          <div class="modal-content glass">
              <h3>Edit Song</h3>
              <div class="form-group">
                  <label for="edit-song-title">Title</label>
                  <input type="text" id="edit-song-title" value="${song.title}">
              </div>
              <div class="form-group">
                  <label for="edit-song-content">Content</label>
                  <textarea id="edit-song-content">${song.content || ""}</textarea>
              </div>
              <div class="modal-buttons">
                  <button class="cancel-btn" onclick="closeModal(this)">Cancel</button>
                  <button class="add-btn" onclick="saveSongEdit('${category}', ${songId})">Save</button>
              </div>
          </div>
      `
    document.body.appendChild(modal)
    modal.style.display = "flex"
  }
  
  // Save song edit
  function saveSongEdit(category, songId) {
    const songs = getSongs(category)
    const songIndex = songs.findIndex((s) => s.id === songId)
    if (songIndex === -1) return
  
    const title = document.getElementById("edit-song-title").value.trim()
    const content = document.getElementById("edit-song-content").value.trim()
  
    if (title) {
      songs[songIndex] = {
        ...songs[songIndex],
        title,
        content,
      }
      saveSongs(category, songs)
      renderSongs(category, songs)
      closeAllModals()
    }
  }
  
  // Delete song
  function deleteSong(category, songId) {
    if (!confirm("Are you sure you want to delete this song?")) return
  
    const songs = getSongs(category)
    const updatedSongs = songs.filter((s) => s.id !== songId)
    saveSongs(category, updatedSongs)
    renderSongs(category, updatedSongs)
    closeAllModals()
  }
  

  function addSong(type) {
    console.log("addSong function called with type:", type);
}

  // Set up event listeners
  function setupEventListeners(category) {
    const addSongCard = document.getElementById("add-song-card")
    const blankCard = document.querySelector(".blank-card")
  
    addSongCard.addEventListener("click", () => showAddSongModal(category))
    blankCard.addEventListener("click", () => (window.location.href = "empty.html"))
  }
  
  // Show add song modal
  function showAddSongModal(category) {
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.innerHTML = `
          <div class="modal-content glass">
              <h3>Add New Song</h3>
              <div class="form-group">
                  <label for="new-song-title">Title</label>
                  <input type="text" id="new-song-title" placeholder="Song title">
              </div>
              <div class="form-group">
                  <label for="new-song-content">Content</label>
                  <textarea id="new-song-content" placeholder="Enter song content..."></textarea>
              </div>
              <div class="modal-buttons">
                  <button class="cancel-btn" onclick="closeModal(this)">Cancel</button>
                  <button class="add-btn" onclick="addSong('${category}')">Add Song</button>
              </div>
          </div>
      `
    document.body.appendChild(modal)
    modal.style.display = "flex"
  }
  
  // Add new song
  function addSong(category) {
    const titleInput = document.getElementById("new-song-title");
    const contentInput = document.getElementById("new-song-content");

    if (!titleInput) {
        console.error("Error: Missing title input element.");
        return;
    }

    const title = titleInput.value.trim();
    const content = contentInput ? contentInput.value.trim() : ""; // Content is optional

    if (!title) {
        alert("Please enter a song title.");
        return;
    }

    let songs = getSongs(category) || []; // Ensure songs array is always defined
    const existingSong = songs.find((song) => song.title.toLowerCase() === title.toLowerCase());

    if (existingSong) {
        alert("This song already exists in this category.");
        return;
    }

    const newId = songs.length > 0 ? Math.max(...songs.map((s) => s.id)) + 1 : 1;

    const newSong = { id: newId, title, content };
    songs.push(newSong);
    saveSongs(category, songs);
    renderSongs(category, songs);

    // Ensure "All Songs" is updated
    if (category !== "all") {
        let allSongs = getSongs("all") || [];
        if (!allSongs.some((song) => song.title.toLowerCase() === title.toLowerCase())) {
            allSongs.push(newSong);
            saveSongs("all", allSongs);
        }
    }

    closeAllModals();

    // Clear input fields after adding the song
    titleInput.value = "";
    if (contentInput) contentInput.value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const addSongButton = document.getElementById("confirm-add-song");
    
    if (addSongButton) {
        addSongButton.addEventListener("click", function() {
            console.log("Button clicked!"); // Check if this logs
            addSong("all"); // Call the function to add a song
        });
    } else {
        console.error("Button not found!");
    }
});


  
  // Helper functions
  function closeModal(button) {
    const modal = button.closest(".modal")
    modal.remove()
  }
  
  function closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => modal.remove())
  }
  
  

  //song card
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".song-card");

    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 * (index + 1)}s`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".empty=content");

    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 * (index + 1)}s`;
    });
});

