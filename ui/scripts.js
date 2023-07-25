function createPlayerCard(player) {
    const cardContainer = document.getElementById("cardContainer");
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = player.id + " - " + player.name;

    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
    cardDiv.appendChild(card);
    cardContainer.appendChild(cardDiv);
}

function fetchPlayers() {
    fetch("http://localhost:8080/api/v1/player")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((parsedResponse) => {
            if (!Array.isArray(parsedResponse)) {
                throw new Error("Parsed response is not an array");
            }
            parsedResponse.forEach((player) => {
                createPlayerCard(player);
            });
        })
        .catch((error) => console.log("Error fetching players:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPlayers();

    let playerForm = document.getElementById("playerForm");
    playerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let playerId = document.getElementById("playerId").value;
        let playerName = document.getElementById("playerName").value;

        if (!playerId || !playerName) {
            alert("Please enter both Player ID and Player Name.");
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": playerId,
            "name": playerName
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/v1/player", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                createPlayerCard(result);
            })
            .catch((error) => console.log("Error creating player:", error));

        playerForm.reset();
    });

    let updateDeleteForm = document.getElementById("updateDeleteForm");
    updateDeleteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let playerId = document.getElementById("updateDeleteId").value;
        let playerName = document.getElementById("updateDeleteName").value;
        let action = event.submitter.dataset.action;

        if (!playerId) {
            alert("Please enter Player ID.");
            return;
        }

        if (action === "update") {
            if (!playerName) {
                alert("Please enter New Name for update.");
                return;
            }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "id": playerId,
                "name": playerName
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:8080/api/v1/player/" + playerId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    alert("Player updated successfully!");
                    fetchPlayers();
                })
                .catch((error) => console.log("Error updating player:", error));
        } else if (action === "delete") {
            var requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            fetch("http://localhost:8080/api/v1/player/" + playerId, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        alert("Player deleted successfully!");
                        fetchPlayers();
                    } else {
                        alert("Player not found. Please enter a valid Player ID.");
                    }
                })
                .catch((error) => console.log("Error deleting player:", error));
        }

        updateDeleteForm.reset();
    });
});
