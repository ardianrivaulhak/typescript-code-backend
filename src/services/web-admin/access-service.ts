import { IAccess, Access } from "@/domain/models/access";
import { AccessRepository } from "@/domain/service/access-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";

@injectable()
export class AccessService {
  constructor(@inject(TYPES.AccessRepository) private _repository: AccessRepository) {}

  public async findById(id: string): Promise<IAccess> {
    const access = await this._repository.findById(id);
    return access.unmarshal();
  }

  public async store(_role: IAccess): Promise<IAccess> {
    const access = await this._repository.store(
      Access.create({
        name: _role.name,
      })
    );
    return access.unmarshal();
  }

  public async update(id: string, _access: IAccess): Promise<IAccess> {
    const toUpdateAccess = Access.create({
      name: _access.name,
    });
    const access = await this._repository.update(id, toUpdateAccess);
    return access.unmarshal();
  }

  public async destroy(id: string): Promise<boolean> {
    await this._repository.destroy(id);
    return true;
  }

  public async getDataTable(param: TDataTableParam): Promise<ITableData<IAccess>> {
    const dataTable = await this._repository.getDataTable(param);
    return dataTable.unmarshal();
  }
}
