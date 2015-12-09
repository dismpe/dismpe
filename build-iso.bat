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
@echo on

for /f "tokens=1-5*" %%1 in ('vol') do (
   set vol=%%6 & goto done
)
:done
echo %vol%
echo start creating the iso
call %~dp0get-label.bat %SRC_ISO%

call :GetLabel %SRC_ISO% SRC_ISO_LABEL
echo %SRC_ISO_LABEL%

oscdimg -t%ISO_TIME% -o "-l%SRC_ISO_LABEL%" -g -d -n -m -b"%TARGET_ISO%\boot\etfsboot.com" %TARGET_ISO% %TARGET_ISO%\..\final.iso

goto :eof

:GetLabel
setlocal
for /f "tokens=5*" %%a in (
  'vol "%~1"^|find "Volume in drive "') do (
    set label_=%%b)
endlocal & set "%2=%label_%" & goto :EOF