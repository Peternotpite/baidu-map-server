// 全局变量
var map;
var personMarker;
var driving;

// 初始化地图
function initMap() {
    console.log("开始初始化地图");
    map = new BMap.Map("map");
    // 设置地图中心点
    var point = new BMap.Point(103.825728, 36.050382);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom();

    // 设置起点和终点
    var startPoint = new BMap.Point(103.825728, 36.050382);  // 起点
    var endPoint = new BMap.Point(103.781152, 36.075085);    // 终点

    // 创建路线规划
    driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true,
            showTraffic: false,
            panel: "panel"
        },
        onSearchComplete: function(results) {
            console.log("路线规划完成，状态:", driving.getStatus());
            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                var plan = results.getPlan(0);
                var route = plan.getRoute(0);
                var path = route.getPath();
                console.log("路径点数量:", path.length);
                
                // 开始动画
                animatePerson(path);
            } else {
                console.error("路线规划失败");
            }
        },
        onPolylinesSet: function() {
            console.log("路线已绘制");
        }
    });

    // 搜索路线
    driving.search(startPoint, endPoint);
}

// 动画函数
function animatePerson(path) {
    console.log("开始动画");
    var currentIndex = 0;
    
    // 创建自定义图标 - 小人图标
    var myIcon = new BMap.Icon("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjEwIiByPSI4IiBmaWxsPSIjRkY0NDQ0Ii8+PHBhdGggZD0iTTE1IDIwQzE1IDIwIDEwIDI1IDEwIDM1SDE1VjQwSDE1VjM1SDIwQzIwIDI1IDE1IDIwIDE1IDIwWiIgZmlsbD0iIzQ0NDRGRiIvPjwvc3ZnPg==", 
        new BMap.Size(30, 40), {
            imageSize: new BMap.Size(30, 40),
            anchor: new BMap.Size(15, 40)
        }
    );
    
    // 创建小人标记
    personMarker = new BMap.Marker(path[0], {icon: myIcon});
    map.addOverlay(personMarker);
    
    // 计算总距离
    var totalDistance = 0;
    for (var i = 1; i < path.length; i++) {
        totalDistance += map.getDistance(path[i-1], path[i]);
    }
    console.log("总距离:", totalDistance, "米");
    
    // 进一步增加移动速度（米/秒）
    var speed = 500; // 从200增加到500
    var totalTime = totalDistance / speed * 1000; // 总时间（毫秒）
    var interval = 20; // 进一步减少更新间隔（毫秒），从30减少到20
    var steps = Math.ceil(totalTime / interval);
    console.log("总步数:", steps);
    
    function move() {
        if (currentIndex < steps) {
            // 计算当前位置
            var progress = currentIndex / steps;
            var currentPathIndex = Math.floor(progress * (path.length - 1));
            var nextPathIndex = Math.min(currentPathIndex + 1, path.length - 1);
            var segmentProgress = (progress * (path.length - 1)) % 1;
            
            // 计算当前位置的经纬度
            var currentPoint = new BMap.Point(
                path[currentPathIndex].lng + (path[nextPathIndex].lng - path[currentPathIndex].lng) * segmentProgress,
                path[currentPathIndex].lat + (path[nextPathIndex].lat - path[currentPathIndex].lat) * segmentProgress
            );
            
            // 更新小人位置
            personMarker.setPosition(currentPoint);
            
            currentIndex++;
            setTimeout(move, interval);
        } else {
            console.log("动画完成");
        }
    }
    
    // 开始移动
    move();
} 