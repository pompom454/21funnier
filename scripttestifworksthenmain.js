// Global Variables
let mp3s = [];
let mp4s = [];
let pngs = [];
let space = 0;
let pause = false;

// Function to fetch all files from a GitHub directory
async function fetchFilesFromGitHub(endpoint) {
    const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github.v3+json' },
    });
    const data = await response.json();

    if (Array.isArray(data)) {
        return data.map(file => file.download_url); // Get direct download URL
    }
    return [];
}

// Function to load all .mp3, .mp4, and .png files
async function loadFiles() {
    try {
        const baseUrl = 'https://api.github.com/repos/pompom454/21funnier/contents';
        const ref = '?ref=main';

        const mp3Files = await fetchFilesFromGitHub(`${baseUrl}/mp3s${ref}`);
        const mp4Files = await fetchFilesFromGitHub(`${baseUrl}/mp4s${ref}`);
        const pngFiles = await fetchFilesFromGitHub(`${baseUrl}/pngs${ref}`);

        mp3s = mp3Files;
        mp4s = mp4Files;
        pngs = pngFiles;

        console.log('Loaded files:', { mp3s, mp4s, pngs });
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

// Start the application
function start() {
    document.body.innerHTML = `
        <canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas"></canvas>
        <canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas3"></canvas>
        <canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas2"></canvas>
    `;
    ctx = document.getElementById("canvas").getContext("2d");
    ctx3 = document.getElementById("canvas3").getContext("2d");

    setInterval(() => {
        if (!pause && mp3s.length > 0) {
            play(mp3s[Math.floor(Math.random() * mp3s.length)]);
        }
    }, 200); // Reduced interval for faster audio playback

    setInterval(() => {
        if (!pause && pngs.length > 0) {
            let i = 0, poopoo = Math.round(Math.random() * 5); // Reduced max images to 5
            while (i < poopoo) {
                let a = png(pngs[Math.floor(Math.random() * pngs.length)]),
                    g = Math.random(),
                    x = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerWidth,
                    y = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerHeight,
                    w = g > 0.75 ? innerWidth : innerWidth / 2,
                    h = g > 0.75 ? innerHeight : innerHeight / 2;
                a.onload = () => {
                    ctx.drawImage(a, x, y, w, h);
                }
                i++;
            }
        }
    }, 500); // Reduced interval for faster image updates

    ctx2 = document.getElementById("canvas2").getContext("2d");
    (anus = function() {
        if (!pause && mp4s.length > 0) {
            mp4(mp4s[Math.floor(Math.random() * mp4s.length)], anus);
        }
    })();

    setInterval(() => {
        if (pause) {
            ctx3.font = "Arial 20px";
            ctx3.fillStyle = "#000000";
            ctx3.fillRect(0, 0, innerWidth, innerHeight);
            ctx3.fillText("Paused", 0, innerHeight - 20);
        } else {
            ctx3.clearRect(0, 0, innerWidth, innerHeight);
        }
    }, 100); // Added interval to refresh the canvas3
}

function play(file) {
    let wav = new Audio(file);
    wav.load();
    wav.play()
        .then(() => {
            wav.preservesPitch = false;
            wav.playbackRate = Math.random() > 0.5 ? Math.random() * 3.5 : 2; // Increased playback rate
            let b = Math.random() * Math.min(wav.duration, 5); // Reduced max duration
            wav.currentTime = Math.random() * (wav.duration - b);
            setTimeout(() => {
                wav.pause();
                wav.src = "";
            }, (500 + b * 500) / wav.playbackRate); // Reduced base duration
        })
        .catch(error => console.log(error));
}

function mp4(file, callback) {
    let vid = document.createElement("video");
    let g = Math.random(),
        x = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerWidth,
        y = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerHeight,
        w = g > 0.75 ? innerWidth : innerWidth / 2,
        h = g > 0.75 ? innerHeight : innerHeight / 2;

    vid.src = file;
    vid.autoplay = false;
    vid.paused = true;

    vid.addEventListener('loadedmetadata', function() {
        let poo = Math.random() * Math.min(vid.duration, 5); // Reduced max duration
        this.preservesPitch = false;
        this.currentTime = Math.random() > 0.5 ? Math.random() * (this.duration - poo) : 1;
    });

    vid.play()
        .then(() => {
            vid.playbackRate = Math.random() * 3.5; // Increased playback rate
            setTimeout(() => {
                vid.pause();
                vid.src = "";
                ctx2.clearRect(0, 0, innerWidth, innerHeight);
            }, 5000 / vid.playbackRate); // Reduced base duration
            let $this = vid; // Cache
            (function loop() {
                if (!$this.paused && !$this.ended) {
                    ctx2.drawImage($this, x, y, w, h);
                    setTimeout(loop, 1000 / 30); // Drawing at 30fps
                }
            })();
        })
        .catch(error => console.log(error));
}

function png(file) {
    let a = new Image();
    a.src = file;
    return a;
}

// Add key listener for pause functionality
document.onkeypress = (e) => {
    if (e.key === " ") { // Space key toggles pause
        pause = !pause;
    }
}

// Load files on page load
loadFiles();

// Initial HTML
document.body.innerHTML = `
<h1>21funnier: the improved humour generation engine (!!!Epilepsy & Earrape Warning!!!)</h1>
<p>Generates humour (21st century guranteed!) using a bunch of preset assets. It freely mixes these with no regard for anything but being as surprising as possible (to maximize funnyness)</p>
<h4>Issues:</h4>
<p>program goes silent randomly, too lazy to figure out how to solve this to be honest.</p>
<p>not enough material</p>
<button onclick="start()">Begin</button>`;
