"""
Launch script for DocMate AI All-in-One Server.
Usage:
    python run.py
"""
import os
import sys
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    print(f"==================================================")
    print(f"  DocMate AI - All-in-One Server Starting")
    print(f"  URL: http://127.0.0.1:{port}")
    print(f"  API Docs: http://127.0.0.1:{port}/docs")
    print(f"==================================================")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
