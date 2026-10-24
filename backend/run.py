import sys
import os

# Clean sys.path from external global editable packages that define competing 'app' namespaces
sys.path = [p for p in sys.path if not p.endswith('_editable_impl_knowly_backend.pth') and 'knowly' not in p.lower()]
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn
from app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    print(f"Starting Kairo Backend on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
