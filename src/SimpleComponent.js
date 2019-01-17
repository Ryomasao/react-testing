import React from 'react'

class SimpleComponent extends React.Component {
  // おお、こういう書き方ができるんだ
  static defaultProps = {max: 10}

  state = {age: 0, touched: false}

  handleChage = e => {
    this.setState({age: e.target.value, touched: true})
  }

  render() {
    // validationの値をpropsから設定する
    const {max} = this.props
    const isValid = !this.state.touched || this.state.age <= max

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
