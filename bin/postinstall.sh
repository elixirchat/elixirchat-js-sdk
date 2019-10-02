#!/usr/bin/env bash


printf "\n\n\n --- POSTINSTALL YO YO \n\n"
printf " --- COMMAND: \n\n"
echo $(command -v node-sass)
printf " ^^^^^\n\n\n\n"

sleep 4

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/
