if not defined PE_TOOLS_PREPARED (
  call "%~dp0Windows AIK\PETools\pesetenv.cmd"
)
SET PE_TOOLS_PREPARED=true
node %~dp0index.js