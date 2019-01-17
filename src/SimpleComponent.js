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
