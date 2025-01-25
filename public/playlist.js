const client_id = '2b25bd7aba254ef5bda07dddb21861f5';
const client_secret = 'edd8ead4b35e4551b7641af95e2563cf';
var playlist_id;
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

async function getPlaylist(token){
  let url = window.location.href;
  let s = url.split('?');
  playlist_id = s[1];
  
  const fetchResponsePlaylistData = await fetch('https://api.spotify.com/v1/playlists/'+playlist_id, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
});

if(fetchResponsePlaylistData.status === 200){
    const data = await fetchResponsePlaylistData.json();
    let description = data.description;
    const descriptionSelector = document.querySelector('.description');
    descriptionSelector.innerText = description;

    let image = data.images[0].url;
    const imageSelector = document.querySelector('.cover-image');
    imageSelector.setAttribute('src', image);

    let name = data.name;
    const nameSelector = document.querySelector('.name');
    nameSelector.innerText = name;

    let author = data.owner.display_name;
    const authorSelector = document.querySelector('.author');
    authorSelector.innerText = author;

    const fetchResponsePlaylistTracks = await fetch('https://api.spotify.com/v1/playlists/'+playlist_id+'/tracks', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
  });
  if (fetchResponsePlaylistTracks.status ===200){
      const data = await fetchResponsePlaylistTracks.json();
      let audioTracks = [];
      let curTrack = 0;

      function trackSelectedHandler(curTrack){
        let curTrackStyle = document.querySelectorAll('.uncur-track');
        //console.log(curTrack);
        curTrackStyle[curTrack].classList.add('cur-track');
        curTrackStyle[curTrack].classList.remove('uncur-track');
      }

      function trackUnselectedHandler(curTrack){
        let curTrackUnStyle = document.querySelectorAll('.cur-track');
        if (curTrackUnStyle[0] != null) {
          curTrackUnStyle[0].classList.remove('cur-track')
          curTrackUnStyle[0].classList.add('uncur-track');
        }
      }

      const track = document.querySelector('.tracks'); 
     
      function trackContainer(trackNum){

        let audioContainer = document.createElement('div'); 
        audioContainer.setAttribute('class', 'uncur-track');
        track.appendChild(audioContainer);

        let playPauseImg = document.createElement('div'); 
        playPauseImg.setAttribute('class', 'play-pause-img');
        audioContainer.appendChild(playPauseImg);

        let number = document.createElement('button'); 
        number.setAttribute('class', 'number');
        number.textContent = (trackNum+1)+' ';
        let iplay = document.createElement('i');
        iplay.setAttribute('class', 'fa fa-play');
        iplay.style = 'color:white';
        number.appendChild(iplay);
        playPauseImg.appendChild(number);

        let pause = document.createElement('button');
        pause.setAttribute('class', 'pause');
        let ipause = document.createElement('i');
        ipause.setAttribute('class', 'fa fa-pause');
        ipause.style.color = 'white';
        pause.appendChild(ipause);
        playPauseImg.appendChild(pause);

        var img = document.createElement('img'); 
        img.setAttribute('src', data.items[trackNum].track.album.images[2].url);
        img.setAttribute('class', 'trackImg');
        playPauseImg.appendChild(img);

        let trackName = document.createElement('p'); 
        trackName.textContent = data.items[trackNum].track.name;
        trackName.setAttribute("class", 'track-name')
        audioContainer.appendChild(trackName);

        let albumName = document.createElement('p'); 
        albumName.textContent = data.items[trackNum].track.album.name;
        albumName.setAttribute("class", 'album-name')
        audioContainer.appendChild(albumName);

        let ms = document.createElement('p'); 
        let sec = (data.items[trackNum].track.duration_ms/1000);
        let minutes = Math.round(sec / 60)+':';
        if ((Math.round(sec) % 60) < 10) {
          minutes += '0';
        }
        minutes += (Math.round(sec) % 60);
        ms.textContent = minutes;
        audioContainer.appendChild(ms);
        ms.setAttribute("class", "ms");
  
        return audioContainer;
      }

      for(let i = 0; i < data.items.length; ++i){
        audioTracks[i] = new Audio(data.items[i].track.preview_url);
      }
      for(let i = 0; i<data.items.length; ++i){

        let audioContainer = trackContainer(i);

        function playAudio(){
          audioTracks[i].play();
          curTrack = i;
          trackUnselectedHandler(curTrack);
          trackSelectedHandler(curTrack);
        }
        function pauseAudio(){
          audioTracks[i].pause();
        }

        const num = audioContainer.querySelector('.number');
        num.addEventListener('click', playAudio); 
        audioTracks[i].addEventListener('ended', function() {
          trackUnselectedHandler(i);
          if (audioTracks[i].duration === audioTracks[i].currentTime) {
            trackSelectedHandler(i+1);
            audioTracks[i+1].play();
            curTrack = i+1;
          }
        })

        const pause = audioContainer.querySelector('.pause');
        pause.addEventListener('click', pauseAudio);

        track.appendChild(audioContainer);
    }
    let mainButtonPlay = document.getElementsByClassName('btn');
    mainButtonPlay[0].addEventListener('click', f => {
      trackSelectedHandler(curTrack);
      audioTracks[curTrack].play();
    });

    let mainButtonPause = document.getElementsByClassName('btn2');
    mainButtonPause[0].addEventListener('click', f => {
      audioTracks[curTrack].pause();
    });
  }
  }
}

 try {
  let token = getCookie("token");
  //console.log(token);
  if (token = undefined) {
    token = await getToken();
  }
  token = await getToken();
  await getPlaylist(token);

} catch(err) {
    console.error(err);
  }