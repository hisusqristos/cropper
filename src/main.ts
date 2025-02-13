document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>takiye perogi</h3>
    
  </div>`

const input = document.getElementById('imageInput') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
if (!ctx) throw new Error("I cannot work with this canvas thing you gave me");

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let isSelecting = false;


let img = new Image();

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
    };
    img.src = event.target?.result as string;
  };
  img.onerror = (err) => {
    console.error("Failed to load image", err);
  };

  reader.readAsDataURL(file);
});

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

  const width = Math.abs(cropWidth);
  const height = Math.abs(cropHeight);

  const x = cropWidth > 0 ? startX : endX;
  const y = cropHeight > 0 ? startY : endY;


  console.log("x, y and widths", startX, startY, width, height,
    "\n Start and end", startX, startY, endX, endY)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, width, height,
    0, 0, width, height)
})
