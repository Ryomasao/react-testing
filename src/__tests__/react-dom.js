import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import SimpleComponent from '../SimpleComponent'

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
  const {getByLabelText, getByTestId, queryByTestId, rerender} = render(
    <SimpleComponent />,
  )
  const input = getByLabelText(/age/i)

  fireEvent.change(input, {
    target: {value: 11},
  })

  expect(input).toHaveAttribute('type', 'number')
  expect(getByTestId('error-message')).toBeInTheDocument()
  // プロパティを変更して再描画
  rerender(<SimpleComponent max={11} />)
  // エラーメッセージが表示されなこと
  // 対象のエレメントが存在しないことを確認する際は、queryByを使う。
  // getByは、見つからない場合にエラーをthrowするため
  expect(queryByTestId('error-message')).toBeNull()
})
