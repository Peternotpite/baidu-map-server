require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API路由
app.get('/api/config', (req, res) => {
    res.json({
        baiduMapAK: process.env.BAIDU_MAP_AK
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}); 