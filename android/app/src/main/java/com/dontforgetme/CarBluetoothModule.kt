package com.dontforgetme

import android.annotation.SuppressLint
import android.bluetooth.BluetoothClass
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.dontforgetme.specs.NativeCarBluetoothSpec
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import java.util.Locale

class CarBluetoothModule(reactContext: ReactApplicationContext) :
    NativeCarBluetoothSpec(reactContext) {

  private val ctx
    get() = reactApplicationContext

  override fun getName() = NAME

  @SuppressLint("MissingPermission")
  override fun getPairedDevices(promise: Promise) {
    try {
      val adapter = ctx.getSystemService(BluetoothManager::class.java)?.adapter
      val result = Arguments.createArray()
      val bonded = adapter?.bondedDevices.orEmpty()
      Prefs.addNewCars(ctx, bonded.filter { it.isCar() }.map { it.address })
      bonded.forEach { d ->
        result.pushMap(
            Arguments.createMap().apply {
              putString("name", d.name ?: d.address)
              putString("address", d.address)
              putBoolean("isCar", d.isCar())
            })
      }
      promise.resolve(result)
    } catch (e: SecurityException) {
      promise.reject("E_PERMISSION", e.message, e)
    }
  }

  override fun getSettings(promise: Promise) {
    val devices = Arguments.createArray()
    Prefs.devices(ctx).forEach { devices.pushString(it) }
    promise.resolve(
        Arguments.createMap().apply {
          putBoolean("enabled", Prefs.isEnabled(ctx))
          putInt("delayMinutes", Prefs.delayMinutes(ctx))
          putArray("selectedDevices", devices)
          putString("sound", Prefs.sound(ctx))
          putInt("volume", Prefs.volume(ctx))
          putBoolean("overrideVolume", Prefs.overrideVolume(ctx))
          putString("message", Prefs.message(ctx))
        })
  }

  override fun setEnabled(enabled: Boolean) {
    Prefs.setEnabled(ctx, enabled)
    if (!enabled) Reminder.cancel(ctx)
  }

  override fun setDelayMinutes(minutes: Double) = Prefs.setDelayMinutes(ctx, minutes.toInt())

  override fun setSelectedDevices(addresses: ReadableArray) {
    val set = mutableSetOf<String>()
    for (i in 0 until addresses.size()) addresses.getString(i)?.let { set.add(it) }
    Prefs.setDevices(ctx, set)
  }

  override fun setSound(sound: String) {
    if (AlertSound.isKnown(sound)) Prefs.setSound(ctx, sound)
  }

  override fun setVolume(volume: Double) = Prefs.setVolume(ctx, volume.toInt())

  override fun setOverrideVolume(enabled: Boolean) = Prefs.setOverrideVolume(ctx, enabled)

  override fun setMessage(message: String) = Prefs.setMessage(ctx, message)

  override fun previewSound(sound: String, volume: Double, overrideVolume: Boolean) =
      AlertSound.play(ctx, sound, volume.toInt(), overrideVolume)

  override fun stopSound() = AlertSound.stop(ctx)

  override fun getSystemStatus(promise: Promise) {
    val pm = ctx.getSystemService(PowerManager::class.java)
    promise.resolve(
        Arguments.createMap().apply {
          putBoolean("exactAlarms", Reminder.canScheduleExact(ctx))
          putBoolean("batteryUnrestricted", pm.isIgnoringBatteryOptimizations(ctx.packageName))
        })
  }

  override fun openExactAlarmSettings() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return
    startSettings(
        Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:${ctx.packageName}")))
  }

  @SuppressLint("BatteryLife")
  override fun requestIgnoreBatteryOptimizations() {
    startSettings(
        Intent(
            Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
            Uri.parse("package:${ctx.packageName}"),
        ))
  }

  override fun getDeviceLanguage(): String = Locale.getDefault().language

  override fun getLanguage(): String = Prefs.language(ctx)

  override fun setLanguage(language: String) = Prefs.setLanguage(ctx, language)

  override fun isDisclaimerAccepted(): Boolean = Prefs.disclaimerAccepted(ctx)

  override fun acceptDisclaimer() = Prefs.acceptDisclaimer(ctx)

  override fun testReminder(seconds: Double) = Reminder.schedule(ctx, (seconds * 1000).toLong())

  private fun startSettings(intent: Intent) {
    ctx.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
  }

  companion object {
    const val NAME = "NativeCarBluetooth"
  }
}

@SuppressLint("MissingPermission")
internal fun BluetoothDevice.isCar(): Boolean {
  val cls = runCatching { bluetoothClass?.deviceClass }.getOrNull()
  return cls == BluetoothClass.Device.AUDIO_VIDEO_CAR_AUDIO ||
      cls == BluetoothClass.Device.AUDIO_VIDEO_HANDSFREE
}
