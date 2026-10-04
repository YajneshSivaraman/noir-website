/* =========================================================
   NOIR V3 — INTERACTION ENGINE
   Loader, cursor, scroll physics, distortion, 3D core and UI
   ========================================================= */

/* ---------------------------------------------------------
   DOM references
   --------------------------------------------------------- */

const body = document.body;
const loader = document.querySelector(".loader");
const cursor = document.querySelector(".cursor");
const noirCanvas = document.querySelector("#noirCanvas");

/* ---------------------------------------------------------
   Motion preference
   --------------------------------------------------------- */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
}

/* ---------------------------------------------------------
   Loader
   --------------------------------------------------------- */

window.addEventListener("load", () => {
    const progress = document.querySelector(".loader-progress");
    const percent = document.querySelector(".loader-percent");

    let value = 0;

    const loaderTimer = setInterval(() => {
        value += Math.random() * 8;

        if (value >= 100) {
            value = 100;
            clearInterval(loaderTimer);
        }

        if (progress) {
            progress.style.width = `${value}%`;
        }

        if (percent) {
            percent.textContent = `${Math.floor(value)
                .toString()
                .padStart(2, "0")}%`;
        }
    }, 70);

    setTimeout(() => {
        if (loader) {
            loader.classList.add("loaded");
        }

        body.classList.add("page-ready");
    }, 850);
});

/* ---------------------------------------------------------
   Custom cursor
   --------------------------------------------------------- */

if (
    cursor &&
    window.matchMedia("(pointer: fine)").matches &&
    !prefersReducedMotion
) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.16;
        cursorY += (mouseY - cursorY) * 0.16;

        cursor.style.transform =
            `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    const interactiveElements = document.querySelectorAll(
        "a, button, .service-row, .gallery-item, [data-cursor]"
    );

    interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursor.classList.add("active");

            const cursorType = element.dataset.cursor;

            const label = cursor.querySelector(".cursor-label");

            if (label) {
                if (cursorType === "book") {
                    label.textContent = "BOOK";
                } else if (cursorType === "explore") {
                    label.textContent = "EXPLORE";
                } else {
                    label.textContent = "VIEW";
                }
            }
        });

        element.addEventListener("mouseleave", () => {
            cursor.classList.remove("active");
        });
    });
}

/* ---------------------------------------------------------
   Scroll state
   --------------------------------------------------------- */

let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
let previousScroll = window.scrollY;

let scrollVelocity = 0;
let smoothVelocity = 0;
let scrollDirection = 1;

window.addEventListener(
    "scroll",
    () => {
        targetScroll = window.scrollY;
    },
    { passive: true }
);

/* ---------------------------------------------------------
   Dimensional section list
   --------------------------------------------------------- */

const dimensionalSections = [
    {
        element: document.querySelector(".experience-section"),
        strength: 0.075
    },
    {
        element: document.querySelector(".manifesto-section"),
        strength: -0.055
    },
    {
        element: document.querySelector(".services-section"),
        strength: 0.045
    },
    {
        element: document.querySelector(".service-statement"),
        strength: -0.07
    },
    {
        element: document.querySelector(".gallery-section"),
        strength: 0.035
    },
    {
        element: document.querySelector(".closing-section"),
        strength: -0.055
    },
    {
        element: document.querySelector(".booking-section"),
        strength: 0.06
    }
].filter((item) => item.element);

/* ---------------------------------------------------------
   Depth calculation
   --------------------------------------------------------- */

function getDepthOffset(element, strength) {
    if (!element) {
        return 0;
    }

    const rect = element.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;

    const distance = elementCenter - viewportCenter;

    return distance * strength;
}

/* ---------------------------------------------------------
   Scroll velocity engine
   --------------------------------------------------------- */

function updateScrollVelocity() {
    const currentWindowScroll = window.scrollY;

    const difference =
        currentWindowScroll - previousScroll;

    scrollVelocity = difference;

    if (difference !== 0) {
        scrollDirection = difference > 0 ? 1 : -1;
    }

    previousScroll = currentWindowScroll;

    smoothVelocity +=
        (scrollVelocity - smoothVelocity) * 0.12;

    smoothVelocity = Math.max(
        -35,
        Math.min(35, smoothVelocity)
    );

    document.documentElement.style.setProperty(
        "--scroll-velocity",
        smoothVelocity
    );

    document.documentElement.style.setProperty(
        "--scroll-direction",
        scrollDirection
    );

    requestAnimationFrame(updateScrollVelocity);
}

updateScrollVelocity();

/* ---------------------------------------------------------
   Dimensional scroll
   --------------------------------------------------------- */

function dimensionalScroll() {
    currentScroll +=
        (targetScroll - currentScroll) * 0.08;

    if (!prefersReducedMotion) {
        dimensionalSections.forEach((item) => {
            const offset = getDepthOffset(
                item.element,
                item.strength
            );

            item.element.style.setProperty(
                "--section-depth",
                `${offset}px`
            );

            item.element.style.transform =
                `translate3d(0, ${offset}px, 0)`;
        });
    }

    requestAnimationFrame(dimensionalScroll);
}

dimensionalScroll();

/* ---------------------------------------------------------
   Velocity distortion
   --------------------------------------------------------- */

function updateDistortion() {
    if (prefersReducedMotion) {
        requestAnimationFrame(updateDistortion);
        return;
    }

    const velocity = smoothVelocity;

    const distortionStrength = Math.min(
        1,
        Math.abs(velocity) / 35
    );

    document.documentElement.style.setProperty(
        "--distortion-strength",
        distortionStrength.toFixed(3)
    );

    /* Large typography stretches slightly during fast scroll */
    const largeTypography = document.querySelectorAll(
        ".experience-main h2, .service-statement h2, .closing-section h2"
    );

    largeTypography.forEach((element, index) => {
        const movement =
            velocity *
            0.42 *
            scrollDirection *
            (index % 2 === 0 ? 1 : -1);

        const rotation = Math.max(
            -2.5,
            Math.min(2.5, velocity * 0.035)
        );

        const scaleX =
            1 + distortionStrength * 0.018;

        element.style.transform =
            `translate3d(${movement}px, 0, 0) rotate(${rotation}deg) scaleX(${scaleX})`;
    });

    /* Experience image reacts to velocity */
    const experienceImage = document.querySelector(
        ".experience-image-wrap img"
    );

    if (experienceImage) {
        const scale =
            1.08 + distortionStrength * 0.035;

        const scaleX =
            1 + distortionStrength * 0.025;

        experienceImage.style.transform =
            `scale(${scale}) scaleX(${scaleX})`;
    }

    /* Gallery images react independently */
    const galleryImages =
        document.querySelectorAll(".gallery-item img");

    galleryImages.forEach((image, index) => {
        const direction =
            index % 2 === 0 ? 1 : -1;

        const scale =
            1.035 + distortionStrength * 0.025;

        const scaleX =
            1 + distortionStrength * 0.035;

        const rotation =
            distortionStrength * 0.7 * direction;

        image.style.transform =
            `scale(${scale}) scaleX(${scaleX}) rotate(${rotation}deg)`;
    });

    /* Service rows slide slightly during fast movement */
    const serviceRows =
        document.querySelectorAll(".service-row");

    serviceRows.forEach((row, index) => {
        const direction =
            index % 2 === 0 ? 1 : -1;

        const movement =
            velocity *
            0.65 *
            direction *
            scrollDirection;

        const scaleX =
            1 - distortionStrength * 0.008;

        row.style.transform =
            `translate3d(${movement}px, 0, 0) scaleX(${scaleX})`;
    });

    requestAnimationFrame(updateDistortion);
}

updateDistortion();

/* ---------------------------------------------------------
   Three.js NOIR Core
   --------------------------------------------------------- */

async function initializeNoirCore() {
    if (!noirCanvas) {
        return;
    }

    try {
        /* Use the same Three.js version defined in index.html */
        const THREE = await import("three");

        const isMobile =
            window.innerWidth < 700;

        /* -------------------------------------------------
           Scene
           ------------------------------------------------- */

        const scene = new THREE.Scene();

        /* -------------------------------------------------
           Camera
           ------------------------------------------------- */

        const width =
            noirCanvas.clientWidth || 600;

        const height =
            noirCanvas.clientHeight || 600;

        const camera =
            new THREE.PerspectiveCamera(
                35,
                width / height,
                0.1,
                100
            );

        camera.position.z = 7;

        /* -------------------------------------------------
           Renderer
           ------------------------------------------------- */

        const renderer =
            new THREE.WebGLRenderer({
                canvas: noirCanvas,
                alpha: true,
                antialias: true
            });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 1.7)
        );

        renderer.setSize(
            width,
            height,
            false
        );

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure = 1.05;

        /* -------------------------------------------------
           Lighting
           ------------------------------------------------- */

        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.45
            );

        scene.add(ambientLight);

        const whiteLight =
            new THREE.DirectionalLight(
                0xffffff,
                2.8
            );

        whiteLight.position.set(
            3,
            4,
            5
        );

        scene.add(whiteLight);

        const iceLight =
            new THREE.DirectionalLight(
                0xb9f3ff,
                2.2
            );

        iceLight.position.set(
            -4,
            1,
            3
        );

        scene.add(iceLight);

        const limeLight =
            new THREE.PointLight(
                0xd7ff3f,
                14,
                12
            );

        limeLight.position.set(
            2.2,
            1.5,
            3
        );

        scene.add(limeLight);

        /* -------------------------------------------------
           Main core group
           ------------------------------------------------- */

        const coreGroup =
            new THREE.Group();

        scene.add(coreGroup);

        /* -------------------------------------------------
           Dark chrome core
           ------------------------------------------------- */

        const coreGeometry =
            new THREE.IcosahedronGeometry(
                1.05,
                2
            );

        const coreMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x202326,
                metalness: 1,
                roughness: 0.18,
                flatShading: true
            });

        const coreMesh =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );

        coreMesh.scale.set(
            1,
            1.25,
            0.8
        );

        coreGroup.add(coreMesh);

        /* -------------------------------------------------
           Inner lime energy core
           ------------------------------------------------- */

        const innerGeometry =
            new THREE.SphereGeometry(
                0.12,
                24,
                24
            );

        const innerMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f
            });

        const innerCore =
            new THREE.Mesh(
                innerGeometry,
                innerMaterial
            );

        coreGroup.add(innerCore);

        /* -------------------------------------------------
           Lime halo
           ------------------------------------------------- */

        const haloGeometry =
            new THREE.SphereGeometry(
                0.28,
                32,
                32
            );

        const haloMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0.11,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const halo =
            new THREE.Mesh(
                haloGeometry,
                haloMaterial
            );

        coreGroup.add(halo);

        /* -------------------------------------------------
           Orbital rings
           ------------------------------------------------- */

        const limeRingMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0.42
            });

        const secondLimeRingMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0.22
            });

        const iceRingMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9f3ff,
                transparent: true,
                opacity: 0.28
            });

        const ringOne =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.45,
                    0.012,
                    8,
                    180
                ),
                limeRingMaterial
            );

        ringOne.rotation.x =
            Math.PI * 0.42;

        ringOne.rotation.y =
            Math.PI * 0.12;

        const ringTwo =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.75,
                    0.008,
                    8,
                    180
                ),
                iceRingMaterial
            );

        ringTwo.rotation.x =
            Math.PI * 0.72;

        ringTwo.rotation.z =
            Math.PI * 0.22;

        const ringThree =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.25,
                    0.006,
                    8,
                    180
                ),
                secondLimeRingMaterial
            );

        ringThree.rotation.x =
            Math.PI * 0.18;

        ringThree.rotation.z =
            Math.PI * 0.55;

        coreGroup.add(
            ringOne,
            ringTwo,
            ringThree
        );

        /* -------------------------------------------------
           Outer energy orbit
           ------------------------------------------------- */

        const outerEnergyMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9f3ff,
                transparent: true,
                opacity: 0.13
            });

        const outerEnergyOrbit =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    2.05,
                    0.004,
                    8,
                    180
                ),
                outerEnergyMaterial
            );

        outerEnergyOrbit.rotation.x =
            Math.PI * 0.58;

        outerEnergyOrbit.rotation.z =
            Math.PI * 0.3;

        coreGroup.add(
            outerEnergyOrbit
        );

        /* -------------------------------------------------
           Orbital particles
           ------------------------------------------------- */

        const particleCount =
            isMobile ? 55 : 90;

        const particlePositions =
            new Float32Array(
                particleCount * 3
            );

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {
            const angle =
                Math.random() *
                Math.PI *
                2;

            const radius =
                1.8 +
                Math.random() * 1.35;

            const vertical =
                (Math.random() - 0.5) *
                1.8;

            particlePositions[i * 3] =
                Math.cos(angle) *
                radius;

            particlePositions[i * 3 + 1] =
                vertical;

            particlePositions[i * 3 + 2] =
                Math.sin(angle) *
                radius;
        }

        const particleGeometry =
            new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                particlePositions,
                3
            )
        );

        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0xd7ff3f,
                size: isMobile
                    ? 0.018
                    : 0.021,
                transparent: true,
                opacity: 0.42,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const particles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            );

        coreGroup.add(particles);

        /* -------------------------------------------------
           Scan / decode system
           ------------------------------------------------- */

        const scanGroup =
            new THREE.Group();

        coreGroup.add(scanGroup);

        /* Vertical scan beam */
        const scanBeamGeometry =
            new THREE.PlaneGeometry(
                0.018,
                3.8
            );

        const scanBeamMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9f3ff,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const scanBeam =
            new THREE.Mesh(
                scanBeamGeometry,
                scanBeamMaterial
            );

        scanGroup.add(scanBeam);

        /* Soft scan glow */
        const scanGlowGeometry =
            new THREE.PlaneGeometry(
                0.16,
                3.8
            );

        const scanGlowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9f3ff,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const scanGlow =
            new THREE.Mesh(
                scanGlowGeometry,
                scanGlowMaterial
            );

        scanGroup.add(scanGlow);

        /* Scan node */
        const scanNodeMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const scanNode =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.035,
                    12,
                    12
                ),
                scanNodeMaterial
            );

        scanNode.position.x = 1.62;

        scanGroup.add(scanNode);

        /* Decode ring */
        const decodeRingMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd7ff3f,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const decodeRing =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.35,
                    0.008,
                    8,
                    160
                ),
                decodeRingMaterial
            );

        decodeRing.rotation.x =
            Math.PI * 0.5;

        coreGroup.add(
            decodeRing
        );

        /* -------------------------------------------------
           Scan state
           ------------------------------------------------- */

        let scanActive = false;
        let scanStart = 0;

        let nextScanTime =
            prefersReducedMotion
                ? Infinity
                : 4.5;

        const scanDuration = 1.15;

        /* -------------------------------------------------
           Mouse physics
           ------------------------------------------------- */

        let mouseX = 0;
        let mouseY = 0;

        let targetRotationX = 0;
        let targetRotationY = 0;

        let currentRotationX = 0;
        let currentRotationY = 0;

        window.addEventListener(
            "mousemove",
            (event) => {
                mouseX =
                    event.clientX /
                        window.innerWidth -
                    0.5;

                mouseY =
                    event.clientY /
                        window.innerHeight -
                    0.5;
            }
        );

        /* -------------------------------------------------
           Resize
           ------------------------------------------------- */

        function resizeRenderer() {
            const width =
                noirCanvas.clientWidth;

            const height =
                noirCanvas.clientHeight;

            if (!width || !height) {
                return;
            }

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height,
                false
            );
        }

        window.addEventListener(
            "resize",
            resizeRenderer
        );

        resizeRenderer();

        /* -------------------------------------------------
           Animation clock
           ------------------------------------------------- */

        const clock =
            new THREE.Clock();

        /* -------------------------------------------------
           Main animation
           ------------------------------------------------- */

        function animate() {
            requestAnimationFrame(
                animate
            );

            const delta =
                clock.getDelta();

            const elapsed =
                clock.elapsedTime;

            /* Core rotation */
            coreMesh.rotation.x +=
                delta * 0.24;

            coreMesh.rotation.y +=
                delta * 0.38;

            innerCore.rotation.y -=
                delta * 0.45;

            /* Core breathing */
            const breathing =
                1 +
                Math.sin(
                    elapsed * 1.6
                ) *
                    0.045;

            innerCore.scale.setScalar(
                breathing
            );

            halo.scale.setScalar(
                1 +
                    Math.sin(
                        elapsed * 1.25
                    ) *
                        0.08
            );

            /* Rings */
            ringOne.rotation.z +=
                delta * 0.18;

            ringTwo.rotation.y -=
                delta * 0.12;

            ringThree.rotation.x +=
                delta * 0.15;

            outerEnergyOrbit.rotation.y +=
                delta * 0.08;

            outerEnergyOrbit.rotation.z -=
                delta * 0.04;

            /* Particle movement */
            particles.rotation.y +=
                delta * 0.08;

            particles.rotation.x +=
                delta * 0.025;

            /* -------------------------------------------------
               Trigger scan
               ------------------------------------------------- */

            if (
                !prefersReducedMotion &&
                !scanActive &&
                elapsed >= nextScanTime
            ) {
                scanActive = true;
                scanStart = elapsed;
            }

            /* -------------------------------------------------
               Scan animation
               ------------------------------------------------- */

            let scanPulse = 0;

            if (scanActive) {
                const progress =
                    (elapsed - scanStart) /
                    scanDuration;

                const clampedProgress =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            progress
                        )
                    );

                const easedProgress =
                    clampedProgress < 0.5
                        ? 2 *
                          clampedProgress *
                          clampedProgress
                        : 1 -
                          Math.pow(
                              -2 *
                                  clampedProgress +
                                  2,
                              2
                          ) /
                              2;

                /* Move beam through the core */
                scanGroup.position.y =
                    -1.9 +
                    easedProgress *
                        3.8;

                scanPulse = Math.max(
                    0,
                    Math.sin(
                        clampedProgress *
                            Math.PI
                    )
                );

                /* Beam brightness */
                scanBeamMaterial.opacity =
                    0.55 +
                    scanPulse * 0.25;

                scanGlowMaterial.opacity =
                    0.035 +
                    scanPulse * 0.1;

                scanNodeMaterial.opacity =
                    0.65 +
                    scanPulse * 0.35;

                decodeRingMaterial.opacity =
                    scanPulse * 0.38;

                decodeRing.scale.setScalar(
                    1 +
                        scanPulse * 0.1
                );

                /* Core responds to scan */
                haloMaterial.opacity =
                    0.11 +
                    scanPulse * 0.08;

                limeLight.intensity =
                    14 +
                    scanPulse * 10;

                particleMaterial.opacity =
                    0.42 +
                    scanPulse * 0.25;

                /* Finish scan */
                if (
                    progress >= 1
                ) {
                    scanActive = false;

                    scanGroup.position.y =
                        -1.9;

                    scanBeamMaterial.opacity = 0;
                    scanGlowMaterial.opacity = 0;
                    scanNodeMaterial.opacity = 0;
                    decodeRingMaterial.opacity = 0;

                    nextScanTime =
                        elapsed +
                        4.5 +
                        Math.random() *
                            2.5;
                }
            } else {
                scanBeamMaterial.opacity = 0;
                scanGlowMaterial.opacity = 0;
                scanNodeMaterial.opacity = 0;
                decodeRingMaterial.opacity = 0;

                haloMaterial.opacity =
                    0.11;

                limeLight.intensity =
                    14;

                particleMaterial.opacity =
                    0.42;
            }

            /* -------------------------------------------------
               Mouse rotation
               ------------------------------------------------- */

            targetRotationY =
                mouseX * 0.34;

            targetRotationX =
                mouseY * 0.24;

            currentRotationY +=
                (targetRotationY -
                    currentRotationY) *
                0.045;

            currentRotationX +=
                (targetRotationX -
                    currentRotationX) *
                0.045;

            coreGroup.rotation.y =
                currentRotationY;

            coreGroup.rotation.x =
                -currentRotationX;

            /* -------------------------------------------------
               Scroll depth
               ------------------------------------------------- */

            if (!prefersReducedMotion) {
                const heroProgress =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            window.scrollY /
                                window.innerHeight
                        )
                    );

                coreGroup.position.z =
                    -heroProgress * 2.2 +
                    smoothVelocity * 0.004;

                coreGroup.rotation.z =
                    heroProgress * 0.5;

                coreMesh.rotation.y +=
                    smoothVelocity * 0.0008;
            }

            /* -------------------------------------------------
               Floating motion
               ------------------------------------------------- */

            const targetFloatY =
                Math.sin(
                    elapsed * 0.8
                ) * 0.018;

            coreGroup.position.y +=
                (targetFloatY -
                    coreGroup.position.y) *
                0.025;

            /* -------------------------------------------------
               Moving lime light
               ------------------------------------------------- */

            limeLight.position.x =
                2.2 +
                Math.sin(
                    elapsed * 0.7
                ) *
                    0.7;

            limeLight.position.y =
                1.5 +
                Math.cos(
                    elapsed * 0.55
                ) *
                    0.5;

            /* Render */
            renderer.render(
                scene,
                camera
            );
        }

        animate();
    } catch (error) {
        console.error(
            "NOIR Core failed to initialize:",
            error
        );
    }
}

initializeNoirCore();

/* ---------------------------------------------------------
   Magnetic interactions
   --------------------------------------------------------- */

if (
    window.matchMedia("(pointer: fine)")
        .matches &&
    !prefersReducedMotion
) {
    const magneticElements =
        document.querySelectorAll(
            ".booking-button, .nav-menu"
        );

    magneticElements.forEach(
        (element) => {
            element.addEventListener(
                "mousemove",
                (event) => {
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
                        `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {
                    element.style.transform =
                        "translate3d(0, 0, 0)";
                }
            );
        }
    );
}

/* ---------------------------------------------------------
   Scroll reveal
   --------------------------------------------------------- */

const revealElements =
    document.querySelectorAll(
        "[data-reveal]"
    );

if (revealElements.length) {
    const revealObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "is-visible"
                            );

                            revealObserver.unobserve(
                                entry.target
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
        (element) => {
            revealObserver.observe(
                element
            );
        }
    );
}

/* ---------------------------------------------------------
   WhatsApp booking
   --------------------------------------------------------- */

const whatsappBooking =
    document.querySelector(
        "#whatsappBooking"
    );

if (whatsappBooking) {
    whatsappBooking.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            /*
             * Replace the placeholder number with
             * the business WhatsApp number later.
             */
            const phone = "REPLACE_WITH_WHATSAPP_NUMBER";

            const message =
                "Hi NOIR, I'd like to book an appointment.";

            if (
                phone &&
                phone !==
                    "REPLACE_WITH_WHATSAPP_NUMBER"
            ) {
                window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(
                        message
                    )}`,
                    "_blank"
                );
            }
        }
    );
}