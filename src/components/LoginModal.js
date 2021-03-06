import React, { useCallback, useState } from 'react'
//import '../../styles/layout/LoginModal.scss'

import { emailLogin, emailSignUp } from '../redux/auth'
import { useDispatch } from 'react-redux'

export const LoginModal = React.memo(({ labelFor }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [nickname, setNickname] = useState()
  const [isSignUp, setIsSignUp] = useState(false)

  // 굉장히 fancy한 방법인데 콘솔창이 경고를 띄운다..
  //const onChange = (e) => {
  //  const {
  //    target: { name, value },
  //  } = e
  //  if (name === 'email') {
  //    setEmail(value)
  //  } else if (name === 'password') {
  //    setPassword(value)
  //  }
  //}

  const onChangeEmail = useCallback(
    (e) => {
      setEmail(e.target.value)
    },
    [email]
  )

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value)
    },
    [password]
  )

  const onChangeNickname = useCallback(
    (e) => {
      setNickname(e.target.value)
    },
    [nickname]
  )

  const onEmailLogin = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(emailLogin(email, password))
    },
    [dispatch, email, password]
  )

  const onEmailSignUp = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(emailSignUp(email, password, nickname))
    },
    [dispatch, email, password, nickname]
  )

  return (
    <>
      <div className="login-modal">
        <div className="login-modal-display">
          <label className="login-modal-close-btn" htmlFor={labelFor} />

          <div className="login-modal-display-logo">Login</div>
          <div className="login-modal-display-body">
            <form name="devguru-auth" className="login-form" autoComplete="off">
              <input
                id="login-id-input"
                className="login-input"
                type="email"
                placeholder="Enter Login Email"
                required
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
              <input
                id="login-pw-input"
                className="login-input"
                type="password"
                placeholder="Enter Password"
                required
                name="password"
                value={password}
                onChange={onChangePassword}
              />
              {isSignUp ? (
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter Nickname"
                  required
                  name="nickname"
                  value={nickname}
                  onChange={onChangeNickname}
                />
              ) : (
                ''
              )}

              {isSignUp ? (
                <button className="login-submit" onClick={onEmailSignUp}>
                  Sign Up
                </button>
              ) : (
                <>
                  {' '}
                  <button className="login-submit" onClick={onEmailLogin}>
                    Login
                  </button>
                  <button
                    className="login-submit"
                    onClick={() => {
                      setIsSignUp(true)
                    }}
                  >
                    Sign Up?
                  </button>
                </>
              )}

              <div className="auth-help">
                <div className="auth-help-element">
                  <input id="rememberUser" type="radio" name="Remember Me" />
                  <label htmlFor="rememberUser"> Remember Me</label>
                </div>
                <div className="auth-help-element">Forgot ID/PW?</div>
              </div>
              <div className="authProviders">
                <div>Google</div>
                <div>Facebook</div>
                <div>Github</div>
              </div>
            </form>
          </div>
        </div>
        <label className="login-modal-close-area" htmlFor={labelFor} />
      </div>
    </>
  )
})
