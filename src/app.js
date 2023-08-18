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
    })
}    