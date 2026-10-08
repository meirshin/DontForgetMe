package com.dontforgetme

import android.app.Service
import android.content.Intent
import android.os.IBinder

/**
 * Handles the notification buttons. A service rather than a broadcast: while the reminder sound
 * plays, ReminderReceiver keeps its broadcast open (goAsync), and the system delivers the app's
 * next broadcast only after that one finishes, so a button would stop the sound only once it ended.
 */
class ReminderActionService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      Reminder.ACTION_DISMISS -> Reminder.cancel(this)
      Reminder.ACTION_SNOOZE -> {
        Reminder.dismissNotification(this)
        Reminder.schedule(this, Reminder.SNOOZE_MS)
      }
    }
    stopSelf(startId)
    return START_NOT_STICKY
  }
}
