import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

const ProfilePage = ({ loggedInUser }) => {
    const [userGames, setUserGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null); // game currently being edited
    const [newRating, setNewRating] = useState(1); // for slider
    const [modalError, setModalError] = useState("");

    // fetch the user's games on load
    useEffect(() => {
        if (!loggedInUser) return;

        const fetchUserGames = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("/api/UserGames", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserGames(data);
                } else {
                    console.error('Failed to fetch user games');
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserGames();
    }, [loggedInUser]);

    if (!loggedInUser) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Profile</h2>
                <p>You are not logged in. Please <a href="/login">login</a>.</p>
            </div>
        );
    }

    // open popup
    const handleCardClick = (game) => {
        setSelectedGame(game);
        setNewRating(game.rating || 1);
        setModalError("");
    };

    // update rating
    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/UserGames/${selectedGame.gameId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameId: selectedGame.gameId,
                    Rating: newRating,
                    Title: selectedGame.title,
                    imageUrl: selectedGame.imageUrl,
                    igdbId: selectedGame.igdbId
                })
            });

            if (response.ok) {
                setUserGames(prev =>
                    prev.map(ug =>
                        ug.gameId === selectedGame.gameId ? { ...ug, rating: newRating } : ug
                    )
                );
                setSelectedGame(null);
            } else {
                setModalError("Failed to update rating.");
            }
        } catch (err) {
            console.error(err);
            setModalError("Error connecting to server.");
        }
    };

    // delete game
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/UserGames/${selectedGame.gameId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUserGames(prev =>
                    prev.filter(ug => ug.gameId !== selectedGame.gameId)
                );
                setSelectedGame(null);
            } else {
                setModalError("Failed to delete game.");
            }
        } catch (err) {
            console.error(err);
            setModalError("Error connecting to server.");
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{loggedInUser.username}'s Profile</h1>
            <h2>{loggedInUser.username}'s Games List</h2>
            <p>Add more games on the Search page</p>

            {/* display user's saved games */}
            {userGames.length > 0 ? (
                <div
                    style={{
                        marginTop: '2rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem',
                    }}
                >
                    {userGames.map((ug) => (
                        <div key={`${ug.userId}-${ug.gameId}`} onClick={() => handleCardClick(ug)}>
                            <GameCard
                                game={{
                                    gameId: ug.gameId,
                                    title: ug.title,
                                    imageUrl: ug.imageUrl,
                                    rating: ug.rating // display user's rating
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ marginTop: '2rem' }}>
                    You have not added any games yet. Go to the search page to add some!
                </p>
            )}

            {/* modal for editing/deleting game */}
            {selectedGame && (
                <div
                    style={{
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
                    }}
                    onClick={() => setSelectedGame(null)} // close modal on background click
                >
                    <div
                        style={{
                            backgroundColor: "#222",
                            padding: "2rem",
                            borderRadius: "10px",
                            minWidth: "300px",
                            position: "relative",
                        }}
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        <h3>Edit "{selectedGame.title}"</h3>

                        {/* slider for rating */}
                        <label>Rate this game from 1 to 10:</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={newRating}
                            onChange={(e) => setNewRating(parseInt(e.target.value))}
                            style={{ width: "100%" }}
                        />
                        <p>Rating: {newRating}</p>

                        {modalError && <p style={{ color: "red" }}>{modalError}</p>}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                            <button onClick={handleUpdate} style={{ padding: "0.5rem 1rem" }}>
                                Update
                            </button>
                            <button onClick={handleDelete} style={{ padding: "0.5rem 1rem", backgroundColor: "red", color: "#fff" }}>
                                Delete
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedGame(null)}
                            style={{ position: "absolute", top: "5px", right: "10px", background: "none", border: "none", color: "#fff", fontSize: "1.2rem" }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;