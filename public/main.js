//import "request";
//import { resolve } from "path";

var client_id = '2b25bd7aba254ef5bda07dddb21861f5';
var client_secret = 'edd8ead4b35e4551b7641af95e2563cf';

var token;

 //import fetch from "node-fetch";
 try {
  var authOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (btoa(client_id + ':' + client_secret)),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  };
  var response = await fetch('https://accounts.spotify.com/api/token', authOptions);
  // если запрос был успешный
  var token;
  if (response.status === 200) {
      const data = await response.json();
      token = data.access_token;
      console.log(data);
  } else {
      throw new Error('Something went wrong ' + response.status);
  }
  response = await fetch('https://api.spotify.com/v1/users/31j5egzg4mt2o3a74iykqgu2iuz4', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  if (response.status === 200) {
    var data = await response.json();
    console.log(data);
  } else {
    throw new Error('Something went wrong ' + response.status);
  }
  response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  if (response.status === 200) {
    var genresJSON = await response.json();
    console.log(genresJSON);
    console.log(genresJSON.genres);
    const genersSelector = document.querySelectorAll('.geners')
    //var genres = JSON.parse(genresJSON.genres[0]);
    var genresCount = genresJSON.genres.length;
    for(let i = 0; i < genersSelector.length; i++) {
      //genersSelector[i].style.backgroundColor = 'yellow';
      const paragraph = document.createElement('p');
      paragraph.textContent = genresJSON.genres[Math.round(Math.random() * genresCount)];
      paragraph.style.cssText = 'color:#fff;font-size:50px;font-family:Verdana, Geneva, Tahoma, sans-serif;font-weight:bold;text-align:center;margin-top:65px';
      genersSelector[i].appendChild(paragraph);
    }
  }
  response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + token
    },
    country: 'RU',
    locale: 'ru-RU',
    timestamp: "2021-10-23T09:00:00"
  })
  if (response.status === 200) {
    data = await response.json();
    console.log(data.playlists.items);
    const albumsSelector = document.querySelectorAll('.img');
    const nameSelector = document.querySelectorAll('.header-name');
    for (let i = 0; i < 6; ++i) {
      let name = data.playlists.items[i].name;
      var image = data.playlists.items[i].images[0].url;
      //console.log(name + " " + image);
      albumsSelector[i].setAttribute('src', image);
      nameSelector[i].innerHTML = name;
    }
  }
} catch(err) {
  console.error(err);
}