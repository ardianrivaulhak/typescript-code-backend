import { IPermission, Permission } from "@/domain/models/permission";
import { PermissionRepository } from "@/domain/service/permission-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";

@injectable()
export class PermissionService {
  constructor(@inject(TYPES.PermissionRepository) private _repository: PermissionRepository) {}

  public async findAll(): Promise<IPermission[]> {
    const roles = await this._repository.findAll();
    const dataDto = roles.map((role) => role.unmarshal());
    return dataDto;
  }

  public async findById(id: string): Promise<IPermission> {
    const role = await this._repository.findById(id);
    return role.unmarshal();
  }

  public async store(_role: IPermission): Promise<IPermission> {
    const role = await this._repository.store(
      Permission.create({
        name: _role.name,
      })
    );
    return role.unmarshal();
  }

  public async update(id: string, _user: IPermission): Promise<IPermission> {
    const toUpdatePermission = Permission.create({
      name: _user.name,
    });
    const user = await this._repository.update(id, toUpdatePermission);
    return user.unmarshal();
  }

  public async destroy(id: string): Promise<boolean> {
    await this._repository.destroy(id);
    return true;
  }

  public async getDataTable(param: TDataTableParam): Promise<ITableData<IPermission>> {
    const dataTable = await this._repository.getDataTable(param);
    return dataTable.unmarshal();
  }
}
