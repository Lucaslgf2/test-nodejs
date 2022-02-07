import { IWarehouseModel } from './warehouse-model'

export interface IInventoryModel {
  quantity: number
  warehouses: IWarehouseModel[]
}
