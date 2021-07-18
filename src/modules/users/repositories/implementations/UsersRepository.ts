import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user =  await this.repository.findOne(user_id, {relations: ['games']})

    return user as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {

    return this.repository.query(`
      SELECT * FROM users ORDER BY users.first_name ASC
    `); 
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {

    const queryString = `
    SELECT * 
    FROM users 
    WHERE UPPER(first_name) = UPPER($1)
    AND UPPER(last_name) = UPPER($2)
  `
    return this.repository.query(queryString, [first_name, last_name]);
  }
}
