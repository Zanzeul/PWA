import type { NextApiRequest, NextApiResponse } from 'next';
import { Movies } from '../../../entities/Movies';

const url = 'https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1';
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTIxN2Y3ZDk1YTNlOTVjMmI0MGNmYjVmYWZiYzRjNiIsIm5iZiI6MTczMDg5NTQxNy4xNTg0OTc4LCJzdWIiOiI2NzJiNTVjYjQyNGNjNmEzYmUyZTRkNDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0FIVhsB8iRD3NkXdeFiXinVw8Jxe6BMniB2_YDUJAHo'
    }
  };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Movies[] | { error: string }>
) {
    try {

        // 1. Récupérer les données depuis l'URL externe
        const response = await fetch(url,options);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Erreur lors de la récupération des données' });
        }

        // 2. Analyser les données JSON reçues
        const data = await response.json();

        // 3. Filtrer les champs pour ne conserver que ceux pertinents pour l'entité Movie
        const movies: Movies[] = data.results.map((item: Movies) => ({
            id: item.id,
            title: item.title,
            overview: item.overview,
            releaseDate: item.releaseDate,  // Assurez-vous que le champ correspond bien à celui attendu par votre interface
            posterPath: item.posterPath,
        }));

        // 4. Envoyer la réponse avec les films filtrés
        res.status(200).json(movies);

    } catch (error) {
        // Gérer les erreurs et envoyer une réponse appropriée
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}