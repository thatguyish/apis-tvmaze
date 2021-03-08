/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const searchUrl = "https://api.tvmaze.com/search/shows?"
  const res = await axios.get(searchUrl, { params: { "q": query } });
  const allShows = [];
  for (let showDetails of res.data) {
    const image = await axios.get(`https://api.tvmaze.com/shows/${showDetails.show.id}/images`);
    image.data.length < 1 ?
      showDetails.show.img = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300" :
      showDetails.show.img = image.data[0].resolutions.original.url;


    allShows.push(showDetails.show);
  }

  return allShows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.img}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <div class="row justify-content-center">
              <button class="btn-primary">Episodes</button>
            </div>
            <div id="episodelist${show.id}" class="container"></div>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
    $('button').last().on('click', handleEpisodeClick);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  let episodeUrl = `https://api.tvmaze.com/shows/${id}/episodes`;


  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(episodeUrl)
  return res.data;
}

function populateEpisodes(show, episodes) {
  const $currentShow = $(show);
  for (let episode of episodes) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-episode-id="${episode.id}">
         <div class="card" data-show-id="${episode.id}">
          <img class="card-img-top" src="${episode.image.original}">
           <div class="card-body">
             <h5 class="card-title">${episode.name}</h5>
             <p class="card-text">${episode.summary}</p>
             <div class="row justify-content-center">
            </div>
           </div>
         </div>
       </div>
      `);
    $currentShow.append($item);
  }
}
async function handleEpisodeClick(e) {

  const showId = e.target.parentElement.parentElement.parentElement.getAttribute('data-show-id')
  const episodeContainer = document.querySelector(`#episodelist${showId}`);
  if (episodeContainer.children.length==0) {
    const episodeList = await getEpisodes(showId);
    populateEpisodes(episodeContainer, episodeList);
  } else {
    episodeContainer.innerHTML='';
  }

}