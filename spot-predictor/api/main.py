from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import app_router

app = FastAPI()

origins = [
    "https://www.spotlite.fun/",
    "http://api.spotlite.site/",
    "https://api.spotlite.site/"
]

# MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(app_router, prefix="/predictions", tags=["Predictions"])
    
# INDEX ROUTE
@app.get("/")
async def read_root():
    return { "Hello": "World" }