import numpy as np
from reedsolo import RSCodec

# ===============================================================
# STEP 1: BYTE MODE ENCODING
# ===============================================================

BYTE_MODE_INDICATOR = "0100"       # Byte mode indicator
VERSION_1_DATA_BITS = 152          # Must produce exactly 152 bits
DATA_CODEWORDS = 19
ECC_CODEWORDS = 7


def encode_byte_mode(input_string: str) -> str:
    bits = BYTE_MODE_INDICATOR
    length = len(input_string)
    char_count_bits = format(length, "08b")
    bits += char_count_bits

    for ch in input_string:
        bits += format(ord(ch), "08b")

    return bits


def add_terminator_and_padding(bitstream: str) -> str:
    bits = bitstream

    remaining = VERSION_1_DATA_BITS - len(bits)
    if remaining > 0:
        bits += "0" * min(4, remaining)

    while len(bits) % 8 != 0:
        bits += "0"

    pad_bytes = ["11101100", "00010001"]
    idx = 0
    while len(bits) < VERSION_1_DATA_BITS:
        bits += pad_bytes[idx]
        idx ^= 1

    return bits


def bits_to_codewords(bits: str) -> list:
    codewords = []
    for i in range(0, len(bits), 8):
        codewords.append(int(bits[i:i+8], 2))
    return codewords


def generate_ecc(data_codewords: list) -> list:
    rsc = RSCodec(ECC_CODEWORDS)
    full = rsc.encode(bytes(data_codewords))
    return list(full[-ECC_CODEWORDS:])


# ===============================================================
# STEP 5: EMPTY 21×21 MATRIX
# ===============================================================

def create_empty_matrix() -> np.ndarray:
    return np.full((21, 21), None, dtype=object)


# ===============================================================
# STEP 6: FINDER PATTERNS + SEPARATORS
# ===============================================================

FINDER = np.array([
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
])

def place_fp(matrix, top, left):
    # 7×7 black/white pattern
    for r in range(7):
        for c in range(7):
            matrix[top+r, left+c] = FINDER[r, c]

    # 1-module white separator
    for r in range(-1, 8):
        for c in range(-1, 8):
            rr = top + r
            cc = left + c
            if 0 <= rr < 21 and 0 <= cc < 21:
                if not (0 <= r <= 6 and 0 <= c <= 6):
                    if matrix[rr, cc] is None:
                        matrix[rr, cc] = 0


def place_finder_patterns(matrix):
    place_fp(matrix, 0, 0)
    place_fp(matrix, 0, 14)
    place_fp(matrix, 14, 0)
    return matrix


# ===============================================================
# STEP 7: TIMING PATTERNS
# ===============================================================

def place_timing_patterns(matrix):
    for i in range(8, 21-8):
        matrix[6, i] = i % 2
        matrix[i, 6] = i % 2
    return matrix


# ===============================================================
# STEP 8: ALIGNMENT (Version 1 has none)
# ===============================================================

def place_alignment(matrix):
    return matrix


# ===============================================================
# STEP 9: PLACE DATA + ECC
# ===============================================================

def place_data_bits(matrix, data_bits):
    size = 21
    r = size - 1
    c = size - 1
    upward = True
    bit_index = 0

    def is_reserved(rr, cc):
        if matrix[rr, cc] is None:
            return False
        return True

    while c > 0:
        if c == 6:
            c -= 1

        for offset in [0, -1]:
            cc = c + offset

            if 0 <= r < size and 0 <= cc < size:
                if not is_reserved(r, cc):
                    if bit_index < len(data_bits):
                        matrix[r, cc] = int(data_bits[bit_index])
                        bit_index += 1
                    else:
                        matrix[r, cc] = 0

        r = r - 1 if upward else r + 1

        if r < 0 or r >= size:
            upward = not upward
            r = 0 if not upward else size - 1
            c -= 2

    return matrix


# ===============================================================
# STEP 10: DARK MODULE
# ===============================================================

def place_dark_module(matrix):
    matrix[8, 13] = 1
    return matrix


# ===============================================================
# STEP 11: FORMAT INFORMATION (MASK 0)
# ===============================================================

def place_format_information(matrix, mask_id=0):

    format_bits = [
        1,1,1,0,1,0,0,0,0, # 0–8  (includes mask bit pattern)
        0,1,1,0,0,0,0       # 9–14
    ]

    # Row 8
    for i in range(0, 9):
        matrix[8, i] = format_bits[i]

    for i in range(0, 8):
        matrix[8, 20 - (7 - i)] = format_bits[i+7]

    # Column 8
    for i in range(0, 7):
        matrix[i, 8] = format_bits[i]

    for i in range(0, 8):
        matrix[13 + (i - 0), 8] = format_bits[i+7]

    return matrix


# ===============================================================
# STEP 11B: APPLY MASK 0
# ===============================================================

def apply_mask_0(matrix):
    size = 21

    for r in range(size):
        for c in range(size):

            cell = matrix[r, c]
            if cell is None:
                continue

            in_fp = (
                (r < 7 and c < 7) or
                (r < 7 and c >= size-7) or
                (r >= size-7 and c < 7)
            )
            if in_fp:
                continue

            if r == 6 or c == 6:
                continue

            if r == 8 and c == 13:
                continue

            if r == 8 and (c <= 8 or c >= size - 8):
                continue

            if c == 8 and (r <= 8 or r >= size - 8):
                continue

            if (r + c) % 2 == 0:
                matrix[r, c] ^= 1

    return matrix


# ===============================================================
# STEP 12: ASCII RENDER
# ===============================================================

def render_ascii(matrix):
    for r in range(21):
        line = ""
        for c in range(21):
            line += "██" if matrix[r, c] == 1 else "  "
        print(line)


# ===============================================================
# MAIN EXECUTION
# ===============================================================

if __name__ == "__main__":
    user_input = "HELLO WORLD"

    raw = encode_byte_mode(user_input)
    full_bits = add_terminator_and_padding(raw)
    data_words = bits_to_codewords(full_bits)
    ecc_words = generate_ecc(data_words)

    all_bits = ""
    for byte in data_words + ecc_words:
        all_bits += format(byte, "08b")

    M = create_empty_matrix()
    M = place_finder_patterns(M)
    M = place_timing_patterns(M)
    M = place_alignment(M)
    M = place_dark_module(M)
    M = place_format_information(M)
    M = place_data_bits(M, all_bits)

    M = apply_mask_0(M)

    print("\n=== FINAL QR CODE ===")
    render_ascii(M)
