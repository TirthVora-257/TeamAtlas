#!/bin/sh
# Rebuilds index.html from the files in src/. Run from the repo root: ./build.sh
set -e
cd "$(dirname "$0")/src"
{ cat head.html
  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
  echo '<script>'
  cat data1.js data2.js data3.js engine1.js engine2a.js engine2b.js engine3.js game.js ui.js
  echo '</script>'
} > ../index.html
echo "Built index.html"
