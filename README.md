## Problem
Q: 为什么 `import Didact from "./index"` 在编译过程中被移除  
A: @babel/preset-typescript 处理时，把未使用变量 Didact 当成 type 处理了。加上配置项 `{"pragma": "Didact.createElement"}` 即可

Q: jest 测试跨模块共享闭包变量时有bug, 测试render发生错误
A: 暂时使用 parcel 直接跑项目测试

Q: 为什么使用 合成事件？