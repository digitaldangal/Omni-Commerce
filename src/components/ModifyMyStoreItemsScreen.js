import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, Image, Button, Icon } from 'semantic-ui-react'

import { showModal } from '../actions/modals'
import { retrieveItemById } from '../actions/marketplaces'
import blouseImage from '../assets/marketBlouse.jpg'

function mapStateToProps(state) {
	const { token } = state.authReducer
	const { marketplaceItems, currentMarketplaceItem } = state.marketplaceItemsReducer
	
	return { token, marketplaceItems, currentMarketplaceItem }
}

class ModifyMyStoreItemsScreen extends Component {
	constructor(props) {
		super(props)
		this.renderMarketplaceItems = this.renderMarketplaceItems.bind(this)
	}
	
	renderMarketplaceItems() {
		// Placeholder function to mock styling for real data to be retrieved from API
		const { marketplaceItems } = this.props
		return marketplaceItems.map(item => {
			return (<div className='cardContainer'>
						<Card >
							<Image src={blouseImage} />
							<Card.Content>
								<Card.Header> {item.itemName} </Card.Header>
								<Card.Meta> In-Stock: { item.numberInStock } </Card.Meta>
								<Card.Description> A classy top that is sure to turn heads! </Card.Description>
								<Card.Header> $ 16.99 </Card.Header>
							</Card.Content>
							<Card.Content extra>
								<Button color='black' onClick={this.dispatchModifyModal.bind(this, item._id)} > Modify Item  </Button>
							</Card.Content>
						</Card>
					</div>
					)

		})
	}
	
	dispatchModifyModal(itemId){
		const { dispatch } = this.props
		dispatch(retrieveItemById(itemId))
		dispatch(showModal('MODIFY_STORE_ITEM_FORM_MODAL', {}))
	}

	render() {
		const { marketplaceItems } = this.props
		// If the modal backdrop is not wide enough, we will have to move this to the overview component and pass down an onclick thru props down to this to show the proper modal
		return(
			<div className='itemBrowserWrapper'>
				<div className='cardViewerWrapper'>
					{ marketplaceItems && this.renderMarketplaceItems() }
				</div>
			</div>

		)
	}
}

export default connect()(ModifyMyStoreItemsScreen)