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
        : 14; // Default font size

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

    function createTab() {
        tabCounter++;
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.dataset.tab = tabCounter;
        tab.draggable = true;
        tab.innerHTML = `
            <span class="drag-handle">&#9776;</span>
            <input type="text" class="tab-title" value="New Tab">
            <button class="close-tab">&times;</button>
        `;
        tabsContainer.insertBefore(tab, newTabButton);

        const content = document.createElement("div");
        content.className = "content";
        content.dataset.content = tabCounter;
        content.innerHTML = `
            <h2 class="page-title">New Tab</h2>
            <textarea class="page-content" placeholder="Paste your text here"></textarea>
            <input type="file" class="image-upload" accept="image/*">
            <div class="image-preview"></div>
        `;
        contentContainer.appendChild(content);

        // Apply current font size to the new tab's textarea
        const newTextArea = content.querySelector(".page-content");
        newTextArea.style.fontSize = `${currentFontSize}px`;

        setupTabListeners(tab);
        setupContentListeners(content);
        switchTab(tab);
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
        const addImageButton = content.querySelector(".add-image");

        function handleImageUpload(files) {
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

        imageUpload.addEventListener("change", (e) => {
            handleImageUpload(e.target.files);
        });

        addImageButton.addEventListener("click", () => {
            imageUpload.click();
        });
    }
    function switchTab(clickedTab) {
        document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
        document.querySelectorAll(".content").forEach((content) => content.classList.remove("active"));

        clickedTab.classList.add("active");
        const content = document.querySelector(`.content[data-content="${clickedTab.dataset.tab}"]`);
        content.classList.add("active");

        if (browser.classList.contains("vertical-layout")) {
            content.scrollTop = 0;
        }
    }

    function closeTab(tab) {
        const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`);
        tab.remove();
        content.remove();

        if (tab.classList.contains("active")) {
            const firstTab = document.querySelector(".tab");
            if (firstTab) {
                switchTab(firstTab);
            }
        }
    }

    function updateTabTitle(tab) {
        const titleInput = tab.querySelector(".tab-title");
        const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`);
        const pageTitle = content.querySelector(".page-title");
        pageTitle.textContent = titleInput.value;
    }

    function toggleLayout() {
        browser.classList.toggle("chrome-layout");
        browser.classList.toggle("vertical-layout");

        if (browser.classList.contains("vertical-layout")) {
            layoutToggle.innerHTML = '<i class="fas fa-window-maximize"></i>';
            document.querySelector(".tabs").scrollTop = 0;
            setupVerticalScrolling();
        } else {
            layoutToggle.innerHTML = '<i class="fas fa-columns"></i>';
            removeVerticalScrolling();
        }

        // Reinitialize Sortable for the new layout
        initSortable();
    }

    function setupVerticalScrolling() {
        const contentContainer = document.querySelector(".vertical-layout .content.active");
        if (contentContainer) {
            contentContainer.addEventListener("scroll", handleVerticalScroll);
        }
    }

    function removeVerticalScrolling() {
        const contentContainer = document.querySelector(".content.active");
        if (contentContainer) {
            contentContainer.removeEventListener("scroll", handleVerticalScroll);
        }
    }

    function handleVerticalScroll(event) {
        const contentContainer = event.target;
        const scrollPosition = contentContainer.scrollTop + contentContainer.clientHeight;
        const scrollHeight = contentContainer.scrollHeight;

        if (scrollPosition >= scrollHeight - 10) {
            const currentTab = document.querySelector(".tab.active");
            const nextTab = currentTab.nextElementSibling;

            if (nextTab && nextTab.classList.contains("tab")) {
                switchTab(nextTab);
                nextTab.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    let sortableInstance = null;

    function initSortable() {
        if (sortableInstance) {
            sortableInstance.destroy();
        }
        sortableInstance = new Sortable(tabsContainer, {
            animation: 150,
            handle: ".drag-handle",
            draggable: ".tab",
            onEnd: (evt) => {
                const tabs = Array.from(tabsContainer.querySelectorAll(".tab"));
                tabs.forEach((tab, index) => {
                    const content = document.querySelector(`.content[data-content="${tab.dataset.tab}"]`);
                    contentContainer.appendChild(content);
                });
            },
        });
    }

    newTabButton.addEventListener("click", createTab);
    layoutToggle.addEventListener("click", toggleLayout);

    // Apply stored font size on page load to all existing textareas
    document.querySelectorAll(".page-content").forEach(textarea => {
        textarea.style.fontSize = `${currentFontSize}px`;
    });

    // Setup initial tab
    setupTabListeners(document.querySelector(".tab"));
    setupContentListeners(document.querySelector(".content"));

    // Initialize Sortable
    initSortable();
});


document.addEventListener("DOMContentLoaded", function () {
    const tabsContainer = document.querySelector(".tabs");
    const browser = document.querySelector(".browser");
    const newTabButton = document.querySelector(".new-tab");

    function updateTabs() {
        const tabs = document.querySelectorAll(".tab");
        const contents = document.querySelectorAll(".content");

        tabs.forEach(tab => {
            tab.addEventListener("click", function () {
                const tabId = this.getAttribute("data-tab");

                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove("active"));
                contents.forEach(c => c.classList.remove("active"));

                // Activate the clicked tab and its corresponding content
                this.classList.add("active");
                document.querySelector(`.content[data-content='${tabId}']`).classList.add("active");
            });
        });

        // Ensure close buttons work
        document.querySelectorAll(".close-tab").forEach(closeButton => {
            closeButton.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent tab click when closing

                const tab = this.parentElement;
                const tabId = tab.getAttribute("data-tab");
                const content = document.querySelector(`.content[data-content='${tabId}']`);

                tab.remove();
                content.remove();
            });
        });
    }

    newTabButton.addEventListener("click", function () {
        const tabCount = document.querySelectorAll(".tab").length + 1;

        // Create new tab element
        const newTab = document.createElement("div");
        newTab.classList.add("tab");
        newTab.setAttribute("data-tab", tabCount);
        newTab.innerHTML = `
            <span class="drag-handle">&#9776;</span>
            <input type="text" class="tab-title" value="New Tab">
            <button class="close-tab">&times;</button>
        `;

        // Create new content section
        const newContent = document.createElement("div");
        newContent.classList.add("content");
        newContent.setAttribute("data-content", tabCount);
        newContent.innerHTML = `
            <h2 class="page-title">New Tab</h2>
            <textarea class="page-content" placeholder="Paste your text here"></textarea>
            <input type="file" class="image-upload" accept="image/*">
            <div class="image-preview"></div>
        `;

        // Append new tab and content
        tabsContainer.insertBefore(newTab, newTabButton);
        browser.appendChild(newContent);

        // Update tabs and event listeners
        updateTabs();

        // Set the new tab as active
        newTab.click();
    });

    // Initial update for existing tabs
    updateTabs();
});
