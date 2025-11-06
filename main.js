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