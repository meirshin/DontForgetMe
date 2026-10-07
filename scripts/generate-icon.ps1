# Generates the Android launcher icons (legacy, round and adaptive foreground), a
# 512px preview at assets/icon.png and the 1024x500 Play Store feature graphics at
# assets/feature-graphic.png (English) and assets/feature-graphic-he.png (Hebrew).
# Run from anywhere: powershell -File scripts/generate-icon.ps1
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$res = Join-Path $root 'android\app\src\main\res'

function Color($hex) { [System.Drawing.ColorTranslator]::FromHtml($hex) }
function Brush($hex) { New-Object System.Drawing.SolidBrush (Color $hex) }
function Pt($x, $y) { New-Object System.Drawing.PointF ([single]$x), ([single]$y) }

$bgTop = Color '#F76707'
$bgBottom = Color '#D9480F'

function RoundRectPath($x, $y, $w, $h, $r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = [single](2 * $r)
  $p.AddArc([single]$x, [single]$y, $d, $d, [single]180, [single]90)
  $p.AddArc([single]($x + $w - 2 * $r), [single]$y, $d, $d, [single]270, [single]90)
  $p.AddArc([single]($x + $w - 2 * $r), [single]($y + $h - 2 * $r), $d, $d, [single]0, [single]90)
  $p.AddArc([single]$x, [single]($y + $h - 2 * $r), $d, $d, [single]90, [single]90)
  $p.CloseFigure()
  $p
}

function FillSoftPolygon($g, $hex, $points, $round) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $p.AddPolygon([System.Drawing.PointF[]]$points)
  $g.FillPath((Brush $hex), $p)
  $pen = New-Object System.Drawing.Pen (Color $hex), ([single]$round)
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawPath($pen, $p)
}

function FillCircle($g, $hex, $cx, $cy, $r) {
  $g.FillEllipse((Brush $hex), [single]($cx - $r), [single]($cy - $r), [single](2 * $r), [single](2 * $r))
}

function HeartPath($cx, $cy, $w) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $p.AddBezier((Pt $cx ($cy + 0.42 * $w)), (Pt ($cx - 0.7 * $w) ($cy - 0.05 * $w)),
    (Pt ($cx - 0.32 * $w) ($cy - 0.62 * $w)), (Pt $cx ($cy - 0.2 * $w)))
  $p.AddBezier((Pt $cx ($cy - 0.2 * $w)), (Pt ($cx + 0.32 * $w) ($cy - 0.62 * $w)),
    (Pt ($cx + 0.7 * $w) ($cy - 0.05 * $w)), (Pt $cx ($cy + 0.42 * $w)))
  $p.CloseFigure()
  $p
}

# The artwork lives in a 108x108 unit space (Android adaptive icon grid), centered at (54, 54).
function DrawCar($g) {
  $white = '#FFFFFF'
  FillSoftPolygon $g $white @((Pt 32 51), (Pt 40 33), (Pt 68 33), (Pt 78 51)) 5
  $g.FillPath((Brush $white), (RoundRectPath 22 50 64 20 7))

  $glass = '#FFE8CC'
  FillSoftPolygon $g $glass @((Pt 38 48.5), (Pt 43.5 37), (Pt 52.5 37), (Pt 52.5 48.5)) 2
  FillSoftPolygon $g $glass @((Pt 55.5 37), (Pt 64.5 37), (Pt 70.5 48.5), (Pt 55.5 48.5)) 2

  # The precious passenger in the back seat
  $g.FillPath((Brush '#E03131'), (HeartPath 46.5 43.5 12))

  $g.FillPath((Brush '#FFD43B'), (RoundRectPath 80.5 56 5 4.5 1.5))
  $g.FillPath((Brush '#FA5252'), (RoundRectPath 22.5 56 4 4.5 1.5))

  foreach ($cx in 36, 72) {
    FillCircle $g '#343A40' $cx 70 8.5
    FillCircle $g '#CED4DA' $cx 70 3.5
  }
}

function NewCanvas($size) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  @{ Bmp = $bmp; G = $g }
}

function GradientBrush($size) {
  $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
  New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $bgTop, $bgBottom, ([single]90)
}

# Maps the unit range [from, to] of the artwork onto the whole canvas.
function MapArtwork($g, $size, $from, $to) {
  $k = [single]($size / ($to - $from))
  $g.ScaleTransform($k, $k)
  $g.TranslateTransform([single](-$from), [single](-$from))
}

function Save($canvas, $path) {
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $canvas.Bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.G.Dispose()
  $canvas.Bmp.Dispose()
}

function LegacyIcon($size, $round, $path) {
  $c = NewCanvas $size
  $m = $size * 0.04
  if ($round) {
    $c.G.FillEllipse((GradientBrush $size), [single]$m, [single]$m, [single]($size - 2 * $m), [single]($size - 2 * $m))
  } else {
    $c.G.FillPath((GradientBrush $size), (RoundRectPath $m $m ($size - 2 * $m) ($size - 2 * $m) ($size * 0.2)))
  }
  MapArtwork $c.G $size 12 96
  DrawCar $c.G
  Save $c $path
}

function ForegroundIcon($size, $path) {
  $c = NewCanvas $size
  # Keep the artwork comfortably inside the 66dp safe zone of adaptive icons.
  MapArtwork $c.G $size 0 108
  $c.G.TranslateTransform(54, 54)
  $c.G.ScaleTransform(0.9, 0.9)
  $c.G.TranslateTransform(-54, -54)
  DrawCar $c.G
  Save $c $path
}

$densities = [ordered]@{ mdpi = 1; hdpi = 1.5; xhdpi = 2; xxhdpi = 3; xxxhdpi = 4 }
foreach ($d in $densities.Keys) {
  $scale = $densities[$d]
  $dir = Join-Path $res "mipmap-$d"
  LegacyIcon ([int](48 * $scale)) $false (Join-Path $dir 'ic_launcher.png')
  LegacyIcon ([int](48 * $scale)) $true (Join-Path $dir 'ic_launcher_round.png')
  ForegroundIcon ([int](108 * $scale)) (Join-Path $dir 'ic_launcher_foreground.png')
}

# Full-bleed 512px preview (also suitable as the Play Store icon)
$preview = NewCanvas 512
$preview.G.FillRectangle((GradientBrush 512), 0, 0, 512, 512)
MapArtwork $preview.G 512 10 98
DrawCar $preview.G
Save $preview (Join-Path $root 'assets\icon.png')

# Play Store feature graphic (1024x500, no transparency). In RTL the layout is mirrored.
function FeatureGraphic($title, $tagline, $badges, $rtl, $path) {
  $fw = 1024; $fh = 500
  $bmp = New-Object System.Drawing.Bitmap $fw, $fh, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $rect = New-Object System.Drawing.RectangleF 0, 0, $fw, $fh
  $g.FillRectangle((New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $bgTop, $bgBottom, ([single]35)), $rect)

  # Rectangles are laid out for LTR and mirrored horizontally for RTL.
  $box = {
    param($x, $y, $w, $h)
    if ($rtl) { $x = $fw - $x - $w }
    New-Object System.Drawing.RectangleF ([single]$x), ([single]$y), ([single]$w), ([single]$h)
  }

  $halo = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
  $g.FillEllipse($halo, (& $box 35 45 410 410))

  # Car centered in the halo; the artwork's car spans roughly (22..86, 33..79) units.
  $carX = if ($rtl) { $fw - 240 } else { 240 }
  $g.TranslateTransform($carX, 250)
  $g.ScaleTransform(5.6, 5.6)
  $g.TranslateTransform(-54, -56)
  DrawCar $g
  $g.ResetTransform()

  $px = [System.Drawing.GraphicsUnit]::Pixel
  $regular = [System.Drawing.FontStyle]::Regular
  $titleFont = New-Object System.Drawing.Font 'Segoe UI', ([single]62), ([System.Drawing.FontStyle]::Bold), $px
  $tagFont = New-Object System.Drawing.Font 'Segoe UI Semibold', ([single]31), $regular, $px
  $badgeFont = New-Object System.Drawing.Font 'Segoe UI', ([single]25), $regular, $px
  $fmt = New-Object System.Drawing.StringFormat
  if ($rtl) { $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft }
  $white = Brush '#FFFFFF'
  $g.DrawString($title, $titleFont, $white, (& $box 466 126 550 90), $fmt)
  $g.DrawString($tagline, $tagFont, $white, (& $box 470 220 510 100), $fmt)
  $g.DrawString($badges, $badgeFont, (Brush '#FFE8CC'), (& $box 472 340 510 40), $fmt)

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$dot = [char]0x00B7
FeatureGraphic "Don't Forget Me" 'A reminder to check the back seat every time you leave the car.' `
  "Free $dot No ads $dot No account" $false (Join-Path $root 'assets\feature-graphic.png')
# This file must be saved as UTF-8 with BOM so Windows PowerShell reads the Hebrew correctly.
FeatureGraphic 'אל תשכח אותי' 'תזכורת לבדוק את המושב האחורי בכל פעם שיוצאים מהרכב.' `
  "חינם $dot ללא פרסומות $dot ללא הרשמה" $true (Join-Path $root 'assets\feature-graphic-he.png')

Write-Host 'Icons and feature graphics generated.'
