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
const loginButton = document.getElementById('login')
const loginSection = document.getElementById('loginsection')
const loginResponse = document.getElementById('login-response')
const registerHere = document.getElementById('register-here')

const submit = document.getElementById('submit')
const submitReg = document.getElementById('submit-reg')
const matchlist = document.getElementById('matchlist')
const seenArray = []

const yes = document.getElementById('yes')
const no = document.getElementById('no')

let data
let currentGame
let userID
let isLoggedIn = false


yes.addEventListener('click', () => {
    addMatch(currentGame)
    loadNext()
})
no.addEventListener('click', () => {loadNext()})

submit.addEventListener('click', () => {login()})
submitReg.addEventListener('click', () => {register()})


swipeButton.addEventListener('click', () => {loadSwipe()})
matchesButton.addEventListener('click', () => {loadMatches()})
loginButton.addEventListener('click', () => {loadLogin()})
registerHere.addEventListener('click', () => {loadRegister()})


function loadSwipe() {
    swipeSection.style.display = 'block'
    matchesSection.style.display = 'none'
    loginSection.style.display = 'none'
    yes.style.display = 'block'
    no.style.display = 'block'
}

function loadMatches() {
    swipeSection.style.display = 'none'
    matchesSection.style.display = 'block'
    loginSection.style.display = 'none'
    yes.style.display = 'none'
    no.style.display = 'none'
}

function loadLogin() {
    swipeSection.style.display = 'none'
    matchesSection.style.display = 'none'
    loginSection.style.display = 'block'
    yes.style.display = 'none'
    no.style.display = 'none'
}

function loadNext() {
    swipeSection.scrollTop = 0
    randomGame()
}

function loadRegister() {
    document.getElementById('login-title').textContent = "REGISTER"
    document.getElementById('login-form').style.display = 'none'
    document.getElementById('register-form').style.display = 'block'
}

async function register() {
    const username = document.getElementById('user-reg').value
    const password = document.getElementById('password-reg').value
    try {
    const response = await fetch('https://steam-rolled.herokuapp.com/api/users/register', {
        method: 'POST', 
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({username, password})
    })
    const {user_id, msg} = await response.json()
    userID = user_id

    isLoggedIn = true
    hideRegister(msg)
    } catch (err) { 
        document.getElementById('password').value = ''; 
        loginResponse.style.display = 'block' 
        loginResponse.textContent = "Username taken - Or missing username/password"
    }
}

async function login() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    try {
    const response = await fetch('https://steam-rolled.herokuapp.com/api/users/login', {
        method: 'POST', 
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({username, password})
    })
    const {user_id, games} = await response.json()
    userID = user_id

    isLoggedIn = true
    loadPreviousMatches(games)
    hideLogin()
    } catch (err) { 
        document.getElementById('password').value = ''; 
        loginResponse.style.display = 'block' 
        loginResponse.textContent = "Incorrect username or password; try again."
    }
}

function hideLogin() {
    document.getElementById('login-form').style.display = 'none'
    loginResponse.textContent = "Login Successful!"
    loginResponse.style.display = 'block'
    setTimeout(loadMatches, 2000)
}

function hideRegister(msg) {
    document.getElementById('register-form').style.display = 'none'
    loginResponse.textContent = msg
    loginResponse.style.display = 'block'
    setTimeout(loadSwipe, 2000)
}

function loadPreviousMatches(games) {
    games.forEach(game => {
        addOldMatch(data.filter(el => el.app_id === game)[0])
    })
}

function addOldMatch(game) {
    matchlist.innerHTML += `<li>
    ${game.game_title} - <a href="https://store.steampowered.com/app/${game.app_id}" target="_blank">View on Steam</a>
    </li>
    <hr>`
    seenArray.push(game)
}


async function addMatch(game) {
    matchlist.innerHTML += `<li>
    ${game.game_title} - <a href="https://store.steampowered.com/app/${game.app_id}" target="_blank">View on Steam</a>
    </li>
    <hr>`
    if (isLoggedIn) await fetch('https://steam-rolled.herokuapp.com/api/users/games', {
        method: 'POST', 
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({app_id: currentGame.app_id, user_id: userID})})
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