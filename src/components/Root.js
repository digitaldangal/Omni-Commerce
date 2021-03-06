import React, { Component } from 'react'
import { compose, createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/reducers'



import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import OnlineMerchantRegistrationForm from './OnlineMerchantRegistrationForm'
import Terminal from './Terminal'
import OnlineMerchantDashboard from './OnlineMerchantDashboard'
import AdminTerminal from './AdminTerminal'
import MyStoreHomepage from './MyStoreHomepage'
import TerminalActionScreenMockup from './TerminalActionScreenMockup'
import PurchaseOrderViewScreen from './PurchaseOrderViewScreen'
import ShippingOrderViewScreen from './ShippingOrderViewScreen'
import Splash from './Splash'

import CardMockup from './CardMockup'


const loggerMiddleware = createLogger()
const history = createHistory()


const store = createStore(
	rootReducer,

	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware,
		routerMiddleware(history)
	)

)

export default class Root extends Component {
	render() {
		return (
<Provider store={store}>
	<ConnectedRouter history={history}>
		<Switch>
				<Redirect exact="true" from="/" to="/login"/>
				<Route path="/splash" component={Splash} />
				<Route exact path="/login" component={LoginForm} />
				<Route path="/terminal" component={Terminal} />
				<Route path="/marketplaceDashboard" component={OnlineMerchantDashboard} />
				<Route exact path="/ticket" component={TerminalActionScreenMockup} />
				<Route path="/register_business_organization" component={RegisterForm} />
				<Route path="/register_merchant" component={OnlineMerchantRegistrationForm} />
				<Route path="/admin" component={AdminTerminal} />
				<Route path="/marketplace_landing" component={MyStoreHomepage} />
				<Route path="/marketplace/purchase_orders" component={PurchaseOrderViewScreen} />
				<Route path="/marketplace/sell_orders" component={ShippingOrderViewScreen} />
				<Route path="/cardMockup" component={CardMockup} />

		</Switch>
	</ConnectedRouter>
</Provider>
		)
	}
}


