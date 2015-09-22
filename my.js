// See also:
// https://github.com/libgdx/libgdx/blob/master/extensions/gdx-tools/src/com/badlogic/gdx/tools/distancefield/DistanceFieldGenerator.java

function getASmallCanvasCtx() {
    var canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 50;
    return canvas.getContext('2d');
};

// gets an index into a linear array
function getIndex (x, y, width) {
    return x + y * width;
};

function distance(current, other) {
    return Math.abs(current - other);
};

// http://thomasdiewald.com/blog/?p=1994
function distanceTransform(imgData) {
    var rootTwo = Math.sqrt(2);

    // First Pass
    for (var y = 1; y < imgData.height - 1; ++y) {

        for (var x = 1; x < imgData.width - 1; ++x) {
            
            var currentIndex = getIndex(x, y, imgData.width);
            var currentValue = imgData.data[currentIndex];

            var distanceToLeft = distance(currentValue, imgData.data[currentIndex - 1]);
            var distanceToTop = distance(currentValue, imgData.data[getIndex(x, y - 1, imgData.width)]);
            var distanceToTopLeft = rootTwo * distance(currentValue, imgData.data[getIndex(x - 1, y - 1, imgData.width)]);
            var distanceToTopRight = rootTwo * distance(currentValue, imgData.data[getIndex(x + 1, y - 1, imgData.width)]);

            var smallest = Math.min(distanceToLeft, distanceToTop, distanceToTopLeft, distanceToTopRight);

            imgData.data[currentIndex] = smallest;
            
        }
    }

    // Second Pass
    for (y = imgData.height - 1; y > 0; --y) {
        for (x = imgData.width - 1; x > 0; --x) {
            var currentIndex = getIndex(x, y, imgData.width);
            var currentValue = imgData.data[currentIndex];

            var distanceToRight = distance(currentValue, imgData.data[currentIndex + 1]);
            var distanceToBottom = distance(currentValue, imgData.data[getIndex(x, y + 1, imgData.width)]);
            var distanceToBottomLeft = rootTwo * distance(currentValue, imgData.data[getIndex(x - 1, y + 1, imgData.width)]);
            var distanceToBottomRight = rootTwo * distance(currentValue, imgData.data[getIndex(x + 1, y + 1, imgData.width)]);

            var smallest = Math.min(distanceToRight, distanceToBottom, distanceToBottomLeft, distanceToBottomRight);

            imgData.data[currentIndex] = smallest;
        }
    }
};

var ctx = getASmallCanvasCtx();

ctx.font = '16pt Arial';
ctx.fillText('hello world', 0, 10);

var ctx2 = getASmallCanvasCtx();

var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
console.log(imgData);


distanceTransform(imgData);

ctx2.putImageData(imgData, 0, 0);

document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(ctx.canvas);
    document.body.appendChild(ctx2.canvas);
});