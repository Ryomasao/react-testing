import React from 'react'

class SimpleComponent extends React.Component {
  state = {age: 0, touched: false, clicled: false}

  handleChage = e => {
    this.setState({age: e.target.value, touched: true})
  }

  handleButtonClick = () => {
    this.setState({clicled: true})
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
        <button onClick={this.handleButtonClick}>push</button>
        {isValid ? null : <div data-testid="error-message">Error!!!!</div>}
        {this.state.clicled ? <div>yes</div> : null}
      </div>
    )
  }
}

export default SimpleComponent
