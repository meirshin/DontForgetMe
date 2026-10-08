package com.dontforgetme

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Handles the scheduled alarm. The notification buttons go to ReminderActionService. */
class ReminderReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Reminder.ACTION_FIRE -> {
        // Keep the receiver alive while the sound plays (AlertSound caps it at a few seconds).
        val pending = goAsync()
        if (!Reminder.show(context) { pending.finish() }) pending.finish()
      }
    }
  }
}
