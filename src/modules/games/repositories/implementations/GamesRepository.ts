import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :search", {search: `%${param}%`})
      .getMany()
      
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(games.id)
      FROM games
    `);
  }

  async findUsersByGameId(id: string): Promise<User[] | any> {

    const data = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", {id})
      .getOne()

    return data?.users.map(user => ({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }))


  }
}
