import tkinter as tk

HELP_TEXT = """
QR Code Safety & Usage Guide

• This application uses your own QR encoder (Version 1-L)
• It does NOT use external APIs or online generators.
• Only Byte Mode is supported (Stage 1 requirement)
• Error Correction Level: L (low)

Security warnings:
• Never scan unknown QR codes in the real world.
• Attackers can hide phishing URLs in QR codes.
• Always verify the website before entering personal data.
• Do NOT use QR codes for storing passwords or IDs.

Technical:
• Version: 1 (21×21)
• ECC: Reed-Solomon (Level L)
• Mask Pattern: 0
• Patterns included: Finder, Timing, Dark Module, Format Info
"""

def open_help_window():
    window = tk.Toplevel()
    window.title("Help / Info")
    window.geometry("420x400")

    text = tk.Text(window, wrap="word", padx=10, pady=10)
    text.insert("1.0", HELP_TEXT)
    text.config(state="disabled")
    text.pack(expand=True, fill="both")
