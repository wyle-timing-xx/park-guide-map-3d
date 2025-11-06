// 公园3D导游地图主脚本
// 使用Three.js创建3D场景并实现交互功能

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    controls = new OrbitControls(camera, renderer.domElement);
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

// 添加公园的树木
function addTrees() {
    // 树干几何体
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 1.5, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    // 树冠几何体
    const leavesGeometry = new THREE.ConeGeometry(1, 2, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x33691E });
    
    // 随机放置树木
    for (let i = 0; i < 40; i++) {
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        // 随机位置
        const x = Math.random() * SCENE_SIZE * 2 - SCENE_SIZE;
        const z = Math.random() * SCENE_SIZE * 2 - SCENE_SIZE;
        
        // 避免在水域（湖）中放树
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter < 14) continue; // 跳过位于湖中的树
        
        // 设置位置
        trunk.position.set(x, 0.75, z);
        leaves.position.set(x, 2.5, z);
        
        // 添加阴影
        trunk.castShadow = true;
        leaves.castShadow = true;
        trunk.receiveShadow = true;
        leaves.receiveShadow = true;
        
        // 随机旋转，增加多样性
        trunk.rotation.y = Math.random() * Math.PI;
        leaves.rotation.y = trunk.rotation.y;
        
        scene.add(trunk);
        scene.add(leaves);
    }
}

// 创建景点标记
function createAttractions() {
    attractions.forEach((attraction) => {
        // 创建景点底座
        const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: attraction.color });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(
            attraction.position.x, 
            attraction.position.y, 
            attraction.position.z
        );
        base.receiveShadow = true;
        scene.add(base);
        
        // 创建景点标记（竖立的圆柱）
        const markerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
        const markerMaterial = new THREE.MeshStandardMaterial({ color: attraction.color });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(
            attraction.position.x, 
            attraction.position.y + 1.5, 
            attraction.position.z
        );
        marker.castShadow = true;
        scene.add(marker);
        
        // 创建景点编号（球体）
        const numberGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const numberMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const numberSphere = new THREE.Mesh(numberGeometry, numberMaterial);
        numberSphere.position.set(
            attraction.position.x, 
            attraction.position.y + 3, 
            attraction.position.z
        );
        numberSphere.castShadow = true;
        scene.add(numberSphere);
        
        // 添加景点交互性
        numberSphere.userData = { 
            attractionId: attraction.id,
            type: 'attraction'
        };
        
        // 添加HTML内容（动态创建）
        createAttractionLabel(attraction);
    });
}

// 创建景点的HTML标签
function createAttractionLabel(attraction) {
    // 此功能在UI部分实现
}

// 创建角色（小人）
function createCharacter() {
    // 创建小人体
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3F51B5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    
    // 创建小人头
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE0B2 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.4;
    head.castShadow = true;
    
    // 组合为完整角色
    character = new THREE.Group();
    character.add(body);
    character.add(head);
    
    // 设置初始位置为第一个景点
    if (attractions.length > 0) {
        const firstAttraction = attractions[0];
        character.position.set(
            firstAttraction.position.x,
            0,
            firstAttraction.position.z
        );
        currentAttractionIndex = 0;
        updateCurrentLocation(firstAttraction.name);
    }
    
    scene.add(character);
}

// 创建用户界面
function createUI() {
    const attractionsList = document.getElementById('attractions-list');
    
    // 清空列表
    attractionsList.innerHTML = '';
    
    // 添加景点列表
    attractions.forEach((attraction, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="attraction-number">${attraction.id}</span>
            <span class="attraction-name">${attraction.name}</span>
        `;
        
        // 为第一个景点添加活动类
        if (index === 0) {
            listItem.classList.add('active');
        }
        
        // 点击景点时移动小人
        listItem.addEventListener('click', () => {
            moveToAttraction(index);
        });
        
        attractionsList.appendChild(listItem);
    });
}

// 移动小人到指定景点
function moveToAttraction(index) {
    // 如果已经在该景点或者正在移动中，则忽略
    if (index === currentAttractionIndex || isMoving) {
        return;
    }
    
    // 获取目标景点
    const targetAttraction = attractions[index];
    const startPosition = {
        x: character.position.x,
        z: character.position.z
    };
    const endPosition = {
        x: targetAttraction.position.x,
        z: targetAttraction.position.z
    };
    
    // 计算移动方向
    const direction = new THREE.Vector2(
        endPosition.x - startPosition.x,
        endPosition.z - startPosition.z
    );
    
    // 如果距离太小，直接瞬移
    const distance = direction.length();
    if (distance < 0.1) {
        character.position.x = endPosition.x;
        character.position.z = endPosition.z;
        completeMove(index);
        return;
    }
    
    // 标记为正在移动
    isMoving = true;
    
    // 旋转角色面向移动方向
    character.rotation.y = Math.atan2(direction.x, direction.y);
    
    // 使用TWEEN创建平滑动画
    const duration = distance * 1000 / CHARACTER_SPEED; // 根据距离和速度计算时间
    
    new TWEEN.Tween(startPosition)
        .to(endPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            character.position.x = startPosition.x;
            character.position.z = startPosition.z;
        })
        .onComplete(() => {
            completeMove(index);
        })
        .start();
}

// 完成移动后的处理
function completeMove(index) {
    isMoving = false;
    currentAttractionIndex = index;
    
    // 更新UI
    updateCurrentLocation(attractions[index].name);
    highlightCurrentAttraction();
    
    // 可以在此添加达到景点后的特效或声音
}

// 更新当前位置显示
function updateCurrentLocation(name) {
    document.getElementById('location-name').textContent = name;
}

// 高亮当前景点
function highlightCurrentAttraction() {
    const attractionItems = document.querySelectorAll('#attractions-list li');
    attractionItems.forEach((item, index) => {
        if (index === currentAttractionIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 窗口大小调整时更新渲染器和相机
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新控制器
    controls.update();
    
    // 更新TWEEN动画
    TWEEN.update();
    
    // 渲染场景
    renderer.render(scene, camera);
}

// 启动应用
init();