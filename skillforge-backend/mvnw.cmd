@REM Maven Wrapper script for Windows
@REM Downloads and runs the specified Maven version

@echo off

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"
set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper"
set "MAVEN_DIR=%MAVEN_HOME%\apache-maven-3.9.9"

@REM Download and extract Maven if not already present
if not exist "%MAVEN_DIR%" (
    echo Downloading Maven...
    if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"

    powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip' -OutFile '%MAVEN_HOME%\maven-dist.zip'" || (
        echo Error: Failed to download Maven distribution.
        exit /b 1
    )

    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_HOME%\maven-dist.zip' -DestinationPath '%MAVEN_HOME%' -Force" || (
        echo Error: Failed to extract Maven distribution.
        exit /b 1
    )

    del /f /q "%MAVEN_HOME%\maven-dist.zip" 2>nul
    echo Maven installed to %MAVEN_DIR%
)

@REM Run Maven with all passed arguments
"%MAVEN_DIR%\bin\mvn.cmd" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" %*
