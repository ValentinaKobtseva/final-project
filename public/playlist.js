var client_id = '2b25bd7aba254ef5bda07dddb21861f5';
var client_secret = 'edd8ead4b35e4551b7641af95e2563cf';
var playlist_id;

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
  var token;
  if (response.status === 200) {
      const data = await response.json();
      token = data.access_token;
      //console.log(data);
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
    //console.log(data);
  } else {
    throw new Error('Something went wrong ' + response.status);
  }
  var url = window.location.href;
  let s = url.split('?');
  playlist_id = s[1];
  //console.log(playlist_id);
  response = await fetch('https://api.spotify.com/v1/playlists/'+playlist_id, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
});

if(response.status === 200){
    data = await response.json();
    let description = data.description;
    const descriptionSelector = document.querySelector('.description');
    descriptionSelector.innerHTML = description;

    let image = data.images[0].url;
    const imageSelector = document.querySelector('.cover-image');
    imageSelector.setAttribute('src', image);

    let name = data.name;
    const nameSelector = document.querySelector('.name');
    nameSelector.innerHTML = name;

    let author = data.owner.display_name;
    const authorSelector = document.querySelector('.author');
    authorSelector.innerHTML = author;

    var response = await fetch('https://api.spotify.com/v1/playlists/'+playlist_id+'/tracks', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json;charset=UTF-8'
      }
  });
  if (response.status ===200){
      var data = await response.json();
      var audioTracks = [];
      var curTrack = 0;

      function changeStyle(curTrack){
        var s  = document.querySelectorAll('.cur-track');
        s[curTrack].style = 'display:flex;margin-top:5px;justify-content:flex-start;background-color:rgb(187, 60, 212)';
      }

      function changeStyle2(curTrack){
        var s2  = document.querySelectorAll('.cur-track');
        s2[curTrack].style = 'display:flex;margin-top:5px;justify-content:flex-start';
      }
      for(let i = 0; i < data.items.length; ++i){
        audioTracks[i] = new Audio(data.items[i].track.preview_url);
      }
      for(let i = 0; i<data.items.length; ++i){
        //console.log(data.items);
        const track = document.querySelector('.tracks');

        let audioContainer = document.createElement('div');
        audioContainer.setAttribute('class', 'cur-track');
        track.appendChild(audioContainer);
        audioContainer.style = 'display:flex;margin-top:5px;justify-content:flex-start';

        let a = document.createElement('div');
        a.style = 'display:flex;width:120px';
        audioContainer.appendChild(a);

        let number = document.createElement('button');
        number.textContent = (i+1)+' ';
        let iplay = document.createElement('i');
        iplay.setAttribute('class', 'fa fa-play');
        iplay.style = 'color:white';
        number.style = 'color:white;margin-left:5px;width:40px;background-color:rgba(100, 100, 100, 0);border:none';
        number.appendChild(iplay);


        var n;
        function playAudio(){
          audioTracks[i].play();
          curTrack = i;
          changeStyle(curTrack);
          for(let j = 0; j < audioTracks.length; j++) {
            if (i != j) {
              changeStyle2(j);
              audioTracks[j].pause();
              audioTracks[i].currentTime = 0;
            }
          }
        }
        function pauseAudio(){
          audioTracks[i].pause();
          //changeStyle2(i);
        }
        number.addEventListener('click', playAudio);
        audioTracks[i].addEventListener('ended', function() {
          changeStyle2(i);
          if (audioTracks[i].duration === audioTracks[i].currentTime) {
            changeStyle(i+1);
            audioTracks[i+1].play();
            curTrack = i+1;
          }
        })
        a.appendChild(number);

        let pause = document.createElement('button')
        let ipause = document.createElement('i');
        ipause.setAttribute('class', 'fa fa-pause');
        ipause.style.color = 'white';
        pause.appendChild(ipause);
        pause.style = 'margin-left:5px;width:30px;background-color:rgba(100, 100, 100, 0);border:none';
        pause.addEventListener('click', pauseAudio);
        a.appendChild(pause);

        var img = document.createElement('img');
        img.setAttribute('src', data.items[i].track.album.images[2].url);
        img.style = 'height:45px;width:45px';
        a.appendChild(img);

        let trackName = document.createElement('p');
        trackName.textContent = data.items[i].track.name;
        trackName.style = 'color:white;align-self:center;width:250px;margin-left:25px';
        audioContainer.appendChild(trackName);

        let albumName = document.createElement('p');
        albumName.textContent = data.items[i].track.album.name;
        albumName.style = 'color:white;align-self:center;width:250px;margin-left:100px';
        audioContainer.appendChild(albumName);

        let ms = document.createElement('p');
        let sec = (data.items[i].track.duration_ms/1000);
        let minutes = Math.round(sec / 60)+':';
        if ((Math.round(sec) % 60) < 10) {
          minutes += '0';
        }
        minutes += (Math.round(sec) % 60);
        ms.textContent = minutes;
        audioContainer.appendChild(ms);
        ms.style = 'color:white;align-self:center;margin-left:88px';
        track.appendChild(audioContainer);
    }
    let mainButtonPlay = document.getElementsByClassName('btn');
    mainButtonPlay[0].addEventListener('click', f => {
      changeStyle(curTrack);
      audioTracks[curTrack].play();
    });

    let mainButtonPause = document.getElementsByClassName('btn2');
    mainButtonPause[0].addEventListener('click', f => {
      audioTracks[curTrack].pause();
      //changeStyle2(curTrack);
    });
}
}

} catch(err) {
    console.error(err);
  }