export interface Movies {
    id: string;                // Identifiant unique du film
    title: string;             // Titre du film
    overview: string;          // Synopsis du film
    releaseDate: string;       // Date de sortie au format ISO (ex: "2023-05-15")
    posterPath: string;        // URL ou chemin vers l'affiche du film
}
