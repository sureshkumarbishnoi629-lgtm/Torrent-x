package com.torrentx.search.data

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class TorrentProvider(
    val name: String,
    var url: String,
    var isEnabled: Boolean = true,
    val isCustom: Boolean = false
)

data class TorrentResult(
    val title: String,
    val size: String,
    val seeds: Int,
    val leeches: Int,
    val category: String,
    val source: String,
    val magnetUrl: String
)

val Context.dataStore by preferencesDataStore(name = "settings")

class SettingsRepository(private val context: Context) {
    private val THEME_KEY = stringPreferencesKey("app_theme")
    private val TRUE_BLACK_KEY = booleanPreferencesKey("true_black")
    private val PROVIDERS_KEY = stringPreferencesKey("providers_json")

    val themeFlow: Flow<String> = context.dataStore.data.map { it[THEME_KEY] ?: "Dark" }
    val trueBlackFlow: Flow<Boolean> = context.dataStore.data.map { it[TRUE_BLACK_KEY] ?: true }

    suspend fun saveTheme(theme: String) {
        context.dataStore.edit { it[THEME_KEY] = theme }
    }

    suspend fun saveTrueBlack(enabled: Boolean) {
        context.dataStore.edit { it[TRUE_BLACK_KEY] = enabled }
    }
}
