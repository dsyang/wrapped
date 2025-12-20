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
echo -e "${GREEN}=== Vercel Project Configuration ===${NC}"

# Step 3: Handle Vercel project configuration
if [ -d ".vercel" ]; then
    # Find all *-project.json files in .vercel directory
    project_files=(.vercel/*-project.json)
    
    if [ ${#project_files[@]} -gt 0 ] && [ -e "${project_files[0]}" ]; then
        echo "Found existing project configurations:"
        
        # Read current .vercel/project.json content if it exists
        current_content=""
        if [ -f ".vercel/project.json" ]; then
            current_content=$(cat .vercel/project.json)
        fi
        
        # Create array for menu options with current marking
        options=()
        display_options=()
        for file in "${project_files[@]}"; do
            basename_file=$(basename "$file")
            options+=("$basename_file")
            
            # Check if this file's content matches current project.json
            if [ -n "$current_content" ] && [ -f "$file" ]; then
                file_content=$(cat "$file")
                if [ "$current_content" = "$file_content" ]; then
                    display_options+=("$basename_file [current]")
                else
                    display_options+=("$basename_file")
                fi
            else
                display_options+=("$basename_file")
            fi
        done
        options+=("Deploy a new app")
        display_options+=("Deploy a new app")
        
        # Display menu
        echo
        for i in "${!display_options[@]}"; do
            echo "  $((i+1)). ${display_options[i]}"
        done
        echo
        
        # Get user choice
        while true; do
            read -p "Which project configuration would you like to use? (1-${#options[@]}): " choice
            if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#options[@]} ]; then
                break
            else
                echo -e "${RED}Invalid choice. Please enter a number between 1 and ${#options[@]}.${NC}"
            fi
        done
        
        selected_option="${options[$((choice-1))]}"
        
        if [ "$selected_option" = "Deploy a new app" ]; then
            # Move existing .vercel/project.json to backup if it exists
            if [ -f ".vercel/project.json" ]; then
                mv .vercel/project.json .vercel/project.json.bak
                echo -e "${GREEN}✓ Moved existing .vercel/project.json to .vercel/project.json.bak${NC}"
            else
                echo -e "${YELLOW}No existing .vercel/project.json found${NC}"
            fi
        else
            # Copy selected project file to .vercel/project.json
            cp ".vercel/$selected_option" .vercel/project.json
            echo -e "${GREEN}✓ Copied .vercel/$selected_option to .vercel/project.json${NC}"
        fi
    else
        echo -e "${YELLOW}No *-project.json files found in .vercel directory${NC}"
    fi
else
    echo -e "${YELLOW}No .vercel directory found${NC}"
fi

echo
echo -e "${GREEN}=== Summary ===${NC}"
echo "✓ Tokens removed from config.json (if present)"
echo "✓ Large data files removed (kept only *.light.json files)"
echo "✓ Vercel project configuration handled"
echo
echo -e "${YELLOW}Files are ready for publishing.${NC}"