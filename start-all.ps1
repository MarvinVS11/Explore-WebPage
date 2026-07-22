$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$b  = "$root\backend"
$f  = "$root\frontend"
$ab = "$root\admin\backend"
$af = "$root\admin\frontend"
$ff = "$root\fubono\frontend"

$args = (
    "new-tab --title `"Backend Publico`"  -d `"$b`"  cmd /k npm run dev ; " +
    "new-tab --title `"Frontend Explore`" -d `"$f`"  cmd /k npm run dev ; " +
    "new-tab --title `"Admin Backend`"    -d `"$ab`" cmd /k npm run dev ; " +
    "new-tab --title `"Admin Frontend`"   -d `"$af`" cmd /k npm run dev ; " +
    "new-tab --title `"Fubono Frontend`"  -d `"$ff`" cmd /k npm run dev"
)

Start-Process wt -ArgumentList $args
