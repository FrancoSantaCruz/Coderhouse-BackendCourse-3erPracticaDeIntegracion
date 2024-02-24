export default class Manager {
    constructor(model, populate) {
        this.model = model;
        this.populate = populate;
    }

    async getAll() {
        return this.model.find().populate(this.populate).lean();
    }

    async getById(id) {
        // const result = await this.model.findById(id).populate(this.populate).lean();
        // return result;
        return this.model.findById(id).populate(this.populate).lean();
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data){
        return await this.model.findByIdAndUpdate(id, data);
    };

    async delete(id){
        return await this.model.findByIdAndDelete(id);
    };
}