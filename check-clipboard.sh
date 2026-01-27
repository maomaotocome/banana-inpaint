#!/bin/bash

# Check clipboard content script for macOS
# This script shows current clipboard content and basic info

echo "=== 当前剪贴板内容 ==="
echo ""
echo "文本内容："
pbpaste 2>/dev/null || echo "(剪贴板为空或包含非文本内容)"
echo ""
echo ""

echo "剪贴板数据类型："
osascript -e 'clipboard info' 2>/dev/null || echo "无法获取类型信息"
echo ""

echo "提示："
echo "1. 使用 pbpaste 命令可以查看当前剪贴板文本内容"
echo "2. Mac 系统默认不保存剪贴板历史记录"
echo "3. 如需历史记录功能，建议使用第三方应用："
echo "   - Paste (App Store, 付费)"
echo "   - Clipy (免费, GitHub: https://github.com/Clipy/Clipy)"
echo "   - Raycast (免费, https://www.raycast.com)"
