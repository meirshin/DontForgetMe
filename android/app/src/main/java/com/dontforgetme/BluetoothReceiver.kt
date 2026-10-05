package com.dontforgetme

import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * Receives Bluetooth link events even when the app is not running. On disconnect from a selected
 * car device a reminder is scheduled; reconnecting before it fires cancels it.
 */
class BluetoothReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (!Prefs.isEnabled(context)) return

    val device: BluetoothDevice? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
        } else {
          @Suppress("DEPRECATION") intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
        }
    val address = device?.address ?: return
    if (address !in Prefs.devices(context)) return

    when (intent.action) {
      BluetoothDevice.ACTION_ACL_DISCONNECTED ->
          Reminder.schedule(context, Prefs.delayMinutes(context) * 60_000L)
      BluetoothDevice.ACTION_ACL_CONNECTED -> Reminder.cancel(context)
    }
  }
}
