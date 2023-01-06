"use strict";

const missingUrl = "http://tinyurl.com/missing-tv"
const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

async function getShowsByTerm(term) {

    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
    
   return res.data.map((searchRes) => {
    
    return {
      id: searchRes.show.id,
      name: searchRes.show.name,
      summary: searchRes.show.summary,
      image: searchRes.show.image ? searchRes.show.image.medium : missingUrl
      
    }
    
   })
 
}

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="annoying" class="btn btn-outline-primary btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
    
    $showsList.append($show);  } 
}

async function searchForShowAndDisplay() {
  
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function searchShows(term){
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  
  const searchedShows = [res.data]
  
    
  
  }
  
async function getEpisodesOfShow(id) {
  const epSearch = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  const episodes = epSearch.data
  
  return episodes.map((episode) => {
    
    return {
      id: episode.id,
      name: episode.name,
      summary: episode.summary
       
    }
  })


  }

function populateEpisodes(episodes) {
  
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
 

  for(let ep of episodes){
  
    let $li = $(`<li>${ep.name}</li>`)
    $episodesList.append($li);
    
  }
  $episodesArea.show();
  
 }

 async function displayEpisodes(e){
 
  const idOfShow = $(e.target).closest(".Show").data("show-id")
  
  const episodes = await getEpisodesOfShow(idOfShow);
  populateEpisodes(episodes)

 }

$showsList.on("click", ".Show-getEpisodes", displayEpisodes);