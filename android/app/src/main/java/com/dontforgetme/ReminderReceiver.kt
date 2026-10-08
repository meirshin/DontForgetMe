package com.dontforgetme

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Handles the scheduled alarm and the notification action buttons. */
class ReminderReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Reminder.ACTION_FIRE -> {
        // Keep the receiver alive while the sound plays (AlertSound caps it at a few seconds).
        val pending = goAsync()
        if (!Reminder.show(context) { pending.finish() }) pending.finish()
      }
      Reminder.ACTION_DISMISS -> Reminder.cancel(context)
      Reminder.ACTION_SNOOZE -> {
        Reminder.dismissNotification(context)
        Reminder.schedule(context, Reminder.SNOOZE_MS)
      }
    }
  }
}
