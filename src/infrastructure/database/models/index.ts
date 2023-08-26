// Core Sequelize Model Import
import { User } from "./user-sequelize";
import { Role } from "./role-sequelize";
import { Access } from "./access-sequelize";
import { Permission } from "./permission-sequelize";
import { AccessPermission } from "./access-permission-sequelize";

import { Problem } from "./problem-sequelize";
import { Depects } from "./depects-sequelize";
import { Shifts } from "./shifts-sequelize";
import { Line } from "./line-sequelize";
import { Machine } from "./machine-sequelize";
import { Part } from "./part-sequelize";
import { Method } from "./methods-sequelize";
import { PartHasMethods } from "./partHashMethods";
import { Equipment } from "./equipment-sequelize";
import { Material } from "./material-sequelize";
import { Position } from "./position-sequelize";
import { Manpower } from "./manpower-sequelize";
import { SessionLogin } from "./session-login-sequelize";
import { Task } from "./task-sequelize";
import { Schedule } from "./schedule-sequelize";
import { ProductionOrder } from "./production-order-sequelize";
import { ProductionEquipment } from "./production-equipment-sequelize";
import { ProductionManpower } from "./production-manpower-sequelize";
import { ProductionDefect } from "./production-defect-sequelize";
import { ProductionProblem } from "./production-problem-sequelize";
import { ProductionMaterial } from "./production-material-sequelize";

import { MethodLog } from "./method-log-sequelize";
import { ManpowerChangedLog } from "./manpower-changed-log-sequelize";
import { EquipmentChangedLog } from "./equipment-changed-log-sequelize";
import { MaterialChangedLog } from "./material-changed-log-sequelize";
import { PreparationTimeLog } from "./preparation-time-log-sequelize";

// Apps Sequelize Model Import

(async () => {
    // Core Model Synchronisation
    console.log("Start synchronizing models");

    await Role.sync({ alter: false });
    await User.sync({ alter: false });
    await Access.sync({ alter: false });
    await Permission.sync({ alter: false });
    await AccessPermission.sync({ alter: false });
    await Problem.sync({ alter: false });
    await Depects.sync({ alter: false });
    await Shifts.sync({ alter: false });
    await Line.sync({ alter: false });
    await Machine.sync({ alter: false });
    await Part.sync({ alter: false });
    await Method.sync({ alter: false });
    await PartHasMethods.sync({ alter: false });
    await Equipment.sync({ alter: false });
    await Material.sync({ alter: false });
    await Position.sync({ alter: false });
    await Manpower.sync({ alter: false });
    await Task.sync({ alter: false });
    await Schedule.sync({ alter: false });
    await ProductionOrder.sync({ alter: false });
    await SessionLogin.sync({ alter: false });
    await ProductionEquipment.sync({ alter: false });
    await ProductionManpower.sync({ alter: false });
    await ProductionDefect.sync({ alter: false });
    await ProductionProblem.sync({ alter: false });
    await ProductionMaterial.sync({ alter: true });
    await MethodLog.sync({ alter: false });
    await ManpowerChangedLog.sync({ alter: false });
    await EquipmentChangedLog.sync({ alter: false });
    await MaterialChangedLog.sync({ alter: false });
    await PreparationTimeLog.sync({ alter: false });

    // Apps Model Synchronisation
    console.log("All models were synchronized successfully.");
})();

// User Management Model Association
User.belongsTo(Role, {
    foreignKey: "roleId",
});
Role.hasMany(User, {
    foreignKey: "roleId",
});

Access.belongsTo(Access, {
    foreignKey: "parentId",
    as: "parent",
});

Access.hasMany(Access, {
    foreignKey: "parentId",
    as: "children",
});

Role.belongsToMany(Access, {
    through: AccessPermission,
    foreignKey: "roleId",
});

Role.belongsToMany(Permission, {
    through: AccessPermission,
    foreignKey: "roleId",
});

Access.belongsToMany(Permission, {
    through: AccessPermission,
    foreignKey: "accessId",
});

Access.belongsToMany(Role, {
    through: AccessPermission,
    foreignKey: "accessId",
});

Permission.belongsToMany(Role, {
    through: AccessPermission,
    foreignKey: "permissionId",
});

Permission.belongsToMany(Access, {
    through: AccessPermission,
    foreignKey: "permissionId",
});

Role.hasMany(AccessPermission, {
    foreignKey: "roleId",
    as: "accessPermissions",
});

AccessPermission.belongsTo(Role, {
    foreignKey: "roleId",
    as: "roleHasAccess",
});

Access.hasMany(AccessPermission, {
    foreignKey: "accessId",
    as: "accessPermissions",
});

AccessPermission.belongsTo(Access, {
    foreignKey: "accessId",
    as: "accessHasAccess",
});

Permission.hasMany(AccessPermission, {
    foreignKey: "permissionId",
    as: "accessPermissions",
});

AccessPermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permissionHasAccess",
});
// Apps Model Assosiation

Line.hasMany(Machine, {
    foreignKey: "line_id",
});

Machine.belongsTo(Line, {
    foreignKey: "line_id",
});

Line.hasMany(Part, {
    foreignKey: "line_id",
});

Part.belongsTo(Line, {
    foreignKey: "line_id",
});

Part.belongsToMany(Method, {
    through: "part_has_method",
    foreignKey: "part_id",
});

Method.belongsToMany(Part, {
    through: "part_has_method",
    foreignKey: "method_id",
});

Line.hasMany(Machine, {
    foreignKey: "line_id",
});

Machine.belongsTo(Line, {
    foreignKey: "line_id",
});

Line.hasMany(Part, {
    foreignKey: "line_id",
});

Part.belongsTo(Line, {
    foreignKey: "line_id",
});

Part.belongsToMany(Method, {
    through: "part_has_method",
    foreignKey: "part_id",
});

Method.belongsToMany(Part, {
    through: "part_has_method",
    foreignKey: "method_id",
});

Equipment.belongsTo(Part, {
    foreignKey: "part_id",
});

Part.hasMany(Equipment, {
    foreignKey: "part_id",
});

Material.belongsTo(Part, {
    foreignKey: "part_id",
});

Part.hasMany(Material, {
    foreignKey: "part_id",
});

Manpower.belongsTo(Position, {
    foreignKey: "positionId",
});

Position.hasMany(Manpower, {
    foreignKey: "positionId",
});

Manpower.belongsTo(Machine, {
    foreignKey: "machineId",
});

Machine.hasMany(Manpower, {
    foreignKey: "machineId",
});

SessionLogin.belongsTo(User, {
    foreignKey: "userId",
});

User.hasMany(SessionLogin, {
    foreignKey: "userId",
});

SessionLogin.belongsTo(Machine, {
    foreignKey: "machineId",
});

Machine.hasMany(SessionLogin, {
    foreignKey: "machineId",
});

SessionLogin.belongsTo(Shifts, {
    foreignKey: "shiftId",
});

Shifts.hasMany(SessionLogin, {
    foreignKey: "shiftId",
});

SessionLogin.belongsTo(User, {
    foreignKey: "userId",
});

User.hasMany(SessionLogin, {
    foreignKey: "userId",
});

SessionLogin.belongsTo(Machine, {
    foreignKey: "machineId",
});

Machine.hasMany(SessionLogin, {
    foreignKey: "machineId",
});

SessionLogin.belongsTo(Shifts, {
    foreignKey: "shiftId",
});

Shifts.hasMany(SessionLogin, {
    foreignKey: "shiftId",
});

Task.belongsTo(Machine, {
    foreignKey: "machineId",
});
Task.belongsTo(Shifts, {
    foreignKey: "shiftId",
});

Machine.hasMany(Task, {
    foreignKey: "machineId",
});

Shifts.hasMany(Task, {
    foreignKey: "shiftId",
});

Schedule.belongsTo(Part, {
    foreignKey: "partId",
});

Schedule.belongsTo(Line, {
    foreignKey: "lineId",
});

Part.hasMany(Schedule, {
    foreignKey: "partId",
});

Line.hasMany(Schedule, {
    foreignKey: "lineId",
});

ProductionOrder.belongsTo(Task, {
    foreignKey: "taskId",
});

ProductionOrder.belongsTo(Schedule, {
    foreignKey: "scheduleId",
});

ProductionOrder.belongsTo(Part, {
    foreignKey: "partId",
});

ProductionOrder.belongsTo(Line, {
    foreignKey: "actualLineId",
});

Task.hasMany(ProductionOrder, {
    foreignKey: "taskId",
    as: "productionOrders",
});

Schedule.hasMany(ProductionOrder, {
    foreignKey: "scheduleId",
});

Part.hasMany(ProductionOrder, {
    foreignKey: "partId",
});

Line.hasMany(ProductionOrder, {
    foreignKey: "actualLineId",
});
ProductionEquipment.belongsTo(Task, {
    foreignKey: "taskId",
});
ProductionEquipment.belongsTo(Equipment, {
    foreignKey: "equipmentId",
});
ProductionEquipment.belongsTo(Part, {
    foreignKey: "partId",
});
Task.hasMany(ProductionEquipment, {
    foreignKey: "taskId",
    as: "productionEquipments",
});
Equipment.hasMany(ProductionEquipment, {
    foreignKey: "equipmentId",
});
Part.hasMany(ProductionEquipment, {
    foreignKey: "partId",
});
ProductionManpower.belongsTo(Task, {
    foreignKey: "taskId",
});
ProductionManpower.belongsTo(Manpower, {
    foreignKey: "manpowerId",
});
Task.hasMany(ProductionManpower, {
    foreignKey: "taskId",
    as: "productionManpowers",
});
Manpower.hasMany(ProductionManpower, {
    foreignKey: "manpowerId",
});
ProductionDefect.belongsTo(ProductionOrder, {
    foreignKey: "productionOrderId",
});
ProductionDefect.belongsTo(Depects, {
    foreignKey: "defectId",
    as: "defect",
});
ProductionOrder.hasMany(ProductionDefect, {
    foreignKey: "productionOrderId",
});
Depects.hasMany(ProductionDefect, {
    foreignKey: "defectId",
    as: "productionDefects",
});
ProductionProblem.belongsTo(ProductionOrder, {
    foreignKey: "productionOrderId",
});
ProductionProblem.belongsTo(Problem, {
    foreignKey: "problemId",
});
ProductionOrder.hasMany(ProductionProblem, {
    foreignKey: "productionOrderId",
});
Problem.hasMany(ProductionProblem, {
    foreignKey: "problemId",
    as: "productionProblems",
});
ProductionMaterial.belongsTo(Task, {
    foreignKey: "taskId",
});
ProductionMaterial.belongsTo(Material, {
    foreignKey: "materialId",
});
Task.hasMany(ProductionMaterial, {
    foreignKey: "taskId",
    as: "productionMaterials",
});
Material.hasMany(ProductionMaterial, {
    foreignKey: "materialId",
});
MethodLog.belongsTo(Task, {
    foreignKey: "taskId",
});
Task.hasMany(MethodLog, {
    foreignKey: "taskId",
});
ManpowerChangedLog.belongsTo(Task, {
    foreignKey: "taskId",
});
Task.hasMany(ManpowerChangedLog, {
    foreignKey: "taskId",
});
EquipmentChangedLog.belongsTo(Task, {
    foreignKey: "taskId",
});
Task.hasMany(EquipmentChangedLog, {
    foreignKey: "taskId",
});
MaterialChangedLog.belongsTo(Task, {
    foreignKey: "taskId",
});
Task.hasMany(MaterialChangedLog, {
    foreignKey: "taskId",
});
PreparationTimeLog.belongsTo(Task, {
    foreignKey: "taskId",
});
Task.hasOne(PreparationTimeLog, {
    foreignKey: "taskId",
});
// Core Model Export
export * from "./user-sequelize";
export * from "./role-sequelize";
export * from "./access-sequelize";
export * from "./permission-sequelize";
export * from "./access-permission-sequelize";

export * from "./problem-sequelize";
export * from "./depects-sequelize";
export * from "./shifts-sequelize";
export * from "./machine-sequelize";
export * from "./line-sequelize";
export * from "./methods-sequelize";
export * from "./part-sequelize";
export * from "./partHashMethods";

export * from "./permission-sequelize";
export * from "./equipment-sequelize";
export * from "./material-sequelize";
export * from "./position-sequelize";
export * from "./manpower-sequelize";
export * from "./session-login-sequelize";
export * from "./schedule-sequelize";
export * from "./production-order-sequelize";
export * from "./production-equipment-sequelize";
export * from "./task-sequelize";
export * from "./production-manpower-sequelize";
export * from "./production-problem-sequelize";
export * from "./production-defect-sequelize";
export * from "./production-material-sequelize";
export * from "./method-log-sequelize";
export * from "./manpower-changed-log-sequelize";
export * from "./equipment-changed-log-sequelize";
export * from "./material-changed-log-sequelize";
export * from "./preparation-time-log-sequelize";

// Apps Model Export
