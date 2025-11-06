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