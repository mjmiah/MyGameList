import React from "react";

const GameCard = ({ game }) => {
    return (
        <div
            style={{
                background: "rgba(255, 255, 255, 0.15)", // glass look
                borderRadius: "15px",
                padding: "1rem",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {game.imageUrl && (
                <img
                    src={game.imageUrl}
                    alt={game.title}
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "0.75rem",
                    }}
                />
            )}
            <h3 style={{ margin: "0 0 0.5rem 0", textAlign: "center" }}>
                {game.title}
            </h3>

            {/* show rating if it exists, otherwise show IGDB ID */}
            {game.rating !== undefined ? (
                <p style={{ color: "#ffeb3b", fontSize: "1rem", fontWeight: "bold" }}>
                    ⭐ Rating: {game.rating}
                </p>
            ) : (
                <p style={{ color: "#ddd", fontSize: "0.9rem" }}>IGDB ID: {game.igdbId}</p>
            )}
        </div>
    );
};

export default GameCard;
