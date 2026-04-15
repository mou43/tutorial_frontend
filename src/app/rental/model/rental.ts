import { Game } from "../../game/model/game";
import { Client } from "../../client/model/client";

export class Rental {
    id: number;
    game: Game;
    client: Client;
    rentalDate: Date | null = null;
    returnDate: Date | null = null;
    
}