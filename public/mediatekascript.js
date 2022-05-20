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

async function getPlaylists(token){
  let fetchResponsePlaylists = await fetch('https://api.spotify.com/v1/users/chilledcow/playlists', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
});

let fetchResponsePlaylistsSecond = await fetch('https://api.spotify.com/v1/users/zank17/playlists', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      },
});
if(fetchResponsePlaylists.status === 200 && fetchResponsePlaylistsSecond.status === 200) {
    let data = await fetchResponsePlaylists.json();
    let data1 = await fetchResponsePlaylistsSecond.json();
    let l = data.items.length;
    let l2 = Math.min(data1.items.length, 10 - l);
    const playlistSelector = document.querySelectorAll('.PlaylistImg');
    const nameSelector = document.querySelectorAll('.header-name');
    const playlistsSelector = document.querySelectorAll('.link-p');
    for (let i = 0; i < l; ++i) {
        let name = data.items[i].name;
        const image = data.items[i].images[0].url;
        playlistSelector[i].setAttribute('src', image);
        nameSelector[i].innerHTML = name;
        playlistsSelector[i].setAttribute('href', "./playlist.html?"+data.items[i].id);
      }
      for (let i = 0; i < l2; ++i) {
        let name1 = data1.items[i].name;
        const image1 = data1.items[i].images[0].url;
        playlistSelector[i+l].setAttribute('src', image1);
        nameSelector[i+l].innerHTML = name1;
        playlistsSelector[i+l].setAttribute('href', "./playlist.html?"+data1.items[i].id);
      }
    }
    else{
      console.log(await response.json());
    } 
}

 try {

  let token = getCookie("token");
  if (token = undefined) {
    token = await getToken();
  }
  token = getCookie("token");
  await getPlaylists(token);
} catch(err) {
    console.error(err);
  }