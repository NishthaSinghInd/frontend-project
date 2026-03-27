import asyncio
from database import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text('SELECT COUNT(*) FROM loan_applications'))
        count = res.scalar()
        print(f"--- TOTAL LOANS IN DB: {count} ---")

asyncio.run(check())
