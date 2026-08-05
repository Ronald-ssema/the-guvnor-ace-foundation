#!/usr/bin/env python3
import os
import numpy as np
from reedsolo import RSCodec

# 🔧 Use a non-GUI backend so Tkinter / macOS doesn't crash
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
plt.ioff()


# ============================================================
# STEP 1 — TEXT → BYTE MODE BITSTREAM
# ============================================================

def text_to_bits(text: str) -> np.ndarray:
    """
    Encode input text using QR byte mode (ISO-8859-1 for simplicity).
    Returns a 1D NumPy array of 0/1 bits.
    """
    bits = []

    # Mode indicator for BYTE MODE = 0100
    bits += [0, 1, 0, 0]

    # Character count (8 bits for Version 1)
    length = len(text)
    bits += [int(b) for b in f"{length:08b}"]

    # One byte per character
    for ch in text:
        bits += [int(b) for b in f"{ord(ch):08b}"]

    return np.array(bits, dtype=np.uint8)


# ============================================================
# STEP 2 — PAD TO 152 BITS (Version 1-L)
# ============================================================

def pad_bits_to_152(bits: np.ndarray) -> np.ndarray:
    """
    Add terminator + pad bytes so that we end up with exactly 152 bits
    (19 data codewords) for Version 1-L.
    """
    data = list(bits)

    # Terminator: up to 4 zeros (but not beyond total capacity)
    remaining = 152 - len(data)
    data += [0] * min(4, remaining)

    # Pad to next byte boundary
    while len(data) % 8 != 0:
        data.append(0)

    # Alternate pad bytes 0xEC (11101100) and 0x11 (00010001)
    pad_bytes = [
        [1, 1, 1, 0, 1, 1, 0, 0],  # 0xEC
        [0, 0, 0, 1, 0, 0, 0, 1],  # 0x11
    ]
    i = 0
    while len(data) < 152:
        data += pad_bytes[i]
        i = 1 - i

    # Truncate just in case we went over
    return np.array(data[:152], dtype=np.uint8)


# ============================================================
# STEP 3 — BITSTREAM → 19 DATA CODEWORDS
# ============================================================

def bits_to_codewords(bits: np.ndarray) -> list:
    """
    Group the 152 data bits into 19 bytes (big-endian within each byte).
    """
    codewords = []
    for i in range(0, 152, 8):
        byte_bits = bits[i:i+8]
        value = int("".join(str(b) for b in byte_bits), 2)
        codewords.append(value)
    return codewords


# ============================================================
# STEP 4 — GENERATE ECC CODEWORDS (7 bytes, Level L)
# ============================================================

def generate_ecc(data_cw: list) -> list:
    """
    Use reedsolo to generate 7 ECC bytes for Version 1-L.
    """
    rsc = RSCodec(7)
    encoded = rsc.encode(bytearray(data_cw))
    ecc = encoded[-7:]       # last 7 bytes are ECC
    return list(ecc)


# ============================================================
# STEP 5 — EMPTY 21×21 MATRIX
# ============================================================

def create_empty_matrix() -> np.ndarray:
    """
    Create a 21x21 grid initialised to -1 (meaning "unused").
    """
    return np.full((21, 21), -1, dtype=np.int8)


# ============================================================
# STEP 6 — FINDER PATTERNS + SEPARATORS
# ============================================================

FINDER = np.array([
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
], dtype=np.int8)


def place_finder(M: np.ndarray, r: int, c: int) -> np.ndarray:
    """
    Place a 7x7 finder pattern at (r,c) with a white separator around it.
    """
    # Finder itself
    M[r:r+7, c:c+7] = FINDER

    # White separator ring (0) around the finder
    for i in range(-1, 8):
        for j in range(-1, 8):
            rr, cc = r + i, c + j
            if 0 <= rr < 21 and 0 <= cc < 21:
                if not (0 <= i <= 6 and 0 <= j <= 6):
                    if M[rr, cc] == -1:
                        M[rr, cc] = 0
    return M


def place_finder_patterns(M: np.ndarray) -> np.ndarray:
    """
    Place the three finder patterns on the matrix.
    """
    M = place_finder(M, 0, 0)    # top-left
    M = place_finder(M, 0, 14)   # top-right
    M = place_finder(M, 14, 0)   # bottom-left
    return M


# ============================================================
# STEP 7 — TIMING PATTERNS
# ============================================================

def place_timing_patterns(M: np.ndarray) -> np.ndarray:
    """
    Place horizontal and vertical timing patterns (alternating 1/0).
    """
    # Horizontal timing (row 6, columns 8–12)
    for c in range(8, 13):
        M[6, c] = c % 2

    # Vertical timing (column 6, rows 8–12)
    for r in range(8, 13):
        M[r, 6] = r % 2

    return M


# ============================================================
# STEP 10 — DARK MODULE
# ============================================================

def place_dark_module(M: np.ndarray) -> np.ndarray:
    """
    Fixed dark module position for Version 1 at (8, 13).
    """
    M[8, 13] = 1
    return M


# ============================================================
# STEP 11 — FORMAT INFORMATION (Level L, Mask 0)
# ============================================================

# Pre-computed 15-bit format string for (ECC=L, mask=0)
# Already BCH-encoded and mask-applied as per QR spec.
FORMAT_BITS = [0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0]


def place_format_info(M: np.ndarray) -> np.ndarray:
    """
    Place the 15 format bits in their two locations around the finders.
    This is a simplified but coursework-style placement.
    """
    fb = FORMAT_BITS

    # --- First copy around top-left finder ---

    # Row 8, columns 0–5, then column 7
    for i in range(6):
        M[8, i] = fb[i]
    M[8, 7] = fb[6]

    # Centre module & column 8 upwards
    M[8, 8] = fb[7]       # centre
    M[7, 8] = fb[8]
    M[5, 8] = fb[9]
    M[4, 8] = fb[10]
    M[3, 8] = fb[11]
    M[2, 8] = fb[12]
    M[1, 8] = fb[13]
    M[0, 8] = fb[14]

    # --- Second copy (top-right row and bottom-left column) ---

    # Row 8, columns 20–14
    M[8, 20] = fb[0]
    M[8, 19] = fb[1]
    M[8, 18] = fb[2]
    M[8, 17] = fb[3]
    M[8, 16] = fb[4]
    M[8, 15] = fb[5]
    M[8, 14] = fb[6]

    # Column 8, rows 20–14
    M[20, 8] = fb[7]
    M[19, 8] = fb[8]
    M[18, 8] = fb[9]
    M[17, 8] = fb[10]
    M[16, 8] = fb[11]
    M[15, 8] = fb[12]
    M[14, 8] = fb[13]
    # (13,8) overlaps function area in larger versions; unused here

    return M


# ============================================================
# STEP 9 — PLACE DATA BITS (ZIG-ZAG, TRACK DATA CELLS)
# ============================================================

def place_data_bits(M: np.ndarray, stream: list) -> tuple[np.ndarray, np.ndarray]:
    """
    Place data + ECC codewords into the matrix using the QR zig-zag pattern.

    Returns:
        M          – updated matrix
        data_mask  – boolean 21x21 array; True where a data bit was written.
                     Lets us apply the mask ONLY to data modules.
    """
    # Convert bytes to bit list (MSB first)
    bits = []
    for b in stream:
        bits.extend(int(x) for x in f"{b:08b}")

    data_mask = np.zeros_like(M, dtype=bool)

    col = 20          # start at rightmost column
    upward = True
    bit_index = 0

    while col > 0:
        # Skip timing column
        if col == 6:
            col -= 1

        for c in (col, col - 1):
            rows = range(20, -1, -1) if upward else range(21)
            for r in rows:
                # Anything already set (finder, timing, dark, format) is reserved
                if M[r, c] != -1:
                    continue

                # Take next bit or pad with 0 if bits run out
                if bit_index < len(bits):
                    bit = bits[bit_index]
                    bit_index += 1
                else:
                    bit = 0

                M[r, c] = bit
                data_mask[r, c] = True

        upward = not upward
        col -= 2

    return M, data_mask


# ============================================================
# STEP 12 — APPLY MASK 0 (ONLY TO DATA MODULES)
# ============================================================

def apply_mask_0(M: np.ndarray, data_mask: np.ndarray) -> np.ndarray:
    """
    Apply mask pattern 0 ((r + c) % 2 == 0) to data modules only.
    Function modules (finder, timing, format, dark) are untouched.
    """
    for r in range(21):
        for c in range(21):
            if data_mask[r, c] and ((r + c) % 2 == 0):
                M[r, c] ^= 1
    return M


# ============================================================
# MAIN ENCODER PIPELINE
# ============================================================

def qr_encode(text: str) -> np.ndarray:
    """
    Complete Version 1-L, mask 0 QR encoding pipeline for a single string.
    """
    # ---- Steps 1–4: bitstream + ECC ----
    raw_bits    = text_to_bits(text)
    padded_bits = pad_bits_to_152(raw_bits)
    data_cw     = bits_to_codewords(padded_bits)
    ecc_cw      = generate_ecc(data_cw)
    full_stream = data_cw + ecc_cw   # 19 data + 7 ECC = 26 codewords

    # ---- Steps 5–11: matrix construction ----
    M = create_empty_matrix()
    M = place_finder_patterns(M)
    M = place_timing_patterns(M)
    M = place_dark_module(M)
    M = place_format_info(M)

    # Data placement returns mask of data modules
    M, data_mask = place_data_bits(M, full_stream)

    # Apply mask 0 only to data modules
    M = apply_mask_0(M, data_mask)

    return M


# ============================================================
# ASCII RENDER (TERMINAL OUTPUT)
# ============================================================

def render_ascii(M: np.ndarray) -> None:
    """
    Print the QR matrix in a simple ASCII block form.
    """
    for r in range(21):
        print("".join("██" if M[r, c] == 1 else "  " for c in range(21)))


# ============================================================
# EXPORT PNG
# ============================================================

def export_png(M: np.ndarray, filename: str = "output_qr.png") -> None:
    """
    Save the QR matrix as a black-and-white PNG using matplotlib.
    """
    plt.figure(figsize=(4, 4))
    plt.imshow(M == 1, cmap="binary", interpolation="nearest")
    plt.axis("off")
    plt.savefig(filename, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"PNG saved to: {os.path.abspath(filename)}")


# ============================================================
# DEMO RUN
# ============================================================

if __name__ == "__main__":
    demo_text = "HELLO WORLD"
    print(f"Encoding demo string: {demo_text!r}")

    M = qr_encode(demo_text)

    print("\n=== FINAL QR CODE MATRIX ===\n")
    render_ascii(M)

    export_png(M)
