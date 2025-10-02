from __future__ import annotations

from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

DB_PATH = Path(__file__).with_name("counter.db")

app = FastAPI(title="Visitor Counter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)


class CounterResponse(BaseModel):
    value: int


def get_connection() -> Annotated[sqlite3.Connection, Depends]:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            total INTEGER NOT NULL
        )
        """
    )
    conn.execute(
        "INSERT OR IGNORE INTO stats (id, total) VALUES (1, 0)"
    )
    return conn


@app.post("/hit", response_model=CounterResponse)
@app.get("/hit", response_model=CounterResponse)
def hit_endpoint(conn: Annotated[sqlite3.Connection, Depends(get_connection)]):
    cursor = conn.cursor()
    cursor.execute("UPDATE stats SET total = total + 1 WHERE id = 1")
    conn.commit()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    total = cursor.fetchone()[0]
    conn.close()
    return CounterResponse(value=total)


@app.get("/current", response_model=CounterResponse)
def current_count(conn: Annotated[sqlite3.Connection, Depends(get_connection)]):
    cursor = conn.cursor()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    row = cursor.fetchone()
    total = row[0] if row else 0
    conn.close()
    return CounterResponse(value=total)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
