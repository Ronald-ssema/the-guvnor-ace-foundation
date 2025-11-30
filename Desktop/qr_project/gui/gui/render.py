import matplotlib.pyplot as plt
import numpy as np
import os

def render_qr_matrix(matrix, filename="qr_output.png"):
    """
    Render a Version-1 QR matrix (21×21 NumPy array) to a PNG file.
    """
    plt.figure(figsize=(4, 4))
    plt.imshow(matrix == 1, cmap="binary", interpolation="nearest")
    plt.axis("off")
    plt.savefig(filename, dpi=300, bbox_inches="tight")
    plt.close()

    return os.path.abspath(filename)
