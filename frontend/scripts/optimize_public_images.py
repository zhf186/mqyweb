from __future__ import annotations

import argparse
import io
import warnings
from pathlib import Path

from PIL import Image, ImageOps


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
Image.MAX_IMAGE_PIXELS = None
warnings.simplefilter("ignore", Image.DecompressionBombWarning)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize large public images for web delivery.")
    parser.add_argument("root", type=Path, help="Root directory to scan.")
    parser.add_argument("--min-bytes", type=int, default=300_000, help="Only optimize files above this size.")
    parser.add_argument("--max-edge", type=int, default=2200, help="Resize images whose long edge exceeds this.")
    parser.add_argument("--jpeg-quality", type=int, default=82, help="JPEG output quality.")
    parser.add_argument(
        "--report-only",
        action="store_true",
        help="Inspect candidates without writing changes.",
    )
    return parser.parse_args()


def iter_candidates(root: Path, min_bytes: int):
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        if path.stat().st_size < min_bytes:
            continue
        yield path


def resize_if_needed(image: Image.Image, max_edge: int) -> Image.Image:
    width, height = image.size
    longest_edge = max(width, height)
    if longest_edge <= max_edge:
        return image

    scale = max_edge / longest_edge
    next_size = (max(1, int(width * scale)), max(1, int(height * scale)))
    return image.resize(next_size, Image.Resampling.LANCZOS)


def optimize_image(path: Path, max_edge: int, jpeg_quality: int, report_only: bool) -> tuple[bool, int, int]:
    original_size = path.stat().st_size

    with Image.open(path) as source_image:
        image = ImageOps.exif_transpose(source_image)
        image.load()

    image = resize_if_needed(image, max_edge)

    buffer = io.BytesIO()
    extension = path.suffix.lower()

    if extension in {".jpg", ".jpeg"}:
        if image.mode not in {"RGB", "L"}:
            image = image.convert("RGB")
        image.save(
            buffer,
            format="JPEG",
            quality=jpeg_quality,
            optimize=True,
            progressive=True,
        )
    else:
        if image.mode not in {"RGB", "RGBA", "P", "L"}:
            image = image.convert("RGBA")
        image.save(
            buffer,
            format="PNG",
            optimize=True,
            compress_level=9,
        )

    optimized_bytes = buffer.getvalue()
    optimized_size = len(optimized_bytes)

    if optimized_size >= original_size:
        return False, original_size, optimized_size

    if not report_only:
        path.write_bytes(optimized_bytes)

    return True, original_size, optimized_size


def main() -> int:
    args = parse_args()
    root = args.root.resolve()

    if not root.exists():
        raise SystemExit(f"Path does not exist: {root}")

    optimized_files = 0
    bytes_before = 0
    bytes_after = 0

    for path in iter_candidates(root, args.min_bytes):
        changed, original_size, optimized_size = optimize_image(
            path,
            max_edge=args.max_edge,
            jpeg_quality=args.jpeg_quality,
            report_only=args.report_only,
        )
        if not changed:
            continue

        optimized_files += 1
        bytes_before += original_size
        bytes_after += optimized_size

        saved_kb = (original_size - optimized_size) / 1024
        print(f"optimized {path} | {original_size / 1024:.1f} KB -> {optimized_size / 1024:.1f} KB | saved {saved_kb:.1f} KB")

    if optimized_files == 0:
        print("No files were reduced.")
        return 0

    saved_mb = (bytes_before - bytes_after) / 1024 / 1024
    print(
        f"Optimized {optimized_files} files | {bytes_before / 1024 / 1024:.2f} MB -> {bytes_after / 1024 / 1024:.2f} MB | saved {saved_mb:.2f} MB"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
