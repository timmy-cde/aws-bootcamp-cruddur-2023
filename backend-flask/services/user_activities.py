from datetime import datetime, timedelta, timezone
from aws_xray_sdk.core import xray_recorder

class UserActivities:
  def run(user_handle):
    # xray ----------------
    subsegment = xray_recorder.begin_subsegment('user_activities')

    model = {
      'errors': None,
      'data': None
    }
    now = datetime.now(timezone.utc).astimezone()

    # xray ----------------
    subsegment.put_annotation('now', now.isoformat())

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['blank_user_handle']
    else:
      now = datetime.now()
      
      # xray ----------------
      subsegment2 = xray_recorder.begin_subsegment('mock-data')
      subsegment2.put_annotation('now', now.isoformat())

      results = [{
        'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
        'handle':  'Andrew Brown',
        'message': 'Cloud is fun!',
        'created_at': (now - timedelta(days=1)).isoformat(),
        'expires_at': (now + timedelta(days=31)).isoformat()
      }]
      model['data'] = results

      # xray ----------------
      xray_recorder.end_subsegment()

    # xray ----------------
    subsegment.put_annotation('results_length', len(model['data']))
    xray_recorder.end_subsegment()

    return model