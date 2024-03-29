import os
import sys

from flask import Flask
from flask import request, g

from lib.rollbar import init_rollbar
from lib.xray import init_xray
from lib.cors import init_cors
from lib.honeycomb import init_honeycomb
from lib.cloudwatch import init_cloudwatch

import routes.general
import routes.activities
import routes.users
import routes.messages

app = Flask(__name__)

# initializations -------
# init_xray(app)
with app.app_context():
  g.rollbar = init_rollbar(app)
init_honeycomb(app)
init_cors(app)

# load routes -------
routes.general.load(app)
routes.activities.load(app)
routes.users.load(app)
routes.messages.load(app)

if __name__ == "__main__":
    app.run(debug=True)
