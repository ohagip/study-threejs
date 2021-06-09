# Tweakpane Tips
Tweakpaneでよく使うThree.jsのパラメータ調整

- [Tweakpane](https://cocopon.github.io/tweakpane/)
- [Demo](https://ohagip.github.io/study-threejs/tweakpane/)

## 初期化
```shell
npm install tweakpane
```
```js
import { Pane } from 'tweakpane'
const pane = new Pane()
```

## パラメータの調整

### Number
範囲やステップの設定が便利
```js
const params = { speed: 0.01 }
pane.addInput(params, 'speed', {
    min: 0,
    max: 0.1,
    step: 0.01,
})
```

### Boolean
```js
pane.addInput(mesh, 'visible')
```

### Color（Color, Event）
カラーは直接変更できないのでTweakpaneのイベントを利用  
カラーの値はいろんな型で設定できるがこの方法が簡単
```js
const params = { color: '#ff0000' }
pane.addInput(params, 'color')
  .on('change', (ev) => {
    material.color.set(ev.value)
  })
```

### Vector3（Point 3D）
Vector2, Vector4も利用できる
```js
pane.addInput(camera, 'position', {
  x: { min: -30, max: 30, step: 0.1 },
  y: { min: -30, max: 30, step: 0.1 },
  z: { min: 3, max: 30, step: 0.1 },
})
```

### Texture（Button, Event）
Buttonのclickイベントで任意の処理を実行できるので  
そちらを利用してファイル選択、Texture作成を行っている  
一連の処理をプラグイン化するのもよさそう  
[プラグイン作成のテンプレート](https://github.com/tweakpane/plugin-template)
```js
const inputElm = document.createElement('input')
inputElm.setAttribute('type', 'file')
inputElm.setAttribute('accept', 'image/png, image/jpeg')
inputElm.addEventListener('change', (e) => {
  // file読み込み
  const reader = new FileReader()
  reader.onload = (e) => {
    const imgElem = document.createElement('img')
    imgElem.onload = () => {
      // Texture設定
      const texture = new THREE.Texture(imgElem)
      texture.needsUpdate = true
      material.map = texture
      material.needsUpdate = true
    }
    imgElem.src = e.target.result
  }
  reader.readAsDataURL(inputElm.files[0])
})
// pane設定
pane
  .addButton({
    label: 'Texture',
    title: 'file',
  })
  .on('click', () => {
    inputElm.click()
  })
```

## Export
変更したパラメータをExportする  
Exportと同時にクリップボードにコピー、Slackに送信機能もよさそう
```js
const consoleParams = {
  console: '',
}
const exportPane = pane.addFolder({
  title: 'Export'
})
const monitor = exportPane.addMonitor(consoleParams, 'console', {
  multiline: true,
})
const monitorTextareaElm = monitor.controller_.view.valueElement.querySelector('textarea')
monitorTextareaElm.removeAttribute('readonly') // 選択してコピーできるように
exportPane.addButton({ title: 'Export' })
  .on('click', () => {
    const preset = pane.exportPreset()
    consoleParams.console = JSON.stringify(preset, null, 2)
  })
```

## その他
[公式のTips](https://cocopon.github.io/tweakpane/misc.html#tips)
- ラベルの変更
- `Folder` `Tab` `Separator` を利用して見やすく整理できる
