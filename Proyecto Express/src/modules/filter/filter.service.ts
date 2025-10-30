import { FilterRepository } from "./filter.repository";
import { Task } from "../../types";

export type FilterParams = {
  userId: string;
  filter: string;
  activeBoardId: string;
  page: number;
  limit: number;
};

export class FilterService {
  constructor(private readonly filterRepository: FilterRepository) {}

  async filterTasks(params: FilterParams): Promise<{ tasks: Task[]; total: number }> {
    // Here we can implement some business logic if needed
    return this.filterRepository.filterTasks(params);
  }
}

