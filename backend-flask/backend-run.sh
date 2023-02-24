#!/bin/bash

echo 'installing dependencies...'
pip3 install -r requirements.txt
apt-get update 
apt-get install -y gcc
apt-get install -y curl

echo 'building backend...'
python3 -m flask run --host=0.0.0.0 --port=4567

echo 'done building backend!'
