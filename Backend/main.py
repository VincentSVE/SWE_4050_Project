import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "SoftwareMovies")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "Movies")

if not MONGODB_URI:
    raise Exception("MONGODB_URI not found in .env file")

app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]


# Helper to convert Mongo document to JSON-friendly format
def movie_serializer(movie) -> dict:
    return {
        "id": str(movie["_id"]),
        "title": movie.get("title", ""),
        "description": movie.get("description", ""),
        "trailer": movie.get("trailer", ""),
        "poster": movie.get("poster", ""),
        "rating": movie.get("rating", ""),
        "genre": movie.get("genre", []),
        "currentlyPlaying": movie.get("currentlyPlaying", False),
        "datesPlaying": movie.get("datesPlaying", []),
    }


# Get ALL movies
@app.get("/movies")
async def get_movies():
    movies = []
    async for movie in collection.find():
        movies.append(movie_serializer(movie))
    return movies


# Get ONE movie by Mongo ObjectId
@app.get("/movies/{id}")
async def get_movie(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid movie ID")

    movie = await collection.find_one({"_id": ObjectId(id)})

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return movie_serializer(movie)