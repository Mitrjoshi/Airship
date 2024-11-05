#!/bin/bash

# Specify the bucket name to exclude
exclude_bucket="teamtree-app"

# Get a list of all S3 bucket names
all_buckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

for bucket in $all_buckets; do
    # Skip the specified bucket
    if [ "$bucket" != "$exclude_bucket" ]; then
        echo "Deleting bucket: $bucket"
        
        # Delete all objects from the bucket first
        aws s3 rm s3://$bucket --recursive

        # Delete the empty bucket
        aws s3api delete-bucket --bucket $bucket
    else
        echo "Skipping bucket: $bucket"
    fi
done
