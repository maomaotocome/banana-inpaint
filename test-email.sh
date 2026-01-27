#!/bin/bash

# Test email sending script
# Usage: Replace YOUR_DOMAIN and YOUR_EMAIL with actual values

# Replace these values with your actual domain and email
YOUR_DOMAIN="your-domain.com"  # 替换为你的实际域名，例如: example.com
YOUR_EMAIL="your-email@example.com"  # 替换为你的测试邮箱

# Send test email
curl -X POST "https://${YOUR_DOMAIN}/api/email/send-email" \
  -H "Content-Type: application/json" \
  -d "{
    \"emails\": [\"${YOUR_EMAIL}\"],
    \"subject\": \"Test Email\"
  }"

echo ""  # Add a newline for better output
