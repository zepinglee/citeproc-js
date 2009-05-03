@echo off
setlocal

echo Started test-run
set starttime=%time%

cd %~dp0

set RHINO=%~dp0\rhino\js-1.7R1.jar
set DOJO=%~dp0\dojo\dojo\dojo.js
set DOH=%~dp0\dojo\util\doh\

set TARGET=%~dp0\tests\run.js

java -client -jar %RHINO% %TARGET% dojoUrl=%DOJO%  testModule=""

echo Finished test-run
echo Start Time = %starttime%
echo   End Time = %time%
