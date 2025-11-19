#!/bin/bash
# Comprehensive test script for influencer import system

set -e  # Exit on error

echo "=================================================="
echo "Influencer Import System - Comprehensive Test"
echo "=================================================="
echo ""

# Step 1: Clean up existing data
echo "Step 1: Cleaning up existing influencer data..."
echo "------------------------------------------------"
FORCE=true node scripts/cleanup-influencers.js 2>&1 | grep -A 50 "CLEANUP SCRIPT"
echo ""

# Step 2: Run import in dry-run mode
echo "Step 2: Testing import in DRY RUN mode..."
echo "------------------------------------------------"
DRY_RUN=true node scripts/import-influencers.js 2>&1 | grep -A 100 "Import Summary"
echo ""

# Step 3: Run actual import
echo "Step 3: Running ACTUAL import..."
echo "------------------------------------------------"
node scripts/import-influencers.js 2>&1 | grep -A 100 "Import Summary"
echo ""

# Step 4: Verify the imported data
echo "Step 4: Verifying imported data..."
echo "------------------------------------------------"
node scripts/verify-influencers.js 2>&1 | grep -A 200 "Database Statistics"
echo ""

echo "=================================================="
echo "✅ Test Complete!"
echo "=================================================="

