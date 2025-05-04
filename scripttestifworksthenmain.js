const repoOwner = "pompom454";
const repoName = "21funnier";
const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

let assets = { pngs: [], gifs: [], mp4s: [], mp3s: [] };

// Fetch files from a directory in the repository
function fetchFilesFromDirectory(directory, type) {
    fetch(baseUrl + directory)
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch " + type);
            return response.json();
        })
        .then((data) => {
            data.forEach((file) => {
                if (file.type === "file" && file.name.endsWith(type)) {
                    assets[directory].push(file.download_url);
                }
            });
            console.log(`${directory} loaded:`, assets[directory]);
        })
        .catch((error) => {
            console.error(error);
        });
}

// Load all asset types
function loadAssets() {
    fetchFilesFromDirectory("pngs", ".png");
    fetchFilesFromDirectory("gifs", ".gif");
    fetchFilesFromDirectory("mp4s", ".mp4");
    fetchFilesFromDirectory("mp3s", ".mp3");
}

// Function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Use assets (example: for PNGs and GIFs)
function displayRandomImage() {
    const imageUrls = [...assets.pngs, ...assets.gifs];
    if (imageUrls.length === 0) return;

    const randomUrl = getRandomItem(imageUrls);
    const img = new Image();
    img.src = randomUrl;
    img.onload = () => {
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, innerWidth, innerHeight); // Clear canvas for rapid-fire effect
        ctx.drawImage(img, Math.random() * innerWidth, Math.random() * innerHeight, 200, 200);
    };
}

// Use assets (example: for MP3s)
function playRandomAudio() {
    const audioUrls = assets.mp3s;
    if (audioUrls.length === 0) return;

    const randomUrl = getRandomItem(audioUrls);
    const audio = new Audio(randomUrl);
    audio.playbackRate = Math.random() * 2 + 0.5; // Random playback speed (0.5x to 2.5x)
    audio.volume = Math.random() * 0.5 + 0.5; // Random volume (50% to 100%)
    audio.play();
}

// Use assets (example: for MP4s)
function playRandomVideo() {
    const videoUrls = assets.mp4s;
    if (videoUrls.length === 0) return;

    const randomUrl = getRandomItem(videoUrls);
    const video = document.createElement("video");
    video.src = randomUrl;
    video.autoplay = true;
    video.loop = false;
    video.muted = true;
    video.style.position = "absolute";
    video.style.width = "200px";
    video.style.height = "200px";
    video.style.left = Math.random() * innerWidth + "px";
    video.style.top = Math.random() * innerHeight + "px";
    document.body.appendChild(video);

    setTimeout(() => {
        video.remove();
    }, 2000); // Remove video after 2 seconds
}

// Initialize everything
function start() {
    // Load assets from the repository
    loadAssets();

    // Example usage: Rapid-fire media display
    setInterval(() => {
        displayRandomImage();
    }, 200); // Display images every 200ms

    setInterval(() => {
        playRandomAudio();
    }, 300); // Play audio every 300ms

    setInterval(() => {
        playRandomVideo();
    }, 400); // Play videos every 400ms
}

// Attach start function to the button
document.body.innerHTML = `
<h1>21funnier: the improved humour generation engine (!!!Epilepsy & Earrape Warning!!!)</h1>
<p>Generates humour (21st century guranteed!) using a bunch of preset assets. It freely mixes these with no regard for anything but being as surprising as possible (to maximize funnyness)</p>
<h4>Issues:</h4>
<p>Program goes silent randomly, too lazy to figure out how to solve this to be honest.</p>
<p>Not enough material</p>
<button onclick="start()">Begin</button>
<canvas id="canvas" style="position:fixed;top:0px;left:0px;" width="${innerWidth}" height="${innerHeight}"></canvas>
`;
