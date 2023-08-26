export interface IListManpowerHmi {
    id: string;
    name: string;
    position: string;
}

export interface IPayloadManpowerHmi {
    id: string,
    indicator: "existing" | "subtitution" | "absent"
}
export interface IListManpower {
    id: string;
    fullname: string;
    shortname: string;
    nip: string;
    machine_name: string | undefined;
    line_name: string | undefined;
    position: string | undefined;
}
