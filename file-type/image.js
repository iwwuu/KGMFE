import { isDocumentReady, findIndex } from "../common.js";

let images = []
let image_src = []
let index;

const image = document.querySelector("img");
const imageTitle = document.getElementById("image-title");

const fileView = document.getElementById("file-view");
const imageView = document.getElementById("image-view");

function replaceImage(name, transition = true) {
    imageTitle.textContent = name;
    if (transition) {
        image.style.opacity = 0;
        setTimeout(function () {
            image.removeAttribute('src');
            image.style.display = '';
            setTimeout(function () {
                image.setAttribute("src", image_src[name]);
                image.style.opacity = 1;
            }, 20)
        }, 400)
    }
    else {
        image.setAttribute("src", image_src[name]);
    }
}

export function hasImage() {
    return (imageTitle);
}

export function fillImages(isAddEventListener) {
    images = [];
    image_src = [];

    document.querySelectorAll("mock-file[data-type='image']").forEach((item) => {
        let name = item.getAttribute("data-name");
        let content = item.getAttribute('data-content');
        images.push(name);
        image_src[name] = content;
        let img = new Image();
        img.src = content;

        if (isAddEventListener){
            item.addEventListener('click', () => {
                history.pushState({"file": name, "type": "image"}, name, "#"+name);
                replaceImage(name, false);
                fileView.style.opacity = 0;
                fileView.style.animation = "fadein 400ms";
                setTimeout(function () {
                    imageView.style.display = "flex";
                    imageView.style.opacity = 1;
                    fileView.style.display = "none";
                }, 400)
            });
        }
    });

    if (images.length < 2) {
        document.querySelectorAll(".left-delta, .right-delta").forEach((item) => {
            item.style.display = "none";
        })
    }
}

export function stateChangeImage(eventState) {
    if (eventState) {
        const name = eventState["file"];
        replaceImage(name, false);
        fileView.style.opacity = 0;
        fileView.style.animation = "fadein 400ms";
        setTimeout(function () {
            imageView.style.display = "flex";
            imageView.style.opacity = 1;
            fileView.style.display = "none";
        }, 400)
    }
    else {
        imageView.style.opacity = 0;
        setTimeout(function () {
            fileView.style.display = "flex";
            fileView.style.opacity = 1;
            imageView.style.display = "none";
        }, 400)
    }
}

isDocumentReady(() => {
    document.querySelectorAll(".left-delta, .right-delta").forEach((item) => {
        if (item.classList.contains("left-delta")) {
            item.addEventListener('click', () => {
                let name = imageTitle.textContent;
                index = findIndex(name, images);
                
                if (index == 0)
                    index = images.length - 1;
                else index--;
                history.replaceState({file: images[index], type: "image", transition: true}, images[index], "#"+images[index]);
                replaceImage(images[index]);
            })
        }
        else {
            item.addEventListener('click', () => {
                let name = imageTitle.textContent;
                index = findIndex(name, images);

                if (index == images.length - 1)
                    index = 0;
                else index++;
                history.replaceState({file: images[index], type: "image", transition: true}, images[index], "#"+images[index]);
                replaceImage(images[index]);
            })
        }
    })

    if (imageTitle) {
        imageTitle.addEventListener('click', () => {
            history.back();
            imageView.style.opacity = 0;
            setTimeout(function () {
                fileView.style.display = "flex";
                fileView.style.opacity = 1;
                imageView.style.display = "none";
            }, 400)
        });
    }
});