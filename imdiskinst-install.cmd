cd /d "%~dp0"
set IMDISK_SILENT_SETUP=1
set "WD=%CD%"


set "SysDir=%WinDir%\SysWOW64"
if exist %SysDir% goto :install
set "SysDir=%WinDir%\System32"

:install
copy %WD%\imdiskinst\cli\%PROCESSOR_ARCHITECTURE%\imdisk.exe %SysDir%
copy %WD%\imdiskinst\svc\%PROCESSOR_ARCHITECTURE%\imdsksvc.exe %SysDir%
cd /d %WD%\imdiskinst
call uninstall_imdisk.cmd
cd /d %WD%\imdiskinst
call install.cmd
cd /d "%~dp0"