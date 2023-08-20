var Radial_Menu = {
	menu: null,
    menuLogo: null,
	stage: null,
	canvasId: 'myCanvas',
    icons: [
        "radial_menu_icon.png",
        "tools-and-utensils.png",
        "transportation.png",
        "maps-and-location.png",
        "miscellaneous.png"
    ],
	// menuItems : {
 //        list: {
 //            "Home": {
 //                list: []
 //            },
 //            "Link": {
 //                list: []
 //            },
 //            "Navigation": {
 //                list: [
 //                    "Orbit mode",
 //                    "Pan mode"
 //                ]
 //            },
 //            "Rendering": {
 //                list: [
 //                    "Default mode",
 //                    "Wireframe mode"
 //                ]
 //            },
 //            "Measure": {
 //                list: []
 //            },
 //            "Help": {
 //                list: []
 //            }
 //        }
 //    },
    show: function(pos) {
        document.getElementById(this.canvasId).classList.remove("hide");
        document.getElementById(this.canvasId).classList.add("show");
        this.menu.pos(pos.x-50, pos.y-50);
        this.stage.update();
    },
    hide: function() {
        const myCanvas = document.getElementById(this.canvasId);
        myCanvas.classList.remove("show");
        myCanvas.classList.add("hide");
    },
    init: function() {
		var path = "resource/acute3d/";
		var assets = this.icons;
		var frame = new Frame("full", 1024, 768, 'transparent', 'transparent', this.icons, path);
        frame.on("ready", () => { // ES6 Arrow Function - like function(){}
            zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

            this.stage = frame.stage;
            // const stageW = frame.width;
            // const stageH = frame.height;

            this.menu = new Radial({
                labels: ["", "", "", ""],
                icons: [
                    frame.asset(this.icons[1]).centerReg({add:false}),
                    frame.asset(this.icons[2]).centerReg({add:false}),
                    frame.asset(this.icons[3]).centerReg({add:false}),
                    frame.asset(this.icons[4]).centerReg({add:false})
                ],
                iconsShiftVertical: [-205, 0, 0, 0],
                coreRadius: 60
            })
            .center()
            .sca(0.5)
            .tap(() => {
                // zog(this.menu.selectedIndex);
                this.hide();
            });

            frame.asset("radial_menu_icon.png").addTo(this.menu).sca(0.8).center();

            // this.menu = new RadialMenu({
            //     menu: this.menuItems,
            //     title: "",
            //     titleIcon: frame.asset("radial_menu_icon.png"),
            //     open:true,
            //     gradient:.1,
            //     // default colors - may be overridden by styles in menu data
            //     backgroundColor:dark,
            //     selectedBackgroundColor:dark,
            //     selectedRollColor:white,
            //     rollBackgroundColor:white,
            //     rollColor:dark,
            //     // totalAngle:320,
            //     // startAngle:-160
            // })
            // .center()
            // .sca(0)
            // .animate({
            //     wait:500,
            //     time:500,
            //     ease:"backOut",
            //     props:{scale:.5}
            // })
            // .tap(()=>{ // also a change() method
            //     if (this.menu.leafNode) {
            //         // console.log(acute3d.page.Canvas3D.isLoadingFinished());
            //         const myCanvas = document.getElementById(this.canvasId);
            //         myCanvas.classList.remove("show");
            //         myCanvas.classList.add("hide");
            //     }
            // });
            this.stage.update();
        }); // end of ready
    }
}