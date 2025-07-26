export interface ModelPermission {
    add: boolean;
    view: boolean;
    change: boolean;
    delete: boolean;
}
  
export interface ToggleState {
    [modelName: string]: ModelPermission;
}
  