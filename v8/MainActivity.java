package com.brizking.constructionrecords;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.*;
import android.view.ViewGroup;
import android.print.*;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView, printWebView;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(-1, -1));
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        webView.addJavascriptInterface(new Bridge(), "BrizKingNative");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)
                        || "mailto".equalsIgnoreCase(scheme) || "tel".equalsIgnoreCase(scheme)) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception ex) { Toast.makeText(MainActivity.this, "No app can open this link.", Toast.LENGTH_LONG).show(); }
                    return true;
                }
                return false;
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Uri uri = Uri.parse(url);
                String scheme = uri.getScheme();
                if ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)
                        || "mailto".equalsIgnoreCase(scheme) || "tel".equalsIgnoreCase(scheme)) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception ex) { Toast.makeText(MainActivity.this, "No app can open this link.", Toast.LENGTH_LONG).show(); }
                    return true;
                }
                return false;
            }
        });
        webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView);
        if (b == null) webView.loadUrl("file:///android_asset/index.html");
        else webView.restoreState(b);
    }

    public class Bridge {
        @JavascriptInterface public void shareText(final String message, final String title) {
            runOnUiThread(() -> {
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("text/plain");
                send.putExtra(Intent.EXTRA_TEXT, message == null ? "" : message);
                send.putExtra(Intent.EXTRA_SUBJECT, title == null ? "Briz King Construction" : title);
                try {
                    startActivity(Intent.createChooser(send, "Share Briz King estimate"));
                } catch (Exception ex) {
                    Toast.makeText(MainActivity.this, "Sharing is not available on this device.", Toast.LENGTH_LONG).show();
                }
            });
        }

        @JavascriptInterface public void printHtml(final String html, final String title) {
            runOnUiThread(() -> {
                printWebView = new WebView(MainActivity.this);
                printWebView.setWebViewClient(new WebViewClient() {
                    @Override public void onPageFinished(WebView v, String url) {
                        PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                        String n = (title == null ? "BrizKing-Document" : title).replaceAll("[^A-Za-z0-9._-]", "_");
                        pm.print(n, v.createPrintDocumentAdapter(n),
                                new PrintAttributes.Builder()
                                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                        .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                        .build());
                    }
                });
                printWebView.loadDataWithBaseURL(null, html, "text/HTML", "UTF-8", null);
            });
        }
    }

    @Override protected void onSaveInstanceState(Bundle b) {
        webView.saveState(b);
        super.onSaveInstanceState(b);
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}