var client_id = '2b25bd7aba254ef5bda07dddb21861f5';
var client_secret = 'edd8ead4b35e4551b7641af95e2563cf';

var token;
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
response = await fetch('https://api.spotify.com/v1/users/chilledcow/playlists', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
});
var response1 = await fetch('https://api.spotify.com/v1/users/zank17/playlists', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      },
});
if(response.status === 200 && response1.status === 200){
    data = await response.json();
    var data1 = await response1.json();
    let l = data.items.length;
    let l2 = data1.items.length
    const playlistSelector = document.querySelectorAll('.img');
    const nameSelector = document.querySelectorAll('.header-name');
    const playlistsSelector = document.querySelectorAll('.link-p');
    console.log(data);
    console.log(playlistsSelector.length);
    for (let i = 0; i < l; ++i) {
        let name = data.items[i].name;
        var image = data.items[i].images[0].url;
        playlistSelector[i].setAttribute('src', image);
        nameSelector[i].innerHTML = name;
        playlistsSelector[i].setAttribute('href', "./playlist.html?"+data.items[i].id);
      }
      for (let i = 0; i < l2; ++i) {
        let name1 = data1.items[i].name;
        var image1 = data1.items[i].images[0].url;
        playlistSelector[i+l].setAttribute('src', image1);
        nameSelector[i+l].innerHTML = name1;
        playlistsSelector[i+l].setAttribute('href', "./playlist.html?"+data1.items[i].id);
      }
    }
    else{
      console.log(await response.json());
    } 
} catch(err) {
    console.error(err);
  }