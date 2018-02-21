import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Button, Segment, Message } from 'semantic-ui-react'

import { postItemToMarketplace } from '../actions/marketplaces'

// Should be a form that uses the authroken to route to Client's Marketplace - upload a new item via a POST request

function mapStateToProps(state) {
	const { token } = state.authReducer;
	return { token }
}

class AddMarketplaceItemForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName: '',
			itemPrice: '',
			imageURL: '',
			numberInStock: 1,
			
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(input, value) {
		this.setState({
			[input]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		const { dispatch, token } = this.props
		dispatch(postItemToMarketplace(token, this.state))

	}

	render() {
		return(
			<Form onSubmit={this.handleSubmit} >
				<Segment raised>
					<Message> 
						Create a descriptive name for your item listing
							<Form.Input
								fluid
								placeholder="Item Name"
								type='text'
								value={this.state.itemName}
								onChange={(e) => this.handleChange('itemName', e.target.value)} 
							/>
					</Message>
					<Message>
						Price your item
						<Form.Input
							fluid
							placeholder="Item Price"
							type='text'
							value={this.state.itemPrice}
							onChange={e => this.handleChange('itemPrice', e.target.value)}
						/>
					</Message>
					<Message>
						Please upload an image to be shown when users look at your listing
						<Form.Input
							fluid
							placeholder="URL"
							type='text'
							value={this.state.imageURL} 
							onChange={e => this.handleChange('imageURL', e.target.value)} 
						/>
					</Message>
					<Message>
						TODO: Add support for TAGS! 
					</Message>
					<Message>
						Quantity to stock (Default is one item)
						<Form.Input
							fluid
							placeholder="# In Stock"
							type='number'
							value={this.state.numberInStock} 
							onChange={e => this.handleChange('numberInStock', e.target.value)}
						/>
					</Message>
					<Form.Button fluid size='large' content='Submit'>Add Item To My Marketplace</Form.Button>
				</Segment>
			</Form>
		)

	}
}

export default connect(mapStateToProps)(AddMarketplaceItemForm)

/*

	itemName: String,
	itemPrice: Number,
	mongoCollectionKey: String,
	imageURL: String, 
	category: String, // Consider consolidating with tags
	options: [String],
	tags: [String],
	numberInStock: Number,
	status: String, // inStock/ outOfStock
	sellerRef_Id: {type: Schema.Types.ObjectId, ref: 'Client'}
	marketplaceRef_Id: {type: Schema.Types.ObjectId, ref: 'Marketplace'}

	*/