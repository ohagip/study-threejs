# glTF Draco

- [Draco](https://github.com/google/draco)
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
- [Demo](https://ohagip.github.io/study-threejs/gltf-draco/)

## 初期化
```shell
npm i -D gltf-pipeline
```

## 圧縮方法
```shell
npx gltf-pipeline -i model.gltf -o model-draco.glb -s -d --draco.compressionLevel 10
```
glbファイルにbuffersを含めるより、binファイルに分けた方が軽い

|オプション|説明|
|----------|----|
|`-i`|入力モデルデータ|
|`-o`|出力モデルデータ|
|`-s`|buffersを別ファイルにする（.bin）|
|`-d`|Draco圧縮する|
|`--draco.compressionLevel`|圧縮レベル（デフォルト 7）|
[その他オプション](https://github.com/CesiumGS/gltf-pipeline#command-line-flags)

JavaScriptでも利用することもできるのでモデル数が多かったり更新頻度が高い場合は  
スクリプトを組んでnpm run scriptsから実行した方が楽かも  

### ファイル容量
[検証に使用したモデルデータ](https://sketchfab.com/3d-models/adam-head-a7d347b738c041579a8790f539fe0d8f)


| |圧縮前|圧縮後|
|---|------|------|
|gltf/glb|117KB|118KB|
|bin|2500KB|766KB|
|合計|2617KB|884KB|
1733KB軽くなった

## 解凍方法
解凍に必要なファイルを適当なディレクトリにコピー  
`./node_modules/three/examples/js/libs/draco/`
- draco_wasm_wrapper.js（754KB）
- draco_decoder.wasm（281KB）
- draco_decoder.js（754KB）wasmが利用できない場合

```js
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/') // コピーしたディレクトリを指定
dracoLoader.preload()

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader) // dracoLoaderをセット
gltfLoader.load('./model-draco.glb', (gltf) => {
    scene.add(gltf.scene)
})
```

## その他
圧縮はメッシュ情報（頂点, 座標, UV, color, normals, 属性など）のみ、  
テクスチャやアニメーションなどは圧縮されない

### Draco圧縮すべきか
- モデルデータの容量が少ないとき・数が少ないときは圧縮するか要検討
    - Dracoを解凍するためのファイル容量 335KB（2ファイル）
    - Dracoの解凍処理に時間と負荷がかかる（プチフリーズする可能性あり）
- モデルデータがglTFで支給されない場合
    - コンバートが簡単にできるなら圧縮する
    - コンバートエラー・一部データ欠損など手間取る場合は圧縮しない

### FBXからglTFへのコンバート
- FBX2glTF: モデルデータの容量が大きいときにエラーが発生してコンバートできなかった
- Blenderで書き出し: モデルデータの容量が大きいときにエラーが発生してコンバートできなかった（Blenderが落ちる...）
