#!/bin/bash

echo 'installing dependencies...'
pip3 install -r requirements.txt

echo 'building backend...'
python3 -m flask run --host=127.0.0.1 --port=4568

echo 'done building backend!'
