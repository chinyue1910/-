# settings.json 設定檔

```json
 // Live Sass Compiler -----------------------------------------------------------------------------------------
   "liveSassCompile.settings.formats": [
      // 輸出 css 檔案
      {
         "format": "expanded",
         "extensionName": ".css",
         "savePath": "/css"
      },
      // 輸出 min.css 壓縮檔案
      {
         "format": "compressed",
         "extensionName": ".min.css",
         "savePath": "/dist"
      }
   ],
   // 排除區域，這些路徑下不會轉成SASS
   "liveSassCompile.settings.excludeList": ["**/node_modules/**", ".vscode/**"],
   // 產生 Map 檔，SASS 跟 CSS 做對應行數,false => 不啟動
   "liveSassCompile.settings.generateMap": false,
   // 自動加入前綴（Prefix => moz、webkit、o、ms），市佔率大於 1% 或 最新的 2 個版本的瀏覽器
   "liveSassCompile.settings.autoprefix": ["> 1%", "last 2 versions"],
```
