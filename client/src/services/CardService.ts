import { Card, CardEffect, CardType } from "../types/Card";
const BASE_URL = "http://localhost:8080/api";

export async function fetchCards(status: "ACTIVE" | "GENERAL") {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/carduri/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }

  const data = await response.json();
  console.log("Fetched cards:", data.data); // Debugging line
  return data.data;
}

export async function fetchCardsByGame(gameId: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/carduri/jocuri/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch game cards");
  }

  const data = await response.json();
  return data.data;
}

export async function fetchUserCards(username: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/carduri/utilizatori/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user cards");
  }

  const data = await response.json();
  return data.data;
}

export async function drawRandomCard(
  type: "empire" | "chance",
  gameId: number,
  username: string
) {
  const token = localStorage.getItem("token");

  try {
    // Obține toate cardurile
    const status = "GENERAL";
    const cards = await fetchCards(status);
    console.log("Cards before filtering:", cards);

    // Filtrează cardurile folosind proprietatea corectă și ignorând case-ul
    const filteredCards = cards.filter((card: any) => {
      if (!card.cardType) {
        console.warn("Card missing cardType:", card);
        return false;
      }

      // Convertim tipul cardului la lowercase pentru comparare
      const cardTypeNormalized = card.cardType.toLowerCase();
      return cardTypeNormalized === type.toLowerCase();
    });

    console.log("Filtered cards for", type, ":", filteredCards);

    if (filteredCards.length === 0) {
      throw new Error(`No ${type} cards available`);
    }

    // Selectăm un card aleatoriu
    const randomCard =
      filteredCards[Math.floor(Math.random() * filteredCards.length)];

    // Mapăm card-ul la formatul așteptat de interfață
    const formattedCard: Card = {
      idCard: randomCard.idCard,
      titlu: randomCard.descriere.split(".")[0], // Use titlu instead of nume
      descriere: randomCard.descriere,
      cardType: randomCard.cardType as CardType,
      valoare: extractValueFromDescription(randomCard.descriere),
      efectSpecial: determineEffectFromDescription(randomCard.descriere),
      imagine: randomCard.imagine || null,
    };

    // Înregistrăm cardul ca fiind câștigat
    await addCardToUser(formattedCard.idCard, username, gameId);

    return formattedCard;
  } catch (error) {
    console.error("Error in drawRandomCard:", error);
    throw error;
  }
}

// Funcții ajutătoare pentru a procesa descrierea cardului
function extractValueFromDescription(description: string): number | null {
  // Caută numere în descriere (ex: "Primești 50" -> 50)
  const matches = description.match(/\b(\d+)\b/);
  return matches ? parseInt(matches[0]) : null;
}

// Update the return type to match CardEffect
function determineEffectFromDescription(
  description: string
): CardEffect | null {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("primesti") || lowerDesc.includes("primește")) {
    return "COLLECT_MONEY";
  }
  if (lowerDesc.includes("platesti") || lowerDesc.includes("plătești")) {
    return "PAY_MONEY";
  }
  if (lowerDesc.includes("mergi")) {
    return "MOVE";
  }
  if (lowerDesc.includes("inchisoare") && lowerDesc.includes("mergi")) {
    return "GO_TO_JAIL";
  }
  if (lowerDesc.includes("inchisoare") && lowerDesc.includes("iesi")) {
    return "GET_OUT_JAIL";
  }
  if (lowerDesc.includes("schimba")) {
    return "SWAP_BRAND";
  }
  if (lowerDesc.includes("fura")) {
    return "STEAL_BRAND";
  }
  if (lowerDesc.includes("returneaza") || lowerDesc.includes("restitui")) {
    return "RETURN_BRAND";
  }

  return "SPECIAL_EFFECT";
}

export async function addCardToUser(
  cardId: number,
  username: string,
  gameId: number
) {
  const token = localStorage.getItem("token");

  const payload = {
    idCard: cardId, // Asigură-te că folosim numele corect al câmpului
    username: username,
    idJoc: gameId,
  };

  console.log("Adding card to user with payload:", payload);

  try {
    const response = await fetch(`${BASE_URL}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add card. Server response:", errorText);
      throw new Error("Failed to add card to user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in addCardToUser:", error);
    throw error;
  }
}

export async function useCard(activeCardId: number, targetUsername?: string) {
  const token = localStorage.getItem("token");

  const payload = {
    username: targetUsername,
  };
  console.log("activeCardId:", activeCardId);
  const response = await fetch(
    `${BASE_URL}/card/utilizeazaCard/${activeCardId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to use card");
  }

  return await response.json();
}
