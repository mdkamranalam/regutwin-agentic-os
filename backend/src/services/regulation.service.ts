import Regulation from "../models/regulation.model.js";

export class RegulationService {
  static async create(data: any) {
    return Regulation.create(data);
  }

  static async getAll() {
    return Regulation.find().sort({
      createdAt: -1,
    });
  }

  static async getById(id: string) {
    return Regulation.findById(id);
  }
}
