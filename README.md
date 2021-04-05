# AceCards-FE

AceCards 的前端仓库

[主仓库(后端)](https://github.com/CmdBlock-zqg/acecards-be)

## 直接下载部署版本前端 (推荐)

前往[Release页](https://github.com/CmdBlock-zqg/acecards-fe/releases/)下载最新版部署版本前端

## 自行编译前端 (不推荐)

```
git clone https://github.com/CmdBlock-zqg/acecards-fe.git
cd acecards-fe
npm i
npm run build
```

这时控制台将输出一段文件列表，形如：

```
✓ 278 modules transformed.
dist/index.html                     0.57kb
dist/assets/axios.54b6010e.js       0.40kb / brotli: 0.25kb
dist/assets/Login.e166cc4d.js       1.27kb / brotli: 0.62kb
dist/assets/ItemCard.f7ef0cba.js    0.71kb / brotli: 0.37kb
dist/assets/List.36d9361f.js        2.61kb / brotli: 1.17kb
dist/assets/Review.9cb5dd67.js      2.29kb / brotli: 1.05kb
dist/assets/Study.d0812e13.js       2.38kb / brotli: 1.07kb
dist/assets/List.48c2c63b.js        4.27kb / brotli: 1.68kb
dist/assets/New.885abba0.js         2.46kb / brotli: 1.14kb
dist/assets/ItemCard.4a79005e.css   0.28kb / brotli: 0.14kb
dist/assets/Settings.4325c648.js    1.81kb / brotli: 0.96kb
dist/assets/Login.795afe07.css      0.58kb / brotli: 0.18kb
dist/assets/Study.1670ef15.css      0.91kb / brotli: 0.29kb
dist/assets/Review.b3de69fb.css     0.91kb / brotli: 0.30kb
dist/assets/New.7a573ceb.css        0.28kb / brotli: 0.14kb
dist/assets/index.2c657948.css      116.46kb / brotli: 36.55kb
dist/assets/index.af64f827.js       321.21kb / brotli: 93.69kb
```

接下来编辑`dist/sw/webcache.js`的内容，将文件列表以以下格式加入代码：

```
const contentToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/sw/db.js',
  '/sw/http.js',
  '/sw/webcache.js',
  '/images/48.png',
  '/images/72.png',
  '/images/96.png',
  '/images/144.png',
  '/images/192.png',
  '/images/512.png', // 之前为固定部分，不要修改

  '/assets/axios.54b6010e.js', // 文件列表
  '/assets/Login.e166cc4d.js',
  '/assets/ItemCard.f7ef0cba.js',
  '/assets/List.36d9361f.js',
  '/assets/Review.9cb5dd67.js',
  '/assets/Study.d0812e13.js',
  '/assets/List.48c2c63b.js',
  '/assets/New.885abba0.js',
  '/assets/ItemCard.4a79005e.css',
  '/assets/Settings.4325c648.js',
  '/assets/Login.795afe07.css',
  '/assets/Study.1670ef15.css',
  '/assets/Review.b3de69fb.css',
  '/assets/New.7a573ceb.css',
  '/assets/index.2c657948.css',
  '/assets/index.af64f827.js'
]
```

**注意**: 去掉每个文件前的`/dist`，去掉`index.html`。

Hint: 利用代码编辑器的**转义符替换**功能可快速完成这一项操作

这时，`dist`目录下的就是可供部署的完整前端代码。

