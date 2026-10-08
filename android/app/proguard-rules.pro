# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# TurboModule methods are invoked from native code by name.
-keep class com.dontforgetme.CarBluetoothModule { public *; }

# Fresco finds its animated-image support by reflection (AnimatedFactoryProvider looks up
# AnimatedFactoryV2Impl's constructor). Without these rules R8 strips the constructor and
# animated WebP images only show their first frame.
-keep class com.facebook.fresco.animation.** { *; }
-keep class com.facebook.imagepipeline.animated.** { *; }
-keep class com.facebook.animated.** { *; }
