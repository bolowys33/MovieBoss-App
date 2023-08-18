let moviesData;
let currentPage = 1;
const itemsPerPage = 8;
let startIndex, endIndex;

async function getMovies() {
    const response = await fetch(`https://api.tvmaze.com/shows`);
    const data = await response.json();
    moviesData = data;

    showPage();
}

let container = document.querySelector(`#main`);

function displayPage() {
    container.innerHTML = "";

    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    const pageData = moviesData.slice(startIndex, endIndex);

    pageData.forEach((movie) => {
        let movieCard = document.createElement(`div`);
        let thumbnail = document.createElement(`img`);
        let movieCardBody = document.createElement(`div`);
        let title = document.createElement(`h3`);

        let id = `item${movie.id}`;

        movieCard.className = `card p-3 bg-success-subtle`;
        thumbnail.className = `card-img-top mb-2`;
        thumbnail.style.cursor = `pointer`;
        movieCardBody.className = `card-body`;
        title.className = `card-title text-center`;
        title.style.cursor = `pointer`;

        thumbnail.src = movie.image.medium;
        title.textContent = movie.name;

        movieCard.append(thumbnail, title, ratingDiv, buttonDiv);
        container.append(movieCard);
    });
}

function showMoviePopup(movie, id) {
    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-container";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    const closeBtn = document.createElement("span");
    closeBtn.className = "popup-close-btn";
    closeBtn.textContent = "×";

    const popupImg = document.createElement("img");
    popupImg.src = movie.image.medium;

    const popupTitle = document.createElement("h3");
    popupTitle.textContent = movie.name;

    const popupDesc = document.createElement("p");
    popupDesc.innerHTML = movie.summary;

    const topDiv = document.createElement("div");
    const bottomDiv = document.createElement("div");

    topDiv.id = `top-div`;
    bottomDiv.id = `bottom-div`;

    let firstDiv = document.createElement("div");
    let secondDiv = document.createElement("div");
    let thirdDiv = document.createElement("div");
    secondDiv.id = `second-div`;
    firstDiv.id = `first-div`;
    secondDiv.style.overflowX = `hidden`;

    let nameInput = document.createElement("input");
    nameInput.type = `text`;
    nameInput.name = `name`;
    let commentInput = document.createElement("textarea");
    commentInput.name = `comment`;
    let subBtn = document.createElement("button");
    let commHead = document.createElement("h4");

    let genre = document.createElement("span");
    let release = document.createElement("span");
    let lang = document.createElement("span");
    let website = document.createElement("span");
    let rating = document.createElement("span");

    genre.innerHTML = `<span class="fw-bold">Genres</span>: ${movie.genres}`;
    rating.innerHTML = `<span class="fw-bold">Rating</span>: ${movie.rating.average}`;
    lang.innerHTML = `<span class="fw-bold">Language</span>: ${movie.language}`;
    release.innerHTML = `<span class="fw-bold">Premiered</span>: ${movie.premiered}`;
    website.innerHTML = `Click <a class="text-decoration-none" href="${movie.officialSite}">Here</a> to visit movie's official website`;

    thirdDiv.style.display = `flex`;
    thirdDiv.style.flexDirection = `column`;
    thirdDiv.style.gap = `10px`;

    let leftDiv = document.createElement("div");
    let rightDiv = document.createElement("div");

    rightDiv.className = `right`;

    nameInput.placeholder = `Enter your name`;
    commentInput.style.height = `100px`;
    commentInput.placeholder = `Type in your comment`;
    subBtn.innerText = `Add Comment`;
    subBtn.style.alignSelf = `center`;
    commHead.innerText = `Tell us what you think about the movie`;
    commHead.style.textAlign = `center`;

    firstDiv.append(popupImg);
    secondDiv.append(popupTitle, popupDesc);
    secondDiv.style.textAlign = `justify`;
    thirdDiv.append(lang, genre, release, rating, website);
    thirdDiv.style.marginTop = `20px`;

    leftDiv.append(commHead, nameInput, commentInput, subBtn);
    leftDiv.style.display = `flex`;
    leftDiv.style.flexDirection = `column`;
    leftDiv.style.justifyContent = `center`;
    leftDiv.style.gap = `20px`;

    let movieId = id;
    getComments();

    topDiv.append(firstDiv, secondDiv, thirdDiv);
    bottomDiv.append(leftDiv, rightDiv);

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    popupContainer.appendChild(overlay);
    document.body.appendChild(popupContainer);

    popupContent.append(closeBtn, topDiv, bottomDiv);
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

    async function addComment() {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        if (name === "" || comment === "") {
            alert(`You cannot leave inputs empty`);
            return;
        } else {
            const commentData = {
                item_id: movieId,
                username: name,
                comment: comment,
            };

            try {
                const response = await fetch(
                    `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/EI8oCHzs7PU6cr94kJaj/comments`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(commentData),
                    }
                );

                if (response.ok) {
                    nameInput.value = "";
                    commentInput.value = "";
                    getComments();
                    getComment();
                } else {
                    console.error("Error adding comment:", response.statusText);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    }

    subBtn.addEventListener("click", () => {
        addComment();
    });

    async function getComments() {
        try {
            const response = await fetch(
                `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/EI8oCHzs7PU6cr94kJaj/comments?item_id=${movieId}`
            );
            const comData = await response.json();
            showComments(comData);
        } catch (error) {
            console.error("An error occurred while fetching comments:", error);
        }
    }

    getComments();

    function showComments(comments) {
        const commHeader = document.createElement("h4");
        commHeader.innerText = "All comments";

        const commCont = document.createElement("div");
        commCont.className = `comm-cont`;

        comments.forEach((comment) => {
            let commDiv = document.createElement("div");
            commDiv.className = `comm-div`;

            let userName = document.createElement("span");
            let commentSent = document.createElement("span");
            let dateSent = document.createElement("span");

            userName.innerText = comment.username;
            commentSent.innerText = comment.comment;

            function convertToWords(dateStr) {
                const today = new Date();
                const inputDate = new Date(dateStr.replace(/-/g, "/"));

                const differenceInMilliseconds = today - inputDate;
                const differenceInDays = Math.floor(
                    differenceInMilliseconds / (1000 * 60 * 60 * 24)
                );

                if (differenceInDays === 0) {
                    dateSent.innerText = "Today";
                } else if (differenceInDays === 1) {
                    dateSent.innerText = "Yesterday";
                } else if (differenceInDays > 1) {
                    dateSent.innerText = `${differenceInDays} days ago`;
                }
            }

            convertToWords(comment.creation_date);

            commDiv.append(userName, commentSent, dateSent);
            commCont.appendChild(commDiv);
        });

        rightDiv.innerHTML = "";
        rightDiv.append(commHeader, commCont);
    }

    closeBtn.addEventListener("click", () => {
        popupContainer.remove();
    });

    overlay.addEventListener("click", () => {
        popupContainer.remove();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            popupContainer.remove();
        }
    });
}
