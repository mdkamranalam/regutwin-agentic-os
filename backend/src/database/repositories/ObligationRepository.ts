import { BaseRepository } from './BaseRepository';
import Obligation from '../models/Obligation';
import { IObligation } from '../models/Obligation';

export class ObligationRepository extends BaseRepository<IObligation> {
  constructor() {
    super(Obligation);
  }

  async findByRegulation(regulationId: string) {
    return this.model.find({ regulationId }).exec();
  }

  async updateStatus(id: string, status: 'pending' | 'implemented' | 'validated') {
    return this.update(id, { status });
  }
}

export const obligationRepository = new ObligationRepository();
