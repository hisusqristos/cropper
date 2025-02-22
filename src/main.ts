document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>takiye perogi</h3>
    <button id="downloadBtn" style="display: none;">Download Image</button>
    <button id="cropBtn" style="display: none;">Crop</button>
  </div>`

const input = document.getElementById('imageInput') as HTMLInputElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const cropBtn = document.getElementById('cropBtn') as HTMLButtonElement;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const ctx = canvas.getContext('2d')!;
if (!ctx) throw new Error("I cannot work with this canvas thing you gave me");

let img = new Image();

let cropX = 100;
let cropY = 100;
let cropWidth = 300;
let cropHeight = 300;

// Dragging
let draggingEdge: 'left' | 'right' | 'top' | 'bottom' | null = null;
let startMouseX = 0;
let startMouseY = 0;

input.addEventListener('change', (_) => {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      drawCropRectangle();
      cropBtn.style.display = 'block';
    };
    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (near(mouseX, cropX) && mouseY > cropY && mouseY < cropY + cropHeight) draggingEdge = 'left';
  else if (near(mouseX, cropX + cropWidth) && mouseY > cropY && mouseY < cropY + cropHeight) draggingEdge = 'right';
  else if (near(mouseY, cropY) && mouseX > cropX && mouseX < cropX + cropWidth) draggingEdge = 'top';
  else if (near(mouseY, cropY + cropHeight) && mouseX > cropX && mouseX < cropX + cropWidth) draggingEdge = 'bottom';
  else draggingEdge = null;

  startMouseX = mouseX;
  startMouseY = mouseY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!draggingEdge) return;

  const dx = e.offsetX - startMouseX;
  const dy = e.offsetY - startMouseY;

  if (draggingEdge === 'left') cropX += dx, cropWidth -= dx;
  if (draggingEdge === 'right') cropWidth += dx;
  if (draggingEdge === 'top') cropY += dy, cropHeight -= dy;
  if (draggingEdge === 'bottom') cropHeight += dy;

  startMouseX = e.offsetX;
  startMouseY = e.offsetY;

  redraw();
});

canvas.addEventListener('mouseup', () => {
  draggingEdge = null;
});

cropBtn.addEventListener('click', () => {
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d')!;
  const buttonColor = urlParams.get("color") || "blue"

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  croppedCtx.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  canvas.width = cropWidth;
  canvas.height = cropHeight;
  ctx.drawImage(croppedCanvas, 0, 0);

  cropBtn.style.display = "none";
  downloadBtn.style.display = "block"
  downloadBtn.style.backgroundColor = buttonColor
});


function drawCropRectangle() {
  ctx.drawImage(img, 0, 0);

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

  // 3x3 reshotka of cropper
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1;

  const thirdWidth = cropWidth / 3;
  const thirdHeight = cropHeight / 3;

  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cropX + i * thirdWidth, cropY);
    ctx.lineTo(cropX + i * thirdWidth, cropY + cropHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cropX, cropY + i * thirdHeight);
    ctx.lineTo(cropX + cropWidth, cropY + i * thirdHeight);
    ctx.stroke();
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCropRectangle();
}

function near(point: number, target: number, threshold = 8) {
  return Math.abs(point - target) < threshold;
}


downloadBtn.addEventListener('click', () => {
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d')!;

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  croppedCtx.drawImage(
    img,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  const croppedImageURL = croppedCanvas.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = croppedImageURL;
  a.download = 'cropped-image.png';
  a.click();
});
