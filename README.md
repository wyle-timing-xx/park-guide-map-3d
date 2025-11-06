# 公园3D导游地图

基于Three.js和HTML的3D公园导游地图，帮助游客导航景点。

## 功能介绍

- 3D公园地图展示，包含地形、水域和树木
- 景点标记系统，直观显示公园内各个景点位置
- 用户可点击景点名称，让虚拟小人按照指定路径移动
- 响应式设计，适应不同设备屏幕

## 技术栈

- **Three.js** - 用于创建和渲染3D场景
- **HTML5 & CSS3** - 页面结构和样式
- **JavaScript** - 交互逻辑和动画
- **Tween.js** - 实现平滑动画效果

## 运行说明

### 在线预览

直接访问GitHub Pages版本：https://wyle-timing-xx.github.io/park-guide-map-3d/

### 本地运行

1. 克隆仓库到本地：

```bash
git clone https://github.com/wyle-timing-xx/park-guide-map-3d.git
cd park-guide-map-3d
```

2. 使用本地服务器运行项目（任选一种方法）：

方法一：使用Node.js的http-server（需要先安装Node.js）：
```bash
# 安装http-server（如果尚未安装）
npm install -g http-server

# 启动服务器
http-server
```

方法二：使用Python的SimpleHTTPServer：
```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

3. 在浏览器中访问：`http://localhost:8080`（或服务器提供的其他URL）

## 使用方法

1. 打开应用后，您将看到公园的3D地图和右侧的控制面板
2. 在控制面板中可以查看当前位置和景点列表
3. 点击景点列表中的任意景点，小人将自动移动到该位置
4. 使用鼠标拖动可以旋转视角，滚轮可以缩放视图

## 自定义景点

如果想要自定义景点，可以修改`main.js`文件中的`attractions`数组：

```javascript
const attractions = [
    {
        id: 1,
        name: '景点名称',
        position: {x: 0, y: 0, z: 0}, // 景点在3D空间中的位置坐标
        description: '景点描述',
        color: 0x8BC34A // 景点标记颜色（十六进制）
    },
    // 添加更多景点...
];
```

## 项目扩展思路

- 添加路径导航线，显示从当前位置到目标景点的路线
- 集成实际地图数据，如卫星图或测绘数据
- 增加景点详情页面，显示图片和更多信息
- 添加昼夜变化和天气效果
- 实现多语言支持

## 浏览器兼容性

- 推荐使用最新版本的Chrome、Firefox或Edge浏览器
- 需要支持WebGL的浏览器
- 移动设备上的性能可能会有所降低

## 许可证

MIT

## 作者

wyle-timing-xx