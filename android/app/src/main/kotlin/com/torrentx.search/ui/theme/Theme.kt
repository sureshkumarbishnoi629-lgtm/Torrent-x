package com.torrentx.search.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val LimeGreen = Color(0xFFA3E635)
val PureBlack = Color(0xFF000000)

private val DarkColorScheme = darkColorScheme(
    primary = LimeGreen,
    secondary = LimeGreen,
    background = PureBlack,
    surface = Color(0xFF121212),
    onPrimary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = LimeGreen,
    secondary = LimeGreen,
    background = Color.White,
    surface = Color(0xFFF5F5F5),
    onPrimary = Color.Black,
    onBackground = Color.Black,
    onSurface = Color.Black
)

@Composable
fun TorrentXTheme(
    themeSetting: String = "Dark",
    trueBlack: Boolean = true,
    content: @Composable () -> Unit
) {
    val darkTheme = when (themeSetting) {
        "Dark" -> true
        "Light" -> false
        else -> isSystemInDarkTheme()
    }

    val colorScheme = if (darkTheme) {
        if (trueBlack) DarkColorScheme else DarkColorScheme.copy(background = Color(0xFF121212))
    } else {
        LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
