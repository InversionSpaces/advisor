from pymongo import MongoClient

from django.conf import settings

# Initialize the database client
client = MongoClient(settings.MONGODB_SETTINGS['host'], settings.MONGODB_SETTINGS['port'])
db = client[settings.MONGODB_SETTINGS['db']]
