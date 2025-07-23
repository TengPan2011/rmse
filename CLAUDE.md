# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RPGMaker Save Editor (RMSE) is an Electron-based desktop application for editing RPGMaker save files. It currently supports RPG Maker MZ (.rmmzsave) files and provides a user-friendly interface for modifying game save data including character stats, inventory items, gold, and game variables.

For context, this is a tiny github project from like 5 years ago?

## Development Commands

### Running the Application
```bash
npm start
```

### Dependencies
```bash
npm install
```

## Architecture

### Core Components

- **main.js**: Electron main process that creates the browser window and handles IPC communication
- **renderer.js**: UI rendering logic that builds the editor interface from parsed save data
- **preload.js**: Security bridge between main and renderer processes using contextBridge
- **rm_load.js**: Core save file loading/saving logic with codec support for different RPGMaker versions
- **index.html**: Main UI structure with dropzone for file loading
- **styles.css**: Grid-based layout with collapsible sections

### Save File Processing Flow

1. **File Loading**: `drop_handler` → `ipc_bridge.load_file` → `rm_loader.load` → `handle_file_load`
2. **File Parsing**: `rm_load.js` detects compression codec (pako, lz-string, or none) and decodes save data
3. **UI Generation**: `build_sections()` creates editable sections from parsed JSON data
4. **File Saving**: `handle_save` → `ipc_bridge.save_file` → `rm_loader.save`

### Data Structure Classes

- **value_item**: Handles single-value fields (gold, steps, inventory quantities)
- **character_item**: Manages character stats with current/max HP/MP and attribute bonuses
- **section**: Groups related items with expand/collapse functionality

### Save File Support

The application supports multiple RPGMaker save file formats:
- **Uncompressed JSON** (.json files)
- **Pako compression** (uses pako.min.js from game directory)
- **LZ-String compression** (uses lz-string.js from game directory)

### Context Loading

Save files require game context data from the RPGMaker data directory:
- **Items.json**: Item definitions for inventory sections
- **Armors.json/Weapons.json**: Equipment definitions
- **System.json**: Variable names and game settings

## Key Features

- Drag-and-drop file loading with automatic RPGMaker root detection
- Expandable/collapsible sections for organized editing
- Dynamic inventory management with add item functionality
- Character stat editing for active party members
- Raw JSON dump/load capability for advanced editing
- Backup-friendly "Save As" functionality

## File Structure Notes

- The `js/` directory contains all JavaScript modules
- The application automatically detects the RPGMaker game root directory
- Context files are loaded from the game's `data/` directory
- Save files must be within the game directory structure for proper saving