# from aws_xray_sdk.core import xray_recorder
from lib.db import db

class UserActivities:
    def run(user_handle):
        print("UserActivites.run")
        # xray custom part ----------------
        # subsegment = xray_recorder.begin_subsegment('user_activities')

        # try:
        model = {
            'errors': None,
            'data': None
        }

        # xray custom part ----------------
        # subsegment.put_annotation('now', now.isoformat())

        if user_handle == None or len(user_handle) < 1:
            model['errors'] = ['blank_user_handle']
        else:
            print("else")
            sql = db.template('users', 'show')
            results = db.query_array_json(sql, {'handle': user_handle})
            model['data'] = results

            # subsegment = xray_recorder.begin_subsegment('mock-data')
            # # xray ---
            # dict = {
            #     "now": now.isoformat(),
            #     "results-size": len(model['data'])
            # }
            # subsegment.put_metadata('key', dict, 'namespace')
            # xray_recorder.end_subsegment()
        # finally:
            # Close the segment
            # xray_recorder.end_subsegment()
        return model
