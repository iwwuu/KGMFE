import "./file-components.js"
import { isDocumentReady } from "./common.js";
import { hasMusic, stateChangeMusic, fillMusic } from "./file-type/audio-stream.js";
import { hasImage, stateChangeImage, fillImages } from "./file-type/image.js";

//hack to avoid white flash while loading stylesheet
document.body.style.backgroundColor = "black";
document.getElementById("backarrow").style.opacity = 0;

const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = new URL('./style.css', import.meta.url).href;
document.head.appendChild(link);

document.getElementById("backarrow").style.opacity = 1;

isDocumentReady(() => {
    const directory = document.getElementById("directory");

    let isNameDescending = true;
    let isDateDescending = true;

    function sortByName() {
        const sortedFiles = Array.from(directory.children)
            .filter(child => child.nodeName === "MOCK-FILE")
            .sort((a, b) => {
                const nameA = a.getAttribute('data-name').toLowerCase();
                const nameB = b.getAttribute('data-name').toLowerCase();
                if (isNameDescending) {
                    return nameB.localeCompare(nameA)
                }
                return nameA.localeCompare(nameB);
        });

        sortedFiles.forEach(file => {
            directory.appendChild(file);
        });

        fillFiles();
        isNameDescending = !isNameDescending;
        isDateDescending = false;
    }

    function sortByDate() {
        const sortedFiles = Array.from(directory.children)
            .filter(child => child.nodeName === "MOCK-FILE")
            .sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-last-modified'));
                const dateB = new Date(b.getAttribute('data-last-modified'));
                if (isDateDescending) {
                    return dateB - dateA
                }
                return dateA - dateB;
        });

        sortedFiles.forEach(file => {
            directory.appendChild(file);
        });

        fillFiles();
        isDateDescending = !isDateDescending;
        isNameDescending = false;
    }

    function fillFiles(isAddEventListener = false) {
        fillMusic(isAddEventListener);
        fillImages(isAddEventListener);
    }

    directory.querySelector(".file-line h3:nth-child(1) b")?.addEventListener("click", sortByName);
    directory.querySelector(".file-line h3:nth-child(2) b")?.addEventListener("click", sortByDate);
    fillFiles(true);

    window.addEventListener("popstate", (event) => {
        if (event.state) {
            if (event.state["type"] == "music"){
                stateChangeMusic(event.state)
            }
            else if (event.state["type"] == "image"){
                stateChangeImage(event.state)
            }
        } else {
            if (hasMusic()) {
                stateChangeMusic(null)
            }
            if (hasImage()) {
                stateChangeImage(null)
            }
        }
    })
});