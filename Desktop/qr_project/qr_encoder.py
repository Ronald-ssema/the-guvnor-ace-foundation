#!/usr/bin/env python3
import numpy as np
from reedsolo import RSCodec

# ============================================================
# STEP 1: TEXT → BYTE MODE BITSTREAM
# ============================================================

def text_to_bits(text: str) -> np.ndarray:
    """Convert ASCII text into QR Byte Mode raw bits."""
    bits = []

    # Mode indicator for BYTE MODE = 0100
    bits += [0,1,0,0]

    # Character count (8 bits for Version 1)
    count = len(text)
    bits += [int(b) for b in f"{count:08b}"]

    # Encode each character using ISO-8859-1 (one byte per char)
    for ch in text:
        byte = ord(ch)
        bits += [int(b) for b in f"{byte:08b}"]

    return np.array(bits, dtype=np.uint8)


# ============================================================
# STEP 2: PAD TO 152 BITS (Version 1-L requires exactly 19 bytes)
# ============================================================

def pad_bits_to_152(bits: np.ndarray) -> np.ndarray:
    data = list(bits)

    # Terminator: up to 4 zeros (but not past 152 bits)
    remaining = 152 - len(data)
    terminator = min(4, remaining)
    data += [0] * terminator

    # Pad to the next byte boundary
    while len(data) % 8 != 0:
        data.append(0)

    # Alternate pad bytes 11101100 & 00010001 until total = 152 bits
    pad_bytes = [[1,1,1,0,1,1,0,0], [0,0,0,1,0,0,0,1]]
    i = 0
    while len(data) < 152:
        data += pad_bytes[i]
        i = 1 - i

    return np.array(data[:152], dtype=np.uint8)


# ============================================================
# STEP 3: BITSTREAM → 19 DATA CODEWORDS
# ============================================================

def bits_to_codewords(bits: np.ndarray) -> list:
    """Convert 152 bits into 19 bytes."""
    return [int("".join(str(b) for b in bits[i:i+8]), 2)
            for i in range(0, 152, 8)]


# ============================================================
# STEP 4: GENERATE ECC BYTES (7 bytes for Version 1-L)
# ============================================================

def generate_ecc(data_codewords: list) -> list:
    rsc = RSCodec(7)
    # encode() returns data + ecc → last 7 bytes are ECC
    ecc = rsc.encode(bytearray(data_codewords))[-7:]
    return list(ecc)


# ============================================================
# STEP 5: EMPTY 21×21 MATRIX
# ============================================================

def create_empty_matrix():
    return np.full((21,21), -1, dtype=np.int8)   # -1 = unassigned


# ============================================================
# STEP 6: FINDER PATTERNS + SEPARATORS
# ============================================================

FINDER = np.array([
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
], dtype=np.int8)

def place_finder(matrix, r, c):
    matrix[r:r+7, c:c+7] = FINDER
    # Separator (0) around finder, if inside matrix
    for i in range(-1, 8):
        for j in range(-1, 8):
            rr, cc = r+i, c+j
            if 0 <= rr < 21 and 0 <= cc < 21:
                if not (0 <= i <= 6 and 0 <= j <= 6):
                    if matrix[rr, cc] == -1:
                        matrix[rr, cc] = 0
    return matrix

def place_finder_patterns(M):
    M = place_finder(M, 0, 0)
    M = place_finder(M, 0, 14)
    M = place_finder(M, 14, 0)
    return M


# ============================================================
# STEP 7: TIMING PATTERNS
# ============================================================

def place_timing_patterns(M):
    for i in range(8, 13):
        M[6, i] = i % 2
        M[i, 6] = i % 2
    return M


# ============================================================
# STEP 8: ALIGNMENT PATTERN (Version 1 has NONE)
# ============================================================

def place_alignment(M):
    return M


# ============================================================
# STEP 9: PLACE DATA BITS (Zig-zag)
# ============================================================

def place_data_bits(M, byte_stream):
    bits = []
    for b in byte_stream:
        bits += [int(x) for x in f"{b:08b}"]

    data_bits = bits[::-1]   # Reverse for pop()

    def is_reserved(r,c):
        return M[r,c] != -1

    col = 20
    upward = True

    while col > 0:
        if col == 6:     # Skip timing column
            col -= 1

        cols = [col, col-1]

        for c in cols:
            rows = range(20, -1, -1) if upward else range(21)
            for r in rows:
                if not is_reserved(r, c):
                    M[r,c] = data_bits.pop() if data_bits else 0

        upward = not upward
        col -= 2

    return M


# ============================================================
# STEP 10: DARK MODULE
# ============================================================

def place_dark_module(M):
    M[8,13] = 1
    return M


# ============================================================
# STEP 11: FORMAT INFORMATION (Mask 0, ECC Level L)
# ============================================================

FORMAT_BITS = [0,1,1,0,0,0,0,1,1,1,0,0,1,0,0]  # 15 bits

def place_format_info(M):
    fb = FORMAT_BITS

    # Row 8, columns 0–5
    for i in range(6):
        M[8, i] = fb[i]

    # Skip timing module at (8,6)
    M[8, 7] = fb[6]
    M[8, 8] = fb[7]
    M[7, 8] = fb[8]

    for i in range(9, 15):
        M[14 - (i-9), 8] = fb[i]

    # Top-left vertical
    for i in range(6):
        M[i, 8] = fb[14 - i]

    # Skip timing module
    M[7, 8] = fb[8]

    return M


# ============================================================
# STEP 12: APPLY MASK 0
# Mask 0 formula: (row + col) % 2 == 0
# ============================================================

def apply_mask_0(M):
    for r in range(21):
        for c in range(21):
            if M[r,c] in (0,1):
                if (r+c) % 2 == 0:
                    M[r,c] ^= 1
    return M


# ============================================================
# MAIN ENCODER PIPELINE
# ============================================================

def qr_encode(text: str):
    raw_bits = text_to_bits(text)
    padded_bits = pad_bits_to_152(raw_bits)
    data_codewords = bits_to_codewords(padded_bits)
    ecc_codewords = generate_ecc(data_codewords)

    full_stream = data_codewords + ecc_codewords

    M = create_empty_matrix()
    M = place_finder_patterns(M)
    M = place_timing_patterns(M)
    M = place_alignment(M)
    M = place_data_bits(M, full_stream)
    M = place_dark_module(M)
    M = place_format_info(M)
    M = apply_mask_0(M)

    return M


# ============================================================
# ASCII RENDER
# ============================================================

def render_ascii(M):
    for r in range(21):
        line = ""
        for c in range(21):
            line += "██" if M[r,c] == 1 else "  "
        print(line)


# ============================================================
# RUN DEMO
# ============================================================

if __name__ == "__main__":
    M = qr_encode("HELLO WORLD")
    print("\n=== FINAL QR CODE ===\n")
    render_ascii(M)
