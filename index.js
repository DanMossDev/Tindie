//DOM cache
const title = document.getElementById('gametitle')
const mov = document.getElementById('mov')
const img1 = document.getElementById('img1')
const img2 = document.getElementById('img2')
const img3 = document.getElementById('img3')
const tags = document.getElementById('tags')
const lang = document.getElementById('languages')
const bio = document.getElementById('bio')
const developer = document.getElementById('dev')
const publisher = document.getElementById('publisher')

const swipeButton = document.getElementById('swipe')
const swipeSection = document.getElementById('swipesection')
const matchesButton = document.getElementById('matches')
const matchesSection = document.getElementById('matchessection')
const matchlist = document.getElementById('matchlist')
const seenArray = []

const yes = document.getElementById('yes')
const no = document.getElementById('no')

let data
let currentGame

yes.addEventListener('click', () => {
    addMatch(currentGame)
    loadNext()
})

no.addEventListener('click', () => {loadNext()})



swipeButton.addEventListener('click', function() {loadSwipe()})
matchesButton.addEventListener('click', function() {loadMatches()})

function loadSwipe() {
    swipeSection.style.display = 'block'
    matchesSection.style.display = 'none'
    yes.style.display = 'block'
    no.style.display = 'block'
}

function loadMatches() {
    swipeSection.style.display = 'none'
    matchesSection.style.display = 'block'
    yes.style.display = 'none'
    no.style.display = 'none'
}

function loadNext() {
    swipeSection.scrollTop = 0
    randomGame()
}

function addMatch(game) {
    matchlist.innerHTML += `<li>
    ${game.game_title} - <a href="https://store.steampowered.com/app/${game.app_id}" target="_blank">View on Steam</a>
    </li>
    <hr>`
}

const initialiseData = async () => {
    const response = await fetch('https://steam-rolled.herokuapp.com/api/games')
    data = await response.json()
    currentGame = data[Math.floor(Math.random() * data.length)]
    while (seenArray.includes(currentGame)) currentGame = data[Math.floor(Math.random() * data.length)]
    seenArray.push(currentGame)
    assignDOM(currentGame)
}

const randomGame = () => {
    currentGame = data[Math.floor(Math.random() * data.length)]
    while (seenArray.includes(currentGame)) currentGame = data[Math.floor(Math.random() * data.length)]
    seenArray.push(currentGame)
    assignDOM(currentGame)
    assignDOM(currentGame)

    console.log(seenArray)
}

const assignDOM = ({game_title, links: [links], genres, languages, description, details, app_id}) => {
    title.textContent = game_title
    bio.textContent = description
    developer.textContent = details.Developer
    publisher.textContent = details.Publisher

    let platform = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'
    
    let movLink = links[0]
    if (platform === 'iPhone') {
        movLink = movLink.replace('.webm', '.mp4')
        movLink = movLink.replace('_vp9', '')
    }
    mov.innerHTML = `<source src="${movLink}"></source>`
    mov.load()
    img1.src = links[1]
    img2.src = links[2]
    img3.src = links[3]

    let genreHTML = `<li><strong>GENRES</strong></li>
    `
    genres.forEach(genre => {
        genreHTML += `<li><em>${genre}</em></li>
        `
    })
    tags.innerHTML = genreHTML

    let languagesHTML = `<li><strong>LANGUAGES</strong></li>
    `
    languages.forEach(language => {
        languagesHTML += `<li><em>${language}</em></li>
        `
    })
    lang.innerHTML = languagesHTML
    
    mov.onload = setTimeout(loaded, 500)
}


function loaded() { //hides black cover when the game has loaded
    $("#cover").hide();
};

initialiseData()