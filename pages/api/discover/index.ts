import type { NextApiRequest, NextApiResponse } from 'next';
import { Movies } from '../../entities/Movies';
import { TVShows } from '../../entities/TVShows';

const movie_url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=1&sort_by=popularity.desc';
const show_url = 'https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=fr-FR&page=1&sort_by=popularity.desc'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmYyNzY4NzU0NmYyMDY3MzMzNDYyOWUwNGRjOWM3MCIsIm5iZiI6MTczMDgyMDExOS45OTIzMTUzLCJzdWIiOiI2NzJhMzM5YjE0ZDRhMzk5NzIwMzU2MDAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0._QOFs8qsJmlp3C3eUZVLptw2xG6B6LBwBLQdldX4m2A'
    }
  };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ movie : Movies[] , show : TVShows[] } | { error: string }>
) {
    try {


        // 1. Récupérer les données depuis les URL externes
        const [movieResponse, showResponse] = await Promise.all([
            fetch(movie_url, options),
            fetch(show_url, options)
        ]);
        
        if (!movieResponse.ok || !showResponse.ok) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        }

        // 2. Analyser les données JSON reçues
        const movieData = await movieResponse.json();
        const showData = await showResponse.json();



        // 3. Filtrer les champs pour ne conserver que ceux pertinents pour l'entité Movie
        const movie: Movies[] = movieData.results.map((item: Movies) => ({
            id: item.id,
            title: item.title,
            overview: item.overview,
            releaseDate: item.releaseDate,  // Assurez-vous que le champ correspond bien à celui attendu par votre interface
            posterPath: item.posterPath,
        }));

        const show: TVShows[] = showData.results.map((item: TVShows) => ({
            id: item.id,
            name: item.name,
            overview: item.overview,
            releaseDate: item.releaseDate,  // Assurez-vous que le champ correspond bien à celui attendu par votre interface
            posterPath: item.posterPath,
        }));

        // 4. Envoyer la réponse avec les films filtrés
        res.status(200).json({movie ,show});

    } catch (error) {
        // Gérer les erreurs et envoyer une réponse appropriée
        res.status(500).json({ error: 'Erreur interne du serveur' });
        console.error(error);
    }
}