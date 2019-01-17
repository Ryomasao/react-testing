import 'jest-dom/extend-expect'
import React from 'react'
import ReactDOM from 'react-dom'
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
  const div = document.createElement('div')
  ReactDOM.render(<SimpleComponent />, div)
  expect(div.querySelector('input')).toHaveAttribute('type', 'number')
  expect(div.querySelector('label')).toHaveTextContent('Hello')
})
