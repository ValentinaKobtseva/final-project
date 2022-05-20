const client_id = '2b25bd7aba254ef5bda07dddb21861f5';
const client_secret = 'edd8ead4b35e4551b7641af95e2563cf';

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


async function getToken(){
  let token;

  const authOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (btoa(client_id + ':' + client_secret)),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  };
  const responseToken = await fetch('https://accounts.spotify.com/api/token', authOptions);
  // если запрос был успешный
  if (responseToken.status === 200) {
      const data = await responseToken.json();
      token = data.access_token;
      //console.log(data);
      setCookie("token", token, {'max-age': data.expires_in});
  } else {
      throw new Error('Something went wrong ' + responseToken.status);
  }
  return token;
}

async function getGeners(token){
  const fetchGenersResponse = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  if (fetchGenersResponse.status === 200) {
    let genresJSON = await fetchGenersResponse.json();
    //console.log(genresJSON);
    //console.log(genresJSON.genres);
    const genersSelector = document.querySelectorAll('.geners');
    const genersNameSelector = document.querySelectorAll('.geners-name');
    let genresCount = genresJSON.genres.length;
    for(let i = 0; i < genersSelector.length; i++) {
      genersNameSelector[i].textContent = genresJSON.genres[Math.round(Math.random() * genresCount)];
    }
  }
}

async function getAlbums(token){
  const fetchAlbumsResponse = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + token
    },
    country: 'RU',
    locale: 'ru-RU',
    timestamp: "2021-10-23T09:00:00"
  })
  if (fetchAlbumsResponse.status === 200) {
    const data = await fetchAlbumsResponse.json();
    const albumsSelector = document.querySelectorAll('.albumImg');
    const nameSelector = document.querySelectorAll('.header-name');
    for (let i = 0; i < albumsSelector.length; ++i) {
      let name = data.playlists.items[i].name;
      let image = data.playlists.items[i].images[0].url;
      albumsSelector[i].setAttribute('src', image);
      nameSelector[i].innerHTML = name;
    }
  }
}

try {
  const token = await getToken();
  await getGeners(token);
  await getAlbums(token);
  
} catch(err) {
  console.error(err);
}