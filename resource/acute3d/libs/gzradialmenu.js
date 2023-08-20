/**
 * Radial menu for object options
 * @constructor
 */
GZ3D.RadialMenu = function (domElement) {
    this.domElement = (domElement !== undefined) ? domElement : document;

    this.init();
};

/**
 * Initialize radial menu
 */
GZ3D.RadialMenu.prototype.init = function () {
    // Distance from starting point
    this.radius = 70;
    // Speed to spread the menu
    this.speed = 10;
    // Icon size
    this.iconSize = 40;
    this.iconSizeSelected = 70;

    // For the opening motion
    this.moving = false;
    this.startPosition = null;

    // Either moving or already stopped
    this.showing = false;

    // Colors
    this.selectedColor = new THREE.Color(0xF78E1E);
    this.plainColor = new THREE.Color(0xffffff);

    // Selected item
    this.selected = null;

    // Selected model
    this.model = null;

    // Object containing all items
    this.menu = new THREE.Object3D();

    // Add items to the menu
    this.addItem('delete', 'style/images/trash_icon.png');
    this.addItem('translate', 'style/images/translate_icon.png');
    this.addItem('rotate', 'style/images/rotate_icon.png');

    this.numberOfItems = this.menu.children.length;
    this.offset = this.numberOfItems - 1 - Math.floor(this.numberOfItems / 2);

    // Start hidden
    this.hide();
};

/**
 * Hide radial menu
 */
GZ3D.RadialMenu.prototype.hide = function (event, callback) {
    for (var i in this.menu.children) {
        this.menu.children[i].visible = false;
        this.menu.children[i].material.color = this.plainColor;
        this.menu.children[i].scale.set(this.iconSize, this.iconSize, 1.0);
    }

    this.showing = false;
    this.startPosition = null;

    if (callback && this.model) {
        if (this.selected) {
            callback(this.selected, this.model);
            this.model = null;
        }
    }

};

/**
 * Show radial menu
 */
GZ3D.RadialMenu.prototype.show = function (event, model) {
    this.model = model;
    var pointer = this.getPointer(event);
    this.startPosition = pointer;

    for (var i in this.menu.children) {
        this.menu.children[i].visible = true;
        this.menu.children[i].position.set(pointer.x, pointer.y, 0);
    }

    this.moving = true;
    this.showing = true;
};

/**
 * Update radial menu
 */
GZ3D.RadialMenu.prototype.update = function () {
    if (!this.moving) {
        return;
    }

    // Move outwards
    for (var i in this.menu.children) {
        var X = this.menu.children[i].position.x - this.startPosition.x;
        var Y = this.menu.children[i].position.y - this.startPosition.y;

        var d = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));

        if (d !== this.radius) {
            X = X - (this.speed * Math.sin((this.offset - i) * Math.PI / 4));
            Y = Y - (this.speed * Math.cos((this.offset - i) * Math.PI / 4));
        }
        else {
            this.moving = false;
        }

        this.menu.children[i].position.x = X + this.startPosition.x;
        this.menu.children[i].position.y = Y + this.startPosition.y;

    }

};

/**
 * Get pointer (mouse or touch) coordinates inside the canvas
 */
GZ3D.RadialMenu.prototype.getPointer = function (event) {
    if (event.originalEvent) {
        event = event.originalEvent;
    }
    var pointer = event.touches ? event.touches[0] : event;
    var rect = this.domElement.getBoundingClientRect();
    var posX = (pointer.clientX - rect.left);
    var posY = (pointer.clientY - rect.top);

    return { x: posX, y: posY };
};

/**
 * Movement after long press to select items on menu
 */
GZ3D.RadialMenu.prototype.onLongPressMove = function (event) {
    var pointer = this.getPointer(event);
    var pointerX = pointer.x - this.startPosition.x;
    var pointerY = pointer.y - this.startPosition.y;

    var angle = Math.atan2(pointerY, pointerX);

    // Check angle region
    var region = null;
    // bottom-left
    if (angle > 5 * Math.PI / 8 && angle < 7 * Math.PI / 8) {
        region = 1;
    }
    // left
    else if ((angle > -8 * Math.PI / 8 && angle < -7 * Math.PI / 8) || (angle > 7 * Math.PI / 8 && angle < 8 * Math.PI / 8)) {
        region = 2;
    }
    // top-left
    else if (angle > -7 * Math.PI / 8 && angle < -5 * Math.PI / 8) {
        region = 3;
    }
    // top
    else if (angle > -5 * Math.PI / 8 && angle < -3 * Math.PI / 8) {
        region = 4;
    }
    // top-right
    else if (angle > -3 * Math.PI / 8 && angle < -1 * Math.PI / 8) {
        region = 5;
    }
    // right
    else if (angle > -1 * Math.PI / 8 && angle < 1 * Math.PI / 8) {
        region = 6;
    }
    // bottom-right
    else if (angle > 1 * Math.PI / 8 && angle < 3 * Math.PI / 8) {
        region = 7;
    }
    // bottom
    else if (angle > 3 * Math.PI / 8 && angle < 5 * Math.PI / 8) {
        region = 8;
    }

    // Check if any existing item is in the region
    var Selected = region - 4 + this.offset;

    if (Selected >= this.numberOfItems || Selected < 0) {
        this.selected = null;
        Selected = null;
    }

    var counter = 0;
    for (var i in this.menu.children) {
        if (counter === Selected) {
            this.menu.children[i].material.color = this.selectedColor;
            this.menu.children[i].scale.set(this.iconSizeSelected, this.iconSizeSelected, 1.0);
            this.selected = this.menu.children[i].name;
        }
        else {
            this.menu.children[i].material.color = this.plainColor;
            this.menu.children[i].scale.set(this.iconSize, this.iconSize, 1.0);
        }
        counter++;
    }
};

/**
 * Create an item and add it to the menu.
 * They must be created in order so they can be called
 */
GZ3D.RadialMenu.prototype.addItem = function (type, itemTexture) {
    // Load icon
    itemTexture = THREE.ImageUtils.loadTexture(itemTexture);

    var itemMaterial = new THREE.SpriteMaterial({
        useScreenCoordinates: true,
        alignment: THREE.SpriteAlignment.center
    });
    itemMaterial.map = itemTexture;
    itemMaterial.color = this.plainColor;

    var item = new THREE.Sprite(itemMaterial);
    item.scale.set(this.iconSize, this.iconSize, 1.0);
    item.name = type;

    this.menu.add(item);

};
