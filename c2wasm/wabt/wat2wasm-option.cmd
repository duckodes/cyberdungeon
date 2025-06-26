@echo off
setlocal

:: === 你的 wat 檔名稱 ===
set /p FILE_NAME=請輸入 .wat 檔案路徑：

:: === 額外參數選項 ===
set /p EXTRA_OPTIONS=請輸入 wat2wasm 的額外選項（可留空）：

:: === 相對路徑的 WABT 工具位置 ===
set WABT_PATH=%~dp0\bin

:: === 輸出檔名（自動換副檔名）===
set OUTPUT_NAME=%FILE_NAME:.wat=.wasm%

:: === 呼叫 wat2wasm 工具進行轉換 ===
echo 執行轉換指令：
echo "%WABT_PATH%\wat2wasm.exe" %EXTRA_OPTIONS% "%FILE_NAME%" -o "%OUTPUT_NAME%"
"%WABT_PATH%\wat2wasm.exe" %EXTRA_OPTIONS% "%FILE_NAME%" -o "%OUTPUT_NAME%"

if exist "%OUTPUT_NAME%" (
    echo 成功產生 %OUTPUT_NAME%
) else (
    echo 錯誤：無法轉換，請檢查檔案與路徑是否正確。
)

pause