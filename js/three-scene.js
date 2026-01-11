// Three.js 3D Scene for Hero Section
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('three-container');
    if (!container) return;

    let scene, camera, renderer, object, wireframe;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = { x: 0, y: 0 };
    let autoRotate = true;

    // Initialize scene
    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0b0b);

        // Camera
        camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add cursor style
        container.style.cursor = 'grab';

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xc9a24d, 1);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xc9a24d, 0.5);
        directionalLight2.position.set(-5, -5, -5);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0xc9a24d, 1, 100);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        // Create abstract geometric shape
        const geometry = new THREE.OctahedronGeometry(1.5, 2);
        
        // Custom material with gold accent
        const material = new THREE.MeshPhongMaterial({
            color: 0x1e1e1e,
            shininess: 100,
            emissive: 0x0b0b0b,
            emissiveIntensity: 0.2,
            specular: 0xc9a24d,
            flatShading: false
        });

        object = new THREE.Mesh(geometry, material);
        scene.add(object);

        // Add wireframe overlay
        const wireframeGeometry = new THREE.OctahedronGeometry(1.5, 2);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xc9a24d,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        scene.add(wireframe);

        // Mouse/Touch interaction
        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseUp);
        
        // Touch events for mobile
        container.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchmove', onTouchMove);
        container.addEventListener('touchend', onTouchEnd);

        // Handle window resize
        window.addEventListener('resize', onWindowResize);

        // Start animation
        animate();
    }

    function onMouseDown(event) {
        isDragging = true;
        autoRotate = false;
        container.style.cursor = 'grabbing';
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseMove(event) {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;

            rotationSpeed.y = deltaX * 0.01;
            rotationSpeed.x = deltaY * 0.01;

            if (object && wireframe) {
                object.rotation.y += rotationSpeed.y;
                object.rotation.x += rotationSpeed.x;
                wireframe.rotation.y += rotationSpeed.y;
                wireframe.rotation.x += rotationSpeed.x;
            }

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            // Gradually slow down rotation
            setTimeout(() => {
                autoRotate = true;
            }, 2000);
        }
    }

    function onTouchStart(event) {
        if (event.touches.length === 1) {
            isDragging = true;
            autoRotate = false;
            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    function onTouchMove(event) {
        if (isDragging && event.touches.length === 1) {
            event.preventDefault();
            const deltaX = event.touches[0].clientX - previousMousePosition.x;
            const deltaY = event.touches[0].clientY - previousMousePosition.y;

            rotationSpeed.y = deltaX * 0.01;
            rotationSpeed.x = deltaY * 0.01;

            if (object && wireframe) {
                object.rotation.y += rotationSpeed.y;
                object.rotation.x += rotationSpeed.x;
                wireframe.rotation.y += rotationSpeed.y;
                wireframe.rotation.x += rotationSpeed.x;
            }

            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    function onTouchEnd() {
        if (isDragging) {
            isDragging = false;
            setTimeout(() => {
                autoRotate = true;
            }, 2000);
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        // Auto-rotate when not dragging
        if (autoRotate && !isDragging) {
            if (object && wireframe) {
                object.rotation.y += 0.005;
                wireframe.rotation.y += 0.005;
            }
        }

        // Apply rotation speed decay
        if (!isDragging) {
            rotationSpeed.x *= 0.95;
            rotationSpeed.y *= 0.95;
            
            if (Math.abs(rotationSpeed.x) > 0.001 || Math.abs(rotationSpeed.y) > 0.001) {
                if (object && wireframe) {
                    object.rotation.x += rotationSpeed.x;
                    object.rotation.y += rotationSpeed.y;
                    wireframe.rotation.x += rotationSpeed.x;
                    wireframe.rotation.y += rotationSpeed.y;
                }
            }
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Initialize when page loads
    init();
});
