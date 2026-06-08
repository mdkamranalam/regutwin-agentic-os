import { BaseRepository } from './BaseRepository';
import Regulation from '../models/Regulation';
import { IRegulation } from '../models/Regulation';

export class RegulationRepository extends BaseRepository<IRegulation> {
  constructor() {
    super(Regulation);
  }

  async findBySource(source: string) {
    return this.model.find({ source }).exec();
  }

  async updateAnalysisStatus(id: string, status: 'pending' | 'analyzing' | 'completed' | 'failed') {
    return this.update(id, { analysisStatus: status });
  }
}

export const regulationRepository = new RegulationRepository();
