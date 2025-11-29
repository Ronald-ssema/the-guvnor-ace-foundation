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


# ------------------------------------------------------------
# DEMO WHEN RUN DIRECTLY
# ------------------------------------------------------------

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

