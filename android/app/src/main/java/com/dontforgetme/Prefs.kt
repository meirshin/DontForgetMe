package com.dontforgetme

import android.content.Context

object Prefs {
  private const val FILE = "dont_forget_me"
  private const val KEY_ENABLED = "enabled"
  private const val KEY_DELAY = "delay_minutes"
  private const val KEY_DEVICES = "devices"

  const val DEFAULT_DELAY_MINUTES = 5
  const val MIN_DELAY_MINUTES = 1
  const val MAX_DELAY_MINUTES = 60

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
}
