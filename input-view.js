var sPosition, tPosition;
window.currentPosition = {};
window.cameraPosition = {};
window.movedCamera = false;

window.currentMousePosition = function (x, y) {
    currentPosition.x = x;
    currentPosition.y = y;
}

window.showInput = function (startPosition, endPosition, camera) {
    var inputView = document.getElementById("distanceContainer");
    inputView.style.left = (currentPosition.x + 30) + "px";
    inputView.style.top = currentPosition.y + 184 + "px";
    inputView.style.zIndex = 1000;
    this.sPosition = startPosition;
    this.tPosition = endPosition;
}

window.updateDistance = function (distance) {
    var lbDistace = this.document.getElementById("lbDistnace");
    lbDistace.innerHTML = Math.abs(distance) + " ft";
}

function sgHideInput() {
    var inputView = document.getElementById("distanceContainer");
    inputView.style.zIndex = -1;
}

function sgGetCurrentDistance() {
    var lbDistace = this.document.getElementById("lbDistnace");
    var distanceTxt = lbDistace.innerHTML.split(" ")[0];
    return parseFloat(distanceTxt);
}

function getPositions() {
    var positions = [];
    positions[0] = sPosition.x;
    positions[1] = sPosition.y;
    positions[2] = sPosition.z;
    positions[3] = tPosition.x;
    positions[4] = tPosition.y;
    positions[5] = tPosition.z;
    return positions;
}

function showSaveViewInput() {
    var inputView = document.getElementById("saveViewContainer");
    inputView.style.left = 30 + "px";
    inputView.style.top = 30 + 184 + "px";
    inputView.style.zIndex = 1000;
}

function getCurrentViewPosition() {
    var positions = [];
    if (cameraPosition) {
        positions[0] = cameraPosition.x;
        positions[1] = cameraPosition.y;
        positions[2] = cameraPosition.z;
    }
    return positions;
}

function sgHideViewInput() {
    var inputView = document.getElementById("saveViewContainer");
    inputView.style.zIndex = -1;
}

function updateCamera(positions) {
    if (positions) {
        window.cameraPosition.x = positions[0];
        window.cameraPosition.y = positions[1];
        window.cameraPosition.z = positions[2];
        window.movedCamera = true;
    }
}