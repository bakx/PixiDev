rmdir /S /Q publish
mkdir publish
call build.bat
xcopy index.html publish
xcopy favicon.ico publish
xcopy config "publish/config" /s /i
xcopy gfx "publish/gfx" /s /i
xcopy dist "publish/dist" /s /i