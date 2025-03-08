document.addEventListener("DOMContentLoaded", () => {
    const browser = document.querySelector(".browser");
    const tabsContainer = document.querySelector(".tabs");
    const contentContainer = document.querySelector(".browser");
    const newTabButton = document.querySelector(".new-tab");
    const layoutToggle = document.querySelector(".layout-toggle");
    const increaseFontButton = document.getElementById("increase-font");
    const decreaseFontButton = document.getElementById("decrease-font");

    let tabCounter = 1;
    let currentFontSize = localStorage.getItem("fontSize")
        ? parseInt(localStorage.getItem("fontSize"), 10)
        : 14;

    function updateFontSize(newSize) {
        currentFontSize = newSize;
        document.querySelectorAll(".page-content").forEach(textarea => {
            textarea.style.fontSize = `${currentFontSize}px`;
        });
        localStorage.setItem("fontSize", currentFontSize);
    }

    increaseFontButton.addEventListener("click", () => {
        updateFontSize(currentFontSize + 2);
    });

    decreaseFontButton.addEventListener("click", () => {
        updateFontSize(currentFontSize - 2);
    });

// Inject CSS dynamically
const style = document.createElement("style");
style.innerHTML = `
    .content {
        position: relative;
        padding: 20px;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .page-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .tab-link {
        padding: 8px 15px;
        background: #1ed760;
        color: black;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        text-decoration: none;
        transition: 0.3s;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        font-size: 0.9rem;
        position: absolute;
        top: 15px;
        right: 15px;
        white-space: nowrap;
    }

    .tab-link:hover {
        background:rgb(25, 176, 78);
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Function to create a tab
// function createTab(title = "New Tab", contentText = "", link = "") {
//     tabCounter++;
//     const tab = document.createElement("div");
//     tab.className = "tab";
//     tab.dataset.tab = tabCounter;
//     tab.draggable = true;
//     tab.innerHTML = `
//         <span class="drag-handle">&#9776;</span>
//         <input type="text" class="tab-title" value="${title}">
//         <button class="close-tab">&times;</button>
//     `;
//     tabsContainer.insertBefore(tab, newTabButton);

//     const content = document.createElement("div");
//     content.className = "content";
//     content.dataset.content = tabCounter;
//     content.innerHTML = `
//         <div class="content-header">
//             <h2 class="page-title">${title}</h2>
//             ${link ? `<a href="${link}" target="_blank" class="tab-link">|ılıılı|ıllılı</a>` : ""}
//         </div>
//         <textarea class="page-content">${contentText}</textarea>
//         <input type="file" class="image-upload" accept="image/*">
//         <div class="image-preview"></div>
//     `;
//     contentContainer.appendChild(content);

//     const newTextArea = content.querySelector(".page-content");
//     newTextArea.style.fontSize = `${currentFontSize}px`;

//     setupTabListeners(tab);
//     setupContentListeners(content);
//     switchTab(tab);
// }
function createTab(title = "New Tab", contentText = "", link = "") {
    tabCounter++;

    // Create the tab
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.tab = tabCounter;
    tab.draggable = true;
    tab.innerHTML = `
        <span class="drag-handle">&#9776;</span>
        <span class="tab-title">${title}</span>
        <button class="close-tab">&times;</button>
    `;
    tabsContainer.insertBefore(tab, newTabButton);

    // Create the content area
    const content = document.createElement("div");
    content.className = "content";
    content.dataset.content = tabCounter;
    content.innerHTML = `
        <div class="content-header">
            <input type="text" class="editable-title" value="${title}">
            ${link ? `<a href="${link}" target="_blank" class="tab-link">|ılıılı|ıllılı</a>` : ""}
        </div>
        <textarea class="page-content">${contentText}</textarea>
        <input type="file" class="image-upload" accept="image/*">
        <div class="image-preview"></div>
    `;
    contentContainer.appendChild(content);

    const titleInput = content.querySelector(".editable-title");
    titleInput.addEventListener("input", () => {
        tab.querySelector(".tab-title").textContent = titleInput.value || "Untitled";
    });

    setupTabListeners(tab);
    setupContentListeners(content);
    switchTab(tab);
}



function setupInitialTabs() {
    createTab(
        "I Thank God", 
        `v\n14\n\npre\n5641\n564\n\nch\n1214\n64\n\nbrdge\n1\n\n5641`,
        "https://pnwchords.com/i-thank-god-maverick-city-music-upperroom/"
    );
    createTab(
        "I Speak Jesus", 
        `v\n1641\n\nch\n5 1-4\n1\n\nbrdge\n1\n1641`,
        "https://pnwchords.com/i-speak-jesus-charity-gayle/"
    );
    createTab(
        "God's Great Dance Floor",
        `intro\n1415\n\nv\n1415\n\npre\n2614\n\nch\n1415`,
        "https://www.worshiptogether.com/songs/gods-great-dance-floor-tomlin/"
    );
    createTab(
        "Gratitude",
        `intro\n\nv\n1 654\n\nch\n15\n4 65\n\nbrdge\n1\n5 4 1 5`,
        "https://www.worshiptogether.com/songs/gratitude-brandon-lake/"
    );
    createTab(
        "Dance in Freedom", 
        `v\n14\n641\n\npre-ch\n564\n545\n\nch\n14\n654\n\nbrdge\n14\n654`,
        "https://www.chords-and-tabs.net/song/name/victory-worship-dance-in-freedom-2"
    );
    createTab(
        "Plead The Blood", 
        `v\n1465\n\nch\n14\n154\n\nbrdge\n65\n16\n\n14\n154\n\nVamp1\n65 1 4`,
        "https://www.worshiptogether.com/songs/plead-the-blood-chris-davenport-cody-carnes/"
    );


    // Activate the first tab explicitly
    const firstTab = document.querySelector(".tab");
    if (firstTab) switchTab(firstTab);
}


    
    

    function setupTabListeners(tab) {
        const closeButton = tab.querySelector(".close-tab");
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTab(tab);
        });
        tab.addEventListener("click", () => {
            switchTab(tab);
        });
        const titleInput = tab.querySelector(".tab-title");
        titleInput.addEventListener("input", () => {
            updateTabTitle(tab);
        });
    }

    function setupContentListeners(content) {
        const imageUpload = content.querySelector(".image-upload");
        const imagePreview = content.querySelector(".image-preview");

        imageUpload.addEventListener("change", (e) => {
            handleImageUpload(e.target.files, imagePreview);
        });
    }

    function handleImageUpload(files, imagePreview) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgWrapper = document.createElement("div");
                imgWrapper.className = "image-wrapper";

                const img = document.createElement("img");
                img.src = e.target.result;

                const removeButton = document.createElement("button");
                removeButton.textContent = "X";
                removeButton.className = "remove-image";
                removeButton.addEventListener("click", () => {
                    imgWrapper.remove();
                });

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(removeButton);
                imagePreview.appendChild(imgWrapper);
            };
            reader.readAsDataURL(file);
        }
    }

    function switchTab(clickedTab) {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelectorAll(".content").forEach(content => content.classList.remove("active"));
        clickedTab.classList.add("active");
        document.querySelector(`.content[data-content="${clickedTab.dataset.tab}"]`).classList.add("active");
    }

    function closeTab(tab) {
        document.querySelector(`.content[data-content="${tab.dataset.tab}"]`).remove();
        tab.remove();
        const firstTab = document.querySelector(".tab");
        if (firstTab) switchTab(firstTab);
    }

    function updateTabTitle(tab) {
        const titleInput = tab.querySelector(".tab-title");
        document.querySelector(`.content[data-content="${tab.dataset.tab}"] .page-title`).textContent = titleInput.value;
    }

    function toggleLayout() {
        browser.classList.toggle("chrome-layout");
        browser.classList.toggle("vertical-layout");
    }

    function enableTabReordering() {
        new Sortable(tabsContainer, {
            animation: 150,
            ghostClass: "sortable-ghost"
        });
    }

    newTabButton.addEventListener("click", () => createTab());
    layoutToggle.addEventListener("click", toggleLayout);

    setupInitialTabs();
    enableTabReordering();
});
