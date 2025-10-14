# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx  # for async calls to n8n

app = FastAPI(title="United RAG Chat API")

# Allow frontend (Vite dev server: 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Mock / Placeholder DB ----
MOCK_EMPLOYEES = [
    {"employeeId": "1001", "employeeName": "Rish Kaushick", "department": "Marketing"},
    {"employeeId": "1002", "employeeName": "Gee Shinde", "department": "Finance"},
    # {"employeeId": "1003", "employeeName": "Noah Singh", "department": "HR"},
]

@app.get("/api/getEmployeeData")
def get_employee_data(employeeId: str):
    emp = next((e for e in MOCK_EMPLOYEES if e["employeeId"] == employeeId), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Invalid employee ID")
    return {"ok": True, "data": emp}


# ---- Chat route that proxies to n8n ----
class ChatBody(BaseModel):
    message: str
    department: str
    employeeId: str | None = None


N8N_TEST_WEBHOOK_URL = "https://n8n.gautamishinde.com/webhook-test/15986fbc-9074-4bea-8ad6-4992ee21d8b0"
N8N_WEBHOOK_URL = "https://n8n.gautamishinde.com/webhook/15986fbc-9074-4bea-8ad6-4992ee21d8b0" # confirm this is correct


@app.post("/api/chat")
async def chat_proxy(body: ChatBody):
    """
    Accepts message + department from frontend,
    validates, and forwards to n8n.
    """
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    payload = {
        "message": body.message,
        "department": body.department,
        "employeeId": body.employeeId,
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(N8N_TEST_WEBHOOK_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            return {"ok": True, "data": data}
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error contacting n8n: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"n8n returned {e.response.status_code}: {e.response.text}")


# Optional: simple health check
@app.get("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
