//import { authService, firebaseInstance } from '../lib/firebase'
//import axios from 'axios'

// define ACTION type
const LOG_IN_TRY = 'auth/LOG_IN_TRY'
const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS'
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL'

const LOG_OUT_TRY = 'auth/LOG_OUT_TRY'
const LOG_OUT_SUCCESS = 'auth/LOG_OUT_SUCCESS'
const LOG_OUT_FAIL = 'auth/LOG_OUT_FAIL'

const CREATE_USER_TRY = 'auth/CREATE_USER_TRY'
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS'
const CREATE_USER_FAIL = 'auth/CREATE_USER_FAIL'

const GET_USER_TRY = 'auth/GET_USER_TRY'
const GET_USER_SUCCESS = 'auth/GET_USER_SUCCESS'
const GET_USER_FAIL = 'auth/GET_USER_FAIL'

const CHECK_AUTH = 'auth/CHECK_AUTH'

const initialState = {
  loginState: false,
  userID: '000000000000000000000000',
  userNickname: '익명',
  loading: false,
}

//const session_login = () => {
//  authService.currentUser
//    .getIdToken(/* forceRefresh */ true)
//    .then((idToken) => {
//      axios({
//        url: `${process.env.REACT_APP_BACKEND_URL}/login/sessionLogin`,
//        method: 'POST',
//        data: {
//          firebaseToken: idToken,
//          //crsfToken : crsfToekn
//        },
//        withCredentials: true,
//      })
//    })
//    .catch((e) => {
//      console.log('getIdToken 오류', e)
//    })
//}
//
//const session_signup = (userNickname) => {
//  authService.currentUser
//    .getIdToken(true)
//    .then((idToken) => {
//      axios({
//        url: `${process.env.REACT_APP_BACKEND_URL}/login/account`,
//        method: 'POST',
//        data: {
//          firebaseToken: idToken,
//          displayName: userNickname,
//        },
//        withCredentials: true,
//      })
//      console.log('사용자가 전송한 닉네임:', userNickname)
//    })
//    .catch((e) => {
//      console.log('getIdToken 오류', e)
//    })
//}

export const checkAuth = (user) => {
  if (user) {
    return {
      type: CHECK_AUTH,
      loginState: true,
      nickname: `${user.displayName}`,
      userID: user.uid,
    }
  } else {
    return {
      type: CHECK_AUTH,
      loginState: false,
      userID: '000000000000000000000000',
      nickname: '익명',
    }
  }
}

export const emailLogin = (email, password) => async (dispatch) => {
  dispatch({ type: LOG_IN_TRY })
  try {
    //await authService.signInWithEmailAndPassword(email, password).then(() => {
    //  dispatch({ type: LOG_IN_SUCCESS })
    //
    //})
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: LOG_IN_FAIL })
    alert(e)
  }
}

export const emailSignUp = (email, password, userNickname) => async (
  dispatch
) => {
  dispatch({ type: CREATE_USER_TRY })
  try {
    //await authService
    //  .createUserWithEmailAndPassword(email, password)
    //  .then(() => {
    //    session_signup(userNickname)
    //    console.log('사용자가 전송한 닉네임:', userNickname)
    //  })
    //dispatch({ type: CREATE_USER_SUCCESS, userNickname: userNickname })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_USER_FAIL })
    alert(e)
  }
}

export const logout = () => async (dispatch) => {
  dispatch({ type: LOG_OUT_TRY })

  try {
    // axios({
    //   url: `${process.env.REACT_APP_BACKEND_URL}/login/sessionLogout`,
    //   method: 'GET',
    // })
    // authService.signOut()
    //
    // dispatch({ type: LOG_OUT_SUCCESS })
  } catch (e) {
    dispatch({ type: LOG_OUT_FAIL })
    console.log('error: ', e)
  }
}

export const getUserInfo = () => async (dispatch) => {
  dispatch({ type: GET_USER_TRY })
  try {
    //  const res = await axios.get(
    //    `${process.env.REACT_APP_BACKEND_URL}/login/profile`,
    //    { withCredentials: true }
    //  )
    //  dispatch({ type: GET_USER_SUCCESS, userData: { ...res.data } })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: GET_USER_FAIL, error: e })
  }
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOG_IN_TRY:
      return {
        ...state,
        loading: true,
      }
    case LOG_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginState: true,
      }
    case LOG_IN_FAIL:
      return {
        ...state,
        loading: false,
        loginState: false,
      }
    case CREATE_USER_TRY:
      return {
        ...state,
        loading: true,
      }
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loginState: true,
        userNickname: action.userNickname,
      }
    case CREATE_USER_FAIL:
      return {
        ...state,
        loading: false,
      }
    case LOG_OUT_TRY:
      return {
        ...state,
        loading: true,
      }
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        loading: false,
        loginState: false,
        userID: '000000000000000000000000',
        userNickname: '익명',
      }
    case LOG_OUT_FAIL:
      return {
        ...state,
        loading: false,
      }
    case GET_USER_TRY:
      return {
        ...state,
        loading: true,
      }
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.userData,
      }
    case GET_USER_FAIL:
      return {
        ...state,
        loading: false,
      }
    case CHECK_AUTH:
      return {
        ...state,
        loginState: action.loginState,
        userNickname: action.userNickname,
        userID: action.userID,
      }
    default:
      return state
  }
}
