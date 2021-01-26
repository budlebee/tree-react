import React from 'react'
import { Route, Switch } from 'react-router-dom'

import TechtreeListPage from './pages/TechtreeListPage'
import TechtreeDetailPage from './pages/TechtreeDetailPage'
import UserInfoPage from './pages/UserInfoPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Switch>
      <Route path="/" exact={true} component={TechtreeListPage} />
      <Route path="/techtree/:techtreeID" component={TechtreeDetailPage} />
      <Route path="/user/:userID" component={UserInfoPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}
