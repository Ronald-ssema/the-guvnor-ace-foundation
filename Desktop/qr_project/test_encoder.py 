#!/usr/bin/env python3
"""
Simple test harness for the Version-1-L educational QR encoder.

Run with:
    python test_encoder.py
"""

import os
from encoder.qr_encoder import qr_encode, export_png, render_ascii


TEST_CASES = [
    "HELLO WORLD",
    "CS1OP",
    "UNIVERSITY OF READING",
    "1234567890",
    "qr v1-l demo",
]


def run_tests():
    out_dir = "tests_output"
    os.makedirs(out_dir, exist_ok=True)

    for i, text in enumerate(TEST_CASES, start=1):
        print("=" * 60)
        print(f"Test {i}: {text!r}")
        print("- Raw matrix:")

        M = qr_encode(text)

        # ASCII view in terminal
        render_ascii(M)

        # Save PNG
        filename = os.path.join(out_dir, f"test_{i}.png")
        export_png(M, filename)

        print(f"Saved PNG -> {filename}")
        print()

    print("=" * 60)
    print("All tests finished. PNG files are in the 'tests_output' folder.")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
