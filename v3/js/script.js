// Loader animation
const loaderScreen = document.querySelector(".loader");
const loaderProgress = document.querySelector(".loader-progress");
const loaderPercent = document.querySelector(".loader-percent");

let loadingValue = 0;

function runLoader() {
    const interval = setInterval(function () {
        loadingValue += Math.floor(Math.random() * 8) + 3;

        if (loadingValue >= 100) {
            loadingValue = 100;
            clearInterval(interval);

            setTimeout(function () {
                if (loaderScreen) {
                    loaderScreen.classList.add("loaded");
                }

                document.body.style.overflow = "auto";
            }, 350);
        }

        if (loaderProgress) {
            loaderProgress.style.width =
                loadingValue + "%";
        }

        if (loaderPercent) {
            loaderPercent.textContent =
                String(loadingValue).padStart(2, "0") +
                "%";
        }
    }, 80);
}

runLoader();


// Custom cursor
const cursor = document.querySelector(".cursor");
const cursorLabel =
    document.querySelector(".cursor-label");

if (cursor && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener(
        "mousemove",
        function (event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    );

    function moveCursor() {
        cursorX +=
            (mouseX - cursorX) * 0.15;

        cursorY +=
            (mouseY - cursorY) * 0.15;

        cursor.style.left =
            cursorX + "px";

        cursor.style.top =
            cursorY + "px";

        requestAnimationFrame(
            moveCursor
        );
    }

    moveCursor();

    const interactiveElements =
        document.querySelectorAll(
            "[data-cursor]"
        );

    interactiveElements.forEach(
        function (element) {
            element.addEventListener(
                "mouseenter",
                function () {
                    cursor.classList.add(
                        "active"
                    );

                    const label =
                        element.getAttribute(
                            "data-cursor"
                        );

                    cursorLabel.textContent =
                        label
                            ? label.toUpperCase()
                            : "VIEW";
                }
            );

            element.addEventListener(
                "mouseleave",
                function () {
                    cursor.classList.remove(
                        "active"
                    );

                    cursorLabel.textContent =
                        "";
                }
            );
        }
    );
}


// Procedural 3D NOIR object
import("three").then(
    function (THREE) {
        const canvas =
            document.getElementById(
                "noirCanvas"
            );

        const sceneContainer =
            document.getElementById(
                "heroScene"
            );

        if (!canvas || !sceneContainer) {
            return;
        }

        // Create the scene
        const scene =
            new THREE.Scene();

        const camera =
            new THREE.PerspectiveCamera(
                35,
                sceneContainer.clientWidth /
                    sceneContainer.clientHeight,
                0.1,
                100
            );

        camera.position.set(
            0,
            0,
            7
        );


        // Create renderer
        const renderer =
            new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.7
            )
        );

        renderer.setSize(
            sceneContainer.clientWidth,
            sceneContainer.clientHeight
        );

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure =
            1.25;


        // Create the NOIR core
        const coreGroup =
            new THREE.Group();

        scene.add(coreGroup);


        // Create dark chrome material
        const chromeMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x202326,
                metalness: 1,
                roughness: 0.18
            });


        // Create the central form
        const coreGeometry =
            new THREE.IcosahedronGeometry(
                1.05,
                2
            );

        const core =
            new THREE.Mesh(
                coreGeometry,
                chromeMaterial
            );

        core.scale.set(
            1,
            1.25,
            0.8
        );

        coreGroup.add(core);


        // Create lime inner sphere
        const innerMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f
            });

        const innerGeometry =
            new THREE.SphereGeometry(
                0.12,
                24,
                24
            );

        const inner =
            new THREE.Mesh(
                innerGeometry,
                innerMaterial
            );

        coreGroup.add(inner);


        // Create orbital rings
        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0.72
            });

        const ringGeometry =
            new THREE.TorusGeometry(
                1.55,
                0.012,
                12,
                160
            );


        const ringOne =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ringOne.rotation.x =
            Math.PI * 0.35;

        ringOne.rotation.z =
            Math.PI * 0.12;

        coreGroup.add(ringOne);


        const ringTwo =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial.clone()
            );

        ringTwo.material.opacity =
            0.38;

        ringTwo.rotation.x =
            -Math.PI * 0.55;

        ringTwo.rotation.y =
            Math.PI * 0.2;

        coreGroup.add(ringTwo);


        // Create thin outer ring
        const outerRingMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9f3ff,
                transparent: true,
                opacity: 0.28
            });

        const outerRing =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    2.05,
                    0.006,
                    8,
                    180
                ),
                outerRingMaterial
            );

        outerRing.rotation.y =
            Math.PI * 0.5;

        coreGroup.add(
            outerRing
        );


        // Studio lighting
        const keyLight =
            new THREE.DirectionalLight(
                0xffffff,
                4
            );

        keyLight.position.set(
            4,
            5,
            6
        );

        scene.add(keyLight);


        const iceLight =
            new THREE.DirectionalLight(
                0xb9f3ff,
                3
            );

        iceLight.position.set(
            -5,
            2,
            -4
        );

        scene.add(iceLight);


        const limeLight =
            new THREE.PointLight(
                0xd7ff3f,
                14,
                10
            );

        limeLight.position.set(
            2,
            -2,
            4
        );

        scene.add(limeLight);


        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.25
            );

        scene.add(
            ambientLight
        );


        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        let targetX = 0;
        let targetY = 0;

        window.addEventListener(
            "mousemove",
            function (event) {
                mouseX =
                    event.clientX /
                    window.innerWidth;

                mouseY =
                    event.clientY /
                    window.innerHeight;

                targetY =
                    (mouseX - 0.5) *
                    0.65;

                targetX =
                    (mouseY - 0.5) *
                    0.4;
            }
        );


        // Scroll interaction
        let scrollProgress = 0;

        window.addEventListener(
            "scroll",
            function () {
                const heroHeight =
                    window.innerHeight;

                scrollProgress =
                    Math.min(
                        window.scrollY /
                            heroHeight,
                        1
                    );
            },
            {
                passive: true
            }
        );


        // Resize
        window.addEventListener(
            "resize",
            function () {
                const width =
                    sceneContainer.clientWidth;

                const height =
                    sceneContainer.clientHeight;

                camera.aspect =
                    width / height;

                camera.updateProjectionMatrix();

                renderer.setSize(
                    width,
                    height
                );
            }
        );


        // Animate the object
        const clock =
            new THREE.Clock();

        function animate() {
            requestAnimationFrame(
                animate
            );

            const elapsed =
                clock.getElapsedTime();


            // Smooth mouse rotation
            coreGroup.rotation.x +=
                (
                    targetX -
                    coreGroup.rotation.x
                ) * 0.035;

            coreGroup.rotation.y +=
                (
                    targetY -
                    coreGroup.rotation.y
                ) * 0.035;


            // Continuous rotation
            core.rotation.y +=
                0.0025;

            ringOne.rotation.z +=
                0.004;

            ringTwo.rotation.x +=
                0.003;

            outerRing.rotation.z -=
                0.002;


            // Floating movement
            coreGroup.position.y =
                Math.sin(
                    elapsed * 0.8
                ) * 0.12;

            coreGroup.position.x =
                Math.sin(
                    elapsed * 0.5
                ) * 0.035;


            // Scroll-driven movement
            coreGroup.position.z =
                scrollProgress * -2.2;

            coreGroup.rotation.z =
                scrollProgress * 0.5;


            // Inner light pulse
            const pulse =
                0.11 +
                Math.sin(
                    elapsed * 2
                ) * 0.025;

            inner.scale.setScalar(
                pulse / 0.12
            );


            // Render
            renderer.render(
                scene,
                camera
            );
        }

        animate();
    }
);


// Magnetic buttons
const magneticElements =
    document.querySelectorAll(
        "[data-magnetic]"
    );

magneticElements.forEach(
    function (element) {
        element.addEventListener(
            "mousemove",
            function (event) {
                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                element.style.transform =
                    `translate(${x * 0.15}px, ${y * 0.15}px)`;
            }
        );

        element.addEventListener(
            "mouseleave",
            function () {
                element.style.transform =
                    "translate(0, 0)";
            }
        );
    }
);


// Scroll reveal
const revealElements =
    document.querySelectorAll(
        "[data-reveal]"
    );

if (
    "IntersectionObserver" in
    window
) {
    const revealObserver =
        new IntersectionObserver(
            function (entries) {
                entries.forEach(
                    function (entry) {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "is-visible"
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );

    revealElements.forEach(
        function (element) {
            revealObserver.observe(
                element
            );
        }
    );
}


// Page entrance
window.addEventListener(
    "load",
    function () {
        requestAnimationFrame(
            function () {
                document.body.classList.add(
                    "page-loaded"
                );
            }
        );
    }
);


// Reduced motion support
if (
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {
    document.documentElement.classList.add(
        "reduce-motion"
    );
}