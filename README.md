# postman2openapi-anban

转换 postman collection 为 openapi 格式.
可通过 options 设置 readOnly、required 开关


# 构建

## 构建为 web
wasm-pack build --release --out-dir ./pkg --target web

使用示例: Postman2Openapi.vue

### vue 引用
若本地引用，则将 pkg 文件夹，复制到目标 vue 项目下，
通过 npm i ./pkg 进行本地安装

## 构建为 nodejs
wasm-pack build --release --out-dir ./nodejs --target nodejs

使用示例: myJsTest.js

# 原 postman2openapi 项目地址

https://github.com/rustwasm/wasm-pack

# 官网参考资料

https://rustwasm.github.io/wasm-pack/book/commands/build.html

https://rustwasm.github.io/docs/wasm-bindgen/

