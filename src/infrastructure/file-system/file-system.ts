import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import fs, { unlink } from "fs-extra";
import path from "path";

export class FileSystem {
    public static store(file: IMulterFile, dest: string): string {
        const destPath = path.join(
            "storage",
            dest,
            file.filename + "." + `${file.originalname}`.split(".").reverse()[0]
        );
        fs.moveSync(file.path, destPath);
        return destPath;
    }

    public static destroy(path: string): boolean {
        try {
            if (fs.pathExistsSync(path)) {
                unlink(path);
            }
        } catch (e) {
            //
        }
        return true;
    }

    public static update(file: IMulterFile, dest: string, oldFile?: string): string {
        if (oldFile) {
            if (fs.pathExistsSync(oldFile)) {
                unlink(oldFile, (err) => {
                    if (err) {
                        throw new AppError({
                            statusCode: HttpCode.NOT_FOUND,
                            description: "Image path is not recognized",
                        });
                    }
                });
            }
        }
        const destPath = path.join(
            "storage",
            dest,
            file.filename + "." + `${file.originalname}`.split(".").reverse()[0]
        );
        fs.moveSync(file.path, destPath);
        return destPath;
    }
}
