import prisma from '../../database/index.js'
import type { CampaignModel, CampaignsRepository, CreateCampaignAttributes } from '../CampaignsRepository.js'

export class PrismaCampaignsRepository implements CampaignsRepository {
    find(): Promise<CampaignModel[]> {
        return prisma.campaign.findMany()
    }
    findById(id: number): Promise<CampaignModel | null> {
        return prisma.campaign.findUnique({
            where: { id },
            include: {
                leads: {
                    include: {
                        lead: true,
                    },
                },
            },
        })
    }
    create(attributes: CreateCampaignAttributes): Promise<CampaignModel> {
        return prisma.campaign.create({ data: attributes })
    }
    async updateById(
        id: number,
        attributes: Partial<CreateCampaignAttributes>
    ): Promise<CampaignModel | null> {
        const campaignExists = await prisma.campaign.findUnique({ where: { id } })
        if (!campaignExists) return null

        return prisma.campaign.update({
            where: { id },
            data: attributes,
        })
    }
    async deleteById(id: number): Promise<CampaignModel | null> {
        const campaignExists = await prisma.campaign.findUnique({ where: { id } })
        if (!campaignExists) return null

        return prisma.campaign.delete({ where: { id } })
    }
}
