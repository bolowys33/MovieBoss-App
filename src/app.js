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
        let buttonDiv = document.createElement(`div`);
        let likeDiv = document.createElement("div");
        let likeBtn = document.createElement(`span`);
        let likeText = document.createElement("span");
        let commentDiv = document.createElement("div");
        let commentBtn = document.createElement("span");
        let commentText = document.createElement("span");
        let ratingDiv = document.createElement("div");
        ratingDiv.style.textAlign = `center`;
        ratingDiv.style.marginBottom = `10px`;

        let id = `item${movie.id}`;

        movieCard.className = `card p-3 bg-success-subtle`;
        thumbnail.className = `card-img-top mb-2`;
        thumbnail.style.cursor = `pointer`;
        movieCardBody.className = `card-body`;
        title.className = `card-title text-center`;
        title.style.cursor = `pointer`;
        commentBtn.style.cursor = `pointer`;
        likeBtn.innerHTML = `<i class="fa fa-heart"></i>`;
        likeBtn.style.cursor = `pointer`;
        likeBtn.style.marginRight = `10px`;

        commentBtn.innerHTML = `<i class="fa-solid fa-comment"></i>`;
        commentBtn.style.marginRight = `10px`;

        commentText.innerText = `0 comments`;

        commentDiv.append(commentBtn, commentText);
        likeDiv.append(likeBtn, likeText);

        buttonDiv.append(likeDiv, commentDiv);
        buttonDiv.style.display = `flex`;
        buttonDiv.style.justifyContent = ` space-around`;

        thumbnail.src = movie.image.medium;
        title.textContent = movie.name;

        movieCard.append(thumbnail, title, ratingDiv, buttonDiv);
        container.append(movieCard);

        function ratingConv() {
            let rating = (movie.rating.average / 10) * 5;
            showRating(rating);
        }

        function showRating(rating) {
            if (rating === 1) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>`;
            } else if (rating > 1 && rating < 2) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star-half-stroke" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i>`;
            } else if (rating === 2) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i>`;
            } else if (rating > 2 && rating < 3) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i></i><i class="fa-solid fa-star-half-stroke" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i>`;
            } else if (rating === 3) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i>`;
            } else if (rating > 3 && rating < 4) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i></i><i class="fa-solid fa-star-half-stroke" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i>`;
            } else if (rating === 4) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-regular fa-star" style="color: #ffd700;"></i>`;
            } else if (rating > 4 && rating < 5) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i></i><i class="fa-solid fa-star-half-stroke" style="color: #ffd700;"></i>`;
            } else if (rating === 5) {
                ratingDiv.innerHTML = `<i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i><i class="fa-solid fa-star" style="color: #ffd700;"></i>`;
            }
        }

        async function getComment() {
            try {
                const response = await fetch(
                    `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/EI8oCHzs7PU6cr94kJaj/comments?item_id=${id}`
                );
                const data = await response.json();
                if (data.length === undefined) {
                    commentText.innerText = `No comments`;
                } else if (data.length === 1) {
                    commentText.innerText = `1 comment`;
                } else {
                    commentText.innerText = `${data.length} comments`;
                }
            } catch (error) {
                console.error(
                    "An error occurred while fetching comments:",
                    error
                );
            }
        }

        ratingConv();
        getLikes();
        getComment();

        thumbnail.addEventListener("click", () => {
            showMoviePopup(movie, id);
        });
        title.addEventListener("click", () => {
            showMoviePopup(movie, id);
        });
        commentBtn.addEventListener("click", () => {
            showMoviePopup(movie, id);
        });

        likeBtn.addEventListener(
            "click",
            function () {
                likeBtn.style.color = `red`;

                async function addlike() {
                    await fetch(
                        `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/EI8oCHzs7PU6cr94kJaj/likes`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                item_id: id,
                            }),
                            headers: {
                                "Content-type": "application/json",
                            },
                        }
                    );

                    getLikes();
                }
                addlike();
            },
            { once: true }
        );

        async function getLikes() {
            const response = await fetch(
                `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/EI8oCHzs7PU6cr94kJaj/likes`
            );
            const data = await response.json();
            showLikes(data);
        }

        likeText.innerText = `0 likes`;

        function showLikes(data) {
            const likesArr = data.filter((like) => like.item_id === id);

            if (likesArr[0].likes === 1) {
                likeText.innerText = `${likesArr[0].likes} like`;
            } else {
                likeText.innerText = `${likesArr[0].likes} likes`;
            }
        }

        container.append(movieCard);
    });
}

function prevPage() {
    currentPage--;
    showPage();
}

function nextPage() {
    currentPage++;
    showPage();
}

function showPage() {
    const prevBtn = document.getElementById("prevButton");
    const nextBtn = document.getElementById("nextButton");
    const pageNum = document.getElementById("pageNumber");
    pageNum.textContent = currentPage;

    prevBtn.hidden = currentPage === 1;
    nextBtn.hidden =
        currentPage === Math.ceil(moviesData.length / itemsPerPage);

    nextBtn.addEventListener("click", nextPage);
    prevBtn.addEventListener("click", prevPage);

    displayPage();
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

window.addEventListener("DOMContentLoaded", getMovies);