### jest とは

テストランナー、アサーション、モックの機能がまるっと入ったテストフレームワーク。
過去に Vue.js のテストを書いてみたときは、

mocha：テストランナ
expect：アサーション

という、それぞれのライブラリを入れてやってみたんだけど、jest はまるっと入ってるってイメージなのかな。

### 簡単なセットアップをかくー

--verbose をつけないと watch モードで console.log がでない気がする。

### まずは、React をおいていて

```javascript
test('Basic javascript', () => {
  // DOMノードをつくる
  const div = document.createElement('div')
  const p = document.createElement('p')
  div.appendChild(p)
  const content = document.createTextNode('Hello')
  p.appendChild(content)

  // HTMLにしてみる
  console.log(div.outerHTML)
})
```

<b>結果</b

```sh
<div><label>Hello</label><input type="number"></div>
```

見にくいけど、こんな感じの HTML が出力された。
試しに、アサーションをつくってテストらしいことをしてみる。

```javascript
test('Basic javascript', () => {
  const div = document.createElement('div')
  const input = document.createElement('input')
  const label = document.createElement('label')
  const content = document.createTextNode('Hello')
  div.appendChild(label)
  div.appendChild(input)
  input.setAttribute('type', 'number')
  label.appendChild(content)

  // divノードからinutタグをとってきて、inputのタイプがnumberであること
  expect(div.querySelector('input').type).toBe('number')
  // divノードからlabelタグをとってきて、中のテキストが'Hello'であること
  expect(div.querySelector('label').textContent).toBe('Hello')
})
```

緑色の PASS の文字が表示され、無事テストが通ったことが確認できた！
ここまではプレーンな javascript と jest だけの世界。

### React の世界へ

まずはテスト対象となる React のコンポーネント`SimpleComponent`をつくる。
さきほどの createElement でつくったもの似たようなものをレンダリングするだけのもの。

<b>SimpleComponent.js</b>
'''javascript
import React from 'react'

class SimpleComponent extends React.Component {
render() {
return (

<div>
<label>Hello</label>
<input type="number"/>
</div>
)
}
}

export default SimpleComponent
'''

<br>

そしたら、テスト側にコンポーネントと React を import して、以下のように ReacDOM.render をしてみる。

<b>simple-test.js</b>
'''javascript
import React from 'react'
import ReactDOM from 'react-dom'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
const div = document.createElement('div')
ReactDOM.render(<SimpleComponent />, div)
console.log(div.outerHTML)
})
'''

<br>

おお、なんということだろう。
以下のように、createElement でつくった DOM ノードと同じものがつくられ、以下のような HTML が吐かれることがわかる。
当たり前のようにやっていた ReactDOM.render だったけど、コンソールログで出してみると、凄さを感じる。

<b>結果</b

```sh
<div><label>Hello</label><input type="number"></div>
```

<br>

さきほどと同じように、アサーションをいれてみも、うまくいくことがわかる。

<b>simple-test.js</b>
'''javascript
import React from 'react'
import ReactDOM from 'react-dom'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
const div = document.createElement('div')
ReactDOM.render(<SimpleComponent />, div)
expect(div.querySelector('input').type).toBe('number')
expect(div.querySelector('label').textContent).toBe('Hello')
})
'''

<br>

おおーん、すげえ！となったとこで、便利なテストマッチャーを紹介するぜ！

https://www.npmjs.com/package/jest-dom

<br>

#### jest-dom

あんまよくわかってないのですが、  
Element.type とか、Element.textContent で確認したい要素をよってきて、toBe とがで毎回比較すんのめんどくせえよ！
だったりを解決するためのものみたい？

さっそくつかってみます。

<b>simple-test.js</b>
'''javascript
import 'jest-dom/extend-expect'
import React from 'react'
import ReactDOM from 'react-dom'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
const div = document.createElement('div')
ReactDOM.render(<SimpleComponent />, div)
// 置き換えた
expect(div.querySelector('input')).toHaveAttribute('type', 'number')
expect(div.querySelector('label')).toHaveTextContent('Hello')
})
'''

<br>

チェック内容はさきほどと同じですが、`toHaveAttribute`など、なにをチェックしているのかわかりやすいですね。
