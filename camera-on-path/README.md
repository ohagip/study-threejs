# Camera on path

コードベースでカメラ移動のパスを生成する検証

## 参考サイト
- [three.js- spline extrusion examples](https://threejs.org/examples/#webgl_geometry_extrude_splines)
- [Three.js camera on path](https://discourse.threejs.org/t/three-js-camera-on-path/21554)

## パスとなる曲線を作成
`THREE.CatmullRomCurve3` を利用して曲線を作成
```JS
// 曲線を生成するためのポジション
const points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 0, 1),
  new THREE.Vector3(2, 0, -1),
  ...
]
// 曲線のインスタンス作成
const curve = new THREE.CatmullRomCurve3(positions)

// 曲線上のポジションを取得
const position = curve.getPointAt(0.5) // range: 0〜1
```

カメラの位置と回転に反映
```JS
const cameraPosition = curve.getPointAt(0.5 % 1)
const lookPosition = curve.getPointAt((0.5 + 0.01) % 1) // 現在の位置より少し前に向かせる
camera.position.copy(cameraPosition)
camera.lookAt(lookPosition)
```

## メモ
- `TransformControls` と組み合わせたら画面上でパスの調整ができそう
- 向きの調整が現在位置より少し前など簡単な指定はできるが、特定の位置で特定の向きにする場合は大変そう
  曲線上の回転情報がほしくなる、Blenderなどでカメラの移動と回転情報を作った方がよさそう
