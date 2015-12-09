call "%~dp0Windows AIK\PETools\pesetenv.cmd"
cd /d %~dp0
if not defined SRC_WIM (
  set SRC_WIM=C:\Win7\install.wim
)

if not defined TARGET_ISO (
  set TARGET_ISO=C:\Win7\iso\
)

if not defined SRC_ISO (
  set "SRC_ISO=A:"
)

if exist "%TARGET_ISO%\sources\install.wim" goto :iso_prepared
rd /s /q %TARGET_ISO%
::robocopy can preseve the folder timestamp
robocopy %SRC_ISO%\ %TARGET_ISO% /E /XF "%SRC_ISO%\sources\install.wim"

IMAGEX /COMPRESS maximum /EXPORT %SRC_WIM% 4 %TARGET_ISO%\sources\install.wim


:iso_prepared

:: http://finalthought.org/creating-customized-windows-8-1-media-iso-wim-flash-drive-part-2/ Win8
echo start creating the iso
oscdimg -n -m -bc:\windowsiso\boot\etfsboot.com c:\windowsiso c:\windowsdvd\windowsdvd.iso
oscdimg -n -m -b"%TARGET_ISO%\boot\etfsboot.com" %TARGET_ISO% %TARGET_ISO%\..\final.iso

