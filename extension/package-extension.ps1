param(
  [string]$Out = "..\speakpublic-extension-v1.zip"
)

Write-Host "Packaging extension into $Out"
if (Test-Path $Out) { Remove-Item $Out -Force }
Compress-Archive -Path (Join-Path $PSScriptRoot '*') -DestinationPath $Out -Force
Write-Host "Done"
