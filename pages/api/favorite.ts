import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    // First get user, second we need movie id
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      // Find the movie with movieId
  
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });

      // If missing, throw an error
  
      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      // We need to update our user favourite films list
  
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: {
            push: movieId
          }
        }
      });
  
      return res.status(200).json(user);
    }

    // Delete the film from favourite

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        }
      });

      if (!existingMovie) {
        throw new Error('Invalid ID');
      }

      // Update favourite movie list by deleting movieId

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        }
      });

      return res.status(200).json(updatedUser);
    }

    // If another method 
    
    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
