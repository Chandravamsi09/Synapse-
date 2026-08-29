/**
 * Synapse Base Repository Pattern with High-Throughput In-Memory Caching
 */

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>, limit?: number, offset?: number): Promise<T[]>;
  create(item: Partial<T>): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}

export class InMemoryRepository<T extends { id: string; organizationId?: string }> implements IBaseRepository<T> {
  protected items: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    const found = this.items.get(id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async findAll(filter?: Partial<T>, limit: number = 100, offset: number = 0): Promise<T[]> {
    let result = Array.from(this.items.values());
    if (filter) {
      result = result.filter(item => {
        for (const key of Object.keys(filter)) {
          if ((item as any)[key] !== (filter as any)[key]) {
            return false;
          }
        }
        return true;
      });
    }
    return result.slice(offset, offset + limit).map(i => JSON.parse(JSON.stringify(i)));
  }

  async create(item: Partial<T>): Promise<T> {
    const id = item.id || ('syn_' + Math.random().toString(36).substring(2, 12));
    const fullItem = { ...item, id } as T;
    this.items.set(id, fullItem);
    return JSON.parse(JSON.stringify(fullItem));
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.items.set(id, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async count(filter?: Partial<T>): Promise<number> {
    if (!filter) return this.items.size;
    return (await this.findAll(filter, 100000, 0)).length;
  }
}
