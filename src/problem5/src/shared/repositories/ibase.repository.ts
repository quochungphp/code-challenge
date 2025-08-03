import { Model, Document } from 'mongoose';
import { IBaseRepository } from './types';
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    public model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        const document = new this.model(data);
        return document.save();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
