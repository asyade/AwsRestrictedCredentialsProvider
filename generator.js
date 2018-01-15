var AWS = require('aws-sdk');

AWS.config.update({region: global.aws_region});

var s3 = new AWS.S3();
var iam = new AWS.IAM({apiVersion: '2010-05-08'});

exports.create_user = function(token, cb) {
    create_iam_account(token, (result, data) => {
        if (!result) {
            cb(false);
            return ;
        }
        allow_user(token, (result, allow_data) => {
            if (!result) {
                cb(false);
                return ;
            }
            create_user_key(token, (result, key_data) => {
                if (!result) { 
                    cb(false);
                    return ;
                }
                create_bucket(bucket_name(token), (result, bucket_data) => {
                    if (!result) {
                        cb(false);
                        return ;
                    }
                    create_user_policy(token, bucket_name(token), (result, policy_data) => {
                        if(!result) {
                            cb(false);
                            return ;
                        }
                        cb(true, {
                            id: token,
                            user_key: data.User.UserId,
                            access_key: key_data.AccessKey.AccessKeyId,
                            access_secret: key_data.AccessKey.SecretAccessKey,
                            bucket: bucket_data.Location,
                        });
                    });
                });
            });
        });
    });
}

function create_user_policy(name, bucket, cb) {
    iam.createPolicy({
        PolicyDocument: JSON.stringify(global.config.defaultPolicy(bucket)),
        PolicyName: name,
    }, (err, result) => {
        if (err) {
            global.logger.error(err); 
            cb(false);
            return ;
        }
        iam.attachUserPolicy({
            UserName: name,
            PolicyArn: result.Policy.Arn,
        }, (err, result_register) => {
            if (err) {
                global.logger.error("[attacheUserPolicy]" + err);
                cb(false);
                return ;                
            }
            result.response = result_register;
            cb(true, result);         
        });
    });
}

function create_user_key(name, cb) {
    iam.createAccessKey({UserName: name}, (err, data) => {
        if (err) {
            console.log(err);
            cb(false);
            return ;
        }
        cb(true, data);
    });
}

function allow_user(name, cb) {
    iam.addUserToGroup({
        GroupName: global.config.awsUsersGroupeName,
        UserName: name
    }, (err, data) => {
        if (err) {
            console.log(err);
            cb(false);
            return ;
        }
        cb(true, data);
    });
}

function create_iam_account(name, cb) {
    var params = { UserName: name };
    iam.getUser(params, (err, data) => {
        if (err && err.code === 'NoSuchEntity') {
            iam.createUser(params, (err, data) => {
                if (err) {
                    console.log(err);
                    cb(false, null);
                    return ;
                }
                global.logger.info("New user created " + name);
                cb(true, data);
            });
        } else {
            if (err) global.logger.error(err); else global.logger.error("User " + name + " already exist");
            cb(false, null);
        }
    });
}

function create_bucket(token, cb) {
    s3.createBucket({Bucket: token}, (err, data) => {
        if (err) {
            console.log(err);
            cb(false, null);
            return ;
        }
        cb(true, data);
    });
}

function bucket_name(token) {
    return token + "_bucket";
}