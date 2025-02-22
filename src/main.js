document.querySelector('#app').innerHTML = "\n  <div>\n    <h3>takiye perogi</h3>\n    <button id=\"downloadBtn\" style=\"display: none;\">Download Image</button>\n    <button id=\"cropBtn\" style=\"display: none;\">Crop</button>\n  </div>";
var input = document.getElementById('imageInput');
var downloadBtn = document.getElementById('downloadBtn');
var canvas = document.getElementById('canvas');
var cropBtn = document.getElementById('cropBtn');
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error("I cannot work with this canvas thing you gave me");
var img = new Image();
var cropX = 100;
var cropY = 100;
var cropWidth = 300;
var cropHeight = 300;
// Dragging
var draggingEdge = null;
var startMouseX = 0;
var startMouseY = 0;
input.addEventListener('change', function (_) {
    var _a;
    var file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            drawCropRectangle();
            cropBtn.style.display = 'block';
        };
        img.src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
    };
    reader.readAsDataURL(file);
});
canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    if (near(mouseX, cropX) && mouseY > cropY && mouseY < cropY + cropHeight)
        draggingEdge = 'left';
    else if (near(mouseX, cropX + cropWidth) && mouseY > cropY && mouseY < cropY + cropHeight)
        draggingEdge = 'right';
    else if (near(mouseY, cropY) && mouseX > cropX && mouseX < cropX + cropWidth)
        draggingEdge = 'top';
    else if (near(mouseY, cropY + cropHeight) && mouseX > cropX && mouseX < cropX + cropWidth)
        draggingEdge = 'bottom';
    else
        draggingEdge = null;
    startMouseX = mouseX;
    startMouseY = mouseY;
});
canvas.addEventListener('mousemove', function (e) {
    if (!draggingEdge)
        return;
    var dx = e.offsetX - startMouseX;
    var dy = e.offsetY - startMouseY;
    if (draggingEdge === 'left')
        cropX += dx, cropWidth -= dx;
    if (draggingEdge === 'right')
        cropWidth += dx;
    if (draggingEdge === 'top')
        cropY += dy, cropHeight -= dy;
    if (draggingEdge === 'bottom')
        cropHeight += dy;
    startMouseX = e.offsetX;
    startMouseY = e.offsetY;
    redraw();
});
canvas.addEventListener('mouseup', function () {
    draggingEdge = null;
});
cropBtn.addEventListener('click', function () {
    var croppedCanvas = document.createElement('canvas');
    var croppedCtx = croppedCanvas.getContext('2d');
    var buttonColor = urlParams.get("color") || "blue";
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    croppedCtx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(croppedCanvas, 0, 0);
    cropBtn.style.display = "none";
    downloadBtn.style.display = "block";
    downloadBtn.style.backgroundColor = buttonColor;
});
function drawCropRectangle() {
    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
    // 3x3 reshotka of cropper
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    var thirdWidth = cropWidth / 3;
    var thirdHeight = cropHeight / 3;
    for (var i = 1; i < 3; i++) {
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
function near(point, target, threshold) {
    if (threshold === void 0) { threshold = 8; }
    return Math.abs(point - target) < threshold;
}
downloadBtn.addEventListener('click', function () {
    var croppedCanvas = document.createElement('canvas');
    var croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    croppedCtx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    var croppedImageURL = croppedCanvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = croppedImageURL;
    a.download = 'cropped-image.png';
    a.click();
});
