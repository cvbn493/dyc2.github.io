// 获取 DOM 元素
const audio = document.getElementById('audio');
const coverImg = document.getElementById('coverImg');
const coverWrapper = document.getElementById('coverWrapper');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBarBg = document.getElementById('progressBarBg');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const listBtn = document.getElementById('listBtn');
const playlistModal = document.getElementById('playlistModal');
const closeListBtn = document.getElementById('closeListBtn');
const songListEl = document.getElementById('songList');
const modeBtn = document.getElementById('modeBtn');

// 歌曲数据 (请根据实际文件名调整路径)
const songs = [
    {
        title: "歌曲 1",
        artist: "歌手 A",
        src: "music0.mp3",
        cover: "bg0.png"
    },
    {
        title: "歌曲 2",
        artist: "歌手 B",
        src: "music1.mp3",
        cover: "bg1.png"
    },
    {
        title: "歌曲 3",
        artist: "歌手 C",
        src: "music2.mp3",
        cover: "bg2.png"
    },
    {
        title: "歌曲 4",
        artist: "歌手 D",
        src: "music3.mp3",
        cover: "bg3.png"
    }
];

let songIndex = 0;
let isPlaying = false;
let playMode = 1; // 1: 顺序, 2: 随机, 3: 单曲循环

// 初始化加载歌曲
function loadSong(song) {
    songTitle.innerText = song.title;
    artistName.innerText = song.artist;
    audio.src = song.src;
    coverImg.src = song.cover;
    
    // 更新列表高亮
    updatePlaylistActive();
}

// 播放歌曲
function playSong() {
    isPlaying = true;
    audio.play();
    playIcon.src = "暂停.png"; // 切换为暂停图标
    coverWrapper.classList.add('playing');
}

// 暂停歌曲
function pauseSong() {
    isPlaying = false;
    audio.pause();
    playIcon.src = "music/img/播放.png"; // 注意：截图里只有暂停.png，如果有播放.png最好，没有的话可以复用或者用文字
    // 如果只有暂停.png，这里可以暂时不切换图标，或者找一张播放的图放进去
    // 假设你有一张叫 "播放.png" 的图片
    playIcon.src = "music/img/播放.png"; 
    coverWrapper.classList.remove('playing');
}

// 上一曲
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// 下一曲
function nextSong() {
    if (playMode === 3) {
        // 单曲循环不需要改变索引
    } else if (playMode === 2) {
        // 随机播放
        let randomIndex = Math.floor(Math.random() * songs.length);
        songIndex = randomIndex;
    } else {
        // 顺序播放
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
    }
    loadSong(songs[songIndex]);
    playSong();
}

// 更新进度条
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        
        // 更新时间文本
        const formatTime = (time) => {
            const min = Math.floor(time / 60);
            const sec = Math.floor(time % 60);
            return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        };
        currentTimeEl.innerText = formatTime(currentTime);
        durationEl.innerText = formatTime(duration);
    }
}

// 点击进度条跳转
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// 切换播放模式
function toggleMode() {
    playMode++;
    if (playMode > 3) playMode = 1;
    
    const modeImg = modeBtn.querySelector('img');
    modeImg.src = `music/img/mode${playMode}.png`;
}

// 渲染播放列表
function renderPlaylist() {
    songListEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        songListEl.appendChild(li);
    });
    updatePlaylistActive();
}

// 更新播放列表当前歌曲高亮
function updatePlaylistActive() {
    const items = songListEl.querySelectorAll('li');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 事件监听
playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressBarBg.addEventListener('click', setProgress);
modeBtn.addEventListener('click', toggleMode);

// 歌曲播放结束自动下一曲
audio.addEventListener('ended', nextSong);

// 播放列表开关
listBtn.addEventListener('click', () => {
    playlistModal.classList.add('active');
});

closeListBtn.addEventListener('click', () => {
    playlistModal.classList.remove('active');
});

// 初始化
loadSong(songs[songIndex]);
renderPlaylist();