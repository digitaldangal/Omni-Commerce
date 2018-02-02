// Import client Mongoose Model
const mongoose = require('mongoose');
const Client = require('../models/schemas/client');
const bcrypt = require('bcrypt');
const MarketPlaceModels = require('../models/schemas/marketplace')
// We can export the model in our marketplace Schemas file to avoid importing mongoose here
const Marketplace = MarketPlaceModels.marketplaceSchema // TODO: Avoid having multiple calls to mongoose models and move all model exports to models/marketplace.js
const MarketplaceModel = mongoose.model('Marketplace', Marketplace)
const ShoppingCartSchema = MarketPlaceModels.storeItemSchema
const ShoppingCartModel = MarketPlaceModels.ShoppingCartModel
//CREATE

module.exports.createClient = async function(req, res, next) {
	console.log("req.body recieved by CREATE CLIENT Function:")
	console.log(req.body)

	try {
	// Object assign data from req.data - assign some registration middleware to alter the request
		var data = {
			firstName				: req.body.firstName,
			lastName				: req.body.lastName,
			phoneNumber				: req.body.phoneNumber,
			email					: req.body.email,
			isMaster				: req.body.isMaster,
			isAdmin					: req.body.isAdmin,
			mongoCollectionKey		: req.body.mongoCollectionKey,
			employeeCounter			: req.body.employeeCounter, 
			organizationName		: req.body.organizationName,
			clockInNumber			: req.body.clockInNumber,
			accountType				: req.body.accountType,
			master_id				: req.body.master_id,
			billing_address_line1	: req.body.billing_address_line1,
			billing_address_line2	: req.body.billing_address_line2,
			billing_address_city	: req.body.billing_address_city,
			billing_address_zip		: req.body.billing_address_zip,
			billing_address_state	: req.body.billing_address_state,
			shipping_address_line1	: req.body.shipping_address_line1,
			shipping_address_line2	: req.body.shipping_address_line2,
			shipping__address_city	: req.body.shipping__address_city,
			shipping_address_zip	: req.body.shipping_address_zip,
			shipping_address_state	: req.body.shipping_address_state,
			userName				: req.body.userName,
		};



		
		

		var newClient = new Client(data);
		
		//TODO: handle subsequent validation of inputs past Mongoose Typecasting

		//TODO: handle duplicates - add unique fields within schema level




		//Purpose of keeping the hash function async - if for whatever reason we are getting lots of requests for hashes, or a hash takes a long time due to memory
		//intensity, requests can continue to be fulfilled...I guess..?
		// Converting to AsyncAwait may slow down this? but keeping parent function asnyc should make it OK
	const response = {}
		
		if (!newClient.hash) {
			var plaintext = req.body.password;
			const saltRounds = 10;			
			const hashedPassword = await bcrypt.hash(plaintext, saltRounds);
			newClient.hash = hashedPassword;
				
				if (req.body.accountType === "OnlineMerchant") {

				const storeData = {
					storeName: req.body.shopName,
					ownerName: req.body.userName,
					mongoCollectionKey: req.body.mongoCollectionKey,
				}
				console.log("Store Data: ")
				console.log(storeData)


				const newMarketplace = new MarketplaceModel(storeData)
				const registeredMarketplace = await newMarketplace.save()

				response.createdMarketplace = registeredMarketplace
				newClient.marketplaceRef_id = registeredMarketplace._id
				console.log("New Marketplace: ")
				console.log(registeredMarketplace)
				}

			const registeredClient = await newClient.save();
			response.createdClient = registeredClient
			console.log("New Client: ")
			console.log(registeredClient)
		
				if(req.body.accountType === "OnlineMerchant") {
					const newShoppingCartForClient = new ShoppingCartModel({ ownerRef_id: registeredClient._id })
					const boundShoppingCart = await newShoppingCartForClient.save()
					response.boundShoppingCart = boundShoppingCart
					const updatedMarketplaceWithClientRef = await MarketplaceModel.findOneAndUpdate({ _id: response.createdMarketplace._id }, { ownerRef_id: registeredClient._id}, { new: true })
					console.log("Updated Marketplace with Client Ref ID:")
					console.log(updatedMarketplaceWithClientRef)
					response.updatedCreatedMarketplace = updatedMarketplaceWithClientRef;
				}
		};
	
	res.json(response);

	} catch(err) { next(err) }
}

module.exports.autoCompleteClientOrgName = function (req, res, next) {
	console.log(req.body)
	// Make sure the i for case insensitive flag worked
	 Client.find({ organizationName: { $regex : "^" + req.body.employerLookup + "i"}}, 'organizationName', 
		function(err, clients) {
			console.log(clients)
			if (err) return next(err)
			return res.json(clients);
		})

		
}

// Move to TimeSheet controls?
// Need Middleware to find client
module.exports.getAllClients = function(req, res, next) {
	Client.find({}, function(err, clients) {
		if (err) return next(err);
		return res.json(clients)
	})
}

module.exports.findMasterAndTagChild = function(req, res, next) {
	Client.findOne({
		isMaster: true,
		organizationName: req.body.organizationName
	}, 
			function(err, client) {
				if (err) return next(err);
				req.body.mongoCollectionKey = client.mongoCollectionKey;
			})
}
//TODO: Specific Filtering FindFunctions

//UPDATE

module.exports.updateClient = function(req, res, next) {
	Client.findOneAndUpdate({_id: req.params.id}, req.body, 
		{ new: true }, function(err, client) {
			if(err) return next(err);
			if(!client) return res.status(404).send("No client with that ID");
			return res.json(client);
		});
}

//DELETE

module.exports.deleteClientById = function(req, res, next) {
	Coupon.findOneAndRemove({_id: req.params.id}, function(err, client){
		if (err) return next(err);
		if (!client) return res.status(404).send("No client with that ID");
		return res.sendStatus(200);
	});
}

module.exports.findAllEmployees = function(req, res, next) {
	// Should use req.body.client and find the employees using the adminClient's orgname
	console.log(req.body.client)
	res.json({TODO: "YOU GOTTA FINISH EMPLOYEE LOOKUP METHOD"})
}