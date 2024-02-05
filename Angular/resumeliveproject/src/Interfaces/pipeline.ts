export type ActionStatus = "not started" | "success" | "failure" | "in_progress";

export interface actiondetails  {
    title:string;
    status:ActionStatus;
    isDisabled:boolean;
}

export interface stagedetails {
    name:string;
    status:"not started" | "success" | "failure" | "in_progress";
    description?:string;
}