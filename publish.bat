rmdir /S /Q publish
mkdir publish

xcopy index.html publish
xcopy config "publish/config" /s /i
xcopy gfx "publish/gfx" /s /i
xcopy dist "publish/dist" /s /i