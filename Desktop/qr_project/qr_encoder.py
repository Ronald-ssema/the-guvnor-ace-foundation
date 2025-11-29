# ------------------------------------------------------------
# QR CODE GENERATOR – STEP 1 + STEP 2 + STEP 3 + STEP 4
# Student: Ronald Ssemawere
# Module: CS2PP07 Practical Coursework
# ------------------------------------------------------------

from reedsolo import RSCodec


# ------------------------------------------------------------
# CONSTANTS FOR VERSION 1-L
# ------------------------------------------------------------

BYTE_MODE = "0100"             # Mode indicator
TOTAL_DATA_BITS = 152          # Must be exactly 152 bits
DATA_CODEWORDS = 19            # 19 bytes
ECC_CODEWORDS = 7              # 7 bytes of ECC


# ------------------------------------------------------------
# STEP 1: BYTE MODE ENCODING
# ------------------------------------------------------------

def encode_byte_mode(input_string: str) -> str:
    """
    Encodes text into QR Byte Mode bitstream.
    Output: raw bitstream (no terminator, no padding).
    """

    # Mode indicator (4 bits) + character count (8 bits)
    mode = BYTE_MODE
    char_count = format(len(input_string), "08b")

    # Convert characters to 8-bit binary (ISO 8859-1)
    text_bits = ""
    for ch in input_string:
        text_bits += format(ord(ch), "08b")

    # Final raw stream
    raw_bits = mode + char_count + text_bits
    return raw_bits


# ------------------------------------------------------------
# STEP 2: TERMINATOR + PADDING TO EXACTLY 152 BITS
# ------------------------------------------------------------

def add_terminator_and_padding(bitstream: str) -> str:
    """
    Adds:
    - Terminator (up to 4 bits)
    - Pad to nearest byte boundary
    - Pad bytes 0xEC and 0x11 alternating
    """
    # 1) Add up to 4 zero bits, but do not exceed target length
    remaining = TOTAL_DATA_BITS - len(bitstream)
    terminator_len = min(4, remaining)
    bitstream += "0" * terminator_len

    # 2) Pad to nearest 8-bit boundary with zeros
    while len(bitstream) % 8 != 0:
        bitstream += "0"

    # 3) Add PAD BYTES until 152 bits
    pad_bytes = ["11101100", "00010001"]  # EC, 11
    pad_index = 0

    while len(bitstream) < TOTAL_DATA_BITS:
        bitstream += pad_bytes[pad_index]
        pad_index = 1 - pad_index  # Alternate

    return bitstream


# ------------------------------------------------------------
# STEP 3: SPLIT INTO 19 DATA CODEWORDS (8 bits each)
# ------------------------------------------------------------

def bits_to_codewords(bitstream: str) -> list:
    """
    Splits final padded 152-bit stream into 19 bytes.
    """
    codewords = []
    for i in range(0, TOTAL_DATA_BITS, 8):
        byte = int(bitstream[i:i+8], 2)
        codewords.append(byte)
    return codewords


# ------------------------------------------------------------
# STEP 4: GENERATE 7 ECC CODEWORDS USING REED-SOLOMON
# ------------------------------------------------------------

def generate_ecc(data_codewords: list) -> list:
    """
    Uses RSCodec to produce 7 ECC bytes.
    """
    rs = RSCodec(ECC_CODEWORDS)            # 7 ECC bytes
    encoded = rs.encode(bytes(data_codewords))
    ecc = list(encoded[-ECC_CODEWORDS:])   # Last 7 bytes are ECC
    return ecc


# ------------------------------------------------------------
# MAIN PIPELINE FUNCTION
# ------------------------------------------------------------

def qr_encode(input_string: str):
    """
    Full QR Encoding Pipeline:
    1. Byte Mode
    2. Terminator + padding
    3. Data codewords (19 bytes)
    4. ECC codewords (7 bytes)
    """
    # Step 1
    raw_bits = encode_byte_mode(input_string)

    # Step 2
    full_bits = add_terminator_and_padding(raw_bits)

    # Step 3
    data_codewords = bits_to_codewords(full_bits)

    # Step 4
    ecc_codewords = generate_ecc(data_codewords)

    return raw_bits, full_bits, data_codewords, ecc_codewords


# =============================================================
# STEP 5: INITIALIZE 21x21 QR MATRIX (Version 1-L)
# =============================================================

def create_empty_matrix() -> list:
    """
    Creates an empty 21×21 QR matrix for Version 1-L.
    Each cell is initialized to None (unassigned).
    """
    size = 21  # Version 1 size
    matrix = [[None for _ in range(size)] for _ in range(size)]
    return matrix


# Debug print (optional)
if __name__ == "__main__":
    print("\n=== STEP 5: EMPTY 21×21 MATRIX ===")
    M = create_empty_matrix()
    for row in M:
        print(row)

# STEP 6: PLACE FINDER PATTERNS + SEPARATORS
def place_finder_patterns(matrix):
    """
    Places the three 7x7 Finder Patterns for Version 1-L.
    Also adds the required 1-module white separators.
    """

    # 7×7 finder pattern (1 = black, 0 = white)
    FP = [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1],
    ]

    size = len(matrix)

    # Helper function to place a single finder pattern
    def place_fp(top, left):
        # Place 7×7 pattern
        for r in range(7):
            for c in range(7):
                matrix[top + r][left + c] = FP[r][c]

        # Add white separator around it (1 cell thick)
        for r in range(-1, 8):
            for c in range(-1, 8):
                rr, cc = top + r, left + c
                # ensure within bounds
                if 0 <= rr < size and 0 <= cc < size:
                    # if cell is outside finder pattern, make separator (0)
                    if not (0 <= r <= 6 and 0 <= c <= 6):
                        if matrix[rr][cc] is None:
                            matrix[rr][cc] = 0

    # Place Top-Left FP
    place_fp(0, 0)

    # Place Top-Right FP
    place_fp(0, size - 7)

    # Place Bottom-Left FP
    place_fp(size - 7, 0)

    return matrix

# ================================================================
# STEP 7: TIMING PATTERNS (HORIZONTAL + VERTICAL)
# ================================================================
def place_timing_patterns(matrix):
    """
    Places the two timing patterns for Version 1-L:
    - Horizontal on row 6, from col 8 to end
    - Vertical on col 6, from row 8 to end
    Alternating 1/0 pattern. Only fills cells that are None.
    """

    size = len(matrix)

    # Horizontal timing pattern (row 6)
    row = 6
    for c in range(8, size):
        if matrix[row][c] is None:
            matrix[row][c] = (c % 2)  # alternating 0/1

    # Vertical timing pattern (column 6)
    col = 6
    for r in range(8, size):
        if matrix[r][col] is None:
            matrix[r][col] = (r % 2)  # alternating 0/1

    return matrix

# ===============================================================
# STEP 8: ALIGNMENT PATTERN (Version 1 = NONE)
# ===============================================================

def place_alignment_pattern(matrix):
    """
    Version 1 QR codes do NOT contain any alignment patterns.
    This function exists for compatibility with higher versions.
    """
    # No action required
    return matrix

# ================================================================
# STEP 9: POPULATE MATRIX WITH DATA + ECC BITS
# ================================================================

def place_data_bits(matrix, full_bitstream):
    """
    Places the data+ECC bitstream into the QR matrix using the standard
    zigzag vertical placement algorithm (Version 1-L).
    """
    size = len(matrix)
    bit_index = 0
    direction_up = True  # zigzag direction

    # Start from right-most column pair
    col = size - 1

    while col > 0:
        if col == 6:
            # Skip timing column
            col -= 1

        # Process two columns at a time: col and col-1
        cols = [col, col - 1]

        # Determine traversal order for this column pair
        rows = range(size - 1, -1, -1) if direction_up else range(size)

        for r in rows:
            for c in cols:
                # Skip reserved cells (None = free, 0/1 = reserved)
                if matrix[r][c] is None:
                    if bit_index < len(full_bitstream):
                        matrix[r][c] = int(full_bitstream[bit_index])
                        bit_index += 1

        direction_up = not direction_up  # flip zigzag direction
        col -= 2

    return matrix

# ===============================================================
# STEP 10: PLACE DARK MODULE (Version 1-L)
# ===============================================================

def place_dark_module(matrix):
    """
    Places the required dark module for Version 1-L.
    Location is fixed at (8, 13) in the 21×21 matrix.
    """
    matrix[8][13] = 1
    return matrix


# ============================================================
# DEMO WHEN RUN DIRECTLY (MAIN EXECUTION)
# ============================================================
if __name__ == "__main__":
    user_input = "HELLO WORLD"
    raw_bits, full_bits, data, ecc = qr_encode(user_input)

    print("\n=== STEP 1: RAW BITSTREAM ===")
    print(raw_bits)

    print("\n=== STEP 2: 152-BIT PADDED BITSTREAM ===")
    print(full_bits)
    print("Length:", len(full_bits))

    print("\n=== STEP 3: DATA CODEWORDS (19 bytes) ===")
    print(data)

    print("\n=== STEP 4: ECC CODEWORDS (7 bytes) ===")
    print(ecc)

    print("\n=== STEP 6: FINDER PATTERNS + SEPARATORS ===")
    M = create_empty_matrix()
    place_finder_patterns(M)

    print("\n=== STEP 7: TIMING PATTERNS ===")
    place_timing_patterns(M)

    print("\n=== STEP 8: ALIGNMENT PATTERN (Version 1 has none) ===")
    place_alignment_pattern(M)

    print("\n=== STEP 9: PLACE DATA + ECC BITS ===")
    M = place_data_bits(M, full_bits)

    print("\n=== STEP 10: DARK MODULE ===")
    place_dark_module(M)


    for row in M:
        print(row)

