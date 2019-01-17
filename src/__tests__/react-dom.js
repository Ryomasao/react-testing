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
  const {getByLabelText, getByTestId, getByText} = render(<SimpleComponent />)
  const input = getByLabelText(/age/i)
  const button = getByText('push')

  fireEvent(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  fireEvent.change(input, {
    target: {value: 11},
  })

  expect(input).toHaveAttribute('type', 'number')

  expect(getByTestId('error-message')).toBeInTheDocument()
})
