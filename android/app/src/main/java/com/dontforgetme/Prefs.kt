package com.dontforgetme

import android.content.Context

object Prefs {
  private const val FILE = "dont_forget_me"
  private const val KEY_ENABLED = "enabled"
  private const val KEY_DELAY = "delay_minutes"
  private const val KEY_DEVICES = "devices"
  private const val KEY_KNOWN_CARS = "known_cars"
  private const val KEY_SOUND = "sound"
  private const val KEY_VOLUME = "volume"
  private const val KEY_OVERRIDE_VOLUME = "override_volume"
  private const val KEY_LANGUAGE = "language"
  private const val KEY_DISCLAIMER = "disclaimer_accepted_v1"

  const val DEFAULT_DELAY_MINUTES = 2
  const val MIN_DELAY_MINUTES = 1
  const val MAX_DELAY_MINUTES = 60

  const val DEFAULT_VOLUME = 90
  const val MIN_VOLUME = 10
  const val MAX_VOLUME = 100

  private fun prefs(c: Context) = c.getSharedPreferences(FILE, Context.MODE_PRIVATE)

  fun isEnabled(c: Context): Boolean = prefs(c).getBoolean(KEY_ENABLED, true)

  fun setEnabled(c: Context, value: Boolean) =
      prefs(c).edit().putBoolean(KEY_ENABLED, value).apply()

  fun delayMinutes(c: Context): Int = prefs(c).getInt(KEY_DELAY, DEFAULT_DELAY_MINUTES)

  fun setDelayMinutes(c: Context, value: Int) =
      prefs(c)
          .edit()
          .putInt(KEY_DELAY, value.coerceIn(MIN_DELAY_MINUTES, MAX_DELAY_MINUTES))
          .apply()

  fun devices(c: Context): Set<String> =
      prefs(c).getStringSet(KEY_DEVICES, emptySet())?.toSet() ?: emptySet()

  fun setDevices(c: Context, value: Set<String>) =
      prefs(c).edit().putStringSet(KEY_DEVICES, value).apply()

  fun sound(c: Context): String =
      prefs(c).getString(KEY_SOUND, null)?.takeIf { AlertSound.isKnown(it) } ?: AlertSound.DEFAULT

  fun setSound(c: Context, value: String) =
      prefs(c).edit().putString(KEY_SOUND, value).apply()

  fun volume(c: Context): Int = prefs(c).getInt(KEY_VOLUME, DEFAULT_VOLUME)

  fun setVolume(c: Context, value: Int) =
      prefs(c).edit().putInt(KEY_VOLUME, value.coerceIn(MIN_VOLUME, MAX_VOLUME)).apply()

  /** Raise the phone's alarm volume while the reminder plays (on by default). */
  fun overrideVolume(c: Context): Boolean = prefs(c).getBoolean(KEY_OVERRIDE_VOLUME, true)

  fun setOverrideVolume(c: Context, value: Boolean) =
      prefs(c).edit().putBoolean(KEY_OVERRIDE_VOLUME, value).apply()

  /** App language chosen in the settings, or "" to follow the phone. */
  fun language(c: Context): String = prefs(c).getString(KEY_LANGUAGE, "") ?: ""

  fun setLanguage(c: Context, value: String) =
      prefs(c).edit().putString(KEY_LANGUAGE, value).apply()

  /** The safety notice and terms of use were accepted (bump the key's version when they change). */
  fun disclaimerAccepted(c: Context): Boolean = prefs(c).getBoolean(KEY_DISCLAIMER, false)

  fun acceptDisclaimer(c: Context) = prefs(c).edit().putBoolean(KEY_DISCLAIMER, true).apply()

  /**
   * Car devices are monitored by default the first time they are seen. After that the user's
   * choice is kept. Users who saved a device selection before this existed keep it as is.
   */
  fun addNewCars(c: Context, carAddresses: Collection<String>) {
    val p = prefs(c)
    val known = p.getStringSet(KEY_KNOWN_CARS, null)?.toSet()
    val fresh = carAddresses.filter { known == null || it !in known }
    if (fresh.isEmpty()) return
    val edit = p.edit().putStringSet(KEY_KNOWN_CARS, known.orEmpty() + fresh)
    if (known != null || !p.contains(KEY_DEVICES)) {
      edit.putStringSet(KEY_DEVICES, devices(c) + fresh)
    }
    edit.apply()
  }
}
