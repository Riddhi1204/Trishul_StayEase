from PIL import Image
import os
import base64

# Paths
source_img_path = r"C:\Users\Riddhi Kumari\.gemini\antigravity\brain\9f528bd6-959d-48cb-912d-eb1c242e6517\media__1784188929403.jpg"
public_dir = r"C:\Users\Riddhi Kumari\Desktop\TRISHUL\frontend\public"

# Ensure public dir exists
os.makedirs(public_dir, exist_ok=True)

# 1. Open image and make background transparent (basic approach: remove white)
img = Image.open(source_img_path).convert("RGBA")
datas = img.getdata()

newData = []
# A simple threshold to remove white-ish background
for item in datas:
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0)) # transparent
    else:
        newData.append(item)

img.putdata(newData)

# Generate icon-512x512.png
img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
img_512.save(os.path.join(public_dir, "icon-512x512.png"), "PNG")

# Generate apple-touch-icon.png (180x180)
img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
img_180.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")

# Generate favicon.ico (32x32, 16x16)
img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
img.save(os.path.join(public_dir, "favicon.ico"), format="ICO", sizes=[(32, 32), (16, 16)])

# Generate SVG wrapping the base64 transparent PNG
import io
buffer = io.BytesIO()
img.save(buffer, format="PNG")
b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

svg_template = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img.width} {img.height}">
  <image href="data:image/png;base64,{b64_str}" width="{img.width}" height="{img.height}" />
</svg>"""

with open(os.path.join(public_dir, "logo.svg"), "w") as f:
    f.write(svg_template)

# For logo-light, we just use the same since it's dark text.
with open(os.path.join(public_dir, "logo-light.svg"), "w") as f:
    f.write(svg_template)

# For logo-dark, we apply an invert filter to make dark text readable on dark backgrounds
svg_dark_template = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img.width} {img.height}">
  <filter id="invert"><feColorMatrix in="SourceGraphic" type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" /></filter>
  <image href="data:image/png;base64,{b64_str}" width="{img.width}" height="{img.height}" filter="url(#invert)" />
</svg>"""

with open(os.path.join(public_dir, "logo-dark.svg"), "w") as f:
    f.write(svg_dark_template)

print("Assets generated successfully!")
