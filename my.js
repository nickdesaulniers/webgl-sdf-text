function getASmallCanvasCtx () {
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
    return current - other;
};

// http://thomasdiewald.com/blog/?p=1994
function distanceTransform(imgData) {
    for (var y = 0; y < imgData.height; ++y) {
        if (y === 0 || y === imgData.height - 1) {
            continue;
        }

        // for debugging
        if (y === 2) break;

        for (var x = 0; x < imgData.width; ++x) {
            if (x === 0 || x === imgData.width - 1) {
                continue;
            }
            // for debugging
            //if (x === 2) break;
            var currentIndex = getIndex(x, y, imgData.width);
            var currentValue = imgData.data[currentIndex];

            var distanceToLeft = distance(currentValue, imgData.data[currentIndex - 1]);
            var distanceToTop = distance(currentValue, imgData.data[getIndex(x, y - 1, imgData.width)]);
            var distanceToTopLeft = distance(currentValue, imgData.data[getIndex(x - 1, y - 1, imgData.width)]);
            var distanceToTopRight = distance(currentValue, imgData.data[getIndex(x + 1, y + 1, imgData.width)]);

            console.log(currentIndex, currentValue, distanceToLeft, distanceToTop);
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

document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(ctx.canvas);
    document.body.appendChild(ctx2.canvas);
});