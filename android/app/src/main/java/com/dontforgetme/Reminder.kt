package com.dontforgetme

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import java.util.Locale

/** Schedules and shows the "did you forget a child in the car?" reminder. */
object Reminder {
  const val ACTION_FIRE = "com.dontforgetme.action.FIRE"
  const val ACTION_DISMISS = "com.dontforgetme.action.DISMISS"
  const val ACTION_SNOOZE = "com.dontforgetme.action.SNOOZE"
  const val SNOOZE_MS = 60_000L

  // The sound is played by AlertSound, so the channel itself is silent. Channel sounds can't
  // be changed once created, hence the new id; the old channel is removed.
  private const val CHANNEL_ID = "child_reminder_v2"
  private const val LEGACY_CHANNEL_ID = "child_reminder"
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

  private fun actionIntent(c: Context, action: String, requestCode: Int): PendingIntent =
      PendingIntent.getService(
          c,
          requestCode,
          Intent(c, ReminderActionService::class.java).setAction(action),
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
    AlertSound.stop(c)
    c.getSystemService(NotificationManager::class.java).cancel(NOTIFICATION_ID)
  }

  /** Texts in the language chosen in the app, or the phone's language. */
  private fun localized(c: Context): Context {
    val language = Prefs.language(c).ifEmpty {
      return c
    }
    val config = Configuration(c.resources.configuration)
    config.setLocale(Locale.forLanguageTag(language))
    return c.createConfigurationContext(config)
  }

  private fun ensureChannel(c: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val nm = c.getSystemService(NotificationManager::class.java)
    nm.deleteNotificationChannel(LEGACY_CHANNEL_ID)
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
              setSound(null, null)
            }
    nm.createNotificationChannel(channel)
  }

  /**
   * Shows the reminder and plays its sound. Returns false if notifications are not allowed;
   * otherwise [soundDone] runs once the sound has finished.
   */
  fun show(app: Context, soundDone: () -> Unit): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
        app.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) !=
            PackageManager.PERMISSION_GRANTED) {
      return false
    }
    val c = localized(app)
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
            .setColor(ContextCompat.getColor(c, R.color.notification_accent))
            .setContentTitle(c.getString(R.string.reminder_title))
            .setContentText(c.getString(R.string.reminder_text))
            .setStyle(NotificationCompat.BigTextStyle().bigText(c.getString(R.string.reminder_text)))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setVibrate(VIBRATION)
            .setAutoCancel(true)
            .setContentIntent(openApp)
            .addAction(0, c.getString(R.string.action_ok), actionIntent(c, ACTION_DISMISS, REQ_DISMISS))
            .addAction(
                0, c.getString(R.string.action_snooze), actionIntent(c, ACTION_SNOOZE, REQ_SNOOZE))
            .build()

    c.getSystemService(NotificationManager::class.java).notify(NOTIFICATION_ID, notification)
    AlertSound.playReminder(app, soundDone)
    return true
  }
}
