let mainAreaElement;
let sidebarElement;
let characterCardsElement;

function renderCharacter(name, status, species, image){
    const cardCharacterElement = document.createElement('div')
    cardCharacterElement.className= 'character-card'
    characterCardsElement.appendChild(cardCharacterElement);


const characterImageElement = document.createElement('img')
characterImageElement.src=image;


const characterNameElement = document.createElement('div')
characterNameElement.innerText= name;

const characterSpecieStatusElement = document.createElement('div')
characterSpecieStatusElement.innerText= `${species} | ${status}`;

cardCharacterElement.appendChild(characterImageElement);
cardCharacterElement.appendChild(characterNameElement);
cardCharacterElement.appendChild(characterSpecieStatusElement);

}

async function fetchCharacters(characterURLs){
    const characterFetchPromises = characterURLs.map(characterURL => fetch(characterURL));
    const resolvedFetchResponses = await Promise.all(characterFetchPromises);
    const jsonPromises = resolvedFetchResponses.map(resolvedFetchResponse => resolvedFetchResponse.json());
    const resolvedJsonPromises = await Promise.all(jsonPromises);

    resolvedJsonPromises.forEach(characterJson => renderCharacter(
        characterJson.name, characterJson.status, characterJson.species, characterJson.image));
}

function updateMainArea(name, date, episodeCode, characterURLs){
  mainAreaElement.innerHTML = '';
  characterCardsElement.innerHTML= '';
  


const titleElement = document.createElement('h2')
titleElement.innerText= name;
const dateAndCodeElement = document.createElement('h3')
dateAndCodeElement.innerText= `${date} | ${episodeCode}`;
mainAreaElement.appendChild(titleElement);
mainAreaElement.appendChild(dateAndCodeElement);
mainAreaElement.appendChild(characterCardsElement);

fetchCharacters(characterURLs)
}


 function renderNextEpisodesButton(nextUrl){
     if(nextUrl){
         return;
     }
        const nextButton = document.createElement('button')
        nextButton.className = 'next-list-button';
        nextButton.innerText= 'Next Episodes';
        nextButton.addEventListener('click', _event =>{
            console.log(nextUrl);
           fetch(nextUrl)
            .then(response => response.json())
            .then(json =>{
                renderListOfEpisodes(json.results, json.info.next)
            })
            })
         sidebarElement.appendChild(nextButton);
       
    }

     



  function renderListOfEpisodes(episodes, nextUrl){
      document.querySelectorAll('.next-list-button').forEach(
        buttonElement => sidebarElement.removeChild(buttonElement));


  episodes.forEach(episode => {
    const titleElement = document.createElement('p')
      titleElement.innerText = `Episode ${episode.id}`;
      sidebarElement.appendChild(titleElement);
      titleElement.addEventListener('click', _event =>{
          updateMainArea(episode.name, episode.air_date, episode.episode, episode.characters);

      })
 })
      renderNextEpisodesButton(nextUrl);
 }

function sidebar(){
    sidebarElement= document.createElement('div')
    sidebarElement.id = 'sidebar';
    document.querySelector('#root').appendChild(sidebarElement);
    fetch('https://rickandmortyapi.com/api/episode')
    .then(response => response.json())
    .then(json => {
        renderListOfEpisodes(json.results, json.info.text);
        const firstEpisode= json.results[0];
        updateMainArea(firstEpisode.name, firstEpisode.air_date, firstEpisode.episode, firstEpisode.characters);
    })
     .catch(
         errorMessage => console.error(errorMessage)
     )
   
}

function mainArea(){
    mainAreaElement= document.createElement('div')
    mainAreaElement.id = 'main-area';
    characterCardsElement= document.createElement('div')
    characterCardsElement.id= 'character-cards';
    mainAreaElement.appendChild(characterCardsElement)
    document.querySelector('#root').appendChild(mainAreaElement);
}
sidebar();
mainArea();