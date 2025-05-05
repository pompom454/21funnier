let mp3s = [];
let mp4s = [];
let pngs = [];
let space = 0;
let pause = false;

async function fetchFilesFromGitHub(endpoint) {
    const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github.v3+json' },
    });
    const data = await response.json();
    if (Array.isArray(data)) {
        return data.map(file => file.download_url);
    }
    return [];
}

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

function start() {
    document.body.innerHTML = `<canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas"></canvas><canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas2"></canvas><canvas style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}" id="canvas3"></canvas>`;
    const ctx = document.getElementById("canvas").getContext("2d");
    const ctx2 = document.getElementById("canvas2").getContext("2d");
    const ctx3 = document.getElementById("canvas3").getContext("2d");

    setInterval(() => {
        if (!pause && mp3s.length > 0) {
            play(mp3s[Math.floor(Math.random() * mp3s.length)]);
        }
    }, 500);

    setInterval(() => {
        if (!pause && pngs.length > 0) {
            let i = 0, poopoo = Math.round(Math.random() * 10);
            while (i < poopoo) {
                let a = png(pngs[Math.floor(Math.random() * pngs.length)]);
                const g = Math.random();
                const x = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerWidth;
                const y = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerHeight;
                const w = g > 0.75 ? innerWidth : innerWidth / 2;
                const h = g > 0.75 ? innerHeight : innerHeight / 2;

                a.onload = () => {
                    ctx.drawImage(a, x, y, w, h);
                };
                i++;
            }
        }
    }, 1000);

    setInterval(() => {
        if (!pause && mp4s.length > 0) {
            mp4(mp4s[Math.floor(Math.random() * mp4s.length)], ctx2);
        }
    }, 1000);

    setInterval(() => {
        if (pause) {
            ctx3.font = "20px Arial";
            ctx3.fillStyle = "#000000";
            ctx3.fillRect(0, 0, innerWidth, innerHeight);
            ctx3.fillText("Paused", innerWidth / 2 - 50, innerHeight / 2);
        } else {
            ctx3.clearRect(0, 0, innerWidth, innerHeight);
        }
    }, 100);
}

function play(file) {
    let wav = new Audio(file);
    wav.load();
    wav.play()
        .then(() => {
            wav.preservesPitch = false;
            wav.playbackRate = Math.random() > 0.5 ? Math.random() * 2.5 : 1;
            let b = Math.random() * Math.min(wav.duration, 5);
            wav.currentTime = Math.random() * (wav.duration - b);
            setTimeout(() => {
                wav.pause();
                wav.src = "";
            }, (1000 + b * 1000) / wav.playbackRate);
        })
        .catch(error => console.log(error));
}

function mp4(file, ctx2) {
    let vid = document.createElement("video");
    const g = Math.random();
    const x = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerWidth;
    const y = g > 0.75 ? 0 : Math.floor(Math.random() * 2) / 2 * innerHeight;
    const w = g > 0.75 ? innerWidth : innerWidth / 2;
    const h = g > 0.75 ? innerHeight : innerHeight / 2;

    vid.src = file;
    vid.autoplay = false;
    vid.paused = true;
    vid.addEventListener('loadedmetadata', () => {
        const poo = Math.random() * Math.min(vid.duration, 3);
        vid.preservesPitch = false;
        vid.currentTime = Math.random() > 0.5 ? Math.random() * (vid.duration - poo) : 1;
    });

    vid.play()
        .then(() => {
            vid.playbackRate = Math.random() * 1.4;
            setTimeout(() => {
                vid.pause();
                vid.src = "";
                ctx2.clearRect(0, 0, innerWidth, innerHeight);
            }, 7000 / vid.playbackRate);
            const $this = vid;
            (function loop() {
                if (!$this.paused && !$this.ended) {
                    ctx2.drawImage($this, x, y, w, h);
                    setTimeout(loop, 150 / 30);
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

document.onkeypress = (e) => {
    if (e.key === " ") {
        pause = !pause;
    }
}

loadFiles();

document.body.innerHTML = `
<h1>21funnier: the improved humour generation engine (!!!Epilepsy & Earrape Warning!!!)</h1>
<p>Generates humour (21st century guranteed!) using a bunch of preset assets. It freely mixes these with no regard for anything but being as surprising as possible (to maximize funnyness)</p>
<h4>Issues:</h4>
<p>program goes silent randomly, too lazy to figure out how to solve this to be honest.</p>
<p>not enough material</p>
<button onclick="start()">Begin</button>`;
