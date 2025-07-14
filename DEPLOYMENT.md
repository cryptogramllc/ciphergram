# Deployment Setup Guide

This project is configured to automatically deploy to S3 when you push to the `master` or `main` branch.

## Prerequisites

1. **AWS S3 Bucket**: Your website is hosted on `ciphergrm.io` S3 bucket
2. **AWS IAM User**: Create an IAM user with S3 access permissions
3. **GitHub Repository**: This repository must be on GitHub

## Setup Instructions

### 1. Create AWS IAM User

Create an IAM user with the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::ciphergrm.io",
                "arn:aws:s3:::ciphergrm.io/*"
            ]
        }
    ]
}
```

### 2. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

- `AWS_ACCESS_KEY_ID`: Your IAM user's access key
- `AWS_SECRET_ACCESS_KEY`: Your IAM user's secret key
- `CLOUDFRONT_DISTRIBUTION_ID`: (Optional) Your CloudFront distribution ID if you use CloudFront

### 3. Update S3 Bucket Region

In `.github/workflows/deploy.yml`, update the `aws-region` to match your S3 bucket's region.

### 4. Deploy

Simply push to the `master` or `main` branch:

```bash
git add .
git commit -m "Update website"
git push origin master
```

The GitHub Action will automatically:
1. Build your Pug/Jade templates and Sass files
2. Deploy the `dist` folder contents to S3
3. Invalidate CloudFront cache (if configured)

## Manual Deployment

To deploy manually:

```bash
npm run build
aws s3 sync dist/ s3://ciphergrm.io --delete
```

## Troubleshooting

- Check the Actions tab in your GitHub repository for deployment logs
- Ensure your AWS credentials have the correct permissions
- Verify your S3 bucket name and region are correct 