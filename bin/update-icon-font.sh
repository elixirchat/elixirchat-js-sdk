#!/usr/bin/env bash

source bin/utils.sh

CSS_FILE_README_TEXT="/*

  THIS FILE WAS GENERATED AUTOMATICALLY VIA \`npm run update-icon-font\`
  @see bin/update-icon-font.sh

  In order to add new icons to the elixirchat-icons font:
  1. Copy your SVG icons into widget/DefaultWidget/assets/fonts/elixirchat-icons-source
  2. Run \`npm update-icon-font\` in terminal (this will regenerate elixirchat-icons.woff and icons.scss)
  3. Use your new icons e.g. <i className=\"icon-my-new-icon\"/> (for when your original SVG file was named my-new-icon.svg)

  NOTE:
  The icons are usually taken from Apple SF Symbols set:
  @see https://developer.apple.com/design/human-interface-guidelines/sf-symbols/overview/

*/
"
CSS_FILE_PATH="widget/DefaultWidget/styles/icons.scss"
ICON_FONT_DIRECTORY="widget/DefaultWidget/assets/fonts/"
ICON_FONT_NAME="elixirchat-icons"
SVG_ICONS_DIRECTORY="widget/DefaultWidget/assets/fonts/elixirchat-icons-source"


function prepend_text_to_file() {
  (echo -e "$2"; cat "$1") > "$1.tmp"
  mv "$1.tmp" "$1"
}

function is_font_generator_installed() {
  command -v icon-font-generator
}

if ! is_font_generator_installed; then
  print_error "\nFirst, install icon-font-generator:\n  npm install -g icon-font-generator\n\nThen try again.\n\n"
  tput sgr0
fi


icon-font-generator "$SVG_ICONS_DIRECTORY/*.svg" \
  --out "$ICON_FONT_DIRECTORY" \
  --name "$ICON_FONT_NAME" \
  --csspath "$CSS_FILE_PATH" \
  --types "woff" \
  --tag "*" \
  --normalize true \
  --height 1000 \
  --descent 150 \
  --html false \
  --json false

prepend_text_to_file "$CSS_FILE_PATH" "$CSS_FILE_README_TEXT"
