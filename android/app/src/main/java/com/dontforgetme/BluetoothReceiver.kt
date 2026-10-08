package com.dontforgetme

import android.bluetooth.BluetoothA2dp
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothHeadset
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * Receives Bluetooth link events even when the app is not running. On disconnect from a selected
 * car device a reminder is scheduled; reconnecting before it fires cancels it.
 *
 * Turning Bluetooth off (or airplane mode) does not send ACL_DISCONNECTED on every phone, but the
 * audio/call profiles always report their disconnection, so those are used as a fallback while the
 * adapter is shutting down.
 */
class BluetoothReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val device: BluetoothDevice? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
        } else {
          @Suppress("DEPRECATION") intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
        }
    val address = device?.address ?: return
    if (intent.action == BluetoothDevice.ACTION_ACL_CONNECTED && device.isCar()) {
      Prefs.addNewCars(context, listOf(address))
    }

    if (!Prefs.isEnabled(context)) return
    if (address !in Prefs.devices(context)) return

    when (intent.action) {
      BluetoothDevice.ACTION_ACL_DISCONNECTED -> scheduleReminder(context)
      BluetoothDevice.ACTION_ACL_CONNECTED -> Reminder.cancel(context)
      BluetoothA2dp.ACTION_CONNECTION_STATE_CHANGED,
      BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED -> {
        val state = intent.getIntExtra(BluetoothProfile.EXTRA_STATE, -1)
        if (state == BluetoothProfile.STATE_DISCONNECTED && !isAdapterOn(context)) {
          scheduleReminder(context)
        }
      }
    }
  }

  private fun scheduleReminder(context: Context) =
      Reminder.schedule(context, Prefs.delayMinutes(context) * 60_000L)

  private fun isAdapterOn(context: Context): Boolean =
      context.getSystemService(BluetoothManager::class.java)?.adapter?.state ==
          BluetoothAdapter.STATE_ON
}
