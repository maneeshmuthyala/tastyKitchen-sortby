import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="inpt"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="userName" className="label">
          USERNAME
        </label>
        <input
          type="text"
          id="userName"
          className="inpt"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="log-cont">
        <img
          src="https://res.cloudinary.com/dvmcsww2y/image/upload/v1721553555/Rectangle_1457_nn57af.png"
          className="web-log"
          alt="website logo"
        />
        <div className="log-sub">
          <div className="log-card">
            <img
              src="https://res.cloudinary.com/dvmcsww2y/image/upload/v1721553554/Frame_274_estkw0.png"
              className="web-logo"
              alt="website logo"
            />
            <p className="para">Tasty Kitchens</p>
            <h1 className="log-head">Login</h1>
            <form className="frm" onSubmit={this.submitForm}>
              <div>{this.renderUsernameField()}</div>
              <div>{this.renderPasswordField()}</div>
              <button type="submit" className="log-btn">
                Login
              </button>
              {showSubmitError && <p>{errorMsg}</p>}
            </form>
          </div>
        </div>
        <img
          src="https://res.cloudinary.com/dvmcsww2y/image/upload/v1721555793/Rectangle_1456_tfi2aj.png"
          className="hero-bg"
          alt="background"
        />
      </div>
    )
  }
}
export default LoginForm
