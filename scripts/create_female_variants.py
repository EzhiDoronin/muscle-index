from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def female_proportions(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    data = np.asarray(image, dtype=np.float32)
    height, width, channels = data.shape
    center = (width - 1) / 2
    output = np.empty_like(data)

    points_y = np.array([0.00, 0.10, 0.18, 0.24, 0.33, 0.41, 0.50, 0.59, 0.69, 0.79, 0.93, 1.00])
    points_scale = np.array([1.00, 0.96, 0.93, 0.87, 0.90, 0.89, 1.07, 1.06, 1.03, 0.98, 0.97, 0.99])
    output_x = np.arange(width, dtype=np.float32)

    for y in range(height):
        scale = float(np.interp(y / max(height - 1, 1), points_y, points_scale))
        source_x = center + (output_x - center) / scale
        source_x = np.clip(source_x, 0, width - 1)
        for channel in range(channels):
            output[y, :, channel] = np.interp(source_x, output_x, data[y, :, channel])

    Image.fromarray(np.clip(output, 0, 255).astype(np.uint8), "RGB").save(destination, optimize=True)


female_proportions(
    ROOT / "public" / "muscle-anatomy-front.png",
    ROOT / "public" / "muscle-anatomy-female-front.png",
)
female_proportions(
    ROOT / "public" / "muscle-anatomy-male-back.png",
    ROOT / "public" / "muscle-anatomy-female-back.png",
)
