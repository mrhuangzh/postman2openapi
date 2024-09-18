<template>
    <div class="container">
        <div class="side left-side">
            <button @click="uploadFile">上传文件</button>
            <textarea v-model="leftInput"></textarea>
        </div>
        <div class="side right-side">
            <div class="options-row">
                <select v-model="addReadOnly">
                    <option value="False">不添加只读</option>
                    <option value="True">添加只读</option>
                </select>
                <select v-model="addRequired">
                    <option value="False">不添加必需</option>
                    <option value="True">添加必需</option>
                </select>
            </div>
            <button @click="convertContent">转换</button>
            <button @click="downloadFile">下载</button>
            <textarea v-model="rightInput"></textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import init, { transpile } from "postman2openapi-anban"

export default defineComponent({
    setup() {
        const leftInput = ref<string>('');
        const rightInput = ref<string>('');
        const wasmInitialized = ref<boolean>(false);
        const addReadOnly = ref<string>('False');
        const addRequired = ref<string>('True');

        // Initialize the Wasm module
        init().then(() => {
            wasmInitialized.value = true;
        }).catch(error => {
            console.error("Failed to initialize WebAssembly module:", error);
        });

        const uploadFile = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.json';
            input.onchange = (event: Event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        leftInput.value = e.target?.result as string;
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        };

        const convertContent = () => {
            if (!wasmInitialized.value) {
                console.error("WebAssembly module is not yet initialized.");
                return;
            }
            const options = {
                format: "Json",
                add_read_only: addReadOnly.value,  // 使用页面选择的值
                add_required: addRequired.value  // 使用页面选择的值
            };
            const optionsString = JSON.stringify(options);
            const collection = JSON.parse(leftInput.value);
            try {
                // transpile("{}", "{}");
                const openapi = transpile(collection, optionsString);
                const jsonString = JSON.stringify(openapi, null, 2);
                // const jsonString = JSON.stringify(options, null, 2);
                if (jsonString) {
                    rightInput.value = jsonString;
                }
            } catch (error) {
                console.error("Error transpiling Postman collection:", error);
            }
        };

        const downloadFile = () => {
            const blob = new Blob([rightInput.value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'openapi.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        return {
            leftInput,
            rightInput,
            uploadFile,
            convertContent,
            downloadFile,
            addReadOnly,
            addRequired
        };
    }
});
</script>

<style scoped>
.container {
    display: flex;
    height: 100vh;
    width: 100vh;
}

.side {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.options-row {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}

button {
    flex-shrink: 0;
    margin: 10px;
}

textarea {
    flex-grow: 1;
    width: calc(100% - 20px);
    margin: 0 10px;
    resize: none;
    font-size: 14px;
}

select {
    width: 48%;
    margin-right: 10px;
}
</style>