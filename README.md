# dsh-pet-lan

DSH 插件：在 DSH 启动时拉起桌面宠物小窗（Electron），退出 DSH 时关掉它。

这是一个**启动器**，不包含桌宠本体和图片素材。本体是一个独立的 Electron 应用，默认放在 `D:\dsh-home\pet-lan`；本仓库只负责找到 Electron 并把应用拉起来。

## 行为

- 插件加载时检查 `APP_DIR` 是否存在；不存在就安静跳过。
- Electron 按以下顺序查找：
  1. 环境变量 `DSH_PET_ELECTRON_PATH`
  2. `D:\dsh-home\electron\electron.exe`
  3. `<DSH_HOME>/electron/electron.exe`
- 用 `spawn(electron, [APP_DIR])` 启动，`stdio: "ignore"`，不阻塞 DSH。
- 插件卸载/DSH 退出时 `child.kill()`。

## 路径约定

`lib/index.js` 顶部的 `APP_DIR` 写死为 `D:\dsh-home\pet-lan`。换机器时改这一行，或把应用放到同一路径。

## 安装

把本目录作为 DSH bundle 安装到 profile，`cordis.patch.yml` 注册后生效。

## License

MIT
