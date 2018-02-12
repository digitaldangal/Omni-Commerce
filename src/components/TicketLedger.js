import React, { Component } from 'react'
import { updateTransactionWithSubdocRemoval } from '../actions/tickets-transactions'
import { connect } from 'react-redux'
import AddCustomAddonForm from './AddCustomAddonForm'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { activeTicket } = state.ticketTrackingReducer
	return { activeTicket, token }

}

class TicketLedger extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showAddonScreen: false
		}
	this.handleAddonRequest = this.handleAddonRequest.bind(this)
	}

	pullItemFromTicketItemsArray(token, item_Id, activeTicket_Id) {
		const { dispatch } = this.props
		console.log("Triggering request to pull out of Subdoc Array")
		console.log("Item ID:")
		console.log(item_Id)
		console.log("Transaction ID:")
		console.log(activeTicket_Id)
		dispatch(updateTransactionWithSubdocRemoval(token, item_Id, activeTicket_Id))
	}
	handleAddonRequest() {
		this.setState({showAddonScreen: true})
	}
	generateLedgerFromActiveTicket() {
		const { activeTicket, token } = this.props
		// Add unique option to only return Addon button on LAST element of the array
		return activeTicket.items.map((item, index, array) => {
			if (index == array.length - 1) {
				return (
					<tr key={item._id}>
					 <td><button onClick={this.pullItemFromTicketItemsArray.bind(this, token, item._id, activeTicket._id)}>Remove</button></td>
					 <td><button onClick={this.handleAddonRequest}>AddOn</button></td>
					 <td>{item.itemName}</td>
					 <td>${item.itemPrice}</td>
					</tr>
					)
			}
			return(
				<tr key={item._id}>
				 <td><button onClick={this.pullItemFromTicketItemsArray.bind(this, token, item._id, activeTicket._id)}>Remove</button></td>
				 <td></td>
				 <td>{item.itemName}</td>
				 <td>${item.itemPrice}</td>
				</tr>
			)
		})
	}
	displayPricingFromActiveTicket() {
		const { activeTicket } = this.props
		return(
		 <tfoot> 
		  <tr>
		   <td colSpan="3">SubTotal</td>
		   <td>${activeTicket.subTotal}</td>
		  </tr>
		  <tr>
		   <td colSpan="3">Tax</td>
		   <td>${activeTicket.tax}</td>
		  </tr>
		  <tr>
		   <td colSpan="3">Total</td>
		   <td>${activeTicket.total}</td>
		  </tr>
		  <tr>
		   <td colSpan="3">Discount</td>
		   <td>$0.00</td>
		  </tr>
		  </tfoot>
		  )
	}

	render() {
		const { activeTicket } = this.props
		console.log(activeTicket)
		return(
		<div className="Table-Ledger-Component-Wrapper">
		<table>
		 <thead>
		  <tr>
		   <th scope="col"> Remove </th>
		   <th scope="col"> Addon </th>
		   <th scope="col"> Item </th>
		   <th scope="col"> Price </th>
		  </tr>
		 </thead>
		 <tbody>
			{activeTicket && this.generateLedgerFromActiveTicket()}		 
		 </tbody>
			{activeTicket && this.displayPricingFromActiveTicket()}
		</table>
		{this.state.showAddonScreen && <AddCustomAddonForm/>}
		</div>
		)
	}
}

export default connect(mapStateToProps)(TicketLedger)