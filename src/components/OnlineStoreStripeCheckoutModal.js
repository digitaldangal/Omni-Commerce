import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import { Segment } from 'semantic-ui-react'
import OnlineStoreCheckout from './OnlineStoreCheckout'

import { hideModal } from '../actions/modals'
import { disregardInvalidatedItems } from '../actions/marketplaces'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	}
};

function mapStateToProps(state) {
	const { modalType } = state.modalReducer
	return { modalType }
}

class OnlineStoreStripeCheckoutModal extends Component {
	constructor(props){
		super(props);
		this.state = {}
		this.deactivateModal = this.deactivateModal.bind(this)
	}

	deactivateModal() {
		const { dispatch } = this.props
		dispatch(hideModal())
		dispatch(disregardInvalidatedItems())
	}

	render(){
		// This can be moved to the actual component's props instead of a redux connection to avoid perf hit

		const { modalType } = this.props
		
		return(
			<div>
				<Modal
					isOpen={modalType === 'ONLINE_STORE_STRIPE_CHECKOUT'}
					style={customStyles}
					contentLabel="Stripe Checkout Modal For Online Store"
				>
				<Segment style={{minWidth: '600px'}}>
					<OnlineStoreCheckout modalRemoval={this.deactivateModal}/>
					<button onClick={this.deactivateModal}> Cancel </button>
				</Segment>
				</Modal>
			</div>
		)

	}

}

export default connect(mapStateToProps)(OnlineStoreStripeCheckoutModal)