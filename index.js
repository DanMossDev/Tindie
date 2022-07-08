const testFunk = () => {
    fetch('https://steam-rolled.herokuapp.com/api')
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

testFunk()