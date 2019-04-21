#!/usr/bin/env bash

# npm install -D electron-builder
# https://www.electron.build/configuration/configuration

build --x64 --win nsis --config ./electron-builder.json
build --x64 --linux dir --config ./electron-builder.json
