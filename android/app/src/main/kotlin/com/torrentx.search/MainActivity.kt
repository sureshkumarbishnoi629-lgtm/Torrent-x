package com.torrentx.search

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.torrentx.search.data.SettingsRepository
import com.torrentx.search.ui.screens.HomeScreen
import com.torrentx.search.ui.theme.TorrentXTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val repository = SettingsRepository(this)
        
        setContent {
            val theme by repository.themeFlow.collectAsState(initial = "Dark")
            val trueBlack by repository.trueBlackFlow.collectAsState(initial = true)
            
            TorrentXTheme(themeSetting = theme, trueBlack = trueBlack) {
                HomeScreen(onSettingsClick = {
                    // Navigation to settings
                })
            }
        }
    }
}
