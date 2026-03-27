import os
import asyncio
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def check():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text('SELECT COUNT(*) FROM loan_applications'))
        count = res.scalar()
        print(f"--- TOTAL LOANS IN DB: {count} ---")

asyncio.run(check())
