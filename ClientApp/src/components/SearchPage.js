import React, { useState } from "react";
import GameCard from "./GameCard";

const SearchPage = ({ loggedInUser }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal state
    const [selectedGame, setSelectedGame] = useState(null);
    const [rating, setRating] = useState(1);
    const [modalError, setModalError] = useState("");

    const searchGames = async () => {
        if (!query.trim()) {
            setError("Please enter a search term.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await fetch(`/api/Game/search?query=${query}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else if (response.status === 404) {
                setError("No games found.");
            } else {
                setError("Something went wrong.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleGameClick = (game) => {
        if (!loggedInUser) {
            setError("You must be logged in to add a game.");
            return;
        }
        setSelectedGame(game);
        setRating(1);
        setModalError("");
    };

    const handleAddGame = async () => {
        if (!selectedGame) return;

        const payload = {
            GameId: selectedGame.gameId,
            Rating: rating,          // slider value
            igdbId: selectedGame.igdbId,
            Title: selectedGame.title,
            ImageUrl: selectedGame.imageUrl
        };
        console.log("Payload being sent:", payload);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/UserGames", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSelectedGame(null);
            } else {
                setModalError("Failed to add game to your list.");
            }
        } catch (err) {
            console.error(err);
            setModalError("Error connecting to server.");
        }
    };

    const closeModal = () => {
        setSelectedGame(null);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Search for Games</h2>

            {/* Search input */}
            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search for a game..."
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: "0.5rem", marginRight: "0.5rem", width: "250px" }}
                />
                <button onClick={searchGames} style={{ padding: "0.5rem 1rem" }}>
                    Search
                </button>
            </div>

            {/* Loading / Error */}
            {loading && <p>Searching...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Results */}
            {results.length > 0 && (
                <div
                    style={{
                        marginTop: "5rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {results.map((game) => (
                        <div key={game.gameId} onClick={() => handleGameClick(game)} style={{ cursor: "pointer" }}>
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedGame && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "#222",
                        padding: "2rem",
                        borderRadius: "10px",
                        minWidth: "300px",
                        position: "relative",
                    }}>
                        <h3 style={{ marginBottom: "1rem" }}>Add "{selectedGame.title}"</h3>

                        {/* Slider label */}
                        <label htmlFor="ratingSlider" style={{ display: "block", marginBottom: "0.5rem" }}>
                            Rate this game (1–10):
                        </label>

                        {/* Slider input */}
                        <input
                            id="ratingSlider"
                            type="range"
                            min="1"
                            max="10"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            style={{ width: "100%" }}
                        />

                        {/* Current rating */}
                        <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>Rating: {rating}</p>

                        {modalError && <p style={{ color: "red" }}>{modalError}</p>}

                        {/* Buttons */}
                        <div style={{ marginTop: "1.5rem" }}>
                            <button onClick={handleAddGame} style={{ marginRight: "1rem" }}>Add</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;