package com.dontforgetme

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Handler
import android.os.Looper
import kotlin.math.ceil

/**
 * Plays the reminder sound on the alarm stream. Playing it ourselves (instead of through the
 * notification channel) lets the user pick the sound and its volume, and optionally raise the
 * phone's alarm volume while it plays, so the reminder is heard even when the phone is quiet.
 * The previous alarm volume is restored when the sound ends or is stopped.
 */
object AlertSound {
  const val DEFAULT = "chimes"
  const val SYSTEM = "system"

  /** Longest a reminder sound plays, so it always ends within the alarm broadcast. */
  private const val MAX_PLAY_MS = 9_000L

  private val sounds =
      mapOf(
          "chimes" to R.raw.alert_chimes,
          "marimba" to R.raw.alert_marimba,
          "harp" to R.raw.alert_harp,
          "musicbox" to R.raw.alert_musicbox,
          "bells" to R.raw.alert_bells,
          "piano" to R.raw.alert_piano,
          "pizzicato" to R.raw.alert_pizzicato,
          "steeldrum" to R.raw.alert_steeldrum,
          "synth" to R.raw.alert_synth,
          "chiptune" to R.raw.alert_chiptune,
      )

  fun isKnown(sound: String) = sound == SYSTEM || sound in sounds

  private val handler = Handler(Looper.getMainLooper())
  private var player: MediaPlayer? = null
  private var savedAlarmVolume: Int? = null
  private var onDone: (() -> Unit)? = null

  /** Plays the sound saved in the settings. [done] runs once it has finished or was stopped. */
  fun playReminder(c: Context, done: () -> Unit) =
      play(c, Prefs.sound(c), Prefs.volume(c), Prefs.overrideVolume(c), done)

  @Synchronized
  fun play(
      c: Context,
      sound: String,
      volume: Int,
      overrideVolume: Boolean,
      done: (() -> Unit)? = null,
  ) {
    stop(c)
    val app = c.applicationContext
    val percent = volume.coerceIn(Prefs.MIN_VOLUME, Prefs.MAX_VOLUME)
    val gain =
        if (overrideVolume) {
          raiseAlarmVolume(app, percent)
          1f
        } else {
          percent / 100f
        }
    onDone = done
    try {
      player =
          MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build())
            setDataSource(app, uri(app, sound))
            setVolume(gain, gain)
            setOnCompletionListener { stop(app) }
            setOnErrorListener { _, _, _ ->
              stop(app)
              true
            }
            prepare()
            start()
          }
      handler.postDelayed({ stop(app) }, MAX_PLAY_MS)
    } catch (e: Exception) {
      stop(app)
    }
  }

  @Synchronized
  fun stop(c: Context) {
    handler.removeCallbacksAndMessages(null)
    player?.run {
      runCatching { stop() }
      release()
    }
    player = null
    savedAlarmVolume?.let { previous ->
      runCatching {
        c.applicationContext
            .getSystemService(AudioManager::class.java)
            .setStreamVolume(AudioManager.STREAM_ALARM, previous, 0)
      }
    }
    savedAlarmVolume = null
    onDone?.let {
      onDone = null
      it()
    }
  }

  private fun raiseAlarmVolume(c: Context, percent: Int) {
    val am = c.getSystemService(AudioManager::class.java)
    val max = am.getStreamMaxVolume(AudioManager.STREAM_ALARM)
    val target = ceil(max * percent / 100.0).toInt().coerceIn(1, max)
    runCatching {
      val current = am.getStreamVolume(AudioManager.STREAM_ALARM)
      am.setStreamVolume(AudioManager.STREAM_ALARM, target, 0)
      savedAlarmVolume = current
    }
  }

  private fun uri(c: Context, sound: String): Uri {
    if (sound == SYSTEM) {
      RingtoneManager.getActualDefaultRingtoneUri(c, RingtoneManager.TYPE_ALARM)?.let {
        return it
      }
    }
    val res = sounds[sound] ?: sounds.getValue(DEFAULT)
    return Uri.parse("android.resource://${c.packageName}/$res")
  }
}
