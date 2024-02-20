export default class Manager {
    constructor(model, populate) {
        this.model = model;
        this.populate = populate;
    }

    async getAll() {
        return this.model.find().populate(this.populate).lean();
    }

    async getById(id) {
        return this.model.findById(id).populate(this.populate).lean();
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(id, data){
        return await this.model.findByIdAndUpdate(id, data);
    };

    async delete(id){
        return await this.model.findByIdAndDelete(id);
    };
}