const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(9, 3, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const geometry = new THREE.IcosahedronGeometry(1.5, 4);
const style = new THREE.MeshPhongMaterial({ color: 'red', shininess: 100, shading: THREE.FlatShading });
const object = new THREE.Mesh(geometry, style);

scene.add(object);

const light = new THREE.PointLight();
light.position.set(8, 3, 3);
scene.add(light);

function shape(p) {
    return Math.pow(2 * p.x * p.x + p.y * p.y + p.z * p.z - 1, 3) - p.y * p.y * p.y * (p.x * p.x / 10 + p.z * p.z);
}

let clicked = false;
document.addEventListener("keydown", onDocumentKeyDown);
function onDocumentKeyDown(event) {
    const keyCode = event.which;
    if (keyCode == 13) {
        clicked = true;
        document.removeEventListener("keydown", onDocumentKeyDown);
    }
};

const ray = new THREE.Vector3();
let i = 0;
function binarySearch() {
    let m1 = 0.001,
        m2 = 15,
        m = (m1 + m2) / 2;

    while (m2 - m1 > 0.0001) {
        ray.copy(geometry.vertices[i]).multiplyScalar(m);
        if (shape(ray) > 0) {
            m2 = m;
        } else {
            m1 = m;
        }
        m = (m1 + m2) / 2;
    }
    geometry.vertices[i].copy(ray);
    object.geometry.verticesNeedUpdate = true;
    i++;
}

function animate() {
    requestAnimationFrame(animate);
    if (clicked && i < geometry.vertices.length) {
        binarySearch();
    }
    object.rotation.y += 0.005;
    renderer.render(scene, camera);
}

animate();
