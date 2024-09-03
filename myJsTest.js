// fs 模块提供了文件系统的 API，用于读写文件
const fs = require('fs');

// 引入本地生成的模块
const { transpile } = require('./nodejs/postman2openapi');

// 加载 Postman collection JSON 文件
const collection = require("D:/ownerdata/feishu/yongli.postman_collection.json");

// 函数：检查字符串是否包含中文
function containsChinese(str) {
    return /[\u4e00-\u9fa5]/.test(str);
}

// 定义选项对象
const options = {
    format: "Json", // 根据需要定义
    add_read_only: "False",  // 传递的值必须与 Rust 中的枚举匹配
    add_required: "True"  // 传递的值必须与 Rust 中的枚举匹配
};
// 将选项对象转换为 JSON 字符串
const optionsString = JSON.stringify(options);

async function main() {
    const result = checkForChinese(collection);
    if (result) {
        console.log("不支持中文");
        return; // 退出函数，不再执行后续代码
    }
    try {
        // 调用 transpile 函数
        const openapi = transpile(collection, optionsString);
        // 输出生成的 OpenAPI 定义
        // console.log(JSON.stringify(openapi, null, 2));
        const jsonString = JSON.stringify(openapi, null, 2);
        // 写入文件
        fs.writeFileSync('result-openapi-js.json', jsonString, 'utf8');
    } catch (error) {
        console.error("Error transpiling Postman collection:", error);
    }
}

// 遍历 collection 中的所有字符串字段以检查是否包含中文
function checkForChinese(obj) {
    let hasChinese = false;
    function traverse(value) {
        if (typeof value === 'string') {
            if (containsChinese(value)) {
                hasChinese = true;
            }
        } else if (Array.isArray(value)) {
            value.forEach(traverse);
        } else if (typeof value === 'object') {
            Object.values(value).forEach(traverse);
        }
    }
    traverse(obj);
    return hasChinese;
}

main();

