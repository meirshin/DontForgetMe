package com.dontforgetme

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat

/** Schedules and shows the "did you forget a child in the car?" reminder. */
object Reminder {
  const val ACTION_FIRE = "com.dontforgetme.action.FIRE"
  const val ACTION_DISMISS = "com.dontforgetme.action.DISMISS"
  const val ACTION_SNOOZE = "com.dontforgetme.action.SNOOZE"
  const val SNOOZE_MS = 60_000L

  private const val CHANNEL_ID = "child_reminder"
  private const val NOTIFICATION_ID = 1001
  private const val REQ_ALARM = 1
  private const val REQ_OPEN = 2
  private const val REQ_DISMISS = 3
  private const val REQ_SNOOZE = 4

  private val VIBRATION = longArrayOf(0, 800, 400, 800, 400, 800)

  private fun receiverIntent(c: Context, action: String, requestCode: Int): PendingIntent =
      PendingIntent.getBroadcast(
          c,
          requestCode,
          Intent(c, ReminderReceiver::class.java).setAction(action),
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )

  fun canScheduleExact(c: Context): Boolean =
      Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
          c.getSystemService(AlarmManager::class.java).canScheduleExactAlarms()

  fun schedule(c: Context, delayMs: Long) {
    val am = c.getSystemService(AlarmManager::class.java)
    val triggerAt = System.currentTimeMillis() + delayMs
    val pi = receiverIntent(c, ACTION_FIRE, REQ_ALARM)
    if (canScheduleExact(c)) {
      am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
    } else {
      am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
    }
  }

  /** Cancels a pending reminder and removes a visible one. */
  fun cancel(c: Context) {
    c.getSystemService(AlarmManager::class.java).cancel(receiverIntent(c, ACTION_FIRE, REQ_ALARM))
    dismissNotification(c)
  }

  fun dismissNotification(c: Context) {
    c.getSystemService(NotificationManager::class.java).cancel(NOTIFICATION_ID)
  }

  private fun alarmSound() = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)

  private fun ensureChannel(c: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val channel =
        NotificationChannel(
                CHANNEL_ID,
                c.getString(R.string.channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            )
            .apply {
              description = c.getString(R.string.channel_description)
              enableVibration(true)
              vibrationPattern = VIBRATION
              lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
              setSound(
                  alarmSound(),
                  AudioAttributes.Builder()
                      .setUsage(AudioAttributes.USAGE_ALARM)
                      .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                      .build(),
              )
            }
    c.getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
  }

  fun show(c: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
        c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) !=
            PackageManager.PERMISSION_GRANTED) {
      return
    }
    ensureChannel(c)

    val openApp =
        PendingIntent.getActivity(
            c,
            REQ_OPEN,
            Intent(c, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

    @Suppress("DEPRECATION")
    val notification =
        NotificationCompat.Builder(c, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(c.getString(R.string.reminder_title))
            .setContentText(c.getString(R.string.reminder_text))
            .setStyle(NotificationCompat.BigTextStyle().bigText(c.getString(R.string.reminder_text)))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setVibrate(VIBRATION)
            .setSound(alarmSound(), AudioManager.STREAM_ALARM)
            .setAutoCancel(true)
            .setContentIntent(openApp)
            .addAction(0, c.getString(R.string.action_ok), receiverIntent(c, ACTION_DISMISS, REQ_DISMISS))
            .addAction(
                0, c.getString(R.string.action_snooze), receiverIntent(c, ACTION_SNOOZE, REQ_SNOOZE))
            .build()

    c.getSystemService(NotificationManager::class.java).notify(NOTIFICATION_ID, notification)
  }
}
