import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://root:Bogdan***@ds157818.mlab.com:57818/heroku_tj9l6f4x')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'heroku_tj9l6f4x')
COLLECTION_NAME = 'projects'


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route('/debris/projects')
def debrisProjects():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """


    FIELDS = {
        '_id': False,
        'Timestamp': True,
        'ItemName': True,
        'ListName': True,
        'Location': True,
        'Quantity': True,
        'Latitude': True,
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=20000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    app.run(debug=True)