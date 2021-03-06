if not defined PE_TOOLS_PREPARED (
  call "%~dp0Windows AIK\PETools\pesetenv.cmd"
)
SET PE_TOOLS_PREPARED=true

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

if not defined ISO_TIME (
  set ISO_TIME=04/12/2011,09:38:58
)

if exist "%TARGET_ISO%\sources\install.wim" goto :iso_prepared
rd /s /q %TARGET_ISO%
::robocopy can preseve the folder timestamp
robocopy %SRC_ISO%\ %TARGET_ISO% /E /XF "%SRC_ISO%\sources\install.wim"

IMAGEX /COMPRESS maximum /EXPORT %SRC_WIM% 4 %TARGET_ISO%\sources\install.wim


:iso_prepared

:: http://finalthought.org/creating-customized-windows-8-1-media-iso-wim-flash-drive-part-2/ Win8
::https://technet.microsoft.com/en-us/library/cc749036(v=ws.10).aspx

echo Start creating the iso

call :GetLabel %SRC_ISO% SRC_ISO_LABEL
echo %SRC_ISO_LABEL%

set BOOT_DATA=-u2 -udfver102 "-bootdata:2#p0,e,b%TARGET_ISO%\boot\etfsboot.com#pEF,e,b%TARGET_ISO%\efi\microsoft\boot\efisys.bin"
oscdimg -o -g -m -t%ISO_TIME% -l%SRC_ISO_LABEL% %BOOT_DATA% %TARGET_ISO% %TARGET_ISO%\..\final.iso

goto :eof

:GetLabel
setlocal
for /f "tokens=5*" %%a in (
  'vol "%~1"^|find "Volume in drive "') do (
    set label_=%%b)
endlocal & set "%2=%label_%" & goto :EOF