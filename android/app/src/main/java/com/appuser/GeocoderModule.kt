package com.appuser

import android.location.Geocoder
import com.facebook.react.bridge.*
import java.util.Locale

class GeocoderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "GeocoderModule"

    @ReactMethod
    fun getAddress(latitude: Double, longitude: Double, promise: Promise) {
        try {
            val geocoder = Geocoder(reactContext, Locale("es", "CO"))

            val addresses = geocoder.getFromLocation(latitude, longitude, 1)

            if (addresses.isNullOrEmpty()) {
                promise.resolve(null)
                return
            }

            val address = addresses[0]

            val map = Arguments.createMap()

            map.putString("addressLine", address.getAddressLine(0))
            map.putString("country", address.countryName)
            map.putString("city", address.locality)
            map.putString("state", address.adminArea)
            map.putString("street", address.thoroughfare)
            map.putString("number", address.subThoroughfare)

            promise.resolve(map)

        } catch (e: Exception) {
            promise.reject("GEOCODER_ERROR", e)
        }
    }
}