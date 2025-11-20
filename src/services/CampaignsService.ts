import { HttpError } from '../errors/HttpError.js'
import type { CampaignsRepository, CreateCampaignAttributes } from '../repositories/CampaignsRepository.js'

export class CampaignsService {
    constructor(private readonly campaignsRepository: CampaignsRepository) {}

    async getAllCampaigns() {
        const campaigns = await this.campaignsRepository.find()
        return campaigns
    }

    async getCampaignById(id: number) {
        const campaign = await this.campaignsRepository.findById(id)
        if (!campaign) {
            throw new HttpError(404, 'Campaign not found')
        }

        return campaign
    }

    async createCampaign(attributes: CreateCampaignAttributes) {
        const newCampaign = await this.campaignsRepository.create(attributes)
        return newCampaign
    }

    async updateCampaign(campaignId: number, attributes: Partial<CreateCampaignAttributes>) {
        const updatedCampaign = await this.campaignsRepository.updateById(campaignId, attributes)
        if (!updatedCampaign) {
            throw new HttpError(404, 'Campaign not found')
        }

        return updatedCampaign
    }

    async deleteCampaign(campaignId: number) {
        const deletedCampaign = await this.campaignsRepository.deleteById(campaignId)
        if (!deletedCampaign) {
            throw new HttpError(404, 'Campaign not found')
        }

        return deletedCampaign
    }
}
