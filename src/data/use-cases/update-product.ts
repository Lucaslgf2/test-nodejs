import { IDbFindProductById } from '@/data/protocols/db-find-product-protocol'
import { IDbUpdateProductById } from '@/data/protocols/db-update-product-protocol'
import { GenericBussinessError } from '@/domain/bussiness-errors/generic-bussiness-error'
import { IProductModel } from '@/domain/models/product-model'
import { ICalculateProductAttributes } from '@/domain/protocols/calculate-product-attributes-protocol'
import { IUpdateProductById, NsUpdateProduct } from '@/domain/protocols/update-product-protocol'

export class UpdateProductById implements IUpdateProductById {
  constructor (
    private readonly productRepo: IDbFindProductById & IDbUpdateProductById,
    private readonly calculateProductAttrib: ICalculateProductAttributes
  ) {}

  async updateById (params: NsUpdateProduct.Input): Promise<IProductModel> {
    const existingProduct = await this.productRepo.findById(params.oldSku)
    if (!existingProduct) {
      throw new GenericBussinessError(`Não foi localizado um Produto com o Código SKU ${params.oldSku} na Base de Dados.`)
    }

    const product = await this.productRepo.updateById(params)

    const result: IProductModel = JSON.parse(product)
    result.inventory.quantity = await this.calculateProductAttrib.calcTotalQuantity(result)
    result.isMarketable = await this.calculateProductAttrib.calcIsMarketable(result)
    return result
  }
}