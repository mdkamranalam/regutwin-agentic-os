import { BaseRepository } from './BaseRepository';
import MAP from '../models/MAP';
import { IMAP } from '../models/MAP';

export class MAPRepository extends BaseRepository<IMAP> {
  constructor() {
    super(MAP);
  }

  async findByObligation(obligationId: string) {
    return this.model.find({ obligationId }).exec();
  }

  async updateValidationStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'validated' | 'failed', evidenceUrl?: string) {
    return this.update(id, { status, evidenceUrl });
  }
}

export const mapRepository = new MAPRepository();
