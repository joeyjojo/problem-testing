var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "ThrottleTest"});

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event) => {

    const startTime = Date.now();
   
    var customerID = `${startTime}${Math.random()}`; 
    var params = {
      TableName: 'TestThrottle',
      Item: {
        'CUSTOMER_ID' : {N: customerID},
        'CUSTOMER_NAME' : {S: 'Richard Roe'}
      }
    };
    
    // Call DynamoDB to add the item to the table
    let result;
    let error;
    
    try {
        result = await ddb.putItem(params).promise();
    } catch (err) {
       error = err
    };       

    // TODO implement
    const response = {
        statusCode: error.statusCode || 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    log.info({
        startTime: startTime,
        customerID: customerID,
        ddb: {
            result: result,
            error: error
        },
        statusCode: response.statusCode
    })

    return response;
};


