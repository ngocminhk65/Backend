@Injectable()
export class ItemService {
  constructor(@InjectModel(Item) private readonly itemModel: typeof Item) {}

  async findAll(): Promise<Item[]> {
    return this.itemModel.findAll();
  }

  async findById(id: number): Promise<Item> {
    return this.itemModel.findByPk(id);
  }

  async create(item: Item): Promise<Item> {
    return this.itemModel.create(item);
  }

  async update(id: number, item: Item): Promise<[number, Item[]]> {
    return this.itemModel.update(item, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return this.itemModel.destroy({ where: { id } });
  }

  async findOne(id: number): Promise<Item> {
    return this.itemModel.findOne({ where: { id } });
  }
}