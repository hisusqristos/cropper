document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>takiye perogi</h3>
  </div>`


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
if (!ctx) throw new Error("I cannot work with this canvas thing you gave me");

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let isSelecting = false;

const img = new Image();
img.src = "./public/23006218-3-Brown-bear-in-lupine-meadow.jpg";

img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

img.onerror = (err) => {
  console.error("Failed to load image", err);
};

canvas.addEventListener('mousedown', (e) => {
  const insideCanvas =
    e.offsetX >= 0 &&
    e.offsetX <= canvas.width &&
    e.offsetY >= 0 &&
    e.offsetY <= canvas.height;

  if (!insideCanvas) return;
  isSelecting = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (mouse) => {
  if (!isSelecting) return;
  endX = mouse.offsetX;
  endY = mouse.offsetY;


  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'red';
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener('mouseup', () => {
  isSelecting = false;
  if ((endX < 10) && (endY < 10)) return;

  const cropWidth = endX - startX;
  const cropHeight = endY - startY;

  console.log("x, y and widths", startX, startY, cropWidth, cropHeight, "\n Start and end", startX, startY, endX, endY)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, startX, startY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight)
})
