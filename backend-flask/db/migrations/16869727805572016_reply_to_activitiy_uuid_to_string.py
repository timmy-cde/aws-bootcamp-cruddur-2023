from lib.db import db

class ReplyToActivitiyUuidToStringMigration():
  def migrate_sql():
    data = """
    ALTER TABLE activities
    ALTER COLUMN reply_to_activity_uuid TYPE uuid USING (reply_to_activity_uuid::uuid);
    """
    return data

  def rollback_sql():
    data = """
    ALTER TABLE activities
    ALTER COLUMN reply_to_activity_uuid TYPE integer USIN (reply_to_activity_uuid::integer);
    """
    return data

  def migrate():
    db.query_commit(ReplyToActivitiyUuidToStringMigration.migrate_sql(),{
    })
  def rollback():
    db.query_commit(ReplyToActivitiyUuidToStringMigration.rollback_sql(),{
    })

migration = ReplyToActivitiyUuidToStringMigration