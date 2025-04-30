export default {
  async fetch(request, env, ctx) {
    // 处理 CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 处理 API 请求
    const url = new URL(request.url);
    if (url.pathname === '/api/config') {
      return new Response(JSON.stringify({
        baiduMapAK: env.BAIDU_MAP_AK
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 处理静态文件请求
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>百度地图服务</title>
            <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=${env.BAIDU_MAP_AK}"></script>
          </head>
          <body>
            <div id="map" style="width: 100%; height: 100vh;"></div>
            <script src="/map.js"></script>
          </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 处理 map.js 请求
    if (url.pathname === '/map.js') {
      return new Response(`
        // 初始化地图
        const map = new BMap.Map("map");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        map.enableScrollWheelZoom(true);
      `, {
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 处理 404
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
}; 