#!/bin/bash

echo 'installing dependencies...'
pip3 install -r requirements.txt

echo 'building backend...'
python3 -m flask run --host=0.0.0.0 --port=4567

echo 'done building backend!'
