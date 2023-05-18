let loadedPokemon = 17;
let currentLoadedPokemon = 1;
let listOfLoadedPokemon = [];
let currentSection = 'stats'; //Create a global variable to store the current section

function init() {
    loadPokemon();
}

async function loadPokemon() { // 1. diese Funktion soll das Array runter laden
    for (let i = currentLoadedPokemon; i < loadedPokemon; i++) {

        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url); //2.dafür müssen wir eine Variable definieren
        currentPokemon = await response.json();// 3.die Variable mit der URl wollen wir in ein JSON umwandeln
        //4.responseAsJson kann ich mir wie folgt rausloggen:
        console.log('Loaded Pokemon', currentPokemon);
        //r5. esponseAsJson= await response.json(); möchte ich global speichern, damit ich von überall drauf zu greifen kann.
        //deshalb ändern wir das auf:currentPokemon = await response.json();
        //und speichern das currentPokemon global

        listOfLoadedPokemon.push(currentPokemon);

        document.getElementById('pokemonBox').innerHTML += generateLoadPokemonHTML(i, currentPokemon, response, url);
        renderPokemonInf(i); //6. diese Funktion ist nur dafür zuständig die Infos auch anzuzeigen.
        renderPokemonType(i, currentPokemon);
    }
}

function generateLoadPokemonHTML(i) {
    return `
    <div class="card2" onclick="openOverlayCard(${i})">
            <div class="cardHeadline">
                <h1 class="pokenumber" id="pokemonID${i}">#</h1>
                <div class="typeCard" id="typeCard${i}">
                    <div>
                    <img src="" class="categorieIcon" id="pokemonType${i}">
                    </div>
                </div>
            </div>
            <div class="cardImg"><img src="img\charmander.png" id="pokemonImage${i}"></div>
            <div>
                <h1 class="description" id="pokemonName${i}">Charmander</h1>
            </div>
        </div>
    `;
}

function renderPokemonInf(i) {
    // im ersten Schritt soll der Name angezeigt werden
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    //nun das Bild einfügen
    document.getElementById(`pokemonImage${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    //Pokemon Nr hinzufügen
    document.getElementById(`pokemonID${i}`).innerHTML += currentPokemon['id'];
    //PokemonTypes hinzufügen
    document.getElementById(`pokemonType${i}`).innerHTML = currentPokemon['types'][0]['type']['name'];
}

function renderPokemonType(i, currentPokemon) {
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let pokemonType = currentPokemon['types'][j]['type']['name'];
        document.getElementById(`typeCard${i}`).innerHTML += `
        <div>${getPokemonTypeIcon(pokemonType)}</div>
        `;
    }
}

function getPokemonTypeIcon(pokemonType) {
    return `
<img src="img/${pokemonType}.png" class="categorieIcon"></img>
`;
}

function loadMorePokemon() {
    currentLoadedPokemon = loadedPokemon; // = loadedPokemon+1; habe ich entfernt, weil beim laden immer ein Pokemon dazwischen gefehlt hat.
    loadedPokemon += 17;
    loadPokemon();
    if (!isLoading) {
        isLoading = true;
        loadButton.disabled = true;
        const start = loadedCount;
        const end = Math.min(loadedCount + 3, pokemonData.length);
        for (let i = start; i < end; i++) {
            const newCard = createPokemonCard(pokemonData[i]);
            pokemonList.appendChild(newCard);
            loadedCount++;
        }
        isLoading = false;
        loadButton.disabled = false;
    }
}

function filter() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    let pokemonFound = false; // neue Variable hinzufügen

    document.getElementById('pokemonBox').innerHTML = '';
    document.getElementById('btn').innerHTML = '';
    for (let i = 0; i < listOfLoadedPokemon.length; i++) {
        const pokem = listOfLoadedPokemon[i]['name'].toLowerCase();
        currentPokemon = listOfLoadedPokemon[i];
        if (listOfLoadedPokemon[i]['name'].includes(search)) {
            document.getElementById('pokemonBox').innerHTML += generateLoadPokemonHTML(i, pokem);
            renderPokemonInf(i);
            renderPokemonType(i, currentPokemon);
            pokemonFound = true; // Pokemon wurde gefunden
        }
    }
    if (!pokemonFound) { // Wenn kein Pokemon gefunden wurde
        displayPokemonNotFound();
    }
}

function displayPokemonNotFound() {
    document.getElementById('pokemonBox').innerHTML = `<div class="error"><p class="error-message">A Pokémon with that name could not be found. Please try again or load more Pokémon. Go back on the Logo.</p></div>`;
}

function checkSecondType(currentPokemon) {
    if (currentPokemon['types'].length === 2) {
        return/*html*/ `        
        <img src="img/${currentPokemon['types'][0]['type']['name']}.png" class="categorieIcon"></img>
        <img src="img/${currentPokemon['types'][1]['type']['name']}.png" class="categorieIcon"></img>
        `;
    } else {
        return/*html*/ `
        <img src="img/${currentPokemon['types'][0]['type']['name']}.png" class="categorieIcon"></img>
        `;
    }
}

function closeOverlayCard() {
    document.getElementById('cardOverlay').style.display = "none";
    document.body.style.overflow = "scroll";
}

function openOverlayCard(i) {
    document.getElementById('cardOverlay').style.display = "flex";
    document.body.style.overflow = "hidden";

    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let pokemonType = currentPokemon['types'][j]['type']['name'];
        currentPokemon = listOfLoadedPokemon[i - 1];// minus 1 hinzugefügt, weil es das nächste Pokemon öffnet statt das aktuelle, zählt aber nicht von 0
        document.getElementById('cardOverlay').innerHTML = generateOverlayCardHTML(i, currentPokemon);

        // Entferne die vorherige Hintergrundfarbe, bevor die neue Hintergrundfarbe hinzugefügt wird
        const cardOverlayBack = document.getElementById('cardOverlBack');
        cardOverlayBack.classList.remove('fire', 'water', 'grass', 'electric', 'rock', 'ground', 'bug', 'poison', 'flying', 'psychic', 'fighting', 'ghost', 'ice', 'dragon', 'dark', 'steel', 'fairy');
        document.getElementById('cardOverlBack').classList.add(currentPokemon['types'][0]['type']['name']);
        const statsData = renderPokemonStats(i);//laut ChatGPT hinzugefügt        
        updateCardButtons(i);
    }
    showStats(i);
}

function generateOverlayCardHTML(i, currentPokemon) {
    return `
    <div><img class="cross" src="img/cross-circle.png" alt="exit" onclick="closeOverlayCard()"></div>
        
    <div><img class="left" id="left" src="img/angle-left.png" alt="previousImg"></div>
    <div class="thecard">
<div class="cardOverl front" onclick="openOverlayCard(${i})" >            
    
    <div class="cardHeadline">
        <h1 class="pokenumber" id="">#${currentPokemon['id']}</h1>        
        <div class="typeCard" id="typeCard${i}">
            <div style="display:flex">
            ${(checkSecondType(currentPokemon))} 
            </div>
        </div>
    </div>
    <div class="cardImgOverl"><img src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}"></div>
    <div>
        <h1 class="descriptionOverl" id="">${currentPokemon['name']}</h1>
        <h6>press long to flip</h6>       
    </div>
</div>

<div class="cardOverl back" id="cardOverlBack" >            
    
    <div class="cardHeadline">
        <h1 class="pokenumber" id="">#${currentPokemon['id']}</h1>        
        <div class="typeCard" id="typeCard${i}">
            <div style="display:flex">
            ${(checkSecondType(currentPokemon))} 
            </div>
        </div>
    </div>
    
    <div class="cardImgOverl cardImgBack ">
    <div class="pokemonBodyMass"><h3>weight:</h3><div><h3>${currentPokemon['weight'] / 10} kg</h3></div>
    </div>
    <img class="imgBack" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
    <div class="pokemonBodyMassheight"><h3>height:</h3><div><h3>${currentPokemon['height'] / 10} m</h3></div>
    </div>
    </div>
    
    <div>
        <h1 class="description descriptionBack" id="">${currentPokemon['name']}</h1>        
    </div>
    <div class="sections">
        <div onclick="showStats(${i})" id="statsSection"><h3>stats</h3></div> 
        <div onclick="renderPokemonMoves(${i})" id="movesSection"><h3>moves</h3></div>
        <div onclick="renderPokemonAbility(${i})" id="abilitySection"><h3>ability</h3></div>
    </div>

    <div class="sectionCards" id="sectionCards">
         <div class="statsCard" id="statsCard" >
            <canvas id="myChart"></canvas>
         </div>          
     </div>
</div>
</div>
<div><img class="right" id="right" src="img/angle-right.png" alt="nextImg"></div>
    `;
}

function updateCardButtons(i) {
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');

    leftButton.setAttribute('onclick', `openOverlayCard(${i === 1 ? listOfLoadedPokemon.length : i - 1})`);
    rightButton.setAttribute('onclick', `openOverlayCard(${i >= listOfLoadedPokemon.length ? 1 : i + 1})`);
}

function renderPokemonMoves(i, currentPokemon) {
    let currentSection = 'moves';
    console.log('renderPokemonMoves called');
    console.log('current section:', currentSection);

    let movesContainer = document.getElementById('sectionCards');
    movesContainer.innerHTML = '';

    let moveDivContainer = document.createElement('div');
    moveDivContainer.classList.add('move-container');

    for (let k = 0; k < listOfLoadedPokemon[i - 1]['moves'].length; k++) {
        let move = listOfLoadedPokemon[i - 1]['moves'][k]['move']['name'];
        //document.getElementById('sectionCards').innerHTML += `
        moveDivContainer.innerHTML += `
        <div class="moveCard" id="moveCard">
        <div class="move">${move}</div>
        </div>        
        `;
    }
    movesContainer.appendChild(moveDivContainer);
}

function renderPokemonAbility(i, currentPokemon) {
    let currentSection = 'ability';
    console.log('renderPokemonAbility called');
    console.log('current section:', currentSection);

    let abilityContainer = document.getElementById('sectionCards');
    abilityContainer.innerHTML = '';

    let abilityDivContainer = document.createElement('div');
    abilityDivContainer.classList.add('abilitycontainer');

    for (let k = 0; k < listOfLoadedPokemon[i - 1]['abilities'].length; k++) {
        let ability = listOfLoadedPokemon[i - 1]['abilities'][k]['ability']['name'];
        //document.getElementById('sectionCards').innerHTML += `
        abilityDivContainer.innerHTML += `
        <div class="abilityCard" id="moveCard">
        <div class="ability">${ability}</div>
        </div>
        
        `;
    }
    abilityContainer.appendChild(abilityDivContainer);

}

function renderPokemonStats(i) {
    let datas = [];
    if (listOfLoadedPokemon[i - 1]['stats'].length > 0) {
        for (let k = 0; k < listOfLoadedPokemon[i - 1]['stats'].length; k++) {
            const stats = listOfLoadedPokemon[i - 1].stats[k].base_stat;
            datas.push(stats);
        }
    }
    return datas;
}

function createStatsChartData(statsData) {
    return {

        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [{
            label: 'Stats',
            data: statsData,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                '#660966'
            ],
            color: '#FF0000',
            borderWidth: 0.9,
            borderRadius: 5
        }],
    }
}

function initializeChart(chartId, data) {
    var ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        font: {
                            size: 9,
                        },
                        color: "white",
                    },
                    beginAtZero: true,

                },
                x: {
                    grid: {
                        display: false,
                        drawTicks: false,
                    },

                    ticks: {
                        font: {
                            size: 10,
                        },
                        color: "white",
                        fontFamily: "Verdana"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function showStats(i) {
    let currentSection = 'stats';
    console.log('showStats called');
    console.log('current section:', currentSection);
    const statsData = renderPokemonStats(i);
    const sectionCards = document.getElementById(`sectionCards`);
    sectionCards.innerHTML = '';
    sectionCards.innerHTML += `
        <div class="statsCard" id="statsCard" >
            <canvas id="myChart"></canvas>
        </div>
        `;
    const dataStats = createStatsChartData(statsData);
    initializeChart('myChart', dataStats);
}

const canvas = document.getElementById('myChart');
if (canvas) {
    console.log('Canvas element exists!');
} else {
    console.log('Canvas element does not exist.');
}