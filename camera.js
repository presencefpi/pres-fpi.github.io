const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");

let cameraReady = false;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error("Caméra indisponible", err);
  });

video.addEventListener("loadedmetadata", () => {
  cameraReady = true;
});

function capturePhoto() {
  if (!cameraReady) return "";

  const w = video.videoWidth;
  const h = video.videoHeight;

  if (!w || !h) return "";

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);

 const data = canvas.toDataURL("image/jpeg", 0.1);


  photo.src = data;
  photo.style.display = "block";

  return data;   // ← image réelle
}
