# -------------------------------------------------------------
# QR CODE GENERATOR — STEP 1 + STEP 2 + STEP 3
# Student: Ronald Ssemawere
# Module: CS2PP Practical Coursework
# -------------------------------------------------------------
# This file implements:
# 1. Byte Mode encoding (raw bitstream)
# 2. Terminator + Padding to reach 152 bits (Version 1-L)
# 3. Convert to data codewords (19 bytes)
# 4. Generate ECC codewords (7 bytes) using reedsolo
# -------------------------------------------------------------

from reedsolo import RSCodec


# -------------------------------
# CONSTANTS
# -------------------------------
BYTE_MODE = "0100"                 # Mode indicator (byte mode)
TOTAL_DATA_BITS_V1_L = 152         # Must reach exactly 152 bits for Version 1-L


# -------------------------------
# STEP 1: BYTE MODE ENCODING
# -------------------------------
def encode_byte_mode(input_string: str) -> str:
    """
    Convert text into QR Byte Mode bitstream.
    """

    # 1. Mode indicator (always 0100 for byte mode)
    bitstream = BYTE_MODE

    # 2. Character count in 8 bits
    length = len(input_string)
    char_count_bits = f"{length:08b}"
    bitstream += char_count_bits

    # 3. Convert each character to UTF-8 / ISO-8859-1 binary
    for char in input_string:
        byte_value = ord(char)
        char_bits = f"{byte_value:08b}"
        bitstream += char_bits

    return bitstream


# -------------------------------
# STEP 2: TERMINATOR + PADDING
# -------------------------------
def apply_terminator_and_padding(bitstream: str) -> str:
    """
    Add terminator + pad bits to reach 152 bits exactly.
    """

    # 1. Add terminator (max 4 bits)
    terminator_length = min(4, TOTAL_DATA_BITS_V1_L - len(bitstream))
    bitstream += "0" * terminator_length

    # 2. Pad to nearest byte boundary
    while len(bitstream) % 8 != 0:
        bitstream += "0"

    # 3. Add alternating pad bytes until we reach 152 bits
    pad_bytes = ["11101100", "00010001"]
    pad_index = 0

    while len(bitstream) < TOTAL_DATA_BITS_V1_L:
        bitstream += pad_bytes[pad_index]
        pad_index = 1 - pad_index  # alternate between the two

    return bitstream


# -------------------------------
# STEP 3: Convert final bitstream → Codewords
# -------------------------------
def bits_to_codewords(bitstring):
    """
    Convert 152-bit padded bitstring into 19 codewords.
    """
    codewords = []
    for i in range(0, len(bitstring), 8):
        byte = bitstring[i:i+8]
        codewords.append(int(byte, 2))
    return codewords


# -------------------------------
# STEP 4: Generate ECC codewords
# -------------------------------
def generate_ecc(data_codewords):
    """
    Generate 7 Reed–Solomon ECC codewords for Version 1-L.
    """
    rs = RSCodec(7)                       # 7 ECC codewords
    encoded = rs.encode(bytearray(data_codewords))
    ecc = encoded[-7:]                    # last 7 bytes are ECC
    return list(ecc)


# -------------------------------
# MAIN EXECUTION
# -------------------------------
if __name__ == "__main__":

    input_text = "Known"   # Change this to test any input

    # STEP 1
    raw_bits = encode_byte_mode(input_text)
    print("\nRaw bitstream:", raw_bits)
    print("Raw length:", len(raw_bits))

    # STEP 2
    final_bits = apply_terminator_and_padding(raw_bits)
    print("\nFinal padded bitstream:", final_bits)
    print("Final length:", len(final_bits))

    # STEP 3
    data_codewords = bits_to_codewords(final_bits)
    print("\nData codewords (19 bytes):")
    print(data_codewords)

    # STEP 4
    ecc_codewords = generate_ecc(data_codewords)
    print("\nECC codewords (7 bytes):")
    print(ecc_codewords)

    print("\n--- DONE: Steps 1, 2 and 3 complete ---")
