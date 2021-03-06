const moment = require('moment')

const Client = require('../models/schemas/client');
const jwt = require('jwt-simple');
const config = require('../models/config');



exports.login = async function(req, res, next) {
	try{
		
		if (!req.body.email)
			return res.status(404).send("Please input your Email to log in.");
		if (!req.body.password)
			return res.status(404).send("Please input your Password to log in.");

		const authorizedClient = await Client.findOne({email: req.body.email})
			if (!authorizedClient) { return res.status(404).send("Account with this email does not exist")}

		authorizedClient.comparePassword(req.body.password, async (err, passwordMatch) => {
		
		if (!passwordMatch) { return res.status(403).send("Invalid Password") }
			
			const payload = {
				_id							: authorizedClient._id,
				email 						: authorizedClient.email,
				mongoCollectionKey 			: authorizedClient.mongoCollectionKey,
				accountType					: authorizedClient.accountType,
			}

			const token = jwt.encode(payload, config.secret)
			const tokenCreatedAt = Date.now()
			
			authorizedClient.tokenCreatedAt = tokenCreatedAt
			authorizedClient.token = token;

			// Do not need await, can send login response even if client is not yet saved - remove later, keep now for validation

			const savedClient = await authorizedClient.save()
			
				return res.json({
					token: token,
					accountType: authorizedClient.accountType,
				});
		
		});
	
	} catch(err) { next(err) }
};

async function validateToken(req, res, next, authReq) {

	try{
		
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (!token) return res.status(403).send("Access token required.");

		try { 

			const decoded = jwt.decode(token, config.secret)

			console.log("decoded", decoded)

			console.log("Looking for validated client")

			const validatedClient = await Client.findById(decoded._id)

			console.log(validatedClient)

		if (!validatedClient) 
			return res.status(403).send("Invalid Client.")
		if (token !== validatedClient.token) 
			return res.status(403).send("Expired Token")

			const currentDate = moment(new Date())
			const tokenCreatedAt = moment(validatedClient.tokenCreatedAt)
			
			const timeDifference = currentDate.diff(tokenCreatedAt, 'hours', true)

			console.log("Time Difference", timeDifference)

		if (timeDifference >= 2) 
			return res.status(403).send("Token expired after 2 hours elapsed, please log-in again to refresh your token.")
		
		/* No longer storing admin status on Token
		if (decoded.isAdmin !== validatedClient.isAdmin || decoded.isSuperAdmin !== validatedClient.isSuperAdmin)
			return res.status(403).send("Expired token");
		*/
		
		if (!validatedClient.isAdmin && !validatedClient.isSuperAdmin && authReq.adminRequired)
			return res.status(403).send("Admin privileges required");
			
		if (!validatedClient.isSuperAdmin && authReq.superAdminRequired)
			return res.status(403).send("Super Admin privileges required");
			
		if (authReq.attachMongoCollectionKeyHeaders) {
			if (validatedClient.accountType === "OnlineMerchant") 
				return res.status(403).send("Invalid endpoint request.")
			if (!validatedClient.employeeAuthorization && !validatedClient.isMaster)
				return res.status(403).send("Sorry, your employer has not approved your access to the terminal yet.")

				req.body.client = validatedClient;
				req.headers['x-mongo-key'] = validatedClient.mongoCollectionKey;
				req.headers['x-user-id'] = validatedClient._id;
		}

		if (authReq.attachClientDataToRequest) {
			req.body.client = validatedClient;
			req.headers['x-mongo-key'] = validatedClient.mongoCollectionKey;
			req.headers['x-user-id'] = validatedClient._id;	
			req.headers['x-marketplace-ref'] = validatedClient.marketplaceRef_id
		}
		
			next();

		 } catch(err) { res.status(403).send("Could not validate token")}



		
	   
	   } catch(err) { next(err) }
};

exports.adminRequired = function(req, res, next) {
	validateToken(req, res, next, { adminRequired: true });
};

exports.superAdminRequired = function(req, res, next) {
	validateToken(req, res, next, { superAdminRequired: true });
};

exports.routeEmployeeToMongoCollection = function(req, res, next) {
	validateToken(req, res,  next, { attachMongoCollectionKeyHeaders: true })
}

exports.routeMarketplaceClient = function(req, res, next) {
	validateToken(req, res, next, { attachClientDataToRequest: true })
}
exports.sendStripeTokenMetadataToClient = function(req, res, next) {


	const data = {
		name: req.body.client.firstName.concat(' ', req.body.client.lastName),
		address_line1: req.body.client.billing_address_line1,
		address_line2: req.body.client.billing_address_line2,
		address_city: req.body.client.billing_address_city,
		address_state: req.body.client.billing_address_state,
		address_zip: req.body.client.billing_address_zip,
	}

	res.json(data)
}