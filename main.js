// 公园3D导游地图主脚本
// 使用Three.js创建3D场景并实现交互功能

// 场景常量
const SCENE_SIZE = 50; // 地图场景大小
const CHARACTER_SPEED = 2; // 小人移动速度

// 主要变量
let scene, camera, renderer, controls;
let character; // 小人模型
let currentAttractionIndex = -1; // 当前景点索引
let isMoving = false; // 小人是否在移动

// 景点数据
const attractions = [
    {
        id: 1,
        name: '入口广场',
        position: {x: -20, y: 0, z: 15},
        description: '公园的主要入口，有标志性的牌坊和信息亭。',
        color: 0x8BC34A
    },
    {
        id: 2,
        name: '花卉园',
        position: {x: -10, y: 0, z: 5},
        description: '各种季节性花卉展示，色彩缤纷。',
        color: 0xFF9800
    },
    {
        id: 3,
        name: '湖心亭',
        position: {x: 0, y: 0, z: -5},
        description: '湖中央的休息亭，可以观赏湖景。',
        color: 0x2196F3
    },
    {
        id: 4,
        name: '儿童乐园',
        position: {x: 10, y: 0, z: 0},
        description: '适合儿童玩耍的游乐设施区。',
        color: 0xE91E63
    },
    {
        id: 5,
        name: '观景台',
        position: {x: 20, y: 2, z: 10},
        description: '高处的观景平台，可以俯瞰整个公园。',
        color: 0x9C27B0
    }
];

// 初始化函数
function init() {
    initScene();
    createMap();
    createAttractions();
    createCharacter();
    createUI();
    animate();

    // 窗口大小调整时更新渲染
    window.addEventListener('resize', onWindowResize);
}

// 初始化Three.js场景、相机和渲染器
function initScene() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAEDEBF); // 淡绿色背景
    
    // 添加环境光和平行光模拟阳光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -SCENE_SIZE;
    directionalLight.shadow.camera.right = SCENE_SIZE;
    directionalLight.shadow.camera.top = SCENE_SIZE;
    directionalLight.shadow.camera.bottom = -SCENE_SIZE;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // 创建透视相机
    camera = new THREE.PerspectiveCamera(
        45, // 视角
        window.innerWidth / window.innerHeight, // 宽高比
        0.1, // 近裁面
        1000 // 远裁面
    );
    camera.position.set(0, 30, 30); // 设置相机位置
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // 添加轨道控制，方便旋转和缩放视图
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 添加阻尼效果使控制更平滑
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2.2; // 限制垂直旋转角度
}

// 创建公园地图地面
function createMap() {
    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(SCENE_SIZE * 2, SCENE_SIZE * 2);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7CCC6C,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // 添加网格辅助线（调试用，可以注释掉）
    // const gridHelper = new THREE.GridHelper(SCENE_SIZE * 2, 20, 0x000000, 0x000000);
    // gridHelper.position.y = 0.01;
    // scene.add(gridHelper);
    
    // 创建水域（湖）
    const lakeGeometry = new THREE.CircleGeometry(15, 32);
    const lakeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2196F3,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
    });
    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = 0;
    lake.receiveShadow = true;
    scene.add(lake);
    
    // 添加一些树木
    addTrees();
}