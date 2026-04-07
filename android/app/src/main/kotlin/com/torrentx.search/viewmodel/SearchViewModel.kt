package com.torrentx.search.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.torrentx.search.data.TorrentResult
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.jsoup.Jsoup

class SearchViewModel : ViewModel() {
    private val _results = MutableStateFlow<List<TorrentResult>>(emptyList())
    val results = _results.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching = _isSearching.asStateFlow()

    fun performSearch(query: String, enabledProviders: List<String>) {
        viewModelScope.launch {
            _isSearching.value = true
            val tasks = enabledProviders.map { providerName ->
                async {
                    scrapeProvider(providerName, query)
                }
            }
            _results.value = tasks.awaitAll().flatten()
            _isSearching.value = false
        }
    }

    private suspend fun scrapeProvider(provider: String, query: String): List<TorrentResult> {
        // Placeholder for actual scraping logic
        // In a real app, you would use Jsoup to parse the HTML of each provider
        // or call their respective APIs.
        return try {
            // Example structure:
            // val doc = Jsoup.connect("https://1337x.to/search/$query/1/").get()
            // parse doc and return results
            emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }
}
