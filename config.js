// Http server
exports.serverListenAddress =   "127.0.0.1";
exports.serverListenPort =      4243;

// Amazon
exports.awsRegion =             'eu-west-2';
exports.awsUsersGroupeName =    'swipe_moore_users';

exports.defaultPolicy = function(bucket) {
    return {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
              "arn:aws:s3:::" + bucket,
              "arn:aws:s3:::"+ bucket + "/*"
            ]
          },
          {
            "Effect": "Deny",
            "NotAction": "s3:*",
            "NotResource": [
              "arn:aws:s3:::" + bucket,
              "arn:aws:s3:::" + bucket + "/*"
            ]
          }
        ]
      };      
}