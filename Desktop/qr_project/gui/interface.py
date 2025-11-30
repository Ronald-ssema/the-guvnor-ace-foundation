import tkinter as tk
from tkinter import messagebox
import os
import sys

# Import encoder
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from encoder.qr_encoder import qr_encode

# Import renderer + help
from gui.render import render_qr_matrix
from gui.help_window import open_help_window


def generate_qr():
    text = entry.get().strip()

    if text == "":
        messagebox.showwarning("Empty Input", "Please enter some text.")
        return

    try:
        M = qr_encode(text)
        filepath = render_qr_matrix(M, "gui_output.png")

        messagebox.showinfo("QR Generated", f"QR saved to:\n{filepath}")

    except Exception as e:
        messagebox.showerror("Error", f"Something went wrong:\n{e}")


# ------- GUI WINDOW -------

root = tk.Tk()
root.title("QR Generator (Version 1-L)")
root.geometry("420x200")

label = tk.Label(root, text="Enter text to encode:", font=("Arial", 13))
label.pack(pady=10)

entry = tk.Entry(root, width=40, font=("Arial", 14))
entry.pack()

btn_generate = tk.Button(root, text="Generate QR", font=("Arial", 12), command=generate_qr)
btn_generate.pack(pady=10)

btn_help = tk.Button(root, text="Help / Info", font=("Arial", 12), command=open_help_window)
btn_help.pack()

root.mainloop()
