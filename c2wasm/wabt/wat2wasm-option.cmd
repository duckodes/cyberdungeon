@echo off
setlocal

:: === �A�� wat �ɦW�� ===
set /p FILE_NAME=�п�J .wat �ɮ׸��|�G

:: === �B�~�Ѽƿﶵ ===
set /p EXTRA_OPTIONS=�п�J wat2wasm ���B�~�ﶵ�]�i�d�š^�G

:: === �۹���|�� WABT �u���m ===
set WABT_PATH=%~dp0\bin

:: === ��X�ɦW�]�۰ʴ����ɦW�^===
set OUTPUT_NAME=%FILE_NAME:.wat=.wasm%

:: === �I�s wat2wasm �u��i���ഫ ===
echo �����ഫ���O�G
echo "%WABT_PATH%\wat2wasm.exe" %EXTRA_OPTIONS% "%FILE_NAME%" -o "%OUTPUT_NAME%"
"%WABT_PATH%\wat2wasm.exe" %EXTRA_OPTIONS% "%FILE_NAME%" -o "%OUTPUT_NAME%"

if exist "%OUTPUT_NAME%" (
    echo ���\���� %OUTPUT_NAME%
) else (
    echo ���~�G�L�k�ഫ�A���ˬd�ɮ׻P���|�O�_���T�C
)

pause