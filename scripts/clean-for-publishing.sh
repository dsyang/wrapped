#!/bin/bash

# Script to clean up tokens and data files for publishing
# Usage: ./scripts/clean-for-publishing.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Data Cleanup Script ===${NC}"
echo "Current branch: $(git branch --show-current)"
echo

# Step 1: Remove tokens from config.json
if [ -f "config.json" ]; then
    echo "Removing GitHub token..."
    sed -i '' 's/"token": "github_pat_[^"]*"/"token": ""/' config.json
    echo "Removing Slack token..."
    sed -i '' 's/"token": "xoxp-[^"]*",/"token": "",/' config.json
    echo -e "${GREEN}✓ Tokens removed from config.json${NC}"
else
    echo -e "${YELLOW}No config.json found${NC}"
fi

# Step 2: Clean up data directory (keep only light.json files)
if [ -d "data" ]; then
    echo "Removing large data files (keeping only *.light.json)..."
    find data/ -name "*.json" ! -name "*.light.json" -delete
    find data/ -name "*.bak" ! -name "*.light.json" -delete
    echo -e "${GREEN}✓ Light data files kept, large files removed${NC}"
else
    echo -e "${YELLOW}No data/ directory found${NC}"
fi

echo
echo -e "${GREEN}=== Summary ===${NC}"
echo "✓ Tokens removed from config.json (if present)"
echo "✓ Large data files removed (kept only *.light.json files)"
echo
echo -e "${YELLOW}Files are ready for publishing.${NC}"