import { BaseRepository } from './BaseRepository';
import AuditLog from '../models/AuditLog';
import { IAuditLog } from '../models/AuditLog';

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLog);
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.model.find({ entityType, entityId }).sort({ timestamp: -1 }).exec();
  }
}

export const auditLogRepository = new AuditLogRepository();
