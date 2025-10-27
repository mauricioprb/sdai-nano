export type EquipmentType = 'SEM' | 'TEM';

export interface EquipmentSpecs {
  manufacturer: string;
  model: string;
  serialNumber: string;
}

export interface Equipment {
  id: string;
  labId: string;
  type: EquipmentType;
  inventoryCode?: string;
  specs: EquipmentSpecs;
  createdAt: Date;
  updatedAt: Date;
}
