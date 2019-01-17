import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

//afterEach(cleanup)

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

test('render SimpleComponent', () => {
  //react-testing-libraryを使うとこんな感じにできる
  const {getByLabelText, debug} = render(<SimpleComponent />)
  // Helloという文字列をもつラベルに紐づいたコントロールを取得
  const input = getByLabelText(/hello/i)
  debug(input)
  expect(input).toHaveAttribute('type', 'number')
})

test('other test', () => {
  console.log('on other test', document.documentElement.outerHTML)
})
