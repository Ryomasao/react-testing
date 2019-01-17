# 読む記事

https://blog.kentcdodds.com/what-code-comments-can-teach-us-about-scaling-a-codebase-90bbfad8d70d
https://www.youtube.com/watch?v=zGlnlP99aFk
https://blog.kentcdodds.com/why-i-never-use-shallow-rendering-c08851a68bb7

cypresss
cypress-library :E2E?

## 前回のコード

<b>SimpleComponent.js</b>

```javascript
import React from 'react'

class SimpleComponent extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor="my-number">Hello</label>
        <input id="my-number" type="number" name="my-number" />
      </div>
    )
  }
}

export default SimpleComponent
```

<b>simple-test.js</b>

```javascript
import 'jest-dom/extend-expect'
import React from 'react'
import ReactDOM from 'react-dom'
import {getQueriesForElement} from 'dom-testing-library'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
  const div = document.createElement('div')
  ReactDOM.render(<SimpleComponent />, div)

  // dom-testing-library のクエリを使えるようにする
  const {getByLabelText} = getQueriesForElement(div)

  // Hello という文字列をもつラベルに紐づいたコントロールを取得
  const input = getByLabelText('Hello')

  expect(input).toHaveAttribute('type', 'number')

  // このテストは、もういらない。input を取得できていることで担保できる。
  //expect(div.querySelector('label')).toHaveTextContent('Hello')
})
```

## dom-testing-library で使えるメソッドとメモ

細かい内容は、Github をみるとして、最低限の内容をここにかいとく。

- getByLabelText(TextMatch): TextMatch で指定した要素をもつ、label を検索して、紐づくコントロールを取得
- TextMatch は単純な string の他、正規表現や関数が

```javascript
const {getByLabelText} = getQueriesForElement(div)
// 正規表現の例
const input = getByLabelText(/hello/i)
```

なので、コントロールに紐づいたラベルの文字列を正規表現で取得するようにしとくと
ラベルの内容変えたらテスト通らなくなる、みたいなことがなくなる。
（いや、ラベルの内容が意図せずかわってたらだめじゃん!みたいな考え方もあるのかしら)

- getByTestId: テスト対象のコンポーネントの HTML に、date-testid="hogehoge"、みたいに書いといて、それを取得するやつ
  他のクエリが使えない場合でどうしようもない場合に使うべきものとのこと。
  ユーザーはそんな ID を意識しないから。
  ふと、class 名で取得すればいいのではと思っただけど、class かえたらテストがぶっこわれるからだめだよねということだった。

<br/>

## react-testing-library

dom-testing-library を使ってよし！となったところで、dom-testing-library をラップした、react-testing-library の登場です。

こちらを使うと、さきほどのテストコードをこんな感じに書くことができる。

<b>simple-test.js</b>

```javascript
import 'jest-dom/extend-expect'
import React from 'react'
// もう使わない
//import ReactDOM from 'react-dom'
//import { getQueriesForElement } from 'dom-testing-library'
import {render} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
  //react-testing-library を使うとこんな感じにできる
  const {getByLabelText} = render(<SimpleComponent />)
  // Hello という文字列をもつラベルに紐づいたコントロールを取得
  const input = getByLabelText(/hello/i)
  expect(input).toHaveAttribute('type', 'number')

  //debug
  console.log(document.documentElement.outerHTML)
})
```

<b>debug 結果</b>

```
 <html><head></head><body><div><div><label for="my-number">Hello</label><input id="my-number" type="number" name="my-number"></div></div></body></html>
```

### react-testing-library で使えるメソッドとメモ

## render

今までは、div 要素をつくって、ReactDOM.render で、div 配下にコンポーネントをつっこむようにしていたけど、render はデフォルト、body 要素直下にコンポーネントをつっこんで、ReactDOM.render をしてくれるっぽい。
オプションがいっぱいある。

<b>simple-test.js</b>

```javascript
import 'jest-dom/extend-expect'
import React from 'react'
import {render} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
  const {getByLabelText} = render(<SimpleComponent />)
  const input = getByLabelText(/hello/i)
  expect(input).toHaveAttribute('type', 'number')
  //debug
  console.log(document.documentElement.outerHTML)
})
```

### unmount , cleanup

こんな感じに、テストが二つあった場合、二つ目のテストで、HTML を確認してみると、一つ目の結果が残ってしまっていることがわかる。

<b>simple-test.js(抜粋)</b>

```javascript
test('render SimpleComponent', () => {
  const {getByLabelText} = render(<SimpleComponent />)
  const input = getByLabelText(/hello/i)
  expect(input).toHaveAttribute('type', 'number')
})

test('other test', () => {
  console.log('on other test', document.documentElement.outerHTML)
  // <html><head></head><body><div><div><label for="my-number"> ...が表示される
})
```

テストを独立したものにするために、テスト完了後には umount()をよんで綺麗にしとく必要がある。

<b>simple-test.js(抜粋)</b>

```javascript
test('render SimpleComponent', () => {
  const {getByLabelText, unmount, container} = render(<SimpleComponent />)
  const input = getByLabelText(/hello/i)
  expect(input).toHaveAttribute('type', 'number')

  //きれいにしとく
  console.log('before', document.documentElement.outerHTML)
  unmount()
  console.log('after umount', document.documentElement.outerHTML)
  //あとコンポーネントをラップする div 要素も消す
  container.parentElement.removeChild(container)
  console.log('after remove', document.documentElement.outerHTML)
})

test('other test', () => {
  console.log('on other test', document.documentElement.outerHTML)
})
```

それぞれのログは以下の通り

```
before <html><head></head><body><div><div><label for="my-number">Hello</label><input id="my-number" type="number" name="my-number"></div></div></body></html>

after umount <html><head></head><body><div></div></body></html>
after remove <html><head></head><body></body></html>
on other test <html><head></head><body></body></html>
```

この umount()から、remove()一連の流れを、一回でやってくれる cleanup というものがある。
使う場合は、各テストで書くというより、各テスト完了後にやってほしいことを書く、'afterEach'に書くといい。

<b>simple-test.js(抜粋)</b>

```javascript
import 'jest-dom/extend-expect'
import React from 'react'
import {render, cleanup} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

// コンポーネントをテスト完了後にけす
afterEach(cleanup)
// 以降省略
```

<br>

なんならこれでもいいみたい。

<b>simple-test.js(抜粋)</b>

```javascript
import 'jest-dom/extend-expect'
//afterEachさえもかかない
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

// コンポーネントをテスト完了後にけす
//afterEach(cleanup)
// 以降省略
```

### debug

デバッグ用

<b>simple-test.js(抜粋)</b>

```javascript
test('render SimpleComponent', () => {
  const {getByLabelText, debug} = render(<SimpleComponent />)
  const input = getByLabelText(/hello/i)
  debug(input)
  expect(input).toHaveAttribute('type', 'number')
})
```

こんな感じのものが出力される。

```
  <input
    id="my-number"
    name="my-number"
    type="number"
  />
```

<br/>
## イベントのテスト
イベントのテストに移る前に、`SimpleComponent`にinputのイベントを制御する処理を書く。
また、inputの値が10を超える場合は、エラーメッセージが表示される。

<b>機能を足した SimpleComponent</b>

```javascript
import React from 'react'

class SimpleComponent extends React.Component {
  state = {age: 0, touched: false}

  handleChage = e => {
    this.setState({age: e.target.value, touched: true})
  }

  render() {
    const isValid = !this.state.touched || this.state.age <= 10

    return (
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          name="age"
          value={this.state.age}
          onChange={this.handleChage}
        />
        {isValid ? null : <div data-testid="error-message">Error!!!!</div>}
      </div>
    )
  }
}

export default SimpleComponent
```

テストコードは至ってシンプル。

<b>simple-test.js</b>

```javascript
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

test('render SimpleComponent', () => {
  const {getByLabelText, getByTestId} = render(<SimpleComponent />)
  const input = getByLabelText(/age/i)
  const button = getByText('push')

  // fireEventをつかってイベントを発火させる。発火させた際のtarget.valueを設定してるのかな
  fireEvent.change(input, {
    target: {value: 11},
  })

  expect(input).toHaveAttribute('type', 'number')
  // エラーメッセージが表示されること
  expect(getByTestId('error-message')).toBeInTheDocument()
})
```

button をクリックしたときは以下のようにかける。

<b>button を足した SimpleComponent(抜粋)</b>

```javascript
  render() {
    return (
      <div>
        <button onClick={this.handleButtonClick}>push</button>
      </div>
    )
  }

export default SimpleComponent
```

<b>simple-test.js(抜粋)</b>

```javascript
test('render SimpleComponent', () => {
  const {getByText} = render(<SimpleComponent />)
  const button = getByText('push')

  fireEvent(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
})
```
