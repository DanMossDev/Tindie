//DOM cache

//Swipe Page
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
const yes = document.getElementById('yes')
const no = document.getElementById('no')

//Moving between pages
const swipeButton = document.getElementById('swipe')
const swipeSection = document.getElementById('swipesection')
const matchesButton = document.getElementById('matches')
const matchesSection = document.getElementById('matchessection')
const loginButton = document.getElementById('login')
const loginSection = document.getElementById('loginsection')

//Login page
const loginResponse = document.getElementById('login-response')
const registerResponse = document.getElementById('register-response')
const registerHere = document.getElementById('register-here')
const submit = document.getElementById('submit')
const submitReg = document.getElementById('submit-reg')
const loginTitle = document.getElementById('login-title')
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const loginUser = document.getElementById('username')
const loginPass = document.getElementById('password')
const registerUser = document.getElementById('user-reg')
const registerPass = document.getElementById('password-reg')

//Match page
const matchlist = document.getElementById('matchlist')

//Variables
const seenArray = []
let listOfGames
let currentGame
let userID
let isLoggedIn = false
let isRegistering = false

yes.addEventListener('click', () => {
    addMatch(currentGame)
    loadNext()
})
no.addEventListener('click', () => {loadNext()})

loginForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login()
})
submit.addEventListener('click', () => {login()})
submitReg.addEventListener('click', () => {register()})
loginUser.addEventListener('blur', () => {
    if (!checkUsername(loginUser.value)) {
        loginResponse.textContent = "Username must be 3 or more characters"
    }
})
registerUser.addEventListener('blur', () => {
    if (!checkUsername(registerUser.value)) {
        registerResponse.textContent = "Username must be 3 or more characters"
    }
})
loginPass.addEventListener('blur', () => {
    if (!checkPassword(loginPass.value)) {
        loginResponse.textContent = "Password must be 5 characters and contain at least 1 number, 1 lowercase, and 1 uppercase letter"
    }
})
registerPass.addEventListener('blur', () => {
    if (!checkPassword(registerPass.value)) {
        registerResponse.textContent = "Password must be 5 characters and contain at least 1 number, 1 lowercase, and 1 uppercase letter"
    }
})


swipeButton.addEventListener('click', () => {loadSwipe()})
matchesButton.addEventListener('click', () => {loadMatches()})
loginButton.addEventListener('click', () => {loadLogin()})
registerHere.addEventListener('click', () => {
    isRegistering ? loadLoginForm() : loadRegister()
})


let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
swipeSection.addEventListener('touchstart', element => {
    console.log(element)
    touchStartX = element.changedTouches[0].screenX
    touchStartY = element.changedTouches[0].screenY
})
swipeSection.addEventListener('touchmove', element => {
    touchCurrentX = element.changedTouches[0].screenX - touchStartX
    touchCurrentY = element.changedTouches[0].screenY - touchStartY
    swipeSection.style.transform = `translate(${touchCurrentX}px, ${touchCurrentY}px)`
    swipeSection.style.transform += ` skew(${touchCurrentX / -60}deg, ${touchCurrentX / 60}deg)`
    console.log(touchCurrentX)
})
swipeSection.addEventListener('touchend', element => {
    swipeSection.style.transform = `translate(0px, 0px)`
    touchEndX = element.changedTouches[0].screenX
    const delta = touchEndX - touchStartX
    if (delta > 150) {
        addMatch(currentGame)
        loadNext()
    }
    if (delta < -150) loadNext()
})


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
    registerHere.textContent = "Return to login"
    loginTitle.textContent = "REGISTER"
    loginForm.style.display = 'none'
    registerForm.style.display = 'block'
    loginResponse.textContent = ''
    isRegistering = true
}

function loadLoginForm() {
    registerHere.textContent = "Need to register? Click here!"
    loginTitle.textContent = "LOGIN"
    loginForm.style.display = 'block'
    registerForm.style.display = 'none'
    registerResponse.textContent = ''
    isRegistering = false
}

async function register() {
    const username = registerUser.value
    const password = registerPass.value
    if (!checkPassword(password) || !checkUsername(username)) return
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
    loginForm.style.display = 'none'
    loginResponse.textContent = "Login Successful!"
    loginResponse.style.display = 'block'
    setTimeout(loadMatches, 2000)
}

function hideRegister(msg) {
    registerForm.style.display = 'none'
    loginResponse.textContent = msg
    loginResponse.style.display = 'block'
    setTimeout(loadSwipe, 2000)
}

function loadPreviousMatches(games) {
    games.forEach(game => {
        addOldMatch(listOfGames.filter(el => el.app_id === game)[0])
    })
}

function addOldMatch(game) {
    matchlist.innerHTML += `<hr><li>
    ${game.game_title} - <a href="https://store.steampowered.com/app/${game.app_id}" target="_blank">View on Steam</a>
    </li>`
    seenArray.push(game)
}


async function addMatch(game) {
    matchlist.innerHTML += `<hr><li>
    ${game.game_title} - <a href="https://store.steampowered.com/app/${game.app_id}" target="_blank">View on Steam</a>
    </li>`
    if (isLoggedIn) await fetch('https://steam-rolled.herokuapp.com/api/users/games', {
        method: 'POST', 
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({app_id: currentGame.app_id, user_id: userID})})
}

const initialiseData = async () => {
    const response = await fetch('https://steam-rolled.herokuapp.com/api/games')
    listOfGames = await response.json()
    currentGame = listOfGames[randomise(listOfGames)]
    while (seenArray.includes(currentGame)) currentGame = listOfGames[randomise(listOfGames)]
    seenArray.push(currentGame)
    assignDOM(currentGame)
}

const randomGame = () => {
    currentGame = listOfGames[randomise(listOfGames)]
    while (seenArray.includes(currentGame)) currentGame = listOfGames[randomise(listOfGames)]
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

function checkUsername(username) {
    return username.length >= 3
}

function checkPassword(password) {
    return (password.length >=5 && /[0-9]/g.test(password) && /[a-z]/g.test(password) && /[A-Z]/g.test(password))
}

function randomise(array) {
    return Math.floor(Math.random() * array.length)
}

function loaded() { //hides black cover when the game has loaded
    $("#cover").hide();
};

initialiseData()